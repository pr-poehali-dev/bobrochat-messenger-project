import { useState, useRef, useEffect, useCallback } from "react";
import { ApiChat, ApiMessage } from "./ChatApp";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Props {
  chat: ApiChat;
  userId: string;
  onBack: () => void;
  onChatUpdated: () => void;
}

export default function ChatWindow({ chat, userId, onBack, onChatUpdated }: Props) {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.messages.list(chat.id, userId);
      setMessages(data.messages || []);
    } catch {
      // silent
    }
  }, [chat.id, userId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const msg = await api.messages.send(chat.id, userId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText("");
      onChatUpdated();
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target?.result as string;
      setSending(true);
      try {
        const msg = await api.messages.send(chat.id, userId, "📸 Фото", b64);
        setMessages((prev) => [...prev, msg]);
        onChatUpdated();
      } catch {
        // silent
      } finally {
        setSending(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="md:hidden p-2 rounded-xl hover:bg-orange-50 text-orange-500 transition-colors">
          <Icon name="ChevronLeft" size={22} />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{chat.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{chat.name}</p>
          <p className="text-xs text-gray-400">@{chat.username}</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors">
          <Icon name="MoreVertical" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm">Напиши первое сообщение!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === userId;
          const showDate = i === 0;
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center mb-3">
                  <span className="text-xs text-gray-400 bg-white/80 px-3 py-1 rounded-full shadow-sm">Сегодня</span>
                </div>
              )}
              <div className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                  isOwn
                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-br-md"
                    : "bg-white text-gray-900 rounded-bl-md"
                }`}>
                  {msg.type === "image" && msg.imageUrl && (
                    <img src={msg.imageUrl} alt="фото" className="max-w-full rounded-xl mb-1 max-h-64 object-cover" />
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                    <span className={`text-[10px] ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {isOwn && (
                      <Icon name={msg.read ? "CheckCheck" : "Check"} size={12}
                        className={msg.read ? "text-white/90" : "text-white/60"} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()}
            className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-orange-500 hover:bg-orange-100 transition-colors">
            <Icon name="Paperclip" size={20} />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напишите сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none max-h-24 py-1"
          />
          <button onClick={handleSend} disabled={!text.trim() || sending}
            className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-200 hover:shadow-orange-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
            {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon name="Send" size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
