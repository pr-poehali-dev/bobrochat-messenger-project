"""
Сообщения: получение истории чата, отправка текста и фото.
"""
import json
import os
import base64
import boto3
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

    # GET — история сообщений чата
    if method == "GET":
        chat_id = int(params.get("chat_id", 0))
        user_id = int(params.get("user_id", 0))

        # Отмечаем как прочитанные
        cur.execute(
            f"UPDATE {SCHEMA}.messages SET is_read=TRUE WHERE chat_id=%s AND sender_id!=%s",
            (chat_id, user_id)
        )
        conn.commit()

        cur.execute(f"""
            SELECT id, sender_id, text, image_url, msg_type, is_read, created_at
            FROM {SCHEMA}.messages
            WHERE chat_id=%s
            ORDER BY created_at ASC
            LIMIT 100
        """, (chat_id,))

        rows = cur.fetchall()
        messages = []
        for r in rows:
            messages.append({
                "id": str(r[0]),
                "senderId": str(r[1]),
                "text": r[2],
                "imageUrl": r[3],
                "type": r[4],
                "read": r[5],
                "timestamp": r[6].isoformat()
            })

        cur.close(); conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"messages": messages})}

    # POST — отправить сообщение (текст или фото)
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        chat_id = int(body.get("chat_id", 0))
        sender_id = int(body.get("sender_id", 0))
        text = body.get("text", "")
        image_b64 = body.get("image_b64")
        msg_type = "text"
        image_url = None

        if image_b64:
            msg_type = "image"
            image_data = base64.b64decode(image_b64.split(",")[-1])
            ext = "jpg"
            if "png" in image_b64[:30]:
                ext = "png"
            key = f"chat/{chat_id}/{sender_id}_{os.urandom(4).hex()}.{ext}"

            s3 = boto3.client(
                "s3",
                endpoint_url="https://bucket.poehali.dev",
                aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
                aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"]
            )
            s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=f"image/{ext}")
            image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        cur.execute(
            f"INSERT INTO {SCHEMA}.messages (chat_id, sender_id, text, image_url, msg_type) VALUES (%s, %s, %s, %s, %s) RETURNING id, created_at",
            (chat_id, sender_id, text, image_url, msg_type)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(row[0]),
            "senderId": str(sender_id),
            "text": text,
            "imageUrl": image_url,
            "type": msg_type,
            "read": False,
            "timestamp": row[1].isoformat()
        })}

    cur.close(); conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "bad request"})}
