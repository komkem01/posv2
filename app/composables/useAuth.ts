interface AuthUser {
  id: string;
  branchId?: string | null;
  branchName?: string | null;
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
  mustChangePassword?: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

interface SetSessionPayload {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
}

export const useAuth = () => {
  const auth = useState<AuthState>("auth", () => ({
    isLoggedIn: false,
    user: null,
  }));

  const tokenCookie = useCookie<string | null>("pos_access_token", {
    sameSite: "lax",
  });
  const expiresAtCookie = useCookie<string | null>("pos_access_token_expires_at", {
    sameSite: "lax",
  });
  const userCookie = useCookie<AuthUser | null>("pos_auth_user", {
    sameSite: "lax",
  });

  const syncFromCookie = () => {
    const token = tokenCookie.value;
    const expiresAt = expiresAtCookie.value;
    const user = userCookie.value;

    if (!token || !expiresAt || !user) {
      auth.value.isLoggedIn = false;
      auth.value.user = null;
      return;
    }

    const isExpired = Number.isNaN(new Date(expiresAt).getTime()) || Date.now() >= new Date(expiresAt).getTime();
    if (isExpired) {
      tokenCookie.value = null;
      expiresAtCookie.value = null;
      userCookie.value = null;
      auth.value.isLoggedIn = false;
      auth.value.user = null;
      return;
    }

    auth.value.isLoggedIn = true;
    auth.value.user = user;
  };

  const setSession = (payload: SetSessionPayload) => {
    tokenCookie.value = payload.accessToken;
    expiresAtCookie.value = payload.expiresAt;
    userCookie.value = payload.user;
    auth.value.isLoggedIn = true;
    auth.value.user = payload.user;
  };

  const clearSession = () => {
    tokenCookie.value = null;
    expiresAtCookie.value = null;
    userCookie.value = null;
    auth.value.isLoggedIn = false;
    auth.value.user = null;
  };

  const isAuthenticated = () => {
    syncFromCookie();
    return auth.value.isLoggedIn;
  };

  const getAuthHeader = () => {
    if (!tokenCookie.value) {
      return null;
    }
    return `Bearer ${tokenCookie.value}`;
  };

  syncFromCookie();

  return {
    auth,
    setSession,
    clearSession,
    isAuthenticated,
    getAuthHeader,
  };
};
