import axios from 'axios';
import { logout, getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constant';
import Cookie from "js-cookie";

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // 5 seconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});


// Request interceptor for adding authentication token if available
apiInstance.interceptors.request.use(
    async (config) => {
        const accessToken = Cookie.get("access_token");

        if (accessToken) {
            if (!config.headers) {
                config.headers = new axios.AxiosHeaders();
            }
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;

            // If token is expired, refresh it
            if (isAccessTokenExpired(accessToken)) {
                const refreshToken = Cookie.get("refresh_token");
                if (refreshToken) {
                    try {
                        const response = await getRefreshToken();
                        setAuthUser(response.data.access, response.data.refresh);
                        config.headers.Authorization = `Bearer ${response.data.access}`; // Update header with new access
                    } catch (error) {
                        console.error("Token refresh failed:", error);
                        await logout(); // Важливо: якщо оновити не вдалося — вийти з акаунта
                        throw error; // Перервати запит
                    }
                }
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access - logging out user.");
            logout();
        }
        return Promise.reject(error);
    }
);



export default apiInstance;