import { useState } from "react";
import AuthScreen from "@/components/chat/AuthScreen";
import ChatApp from "@/components/chat/ChatApp";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return <ChatApp user={user} onLogout={() => setUser(null)} />;
}
