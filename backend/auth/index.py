"""
Аутентификация: регистрация и вход пользователей BobroChat.
"""
import json
import os
import hashlib
import psycopg2

SCHEMA = "t_p77195987_bobrochat_messenger_"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")  # "register" | "login"

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        email = body.get("email", "").strip().lower()
        username = body.get("username", "").strip().lower()
        display_name = body.get("display_name", "").strip()
        password = body.get("password", "")

        if not email or not username or not display_name or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполни все поля"})}

        pw_hash = hash_password(password)
        initials = "".join(w[0].upper() for w in display_name.split() if w)[:2] or "?"

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, username, display_name, password_hash, avatar) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (email, username, display_name, pw_hash, initials)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(user_id), "email": email, "username": username,
            "displayName": display_name, "avatar": initials, "bio": ""
        })}

    elif action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        pw_hash = hash_password(password)

        cur.execute(
            f"SELECT id, email, username, display_name, avatar, bio FROM {SCHEMA}.users WHERE email=%s AND password_hash=%s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        cur.close(); conn.close()

        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(row[0]), "email": row[1], "username": row[2],
            "displayName": row[3], "avatar": row[4] or "?", "bio": row[5] or ""
        })}

    cur.close(); conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}
