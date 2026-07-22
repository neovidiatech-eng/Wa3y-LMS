import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { useLanguage } from "../../contexts/LanguageContext";
import { useViolations, useIssueViolation } from "../../features/admin/hooks/useViolations";
import { useTeacher } from "../../features/admin/hooks/useTeacher";
import { useSearchSchedules } from "../../features/admin/hooks/useSchedules";
import { ViolationItem, IssueViolationPayload } from "../../types/Violations";
import { Teacher } from "../../types/teachers";

interface IssueViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId?: string;
  scheduleId?: string;
}

export default function IssueViolationModal({
  isOpen,
  onClose,
  teacherId,
  scheduleId,
}: IssueViolationModalProps) {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [form] = Form.useForm();
  const { data: violationsData } = useViolations();
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeacher({ page: 1, limit: 100 });
  const { data: schedulesData, isLoading: isLoadingSchedules } = useSearchSchedules("", 1, 100);
  const { mutate: issueMutate, isPending: isSubmitting } = useIssueViolation();

  const violationItems: ViolationItem[] = Array.isArray(violationsData?.data)
    ? violationsData.data
    : (violationsData?.data as any)?.items || [];

  const teachersList: Teacher[] = Array.isArray((teachersData as any)?.teachers)
    ? (teachersData as any).teachers
    : Array.isArray((teachersData as any)?.data?.teachers)
    ? (teachersData as any).data.teachers
    : Array.isArray((teachersData as any)?.data)
    ? (teachersData as any).data
    : Array.isArray(teachersData)
    ? (teachersData as any)
    : [];

  const schedulesList = Array.isArray((schedulesData as any)?.data?.schedule)
    ? (schedulesData as any).data.schedule
    : Array.isArray((schedulesData as any)?.schedule)
    ? (schedulesData as any).schedule
    : Array.isArray((schedulesData as any)?.data?.schedules)
    ? (schedulesData as any).data.schedules
    : Array.isArray((schedulesData as any)?.schedules)
    ? (schedulesData as any).schedules
    : Array.isArray((schedulesData as any)?.data)
    ? (schedulesData as any).data
    : Array.isArray(schedulesData)
    ? (schedulesData as any)
    : [];

  const handleItemSelect = (itemId: string) => {
    const selectedItem = violationItems.find((i) => i.id === itemId);
    if (selectedItem) {
      form.setFieldsValue({
        type: selectedItem.defaultType,
        deductionAmount: selectedItem.defaultDeductionAmount || 0,
        reason: selectedItem.description || "",
      });
    }
  };

  const handleSubmit = (values: any) => {
    const payload: IssueViolationPayload = {
      teacherId: values.teacherId || teacherId,
      scheduleId: values.scheduleId || scheduleId,
      infractionItemId: values.infractionItemId,
      type: values.type,
      deductionAmount: values.deductionAmount || 0,
      reason: values.reason,
    };

    issueMutate(payload, {
      onSuccess: () => {
        message.success(isRtl ? "تم إصدار المخالفة/التحذير بنجاح" : "Violation/Warning issued successfully");
        onClose();
        form.resetFields();
      },
      onError: (err: any) => {
        message.error(
          err?.response?.data?.message || (isRtl ? "فشل إصدار المخالفة/التحذير" : "Failed to issue violation/warning")
        );
      },
    });
  };

  return (
    <Modal
      title={isRtl ? "إصدار مخالفة / تحذير للمعلم" : "Issue Violation / Warning to Teacher"}
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {!teacherId && (
          <Form.Item
            name="teacherId"
            label={isRtl ? "اختر المعلم" : "Select Teacher"}
            rules={[{ required: true, message: isRtl ? "يرجى اختيار المعلم" : "Please select a teacher" }]}
          >
            <Select
              loading={isLoadingTeachers}
              showSearch
              placeholder={isRtl ? "اختر المعلم من القائمة..." : "Select teacher from list..."}
              optionFilterProp="label"
              options={teachersList.map((teacher: any) => {
                const name =
                  teacher?.user?.name ||
                  teacher?.name ||
                  [teacher?.firstName, teacher?.lastName].filter(Boolean).join(" ") ||
                  teacher?.user?.email ||
                  (isRtl ? "معلم بدون اسم" : "Unnamed Teacher");
                return {
                  value: teacher.id || teacher._id,
                  label: name,
                };
              })}
            />
          </Form.Item>
        )}

        {!scheduleId && (
          <Form.Item name="scheduleId" label={isRtl ? "اختر الحصة / السيشن (اختياري)" : "Select Session / Schedule (Optional)"}>
            <Select
              loading={isLoadingSchedules}
              showSearch
              allowClear
              placeholder={isRtl ? "اختر الحصة من القائمة..." : "Select session from list..."}
              optionFilterProp="label"
              options={schedulesList.map((sch: any) => {
                const title =
                  sch.title ||
                  sch.subjectName ||
                  sch.subject?.name_ar ||
                  sch.subject?.name_en ||
                  (isRtl ? "حصة" : "Session");
                const date = sch.date || sch.startTime ? ` (${sch.date || ''} ${sch.startTime || ''})` : '';
                return {
                  value: sch.id || sch._id,
                  label: `${title}${date}`.trim(),
                };
              })}
            />
          </Form.Item>
        )}

        <Form.Item
          name="infractionItemId"
          label={isRtl ? "اختر بند المخالفة" : "Select Violation Item"}
          rules={[{ required: true, message: isRtl ? "يرجى اختيار بند المخالفة" : "Please select item" }]}
        >
          <Select
            placeholder={isRtl ? "اختر البند..." : "Select item..."}
            onChange={handleItemSelect}
            options={violationItems.map((item) => ({
              value: item.id,
              label: `${isRtl ? item.title_ar : item.title_en} (${item.defaultType === "penalty" ? (isRtl ? "خصم" : "Penalty") : (isRtl ? "تحذير" : "Warning")})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label={isRtl ? "نوع الإجراء" : "Action Type"}
          initialValue="warning"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "warning", label: isRtl ? "تحذير بدون خصم (Warning)" : "Warning (No Money Deducted)" },
              { value: "penalty", label: isRtl ? "مخالفة مع خصم مالي (Penalty)" : "Penalty (Money Deducted)" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="deductionAmount"
          label={isRtl ? "مبلغ الخصم (ج.م)" : "Deduction Amount (EGP)"}
          initialValue={0}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة المبلغ" : "Please enter deduction amount" }]}
        >
          <InputNumber className="w-full" min={0} placeholder="0" />
        </Form.Item>

        <Form.Item
          name="reason"
          label={isRtl ? "سبب المخالفة / ملاحظات" : "Reason / Notes"}
          rules={[{ required: true, message: isRtl ? "يرجى كتابة السبب" : "Please enter reason" }]}
        >
          <Input.TextArea rows={3} placeholder={isRtl ? "سبب إصدار المخالفة..." : "Reason for issue..."} />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>{isRtl ? "إلغاء" : "Cancel"}</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-primary">
            {isRtl ? "إصدار المخالفة" : "Issue Violation"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
