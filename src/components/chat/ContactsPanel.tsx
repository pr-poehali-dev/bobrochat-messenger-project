import { useState, useEffect } from "react";
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
  onStartChat: (userId: string, name: string, avatar: string, username: string) => void;
}

export default function ContactsPanel({ userId, onStartChat }: Props) {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.chats.allUsers(userId)
      .then((d) => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-3">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти пользователя..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-orange-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">🦫</div>
            <p className="text-gray-400 text-sm">{search ? "Никого не найдено" : "Пока нет других пользователей"}</p>
          </div>
        )}
        <div className="space-y-1">
          {filtered.map((u, i) => (
            <div key={u.id} style={{ animationDelay: `${i * 40}ms` }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 transition-colors animate-fade-in cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{u.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{u.displayName}</p>
                <p className="text-xs text-orange-500 font-medium">@{u.username}</p>
                {u.bio && <p className="text-xs text-gray-400 truncate mt-0.5">{u.bio}</p>}
              </div>
              <button
                onClick={() => onStartChat(u.id, u.displayName, u.avatar, u.username)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
                <Icon name="MessageCircle" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
