import { useState, useRef, useEffect } from "react";
import { Chat, Message } from "./data";
import Icon from "@/components/ui/icon";

interface Props {
  chat: Chat;
  userId: string;
  onSend: (chatId: string, text: string, imageUrl?: string) => void;
  onBack: () => void;
}

export default function ChatWindow({ chat, userId, onSend, onBack }: Props) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.id, chat.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(chat.id, text.trim());
    setText("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onSend(chat.id, "📸 Фото", dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-orange-50/30 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-orange-100 shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-xl hover:bg-orange-50 text-orange-500 transition-colors"
        >
          <Icon name="ChevronLeft" size={22} />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{chat.avatar}</span>
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{chat.name}</p>
          <p className="text-xs text-green-500 font-medium">
            {chat.online ? "в сети" : "не в сети"}
          </p>
        </div>

        <button className="p-2 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition-colors">
          <Icon name="MoreVertical" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === userId;
          const showDate = i === 0;
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center mb-3">
                  <span className="text-xs text-gray-400 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                    Сегодня
                  </span>
                </div>
              )}
              <div className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                    isOwn
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 rounded-bl-md"
                  }`}
                >
                  {msg.type === "image" && msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="фото"
                      className="max-w-full rounded-xl mb-1 max-h-64 object-cover"
                    />
                  ) : null}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                    <span className={`text-[10px] ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {isOwn && (
                      <Icon
                        name={msg.read ? "CheckCheck" : "Check"}
                        size={12}
                        className={msg.read ? "text-white/90" : "text-white/60"}
                      />
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
      <div className="px-4 py-3 bg-white border-t border-orange-100">
        <div className="flex items-end gap-2 bg-orange-50 rounded-2xl px-3 py-2 border border-orange-100 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-orange-500 hover:bg-orange-100 transition-colors"
          >
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

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-200 hover:shadow-orange-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}