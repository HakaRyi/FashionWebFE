import axios from 'axios';

export const BASE_URL = 'http://localhost:5196';
export const API_URL = `${BASE_URL}/api`;

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// 1. Request Interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// 2. Response Interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes('/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes('/auth/refresh')) {
                localStorage.clear();
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (!storedRefreshToken) {
                isRefreshing = false;
                localStorage.clear();
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(error);
            }

            return new Promise((resolve, reject) => {
                axios
                    .post(`${axiosClient.defaults.baseURL}/auth/refresh`, {
                        refreshToken: storedRefreshToken,
                    })
                    .then(({ data }) => {
                        const { accessToken, refreshToken } = data;

                        localStorage.setItem('token', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);

                        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                        window.dispatchEvent(
                            new CustomEvent('auth-refreshed', {
                                detail: { accessToken, refreshToken },
                            }),
                        );

                        processQueue(null, accessToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(axiosClient(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        localStorage.clear();
                        window.dispatchEvent(new Event('auth-logout'));
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    },
);

export default axiosClient;
