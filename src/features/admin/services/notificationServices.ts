import api from "../../../lib/axios";
import { NotificationResponse, SendNotificationPayload } from "../../../types/notification";

const getEndpoint = (path: string = "") => {
    const role = localStorage.getItem('role');
    // If it's an admin or super admin, use /admin/notifications
    // Otherwise, use /notifications for students and teachers
    const basePath = (role === 'admin' || role === 'super_admin') ? '/admin/notifications' : '/notifications';
    return `${basePath}${path}`;
};

export const getNotifications = async (params?: {
    page?: number;
    limit?: number;
}): Promise<NotificationResponse> => {
    const response = await api.get(getEndpoint(), { params });
    return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
    const response = await api.patch(getEndpoint(`/${id}/read`));
    return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<NotificationResponse> => {
    const response = await api.patch(getEndpoint("/read-all"));
    return response.data;
};

export const deleteNotification = async (id: string): Promise<NotificationResponse> => {
    const response = await api.delete(getEndpoint(`/${id}`));
    return response.data;
};

export const sendNotification = async (payload: SendNotificationPayload): Promise<any> => {
    // Sending notifications is usually restricted to admin
    const response = await api.post("/admin/notifications", payload);
    return response.data;
};