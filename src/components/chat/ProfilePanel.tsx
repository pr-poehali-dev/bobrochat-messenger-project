import { useState } from "react";
import { User } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
}

export default function ProfilePanel({ user }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || "");

  const stats = [
    { label: "Чатов", value: "4" },
    { label: "Контактов", value: "5" },
    { label: "Фото", value: "12" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="px-6 pt-6 pb-4 border-b border-orange-100 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">Профиль</h2>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
            editing
              ? "bg-orange-500 text-white"
              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
          }`}
        >
          {editing ? "Сохранить" : "Изменить"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 px-6 pt-10 pb-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl">🦫</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-white/25 backdrop-blur border-4 border-white/40 flex items-center justify-center mb-3 shadow-xl">
              <span className="text-4xl font-black text-white">{user.avatar}</span>
            </div>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-black text-white bg-white/20 rounded-xl px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/60"
              />
            ) : (
              <h3 className="text-xl font-black text-white">{name}</h3>
            )}
            <p className="text-orange-100 text-sm font-medium mt-1">@{user.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-6 -mt-8 bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-4 flex divide-x divide-orange-100 mb-6 border border-orange-50">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 text-center">
              <p className="text-xl font-black text-orange-500">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="px-6 space-y-4 pb-8">
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-orange-400" />
              <p className="text-sm text-gray-900 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Username</p>
            <div className="flex items-center gap-2">
              <Icon name="AtSign" size={16} className="text-orange-400" />
              <p className="text-sm text-gray-900 font-medium">@{user.username}</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">О себе</p>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажи о себе..."
                rows={3}
                className="w-full text-sm bg-white rounded-xl border border-orange-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none placeholder:text-gray-400"
              />
            ) : (
              <p className="text-sm text-gray-700">{bio || "Нет информации"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
