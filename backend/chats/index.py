"""
Управление чатами: получение списка, создание нового чата, список пользователей.
"""
import json
import os
import psycopg2

SCHEMA = "t_p77195987_bobrochat_messenger_"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    # GET /  — список чатов пользователя
    if method == "GET" and params.get("action") == "list":
        user_id = int(params.get("user_id", 0))

        cur.execute(f"""
            SELECT c.id,
                   CASE WHEN c.user1_id = %s THEN u2.id ELSE u1.id END as partner_id,
                   CASE WHEN c.user1_id = %s THEN u2.display_name ELSE u1.display_name END as partner_name,
                   CASE WHEN c.user1_id = %s THEN u2.avatar ELSE u1.avatar END as partner_avatar,
                   CASE WHEN c.user1_id = %s THEN u2.username ELSE u1.username END as partner_username,
                   (SELECT text FROM {SCHEMA}.messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1) as last_msg,
                   (SELECT created_at FROM {SCHEMA}.messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1) as last_time,
                   (SELECT COUNT(*) FROM {SCHEMA}.messages WHERE chat_id=c.id AND sender_id!=%s AND is_read=FALSE) as unread,
                   CASE WHEN c.user1_id = %s THEN u2.id ELSE u1.id END as online_user_id
            FROM {SCHEMA}.chats c
            JOIN {SCHEMA}.users u1 ON u1.id = c.user1_id
            JOIN {SCHEMA}.users u2 ON u2.id = c.user2_id
            WHERE c.user1_id=%s OR c.user2_id=%s
            ORDER BY last_time DESC NULLS LAST
        """, (user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id))

        rows = cur.fetchall()
        chats = []
        for r in rows:
            chats.append({
                "id": str(r[0]),
                "partnerId": str(r[1]),
                "name": r[2],
                "avatar": r[3] or "?",
                "username": r[4],
                "lastMessage": r[5] or "",
                "lastTime": r[6].strftime("%H:%M") if r[6] else "",
                "unread": int(r[7]),
                "online": False
            })

        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"chats": chats})}

    # GET / — поиск пользователей
    if method == "GET" and params.get("action") == "search_users":
        q = params.get("q", "").strip()
        user_id = int(params.get("user_id", 0))

        cur.execute(f"""
            SELECT id, username, display_name, avatar, bio
            FROM {SCHEMA}.users
            WHERE id != %s AND (username ILIKE %s OR display_name ILIKE %s)
            LIMIT 20
        """, (user_id, f"%{q}%", f"%{q}%"))

        rows = cur.fetchall()
        users = [{"id": str(r[0]), "username": r[1], "displayName": r[2], "avatar": r[3] or "?", "bio": r[4] or ""} for r in rows]
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"users": users})}

    # GET / — все пользователи (контакты)
    if method == "GET" and params.get("action") == "all_users":
        user_id = int(params.get("user_id", 0))
        cur.execute(f"""
            SELECT id, username, display_name, avatar, bio
            FROM {SCHEMA}.users WHERE id != %s
            ORDER BY display_name LIMIT 100
        """, (user_id,))
        rows = cur.fetchall()
        users = [{"id": str(r[0]), "username": r[1], "displayName": r[2], "avatar": r[3] or "?", "bio": r[4] or ""} for r in rows]
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"users": users})}

    # POST / — создать или найти чат
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        user_id = int(body.get("user_id", 0))
        partner_id = int(body.get("partner_id", 0))

        u1, u2 = min(user_id, partner_id), max(user_id, partner_id)

        cur.execute(f"SELECT id FROM {SCHEMA}.chats WHERE user1_id=%s AND user2_id=%s", (u1, u2))
        row = cur.fetchone()
        if row:
            chat_id = row[0]
        else:
            cur.execute(f"INSERT INTO {SCHEMA}.chats (user1_id, user2_id) VALUES (%s, %s) RETURNING id", (u1, u2))
            chat_id = cur.fetchone()[0]
            conn.commit()

        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"chatId": str(chat_id)})}

    cur.close(); conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "bad request"})}
