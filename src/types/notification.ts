export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface NotificationData {
  notifications: Notification[];
  pagination: Pagination;
  unreadCount: number;
  totalUnreadCount: number;
}

export interface NotificationResponse {
  message: string;
  status: number;
  lang: string;
  data: NotificationData;
}

export interface SendNotificationPayload {
  title: string;
  message: string;
  targetType: "all" | "teachers" | "students" | "parents" | "single";
  userId?: string;
}
