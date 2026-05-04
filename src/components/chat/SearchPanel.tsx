import { useState } from "react";
import { ApiChat } from "./ChatApp";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface ApiUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
}

interface Props {
  userId: string;
  chats: ApiChat[];
  onSelectChat: (chat: ApiChat) => void;
  onStartChat: (userId: string, name: string, avatar: string, username: string) => void;
}

export default function SearchPanel({ userId, chats, onSelectChat, onStartChat }: Props) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) { setUsers([]); return; }
    setSearching(true);
    try {
      const data = await api.chats.searchUsers(userId, q);
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setSearching(false);
    }
  };

  const matchedChats = query
    ? chats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-3">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск пользователей и чатов..."
            className="w-full pl-10 pr-10 py-3 text-sm bg-orange-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mb-4">
              <Icon name="Search" size={28} className="text-orange-400" />
            </div>
            <p className="font-bold text-gray-700">Найди кого угодно</p>
            <p className="text-sm text-gray-400 mt-1">Введи имя или username</p>
          </div>
        )}

        {searching && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {!searching && query && users.length === 0 && matchedChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
            <div className="text-4xl mb-3">🦫</div>
            <p className="font-bold text-gray-700">Ничего не найдено</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="mb-4 animate-fade-in">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Пользователи</p>
            <div className="space-y-1">
              {users.map((u) => (
                <div key={u.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{u.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{u.displayName}</p>
                    <p className="text-xs text-orange-500">@{u.username}</p>
                  </div>
                  <button
                    onClick={() => onStartChat(u.id, u.displayName, u.avatar, u.username)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-orange-500 text-white rounded-lg">
                    <Icon name="MessageCircle" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchedChats.length > 0 && (
          <div className="animate-fade-in">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Чаты</p>
            <div className="space-y-1">
              {matchedChats.map((c) => (
                <button key={c.id} onClick={() => onSelectChat(c)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{c.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
