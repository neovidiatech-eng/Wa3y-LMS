import { useState } from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { BellPlus, Check, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNotifications, useMarkNotificationAsRead, useDeleteNotification } from "../hooks/useNotification";
import { SendNotificationModal } from "../components/SendNotificationModal";
import { Notification } from "../../../types/notification";

export default function Notifications() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" || role === "super_admin";
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useNotifications({ page, limit });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination;

  const columns = [
    {
      title: isRtl ? "العنوان" : "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Notification) => (
        <span className={record.isRead ? "text-gray-500" : "font-bold text-gray-900"}>
          {text || (isRtl ? "بدون عنوان" : "No Title")}
        </span>
      ),
    },
    {
      title: isRtl ? "الرسالة" : "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string, record: Notification) => (
        <span className={record.isRead ? "text-gray-500" : "font-bold text-gray-900"}>
          {text}
        </span>
      ),
    },
    {
      title: isRtl ? "التاريخ" : "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(isRtl ? "ar-EG" : "en-US"),
    },
    {
      title: isRtl ? "الحالة" : "Status",
      key: "status",
      render: (_: any, record: Notification) => (
        <Tag color={record.isRead ? "default" : "blue"}>
          {record.isRead 
            ? (isRtl ? "مقروء" : "Read") 
            : (isRtl ? "غير مقروء" : "Unread")}
        </Tag>
      ),
    },
    {
      title: isRtl ? "الإجراءات" : "Actions",
      key: "actions",
      render: (_: any, record: Notification) => (
        <Space size="middle">
          {!record.isRead && (
            <Button
              type="text"
              icon={<Check className="w-4 h-4 text-green-600" />}
              onClick={() => markAsRead(record.id)}
              title={isRtl ? "تحديد كمقروء" : "Mark as read"}
            />
          )}
          <Popconfirm
            title={isRtl ? "هل أنت متأكد من حذف الإشعار؟" : "Are you sure to delete this notification?"}
            onConfirm={() => deleteNotif(record.id)}
            okText={isRtl ? "نعم" : "Yes"}
            cancelText={isRtl ? "إلغاء" : "Cancel"}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              title={isRtl ? "حذف" : "Delete"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleBack = () => {
    if (role === 'parent') {
      navigate('/parent-dashboard/children');
    } else if (role === 'admin' || role === 'super_admin') {
      navigate('/dashboard');
    } else if (role === 'student') {
      navigate('/student-dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          {role === 'parent' && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
              title={isRtl ? "رجوع" : "Back"}
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRtl ? "الإشعارات" : "Notifications"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isRtl ? "إدارة إشعارات النظام" : "Manage system notifications"}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl transition-colors"
          >
            <BellPlus className="w-5 h-5" />
            <span>{isRtl ? "إرسال إشعار جديد" : "Send New Notification"}</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: pagination?.totalItems || 0,
            onChange: (page, pageSize) => {
              setPage(page);
              if (pageSize) setLimit(pageSize);
            },
            showSizeChanger: true,
            locale: {
              items_per_page: isRtl ? "في الصفحة" : "/ page"
            }
          }}
          className="[&_.ant-table-thead_th]:bg-gray-50 [&_.ant-table-thead_th]:text-gray-600 [&_.ant-table-thead_th]:font-semibold"
        />
      </div>

      <SendNotificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
