import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5196/api',
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
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error),
);

// 2. Response Interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if 401 Unauthorized and not retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // Wait for existing refresh process
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

            return new Promise(async (resolve, reject) => {
                try {
                    const storedRefreshToken = localStorage.getItem('refreshToken');

                    // Use plain axios to avoid interceptor loop
                    const res = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh`, {
                        refreshToken: storedRefreshToken,
                    });

                    const { accessToken, refreshToken } = res.data;

                    // Update local storage
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Update default header
                    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    processQueue(null, accessToken);
                    
                    // Reset refreshing state
                    isRefreshing = false;

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    resolve(axiosClient(originalRequest));
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;

                    // Handle total expiration
                    localStorage.clear();
                    window.location.href = '/login';
                    reject(refreshError);
                }
            });
        }

        return Promise.reject(error);
    },
);

export default axiosClient;