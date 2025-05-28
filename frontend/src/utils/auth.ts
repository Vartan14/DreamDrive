import { useAuthStore } from "../store/authStore";
import axios from "./axios";
import type { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import {
  LOGIN_URL,
  LOGOUT_URL,
  REFRESH_URL,
  REGISTER_URL,
  PASSWORD_RESET_URL,
} from "./constant";

export interface DecodedUser {
  exp: number;
  email?: string;
  user_id?: number;
  [key: string]: any;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthResult<T = any> {
  data: T | null;
  error: string | null;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResult<LoginResponse>> => {
  try {
    const { data, status }: AxiosResponse<LoginResponse> = await axios.post(LOGIN_URL, { email, password });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);
    }

    return { data, error: null };
  } catch (error: any) {
    const errorMsg: string =
      error.response?.data?.password?.[0] ||
      error.response?.data?.email?.[0] ||
      error.response?.data?.non_field_errors?.[0] ||
      "Помилка входу. Перевірте ваші дані або спробуйте пізніше.";

    console.error(error);

    console.error("Login error:", errorMsg);
    return { data: null, error: errorMsg };
  }
};

function extractFirstError(obj: any): string | null {
  if (!obj) return null;
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) {
    for (const el of obj) {
      const found = extractFirstError(el);
      if (found) return found;
    }
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      const found = extractFirstError(obj[key]);
      if (found) return found;
    }
  }
  return null;
}

export const register = async (
  first_name: string,
  last_name: string,
  email: string,
  password1: string,
  password2: string
): Promise<AuthResult<any>> => {
  try {
    const { data }: AxiosResponse = await axios.post(REGISTER_URL, {
      first_name,
      last_name,
      email,
      password1,
      password2,
    });

    await login(email, password1);

    console.log("Registration successful:", data);
    return { data, error: null };
  } catch (error: any) {
    let errorMsg = "Something went wrong";
    if (error.response?.data) {
      const firstError = extractFirstError(error.response.data);
      if (firstError) errorMsg = firstError;
    }

    console.error("Registration failed:", {
      message: errorMsg,
      status: error?.response?.status,
      data: error?.response?.data,
      request: error?.request,
      fullError: error,
    });

    return {
      data: null,
      error: errorMsg,
    };
  }
};

export const logout = async (): Promise<void> => {
  const refreshToken = Cookie.get("refresh_token");
  if (!refreshToken) {
    console.warn("No refresh token found.");
    return;
  }

  try {
    await axios.post(LOGOUT_URL, {
      refresh: refreshToken,
    });

    console.log("Refresh token blacklisted successfully.");
  } catch (error) {
    console.error("Failed to blacklist token:", error);
  } finally {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
    console.log("User logged out successfully.");
  }
};

export const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response: AxiosResponse = await axios.post(PASSWORD_RESET_URL, { email });
    if (response.status === 200) {
      console.log("Password reset email sent successfully.");
      console.log(response.data?.detail);
      return {
        success: true,
        message: "Password reset email sent successfully.",
      };
    }
    return { success: false, error: "Unknown error" };
  } catch (error: any) {
    const errorMsg: string =
      error.response?.data?.email?.[0] ||
      error.response?.data?.non_field_errors?.[0] ||
      "Виникла помилка при надсиланні листа для скидання пароля.";
    console.error("Forgot Password Error:", errorMsg);
    console.error(error);
    return { success: false, error: errorMsg };
  }
};

export const resetPassword = async (
  uid: string | undefined,
  token: string | undefined,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await axios.post(`/auth/password/reset/confirm/`, {
      uid,
      token,
      new_password1: password,
      new_password2: confirmPassword,
    });
    if (response.status === 200) {
      return { success: true };
    }
    return { success: false, error: "Unknown error" };
  } catch (error: any) {
    const errorMsg: string =
      error.response?.data?.new_password2?.[0] ||
      error.response?.data?.token?.[0] ||
      error.response?.data?.uid?.[0] ||
      "Не вдалося скинути пароль";
    return { success: false, error: errorMsg };
  }
};

export const setUser = async (): Promise<void> => {
  const access_token = Cookie.get("access_token");
  const refresh_token = Cookie.get("refresh_token");

  if (!access_token || !refresh_token) {
    console.log("Tokens do not exist");
    await logout();
    throw new Error("No tokens");
  }

  try {
    if (isAccessTokenExpired(access_token)) {
      const response = await getRefreshToken();
      setAuthUser(response.data.access, response.data.refresh);
    } else {
      setAuthUser(access_token, refresh_token);
    }
  } catch (error) {
    console.error("Failed to set user:", error);
    await logout();
  }
};

export const getTokenExpirationInDays = (
  decoded: { exp: number },
  defaultDays = 7
): number => {
  try {
    const expiresInSec = decoded.exp - Math.floor(Date.now() / 1000);
    const expiresInDays = expiresInSec / (60 * 60 * 24);
    return expiresInDays > 0 ? expiresInDays : defaultDays;
  } catch (error) {
    console.warn("Failed to decode token, using default expiration:", error);
    return defaultDays;
  }
};

export const setAuthUser = (
  access_token: string,
  refresh_token: string
): void => {
  if (access_token && refresh_token) {
    const accessDecoded: DecodedUser = jwtDecode<DecodedUser>(access_token);

    console.log("Access token:", access_token);
    console.log("Decoded access token:", accessDecoded);

    const accessExpires = getTokenExpirationInDays(accessDecoded, 1);
    const refreshDecoded = jwtDecode<DecodedUser>(refresh_token);
    const refreshExpires = getTokenExpirationInDays(refreshDecoded, 7);

    Cookie.set("access_token", access_token, {
      expires: accessExpires,
      secure: true,
    });
    Cookie.set("refresh_token", refresh_token, {
      expires: refreshExpires,
      secure: true,
    });

    const user = accessDecoded || null;
    if (user) {
      const safeUser = {
        user_id: user.user_id ? String(user.user_id) : "",
        email: user.email ? String(user.email) : "",
        role: user.role ? String(user.role) : "",
      };
      useAuthStore.getState().setUser(safeUser);

      // Додаємо виклик fetchUser для оновлення профілю з бекенду
      useAuthStore.getState().fetchUser();
    }
  } else {
    console.error("Invalid tokens, could not set user.");
  }

  useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async (): Promise<AxiosResponse<LoginResponse>> => {
  try {
    const refresh_token = Cookie.get("refresh_token");
    const response: AxiosResponse<LoginResponse> = await axios.post(REFRESH_URL, {
      refresh: refresh_token,
    });
    return response;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    await logout();
    throw error;
  }
};

export const isAccessTokenExpired = (access_token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedUser>(access_token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
