import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import axiosClient from '../lib/axios';

export const useNotifications = (isLoggedIn) => {
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const connectionRef = useRef(null);
    const isFetchingRef = useRef(false);

    // 1. Hàm fetch thông báo với cơ chế lọc trùng tuyệt đối
    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn || isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            const res = await axiosClient.get('/notifications/me');
            const data = Array.isArray(res.data) ? res.data : [];

            setNotifications((prev) => {
                const incomingData = Array.isArray(res.data) ? res.data.filter((n) => n?.id) : [];
                const combined = [...incomingData, ...prev];
                const uniqueMap = new Map(combined.map((item) => [item.id, item]));
                const finalData = Array.from(uniqueMap.values()).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );

                const unread = finalData.some((n) => n.status === 'Unread' || n.status === 'unread');
                setHasUnread(unread);

                return finalData;
            });
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
                setHasUnread(updated.some((n) => n.status === 'Unread' || n.status === 'unread'));
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

    // 4. Quản lý vòng đời SignalR (Hoàn hảo cho cả Strict Mode)
    useEffect(() => {
        let isMounted = true;
        let connection = null;

        if (!isLoggedIn) {
            setNotifications([]);
            setHasUnread(false);
            return;
        }

        fetchNotifications();

        const setupConnection = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5196/notificationHub', {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.None)
                .build();

            connection.on('ReceiveNotification', (newNotif) => {
                if (!isMounted || !newNotif) return;

                const normalizedNotif = {
                    ...newNotif,
                    id: newNotif.id || newNotif.notificationId,
                    status: newNotif.status || 'Unread',
                    createdAt: newNotif.createdAt || new Date().toISOString(),
                };

                if (!normalizedNotif.id) {
                    console.error('Thông báo nhận được không có ID hợp lệ:', newNotif);
                    return;
                }

                setNotifications((prev) => {
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
                // Chỉ log lỗi nếu component vẫn còn mount và không phải lỗi Abort do stop giữa chừng
                if (isMounted && err.name !== 'AbortError') {
                    console.error('SignalR Connection Error:', err);
                }
            }
        };

        setupConnection();

        return () => {
            isMounted = false;
            if (connection) {
                connection.off('ReceiveNotification');
                // Chỉ dừng nếu đang ở trạng thái có thể dừng (tránh lỗi negotiation)
                if (connection.state !== signalR.HubConnectionState.Disconnected) {
                    connection.stop().catch(() => {}); // Nuốt lỗi khi stop âm thầm
                }
            }
            connectionRef.current = null;
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
