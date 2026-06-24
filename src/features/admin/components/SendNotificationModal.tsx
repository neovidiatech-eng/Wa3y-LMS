import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useSendNotification } from "../hooks/useNotification";
import { SendNotificationPayload } from "../../../types/notification";
import { useLanguage } from "../../../contexts/LanguageContext";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm<SendNotificationPayload>();
  const { language } = useLanguage();
  const { mutate: sendNotification, isPending, isSuccess } = useSendNotification();

  const isRtl = language === "ar";

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      onClose();
    }
  }, [isSuccess, form, onClose]);

  const handleSubmit = (values: SendNotificationPayload) => {
    sendNotification(values);
  };

  return (
    <Modal
      title={isRtl ? "إرسال إشعار جديد" : "Send New Notification"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ targetType: "all" }}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label={isRtl ? "عنوان الإشعار" : "Notification Title"}
          rules={[{ required: true, message: isRtl ? "الرجاء إدخال العنوان" : "Please enter the title" }]}
        >
          <Input placeholder={isRtl ? "أدخل عنوان الإشعار" : "Enter notification title"} />
        </Form.Item>

        <Form.Item
          name="message"
          label={isRtl ? "نص الإشعار" : "Notification Message"}
          rules={[{ required: true, message: isRtl ? "الرجاء إدخال الرسالة" : "Please enter the message" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={isRtl ? "أدخل نص الإشعار هنا..." : "Enter notification message here..."}
          />
        </Form.Item>

        <Form.Item
          name="targetType"
          label={isRtl ? "الفئة المستهدفة" : "Target Audience"}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="all">{isRtl ? "الجميع" : "All"}</Select.Option>
            <Select.Option value="teachers">{isRtl ? "المعلمين" : "Teachers"}</Select.Option>
            <Select.Option value="students">{isRtl ? "الطلاب" : "Students"}</Select.Option>
            <Select.Option value="parents">{isRtl ? "أولياء الأمور" : "Parents"}</Select.Option>
            <Select.Option value="single">{isRtl ? "مستخدم محدد" : "Specific User"}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.targetType !== currentValues.targetType}
        >
          {({ getFieldValue }) =>
            getFieldValue("targetType") === "single" ? (
              <Form.Item
                name="userId"
                label={isRtl ? "رقم أو معرّف المستخدم" : "User ID"}
                rules={[{ required: true, message: isRtl ? "الرجاء إدخال معرّف المستخدم" : "Please enter the User ID" }]}
              >
                <Input placeholder={isRtl ? "أدخل معرّف المستخدم" : "Enter User ID"} />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} disabled={isPending}>
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            {isRtl ? "إرسال" : "Send"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
