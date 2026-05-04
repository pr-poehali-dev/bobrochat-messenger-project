import { useState, useEffect, useCallback } from "react";
import { User } from "@/pages/Index";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ContactsPanel from "./ContactsPanel";
import SearchPanel from "./SearchPanel";
import ProfilePanel from "./ProfilePanel";
import SettingsPanel from "./SettingsPanel";
import { api } from "@/lib/api";

export type Tab = "chats" | "contacts" | "search" | "profile" | "settings";

export interface ApiChat {
  id: string;
  partnerId: string;
  name: string;
  avatar: string;
  username: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

export interface ApiMessage {
  id: string;
  senderId: string;
  text: string;
  imageUrl: string | null;
  type: "text" | "image";
  read: boolean;
  timestamp: string;
}

interface Props {
  user: User;
  onLogout: () => void;
}

export default function ChatApp({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [activeChat, setActiveChat] = useState<ApiChat | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  const loadChats = useCallback(async () => {
    try {
      const data = await api.chats.list(user.id);
      setChats(data.chats || []);
    } catch {
      // silent
    } finally {
      setLoadingChats(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, [loadChats]);

  const handleSelectChat = async (chat: ApiChat) => {
    setActiveChat({ ...chat, unread: 0 });
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, unread: 0 } : c));
    setMobileShowChat(true);
  };

  const handleStartChatWithUser = async (userId: string, name: string, avatar: string, username: string) => {
    try {
      const data = await api.chats.create(user.id, userId);
      const chatId = data.chatId;
      const newChat: ApiChat = {
        id: chatId, partnerId: userId, name, avatar, username,
        lastMessage: "", lastTime: "", unread: 0, online: false
      };
      await loadChats();
      setActiveChat(newChat);
      setActiveTab("chats");
      setMobileShowChat(true);
    } catch {
      // silent
    }
  };

  const renderRight = () => {
    if (activeTab === "chats") {
      if (!activeChat) {
        return (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4">🦫</div>
              <p className="text-xl font-bold text-gray-700">Выбери чат</p>
              <p className="text-gray-400 text-sm mt-1">и начни общаться</p>
            </div>
          </div>
        );
      }
      return (
        <ChatWindow
          chat={activeChat}
          userId={user.id}
          onBack={() => { setActiveChat(null); setMobileShowChat(false); }}
          onChatUpdated={loadChats}
        />
      );
    }
    if (activeTab === "contacts") return (
      <ContactsPanel userId={user.id} onStartChat={handleStartChatWithUser} />
    );
    if (activeTab === "search") return (
      <SearchPanel userId={user.id} chats={chats} onSelectChat={(c) => { setActiveTab("chats"); handleSelectChat(c); }} onStartChat={handleStartChatWithUser} />
    );
    if (activeTab === "profile") return <ProfilePanel user={user} />;
    if (activeTab === "settings") return <SettingsPanel onLogout={onLogout} />;
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <div className={`${mobileShowChat && activeTab === "chats" ? "hidden" : "flex"} md:flex flex-col border-r border-gray-100 bg-white shadow-sm`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => { setActiveTab(t); setMobileShowChat(false); if (t !== "chats") setActiveChat(null); }}
          user={user}
          chats={chats}
          loadingChats={loadingChats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat && activeTab === "chats" ? "hidden md:flex" : "flex"}`}>
        {renderRight()}
      </div>
    </div>
  );
}
