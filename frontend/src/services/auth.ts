import type { Credentials, User } from "../types";
import { apiRequest } from "./api";

interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export const authService = {
  me: (signal?: AbortSignal) => apiRequest<User>("/auth/me", { signal }),
  login: (credentials: Credentials) =>
    apiRequest<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    }),
  register: (credentials: Credentials) =>
    apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        email: credentials.email.trim(),
        name: credentials.name?.trim(),
      }),
    }),
};
