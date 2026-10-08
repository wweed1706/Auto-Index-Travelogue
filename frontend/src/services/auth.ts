import type { Credentials, Session, User, UserRecord } from "../types";
import { storage } from "./storage";
import { delay } from "./utils";

const sessionKey = "travelogue_session";
function publicUser(record: UserRecord): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    createdAt: record.createdAt,
  };
}
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
function persistSession(user: User) {
  const session: Session = {
    userId: user.id,
    expiresAt: Date.now() + 30 * 86400000,
  };
  localStorage.setItem(sessionKey, JSON.stringify(session));
  return user;
}
function validate(credentials: Credentials, register = false) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim()))
    throw new Error("Vui lòng nhập email hợp lệ.");
  if (credentials.password.length < 8)
    throw new Error("Mật khẩu cần ít nhất 8 ký tự.");
  if (
    register &&
    (!credentials.name?.trim() || credentials.name.trim().length > 60)
  )
    throw new Error("Tên hiển thị cần từ 1 đến 60 ký tự.");
}
export const authService = {
  async restore(): Promise<User | null> {
    let session: Session;
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem(sessionKey) || "null",
      );
      if (
        !value ||
        typeof value !== "object" ||
        !("userId" in value) ||
        typeof value.userId !== "string" ||
        !("expiresAt" in value) ||
        typeof value.expiresAt !== "number" ||
        value.expiresAt <= Date.now()
      )
        return null;
      session = { userId: value.userId, expiresAt: value.expiresAt };
    } catch {
      return null;
    }
    const record = await storage.userById(session.userId);
    return record ? publicUser(record) : null;
  },
  async login(credentials: Credentials) {
    validate(credentials);
    await delay(450);
    const record = await storage.userByEmail(
      credentials.email.trim().toLowerCase(),
    );
    if (
      !record ||
      record.passwordHash !==
        (await hashPassword(credentials.password, record.salt))
    )
      throw new Error("Email hoặc mật khẩu chưa đúng.");
    return persistSession(publicUser(record));
  },
  async register(credentials: Credentials) {
    validate(credentials, true);
    await delay(450);
    const email = credentials.email.trim().toLowerCase();
    if (await storage.userByEmail(email))
      throw new Error(
        "Email này đã có tài khoản trên thiết bị. Hãy đăng nhập.",
      );
    const firstUser = (await storage.userCount()) === 0;
    const salt = crypto.randomUUID();
    const record: UserRecord = {
      id: crypto.randomUUID(),
      email,
      name: credentials.name!.trim(),
      createdAt: new Date().toISOString(),
      salt,
      passwordHash: await hashPassword(credentials.password, salt),
    };
    await storage.addUser(record);
    if (firstUser) await storage.claimLegacy(record.id);
    return persistSession(publicUser(record));
  },
  async demo() {
    const credentials = {
      email: "demo@travelogue.local",
      password: "TravelogueDemo2026!",
      name: "Người khám phá",
    };
    const existing = await storage.userByEmail(credentials.email);
    return {
      user: existing
        ? await this.login(credentials)
        : await this.register(credentials),
      firstVisit: !existing,
    };
  },
  logout() {
    localStorage.removeItem(sessionKey);
  },
  async updateName(user: User, name: string) {
    if (!name.trim() || name.trim().length > 60)
      throw new Error("Tên hiển thị cần từ 1 đến 60 ký tự.");
    const record = await storage.userById(user.id);
    if (!record) throw new Error("Không tìm thấy hồ sơ.");
    await delay(300);
    const next = { ...record, name: name.trim() };
    await storage.saveUser(next);
    return publicUser(next);
  },
};
