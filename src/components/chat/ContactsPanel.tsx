import { useState } from "react";
import { MOCK_CONTACTS, Contact, Chat } from "./data";
import { Tab } from "./ChatApp";
import Icon from "@/components/ui/icon";

interface Props {
  contacts: Contact[];
  onStartChat: (chat: Chat) => void;
  chats: Chat[];
  setActiveTab: (tab: Tab) => void;
}

export default function ContactsPanel({ onStartChat, chats, setActiveTab }: Props) {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CONTACTS.filter(
    (c) =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleChat = (contact: Contact) => {
    const existing = chats.find((c) => c.name === contact.displayName);
    if (existing) {
      setActiveTab("chats");
      onStartChat(existing);
    } else {
      const newChat: Chat = {
        id: `chat_${contact.id}`,
        name: contact.displayName,
        avatar: contact.avatar,
        lastMessage: "",
        lastTime: "",
        unread: 0,
        online: contact.online,
        messages: [],
      };
      onStartChat(newChat);
      setActiveTab("chats");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="px-6 pt-6 pb-4 border-b border-orange-100">
        <h2 className="text-xl font-black text-gray-900 mb-3">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти контакт..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-orange-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Все контакты — {filtered.length}
        </p>

        <div className="space-y-1">
          {filtered.map((contact, i) => (
            <div
              key={contact.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 transition-colors animate-fade-in cursor-pointer group"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{contact.avatar}</span>
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{contact.displayName}</p>
                <p className="text-xs text-orange-500 font-medium">@{contact.username}</p>
                {contact.bio && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{contact.bio}</p>
                )}
              </div>

              <button
                onClick={() => handleChat(contact)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
              >
                <Icon name="MessageCircle" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
