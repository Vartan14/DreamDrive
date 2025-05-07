import { useAuthStore } from "../store/auth.js";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import { LOGIN_URL, LOGOUT_URL, REFRESH_URL, REGISTER_URL, PASSWORD_RESET_URL } from "./constant.js";


export const login = async (email, password) => {
    try {
        const { data, status } = await axios.post(LOGIN_URL, { email, password });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
            //Swal.fire('Success', 'Logged in successfully', 'success');
        }

        return { data, error: null };
    } catch (error) {
        const errorMsg = 
        error.response?.data?.password?.[0] || 
        error.response?.data?.email?.[0] || 
        error.response?.data?.non_field_errors?.[0] ||
        "Something went wrong";
        
        console.error(error);

        console.error("Login error:", errorMsg);
        return { data: null, error: errorMsg };
    }
};

export const register = async (first_name, last_name, email, password1, password2) => {
    try {
        const { data } = await axios.post(REGISTER_URL, {
            first_name,
            last_name,
            email,
            password1,
            password2,
        });

        await login(email, password1);
 
        console.log("Registration successful:", data);
        return { data, error: null };
    } catch (error) {
        const errorMsg = 
            error.response?.data?.password1?.[0] || 
            error.response?.data?.password2?.[0] || 
            error.response?.data?.email?.[0] || 
            error.response?.data?.non_field_errors?.[0] ||
            "Something went wrong";

        // Лог в консоль для дебагу
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

export const logout = async () => {
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
        // Видаляємо токени та чистимо стан у будь-якому випадку
        Cookie.remove("access_token");
        Cookie.remove("refresh_token");
        useAuthStore.getState().setUser(null);
        console.log("User logged out successfully.");
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(PASSWORD_RESET_URL, { email });
        if (response.status === 200) {
            console.log("Password reset email sent successfully.");
            console.log(response.data?.detail);
            return { success: true, message: "Password reset email sent successfully." };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.email?.[0] ||
            error.response?.data?.non_field_errors?.[0] ||
            "An error occurred while sending the password reset email.";
        console.error("Forgot Password Error:", errorMsg);
        console.error(error)
        return { success: false, error: errorMsg };
    }
};

export const setUser = async () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || !refresh_token) {
        console.log("Tokens do not exist");
        logout();
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
        logout();
    }
};

export const getTokenExpirationInDays = (decoded, defaultDays = 7) => {
    try {
        const expiresInSec = decoded.exp - Math.floor(Date.now() / 1000);
        const expiresInDays = expiresInSec / (60 * 60 * 24);
        return expiresInDays > 0 ? expiresInDays : defaultDays; // щоб не було від'ємного часу
    } catch (error) {
        console.warn("Failed to decode token, using default expiration:", error);
        return defaultDays;
    }
};


export const setAuthUser = (access_token, refresh_token) => {
    if (access_token && refresh_token) {
        const accessDecoded = jwtDecode(access_token);
        
        console.log("Access token:", access_token);
        console.log("Decoded access token:", accessDecoded);

        const accessExpires = getTokenExpirationInDays(accessDecoded, 1); 
        const refreshExpires = getTokenExpirationInDays(jwtDecode(refresh_token), 7); 

        Cookie.set("access_token", access_token, { expires: accessExpires, secure: true });
        Cookie.set("refresh_token", refresh_token, { expires: refreshExpires, secure: true });

        const user = accessDecoded || null; 
        if (user) {
            console.log("User set data:", user);
            useAuthStore.getState().setUser(user);
        }
    } else {
        console.error("Invalid tokens, could not set user.");
    }

    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    try {
        const refresh_token = Cookie.get("refresh_token");
        const response = await axios.post(REFRESH_URL, {
            refresh: refresh_token,
        });
        return response;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
        throw error;
    }
};

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwtDecode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; 
    }
};
