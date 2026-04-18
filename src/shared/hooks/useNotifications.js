import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import axiosClient from '../lib/axios';

export const useNotifications = (isLoggedIn) => {
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const connectionRef = useRef(null);
    const isFetchingRef = useRef(false);

    // 1. Hàm fetch thông báo (Lấy snapshot chuẩn từ Server)
    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn || isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            const res = await axiosClient.get('/notifications/me');

            const rawData = Array.isArray(res.data) ? res.data : [];

            const finalData = rawData
                .filter((n) => n.id || n.notificationId)
                .map((n) => ({
                    ...n,
                    id: n.id || n.notificationId,
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setNotifications(finalData);

            // Cập nhật trạng thái chưa đọc
            const unread = finalData.some((n) => n.status?.toLowerCase() === 'unread');
            setHasUnread(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [isLoggedIn]);

    // 2. Mark as read cho từng mục
    const markAsRead = async (notifId) => {
        try {
            await axiosClient.put(`/notifications/${notifId}/read`);
            setNotifications((prev) => {
                const updated = prev.map((n) => (n.id === notifId ? { ...n, status: 'Read' } : n));
                setHasUnread(updated.some((n) => n.status?.toLowerCase() === 'unread'));
                return updated;
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // 3. Mark all as read
    const markAllAsRead = async () => {
        if (!hasUnread) return;
        try {
            await axiosClient.put('/notifications/read-all');
            setHasUnread(false);
            setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // 4. Quản lý SignalR và Vòng đời Hook
    useEffect(() => {
        let isMounted = true;

        if (!isLoggedIn) {
            setNotifications([]);
            setHasUnread(false);
            return;
        }

        // Gọi fetch lần đầu khi login
        fetchNotifications();

        const setupConnection = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5196/notificationHub', {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.None)
                .build();

            // Lắng nghe thông báo thời gian thực
            connection.on('ReceiveNotification', (newNotif) => {
                if (!isMounted || !newNotif) return;

                const normalizedNotif = {
                    ...newNotif,
                    id: newNotif.id || newNotif.notificationId,
                    status: newNotif.status || 'Unread',
                    createdAt: newNotif.createdAt || new Date().toISOString(),
                };

                if (!normalizedNotif.id) return;

                setNotifications((prev) => {
                    // Chống trùng: Nếu thông báo đã tồn tại trong list thì không thêm nữa
                    if (prev.some((n) => n.id === normalizedNotif.id)) return prev;

                    setHasUnread(true);
                    return [normalizedNotif, ...prev];
                });
            });

            try {
                await connection.start();
                if (isMounted) {
                    connectionRef.current = connection;
                    console.log('SignalR Connected');
                } else {
                    await connection.stop();
                }
            } catch (err) {
                if (isMounted && err.name !== 'AbortError') {
                    console.error('SignalR Connection Error:', err);
                }
            }
        };

        setupConnection();

        return () => {
            isMounted = false;
            if (connectionRef.current) {
                connectionRef.current.off('ReceiveNotification');
                if (connectionRef.current.state !== signalR.HubConnectionState.Disconnected) {
                    connectionRef.current.stop().catch(() => {});
                }
                connectionRef.current = null;
            }
        };
    }, [isLoggedIn, fetchNotifications]);

    return {
        notifications,
        hasUnread,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    };
};
