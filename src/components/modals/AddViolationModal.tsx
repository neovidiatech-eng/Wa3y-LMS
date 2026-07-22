import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCreateViolation } from "../../features/admin/hooks/useViolations";
import { CreateViolationPayload } from "../../types/Violations";

interface AddViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddViolationModal({ isOpen, onClose }: AddViolationModalProps) {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [form] = Form.useForm();
  const { mutate: createViolationMutate, isPending: isSubmitting } = useCreateViolation();

  const handleCreate = (values: any) => {
    const payload: CreateViolationPayload = {
      title_ar: values.title_ar,
      title_en: values.title_en,
      description: values.description,
      defaultType: values.defaultType,
      defaultDeductionAmount: values.defaultDeductionAmount || 0,
    };

    createViolationMutate(payload, {
      onSuccess: () => {
        message.success(isRtl ? "تمت إضافة بند المخالفة بنجاح" : "Violation item added successfully");
        onClose();
        form.resetFields();
      },
      onError: (err: any) => {
        message.error(
          err?.response?.data?.message || (isRtl ? "فشل إضافة بند المخالفة" : "Failed to add violation item")
        );
      },
    });
  };

  return (
    <Modal
      title={isRtl ? "إضافة بند مخالفة جديد" : "Create Infraction Item"}
      open={isOpen}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={null}
      destroyOnClose
      centered
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
        <Form.Item
          name="title_ar"
          label={isRtl ? "العنوان بالعربية" : "Title (Arabic)"}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة العنوان بالعربية" : "Please enter Arabic title" }]}
        >
          <Input placeholder={isRtl ? "مثال: عدم الالتزام بالزي المناسب" : "e.g. Inappropriate Appearance"} />
        </Form.Item>

        <Form.Item
          name="title_en"
          label={isRtl ? "العنوان بالإنجليزية" : "Title (English)"}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة العنوان بالإنجليزية" : "Please enter English title" }]}
        >
          <Input placeholder={isRtl ? "مثال: Inappropriate Appearance" : "e.g. Inappropriate Appearance"} />
        </Form.Item>

        <Form.Item
          name="defaultType"
          label={isRtl ? "النوع الافتراضي" : "Default Type"}
          initialValue="warning"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "warning", label: isRtl ? "تحذير (Warning)" : "Warning" },
              { value: "penalty", label: isRtl ? "عقوبة / خصم (Penalty)" : "Penalty" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="defaultDeductionAmount"
          label={isRtl ? "مبلغ الخصم الافتراضي" : "Default Deduction Amount"}
          initialValue={0}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة المبلغ" : "Please enter deduction amount" }]}
        >
          <InputNumber className="w-full" min={0} placeholder="0" />
        </Form.Item>

        <Form.Item
          name="description"
          label={isRtl ? "الوصف" : "Description"}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة الوصف" : "Please enter description" }]}
        >
          <Input.TextArea rows={3} placeholder={isRtl ? "وصف تفصيلي للبند..." : "Detailed description..."} />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>{isRtl ? "إلغاء" : "Cancel"}</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-primary">
            {isRtl ? "إضافة" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
