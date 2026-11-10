// 授权与鉴权工具模块（内置简单混淆）

const _K = 0x5a;
const _CRED_TOKENS = [
  "IzJgMTs0PTY7Pj8=", // yh:kanglade
  "NzJgMTs0PTY7Pj8=", // mh:kanglade
];

function _d(token: string): string {
  try {
    const raw =
      typeof window !== "undefined"
        ? window.atob(token)
        : Buffer.from(token, "base64").toString("binary");
    let res = "";
    for (let i = 0; i < raw.length; i++) {
      res += String.fromCharCode(raw.charCodeAt(i) ^ _K);
    }
    return res;
  } catch {
    return "";
  }
}

const STORAGE_KEY = "bidding_auth_token";

/**
 * 校验用户名和密码
 */
export function verifyCredentials(
  username: string,
  password: string
): { success: boolean; user?: string } {
  const u = username.trim().toLowerCase();
  const p = password.trim();
  if (!u || !p) return { success: false };

  const target = `${u}:${p}`;
  for (const item of _CRED_TOKENS) {
    const decoded = _d(item);
    if (decoded === target) {
      const [matchedUser] = decoded.split(":");
      return { success: true, user: matchedUser };
    }
  }

  return { success: false };
}

/**
 * 读取当前已登录用户（客户端安全检查）
 */
export function getStoredUser(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;
  try {
    const raw = window.atob(token);
    const [user] = raw.split(":");
    const validUsers = _CRED_TOKENS.map((item) => _d(item).split(":")[0]);
    if (validUsers.includes(user)) {
      return user;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

/**
 * 保存登录状态
 */
export function saveStoredUser(user: string): void {
  if (typeof window === "undefined") return;
  const token = window.btoa(`${user}:${Date.now()}`);
  localStorage.setItem(STORAGE_KEY, token);
}

/**
 * 清除登录状态
 */
export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

