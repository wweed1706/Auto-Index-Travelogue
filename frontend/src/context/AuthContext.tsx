import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthState | null>(null);
function readUser(): User | null {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem("travelogue_profile") || "null",
    );
    if (
      raw &&
      typeof raw === "object" &&
      "email" in raw &&
      typeof raw.email === "string" &&
      "name" in raw &&
      typeof raw.name === "string"
    )
      return { email: raw.email, name: raw.name };
  } catch {
    /* Dữ liệu cũ bị hỏng không được làm lỗi toàn ứng dụng. */
  }
  return null;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readUser);
  const login = (email: string, name?: string) => {
    const next = { email, name: name?.trim() || email.split("@")[0] };
    localStorage.setItem("travelogue_profile", JSON.stringify(next));
    setUser(next);
  };
  const logout = () => {
    localStorage.removeItem("travelogue_profile");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("Thiếu AuthProvider");
  return value;
}
