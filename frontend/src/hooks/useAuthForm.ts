import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { messageOf } from "../services/utils";
export function useAuthForm(register: boolean) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const redirectTo = (() => {
    const state: unknown = location.state;
    const from =
      state &&
      typeof state === "object" &&
      "from" in state &&
      typeof state.from === "string"
        ? state.from
        : "/";
    return from.startsWith("/") &&
      !from.startsWith("//") &&
      !from.includes("\\") &&
      !/^\/(login|register)/.test(from)
      ? from
      : "/";
  })();
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (
        new TextEncoder().encode(password).length > 72 ||
        password.includes("\0")
      )
        throw new Error(
          "Mật khẩu tối đa 72 byte UTF-8 và không chứa ký tự null.",
        );
      if (register) await auth.register({ email, password, name });
      else await auth.login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    busy,
    error: error || auth.error,
    submit,
    redirectTo,
  };
}
