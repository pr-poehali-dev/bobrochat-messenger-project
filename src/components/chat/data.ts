export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: "text" | "image";
  imageUrl?: string;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Contact {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  online: boolean;
  phone?: string;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: "2", username: "masha_beaver", displayName: "Маша Боброва", avatar: "МБ", bio: "Люблю строить 🏗️", online: true, phone: "+7 900 123 45 67" },
  { id: "3", username: "vanya_dam", displayName: "Ваня Плотников", avatar: "ВП", bio: "Инженер плотин", online: false, phone: "+7 900 765 43 21" },
  { id: "4", username: "lena_water", displayName: "Лена Речкина", avatar: "ЛР", bio: "🌊 Плыву по жизни", online: true, phone: "+7 900 111 22 33" },
  { id: "5", username: "sasha_forest", displayName: "Саша Лесной", avatar: "СЛ", bio: "Хранитель леса", online: false, phone: "+7 900 444 55 66" },
  { id: "6", username: "dima_branch", displayName: "Дима Веткин", avatar: "ДВ", bio: "Ем ветки и думаю 🌿", online: true, phone: "+7 900 777 88 99" },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: "c1",
    name: "Маша Боброва",
    avatar: "МБ",
    lastMessage: "Привет! Как дела с плотиной? 🦫",
    lastTime: "14:32",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", senderId: "2", text: "Привет! Как дела?", timestamp: new Date(), type: "text", read: true },
      { id: "m2", senderId: "1", text: "Всё отлично! Строю новую плотину", timestamp: new Date(), type: "text", read: true },
      { id: "m3", senderId: "2", text: "Привет! Как дела с плотиной? 🦫", timestamp: new Date(), type: "text", read: false },
      { id: "m4", senderId: "2", text: "Жду новостей!", timestamp: new Date(), type: "text", read: false },
    ],
  },
  {
    id: "c2",
    name: "Ваня Плотников",
    avatar: "ВП",
    lastMessage: "Встретимся у реки в 6?",
    lastTime: "12:15",
    unread: 0,
    online: false,
    messages: [
      { id: "m5", senderId: "3", text: "Эй, есть время?", timestamp: new Date(), type: "text", read: true },
      { id: "m6", senderId: "1", text: "Да, что случилось?", timestamp: new Date(), type: "text", read: true },
      { id: "m7", senderId: "3", text: "Встретимся у реки в 6?", timestamp: new Date(), type: "text", read: true },
    ],
  },
  {
    id: "c3",
    name: "Лена Речкина",
    avatar: "ЛР",
    lastMessage: "Фото отправлю чуть позже 📸",
    lastTime: "Вчера",
    unread: 1,
    online: true,
    messages: [
      { id: "m8", senderId: "4", text: "Сделала красивые фото у пруда!", timestamp: new Date(), type: "text", read: true },
      { id: "m9", senderId: "1", text: "Покажи!", timestamp: new Date(), type: "text", read: true },
      { id: "m10", senderId: "4", text: "Фото отправлю чуть позже 📸", timestamp: new Date(), type: "text", read: false },
    ],
  },
  {
    id: "c4",
    name: "Дима Веткин",
    avatar: "ДВ",
    lastMessage: "👍",
    lastTime: "Пн",
    unread: 0,
    online: true,
    messages: [
      { id: "m11", senderId: "1", text: "Посмотри мой проект!", timestamp: new Date(), type: "text", read: true },
      { id: "m12", senderId: "5", text: "👍", timestamp: new Date(), type: "text", read: true },
    ],
  },
];
