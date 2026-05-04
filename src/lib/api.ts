const AUTH_URL = "https://functions.poehali.dev/f0adfe5e-1fd1-4732-9220-20b26c3fd8bb";
const CHATS_URL = "https://functions.poehali.dev/5f650a45-cf27-468d-ba67-a282d526d083";
const MESSAGES_URL = "https://functions.poehali.dev/2edc92a5-7c12-4ee0-ba6b-a9b019bf0b73";

async function post(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

async function get(url: string, params: Record<string, string>) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${url}?${q}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export const api = {
  auth: {
    register: (email: string, username: string, displayName: string, password: string) =>
      post(AUTH_URL, { action: "register", email, username, display_name: displayName, password }),
    login: (email: string, password: string) =>
      post(AUTH_URL, { action: "login", email, password }),
  },
  chats: {
    list: (userId: string) =>
      get(CHATS_URL, { action: "list", user_id: userId }),
    allUsers: (userId: string) =>
      get(CHATS_URL, { action: "all_users", user_id: userId }),
    searchUsers: (userId: string, q: string) =>
      get(CHATS_URL, { action: "search_users", user_id: userId, q }),
    create: (userId: string, partnerId: string) =>
      post(CHATS_URL, { user_id: userId, partner_id: partnerId }),
  },
  messages: {
    list: (chatId: string, userId: string) =>
      get(MESSAGES_URL, { chat_id: chatId, user_id: userId }),
    send: (chatId: string, senderId: string, text: string, imageB64?: string) =>
      post(MESSAGES_URL, { chat_id: chatId, sender_id: senderId, text, image_b64: imageB64 }),
  },
};
