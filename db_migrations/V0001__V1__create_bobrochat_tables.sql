
CREATE TABLE IF NOT EXISTS t_p77195987_bobrochat_messenger_.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p77195987_bobrochat_messenger_.chats (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL REFERENCES t_p77195987_bobrochat_messenger_.users(id),
  user2_id INTEGER NOT NULL REFERENCES t_p77195987_bobrochat_messenger_.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS t_p77195987_bobrochat_messenger_.messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES t_p77195987_bobrochat_messenger_.chats(id),
  sender_id INTEGER NOT NULL REFERENCES t_p77195987_bobrochat_messenger_.users(id),
  text TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT NULL,
  msg_type TEXT NOT NULL DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON t_p77195987_bobrochat_messenger_.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON t_p77195987_bobrochat_messenger_.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON t_p77195987_bobrochat_messenger_.chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON t_p77195987_bobrochat_messenger_.chats(user2_id);
