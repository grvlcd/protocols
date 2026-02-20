const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to read token from localStorage:", error);
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to save token to localStorage:", error);
  }
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to clear token from localStorage:", error);
  }
}
