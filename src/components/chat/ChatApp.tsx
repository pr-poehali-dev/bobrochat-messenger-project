import { useState } from "react";
import { User } from "@/pages/Index";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ContactsPanel from "./ContactsPanel";
import SearchPanel from "./SearchPanel";
import ProfilePanel from "./ProfilePanel";
import SettingsPanel from "./SettingsPanel";
import { Chat, MOCK_CHATS } from "./data";

export type Tab = "chats" | "contacts" | "search" | "profile" | "settings";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function ChatApp({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const handleSelectChat = (chat: Chat) => {
    const updated = chats.map((c) =>
      c.id === chat.id ? { ...c, unread: 0 } : c
    );
    setChats(updated);
    setActiveChat(updated.find((c) => c.id === chat.id) || chat);
    setMobileShowChat(true);
  };

  const handleSendMessage = (chatId: string, text: string, imageUrl?: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const newMsg = {
          id: `m${Date.now()}`,
          senderId: user.id,
          text,
          timestamp: new Date(),
          type: (imageUrl ? "image" : "text") as "text" | "image",
          imageUrl,
          read: true,
        };
        const updated = { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: "Сейчас" };
        if (activeChat?.id === chatId) setActiveChat(updated);
        return updated;
      })
    );
  };

  const renderRight = () => {
    if (activeTab === "chats") {
      if (!activeChat) {
        return (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-orange-50/50">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4">🦫</div>
              <p className="text-xl font-bold text-gray-700">Выбери чат</p>
              <p className="text-gray-400 text-sm mt-1">и начни общаться как настоящий бобёр</p>
            </div>
          </div>
        );
      }
      return (
        <ChatWindow
          chat={activeChat}
          userId={user.id}
          onSend={handleSendMessage}
          onBack={() => { setActiveChat(null); setMobileShowChat(false); }}
        />
      );
    }
    if (activeTab === "contacts") return <ContactsPanel contacts={[]} onStartChat={handleSelectChat} chats={chats} setActiveTab={setActiveTab} />;
    if (activeTab === "search") return <SearchPanel chats={chats} onSelectChat={(c) => { setActiveTab("chats"); handleSelectChat(c); }} />;
    if (activeTab === "profile") return <ProfilePanel user={user} />;
    if (activeTab === "settings") return <SettingsPanel onLogout={onLogout} />;
  };

  return (
    <div className="h-screen flex bg-orange-50/30 overflow-hidden">
      {/* Sidebar — always visible on desktop */}
      <div className={`${mobileShowChat && activeTab === "chats" ? "hidden" : "flex"} md:flex flex-col`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => { setActiveTab(t); setMobileShowChat(false); setActiveChat(null); }}
          user={user}
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat && activeTab === "chats" ? "hidden md:flex" : "flex"}`}>
        {renderRight()}
      </div>
    </div>
  );
}
