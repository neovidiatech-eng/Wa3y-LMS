import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useSendNotification } from "../hooks/useNotification";
import { SendNotificationPayload } from "../../../types/notification";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTeacher } from "../hooks/useTeacher";
import { useStudents } from "../hooks/useStudents";
import { useGetParents } from "../hooks/useParents";

const SpecificUserSelect = ({ role, isRtl }: { role: string, isRtl: boolean }) => {
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeacher(role === "teachers" ? { limit: 100 } : undefined);
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents(role === "students" ? { limit: 1000 } : undefined);
  const { data: parentsData, isLoading: isLoadingParents } = useGetParents(); 

  let options: { value: string, label: string }[] = [];
  let loading = false;

  if (role === "teachers") {
    loading = isLoadingTeachers;
    options = teachersData?.teachers?.map(t => ({ value: t.user?.id || t.user_id, label: t.user?.name || t.user?.email || t.id })) || [];
  } else if (role === "students") {
    loading = isLoadingStudents;
    options = studentsData?.data?.studentsData?.map(s => ({ value: s.user?.id || s.user_id, label: s.user?.name || s.user?.email || s.id })) || [];
  } else if (role === "parents") {
    loading = isLoadingParents;
    options = parentsData?.data?.parents?.map(p => ({ value: p.id, label: p.name || p.email || p.id })) || [];
  }

  return (
    <Form.Item
      name="userId"
      label={isRtl ? "اختر المستخدم" : "Select User"}
      rules={[{ required: true, message: isRtl ? "الرجاء اختيار المستخدم" : "Please select a user" }]}
    >
      <Select 
        showSearch 
        loading={loading}
        optionFilterProp="children"
        placeholder={isRtl ? "ابحث بالاسم أو البريد الإلكتروني" : "Search by name or email"}
      >
        {options.map(opt => (
          <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

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

  const handleSubmit = (values: SendNotificationPayload & { specificUserRole?: string }) => {
    const payload = { ...values };
    delete payload.specificUserRole;
    sendNotification(payload);
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
          {({ getFieldValue, setFieldsValue }) =>
            getFieldValue("targetType") === "single" ? (
              <Form.Item
                name="specificUserRole"
                label={isRtl ? "نوع المستخدم" : "User Type"}
                rules={[{ required: true, message: isRtl ? "الرجاء اختيار النوع" : "Please select user type" }]}
              >
                <Select placeholder={isRtl ? "اختر النوع" : "Select Type"} onChange={() => setFieldsValue({ userId: undefined })}>
                  <Select.Option value="teachers">{isRtl ? "المعلمين" : "Teachers"}</Select.Option>
                  <Select.Option value="students">{isRtl ? "الطلاب" : "Students"}</Select.Option>
                  <Select.Option value="parents">{isRtl ? "أولياء الأمور" : "Parents"}</Select.Option>
                </Select>
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.targetType !== currentValues.targetType ||
            prevValues.specificUserRole !== currentValues.specificUserRole
          }
        >
          {({ getFieldValue }) => {
            const targetType = getFieldValue("targetType");
            const specificRole = getFieldValue("specificUserRole");
            
            if (targetType === "single" && specificRole) {
              return <SpecificUserSelect role={specificRole} isRtl={isRtl} />;
            }
            return null;
          }}
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
