import { Tab, ApiChat } from "./ChatApp";
import { User } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user: User;
  chats: ApiChat[];
  loadingChats: boolean;
  activeChat: ApiChat | null;
  onSelectChat: (chat: ApiChat) => void;
}

const allTabs = [
  { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
  { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
  { id: "search" as Tab, icon: "Search", label: "Поиск" },
  { id: "profile" as Tab, icon: "User", label: "Профиль" },
  { id: "settings" as Tab, icon: "Settings", label: "Настройки" },
];

export default function Sidebar({ activeTab, onTabChange, chats, loadingChats, activeChat, onSelectChat }: Props) {
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex flex-col h-full w-72">
      {/* Logo header */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
          <span className="text-lg">🦫</span>
        </div>
        <span className="text-lg font-black text-gray-900">BobroChat</span>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Поиск..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-orange-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {loadingChats && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}
        {!loadingChats && chats.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-gray-400 text-sm">Нет чатов. Найди собеседника в разделе «Контакты»</p>
          </div>
        )}
        {chats.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            style={{ animationDelay: `${i * 30}ms` }}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors animate-fade-in ${
              activeChat?.id === chat.id ? "bg-orange-50 border-r-2 border-orange-500" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{chat.avatar}</span>
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-sm truncate">{chat.name}</span>
                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-1">{chat.lastTime}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-gray-500 truncate">{chat.lastMessage || "Нет сообщений"}</span>
                {chat.unread > 0 && (
                  <span className="ml-1 flex-shrink-0 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom sandbar island — горизонтальный */}
      <div className="px-3 py-3 flex-shrink-0">
        <div className="bg-gray-900 rounded-2xl px-2 py-2 flex items-center justify-around shadow-lg shadow-gray-900/20">
          {allTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/40"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span className="text-[9px] font-medium leading-none">{tab.label}</span>
                {tab.id === "chats" && totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
