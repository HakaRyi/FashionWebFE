import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://your-api-domain.com/api',
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
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (Nơi xử lý Refresh Token)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử lại lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh, đưa request này vào hàng đợi
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
          const refreshToken = localStorage.getItem('refreshToken');
          
          // Gọi API refresh token (không dùng axiosClient để tránh loop vô tận)
          const res = await axios.post('https://your-api-domain.com/api/auth/refresh', {
            refreshToken: refreshToken
          });

          const { token, newRefreshToken } = res.data;

          // Lưu token mới
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Cập nhật header cho request hiện tại và các request trong hàng đợi
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          processQueue(null, token);
          
          resolve(axiosClient(originalRequest));
        } catch (refreshError) {
          // Nếu refresh cũng lỗi (hết hạn cả refresh token) -> Logout luôn
          processQueue(refreshError, null);
          localStorage.clear();
          window.location.href = '/login';
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;