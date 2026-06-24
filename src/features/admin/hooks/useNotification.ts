import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationResponse } from "../../../types/notification";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    sendNotification,
} from "../services/notificationServices";
import { SendNotificationPayload } from "../../../types/notification";
import { message } from "antd";
import { useLanguage } from "../../../contexts/LanguageContext";

export const useNotifications = (params?: {
    page?: number;
    limit?: number;
}, enabled?: boolean) => {
    return useQuery<NotificationResponse>({
        queryKey: ["notifications", params],
        queryFn: () => getNotifications(params),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60 * 10,
        enabled: enabled !== undefined ? enabled : true,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    return useMutation({
        mutationFn: (id: string) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            message.success(language === "ar" ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
        },
        onError: () => {
            message.error(language === "ar" ? "حدث خطأ أثناء التحديث" : "An error occurred while updating");
        }
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    return useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            message.success(language === "ar" ? "تم تحديد جميع الإشعارات كمقروءة" : "All notifications marked as read");
        },
        onError: () => {
            message.error(language === "ar" ? "حدث خطأ أثناء التحديث" : "An error occurred while updating");
        }
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            message.success(language === "ar" ? "تم حذف الإشعار بنجاح" : "Notification deleted successfully");
        },
        onError: () => {
            message.error(language === "ar" ? "حدث خطأ أثناء الحذف" : "An error occurred during deletion");
        }
    });
};

export const useSendNotification = () => {
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    return useMutation({
        mutationFn: (payload: SendNotificationPayload) => sendNotification(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            message.success(language === "ar" ? "تم إرسال الإشعار بنجاح" : "Notification sent successfully");
        },
        onError: () => {
            message.error(language === "ar" ? "حدث خطأ أثناء إرسال الإشعار" : "An error occurred while sending notification");
        }
    });
};