import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogout: () => void;
}

const SETTINGS_SECTIONS = [
  {
    title: "Уведомления",
    items: [
      { id: "notif_msg", icon: "Bell", label: "Сообщения", desc: "Уведомления о новых сообщениях" },
      { id: "notif_sound", icon: "Volume2", label: "Звук", desc: "Звуковые уведомления" },
      { id: "notif_preview", icon: "Eye", label: "Предпросмотр", desc: "Показывать текст сообщений" },
    ],
  },
  {
    title: "Конфиденциальность",
    items: [
      { id: "priv_online", icon: "Wifi", label: "Статус «онлайн»", desc: "Показывать когда ты в сети" },
      { id: "priv_read", icon: "CheckCheck", label: "Отметки о прочтении", desc: "Показывать что читал сообщение" },
    ],
  },
  {
    title: "Оформление",
    items: [
      { id: "theme_dark", icon: "Moon", label: "Тёмная тема", desc: "Тёмный режим интерфейса" },
      { id: "notif_archive", icon: "Archive", label: "Архивировать чаты", desc: "Скрывать прочитанные чаты" },
    ],
  },
];

export default function SettingsPanel({ onLogout }: Props) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notif_msg: true,
    notif_sound: true,
    notif_preview: true,
    priv_online: true,
    priv_read: true,
    theme_dark: false,
    notif_archive: false,
  });

  const toggle = (id: string) =>
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <div className="px-6 pt-6 pb-4 border-b border-orange-100">
        <h2 className="text-xl font-black text-gray-900">Настройки</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="animate-fade-in">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-orange-50 rounded-2xl overflow-hidden border border-orange-100">
              {section.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    idx > 0 ? "border-t border-orange-100/70" : ""
                  }`}
                >
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon name={item.icon} size={17} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      toggles[item.id] ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        toggles[item.id] ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div className="animate-fade-in">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Аккаунт
          </p>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors border border-orange-100">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Icon name="Shield" size={17} className="text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Сменить пароль</p>
                <p className="text-xs text-gray-400">Безопасность аккаунта</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-gray-400 ml-auto" />
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors border border-red-100"
            >
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Icon name="LogOut" size={17} className="text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Выйти из аккаунта</p>
                <p className="text-xs text-red-400">Завершить сессию</p>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center pt-4 pb-2">
          <p className="text-xs text-gray-300">BobroChat v1.0 · Строй связи как бобёр 🦫</p>
        </div>
      </div>
    </div>
  );
}
