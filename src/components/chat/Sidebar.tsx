import { Tab } from "./ChatApp";
import { Chat } from "./data";
import { User } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user: User;
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

const allTabs = [
  { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
  { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
  { id: "search" as Tab, icon: "Search", label: "Поиск" },
  { id: "profile" as Tab, icon: "User", label: "Профиль" },
  { id: "settings" as Tab, icon: "Settings", label: "Настройки" },
];

export default function Sidebar({ activeTab, onTabChange, chats, activeChat, onSelectChat }: Props) {
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex h-full">
      {/* Nav rail */}
      <div className="w-16 h-full bg-gradient-to-b from-orange-500 to-orange-600 flex flex-col items-center pt-4 pb-3 shadow-lg">
        {/* Logo */}
        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-2 flex-shrink-0">
          <span className="text-xl">🦫</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom island — все кнопки */}
        <div className="w-full px-1.5">
          <div className="bg-black/25 rounded-2xl p-1 flex flex-col gap-0.5">
            {allTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 w-full ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "text-white/55 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="text-[8px] mt-0.5 font-medium leading-none">{tab.label}</span>
                  {tab.id === "chats" && totalUnread > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white text-orange-600 text-[8px] font-bold rounded-full flex items-center justify-center">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat list — shown only on chats tab */}
      {activeTab === "chats" && (
        <div className="w-72 h-full bg-white flex flex-col border-r border-orange-100">
          <div className="px-4 pt-5 pb-3">
            <h2 className="text-xl font-black text-gray-900">Чаты</h2>
            <div className="mt-3 relative">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Поиск..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-orange-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat, i) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors animate-fade-in ${
                  activeChat?.id === chat.id ? "bg-orange-50 border-r-2 border-orange-500" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{chat.avatar}</span>
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm truncate">{chat.name}</span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-1">{chat.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500 truncate">{chat.lastMessage}</span>
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
        </div>
      )}
    </div>
  );
}