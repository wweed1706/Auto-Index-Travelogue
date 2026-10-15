import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { Credentials, User } from "../types";
import { authService } from "../services/auth";
import { SESSION_EXPIRED, TOKEN_KEY } from "../services/api";
import { messageOf } from "../services/utils";

interface AuthState {
  user: User | null;
  isInitializing: boolean;
  error: string;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const version = generation;
    let controller: AbortController | undefined;
    const restore = async () => {
      controller?.abort();
      controller = new AbortController();
      const current = ++generation.current;
      setIsInitializing(true);
      setUser(null);
      setError("");
      try {
        localStorage.removeItem("travelogue_session");
        if (localStorage.getItem(TOKEN_KEY)) {
          const restored = await authService.me(controller.signal);
          if (current === generation.current) setUser(restored);
        }
      } catch (err) {
        if (current === generation.current) setError(messageOf(err));
      } finally {
        if (current === generation.current) setIsInitializing(false);
      }
    };
    const expired = () => {
      ++version.current;
      controller?.abort();
      setUser(null);
      setIsInitializing(false);
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      const from =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      navigateRef.current("/login", { replace: true, state: { from } });
    };
    const sync = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY || event.key === null) void restore();
    };
    window.addEventListener(SESSION_EXPIRED, expired);
    window.addEventListener("storage", sync);
    void restore();
    return () => {
      ++version.current;
      controller?.abort();
      window.removeEventListener(SESSION_EXPIRED, expired);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    const current = ++generation.current;
    setError("");
    const result = await authService.login(credentials);
    if (current !== generation.current)
      throw new Error("Phiên đã thay đổi. Vui lòng thử lại.");
    localStorage.setItem(TOKEN_KEY, result.access_token);
    try {
      const next = await authService.me();
      if (current !== generation.current)
        throw new Error("Phiên đã thay đổi. Vui lòng thử lại.");
      setUser(next);
    } catch (err) {
      if (localStorage.getItem(TOKEN_KEY) === result.access_token)
        localStorage.removeItem(TOKEN_KEY);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (credentials: Credentials) => {
      const current = ++generation.current;
      setError("");
      await authService.register(credentials);
      if (current !== generation.current)
        throw new Error("Phiên đã thay đổi. Vui lòng đăng nhập lại.");
      try {
        await login(credentials);
      } catch {
        throw new Error(
          "Tài khoản đã tạo thành công nhưng chưa thể mở phiên. Vui lòng đăng nhập lại.",
        );
      }
    },
    [login],
  );

  const logout = useCallback(() => {
    ++generation.current;
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setError("");
    setIsInitializing(false);
    navigateRef.current("/login", { replace: true });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isInitializing, error, login, register, logout }}
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
