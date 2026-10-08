import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Credentials, User } from "../types";
import { authService } from "../services/auth";
import { seedDemo } from "../services/journeys";
import { messageOf } from "../services/utils";
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  demo: () => Promise<void>;
  logout: () => void;
  updateName: (name: string) => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    authService
      .restore()
      .then((next) => {
        if (active) setUser(next);
      })
      .catch((err: unknown) => {
        if (active) setError(messageOf(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const login = useCallback(async (credentials: Credentials) => {
    setUser(await authService.login(credentials));
    setError("");
  }, []);
  const register = useCallback(async (credentials: Credentials) => {
    setUser(await authService.register(credentials));
    setError("");
  }, []);
  const demo = useCallback(async () => {
    const result = await authService.demo();
    if (result.firstVisit) await seedDemo(result.user.id);
    setUser(result.user);
    setError("");
  }, []);
  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
    } catch {
      setError("Không thể kết thúc phiên. Vui lòng kiểm tra quyền lưu trữ.");
    }
  }, []);
  const updateName = async (name: string) => {
    if (user) setUser(await authService.updateName(user, name));
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        demo,
        logout,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Thiếu AuthProvider");
  return context;
}
