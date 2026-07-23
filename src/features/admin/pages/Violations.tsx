import { useState } from "react";
import { Table, Tag, Card, Row, Col, Select, Spin, Alert, Button, message } from "antd";
import { ShieldAlert, AlertTriangle, CheckCircle, Filter, Plus, History, List, Trash2 } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useViolations, useTeacherViolationsHistory, useDeleteViolationItem } from "../hooks/useViolations";
import { ViolationItem, IssuedViolationHistoryItem, ViolationType } from "../../../types/Violations";
import AddViolationModal from "../../../components/modals/AddViolationModal";
import IssueViolationModal from "../../../components/modals/IssueViolationModal";
import ConfirmModal from "../../../components/modals/ConfirmModal";

export default function Violations() {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [filterType, setFilterType] = useState<string>("all");
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>("all");
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historyLimit] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<ViolationItem | null>(null);

  const [activeTab, setActiveTab] = useState<"items" | "history">("items");

  // Predefined violation items
  const { data, isLoading, isError, error } = useViolations();
  const deleteViolationMutation = useDeleteViolationItem();

  // History query params
  const historyParams = {
    page: historyPage,
    limit: historyLimit,
    type: historyTypeFilter !== "all" ? (historyTypeFilter as ViolationType) : undefined,
  };
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
  } = useTeacherViolationsHistory(historyParams);

  const items: ViolationItem[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data as any)?.items || [];

  const filteredItems = items.filter((item) => {
    if (filterType === "all") return true;
    return item.defaultType === filterType;
  });

  const historyViolations: IssuedViolationHistoryItem[] = historyData?.data?.violations || [];
  const historyPagination = historyData?.data?.pagination;

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteViolationMutation.mutateAsync(itemToDelete.id);
      message.success(isRtl ? "تم حذف البند بنجاح" : "Item deleted successfully");
      setItemToDelete(null);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || (isRtl ? "حدث خطأ أثناء الحذف" : "Failed to delete item")
      );
    }
  };

  const itemColumns = [
    {
      title: isRtl ? "العنوان بالعربية" : "Title (Arabic)",
      dataIndex: "title_ar",
      key: "title_ar",
      render: (text: string) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: isRtl ? "العنوان بالإنجليزية" : "Title (English)",
      dataIndex: "title_en",
      key: "title_en",
      render: (text: string) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: isRtl ? "النوع الافتراضي" : "Default Type",
      dataIndex: "defaultType",
      key: "defaultType",
      render: (type: string) => (
        <Tag color={type === "penalty" ? "red" : "gold"} className="px-2 py-0.5 font-medium">
          {type === "penalty"
            ? isRtl
              ? "مخالفة / خصم"
              : "Penalty"
            : isRtl
            ? "تحذير"
            : "Warning"}
        </Tag>
      ),
    },
    {
      title: isRtl ? "قيمة الخصم الافتراضية" : "Default Deduction",
      dataIndex: "defaultDeductionAmount",
      key: "defaultDeductionAmount",
      render: (amount: number) => (
        <span className="font-medium text-gray-800">
          {amount > 0 ? `${amount} ${isRtl ? "ج.م" : "EGP"}` : isRtl ? "بدون خصم" : "No deduction"}
        </span>
      ),
    },
    {
      title: isRtl ? "الوصف" : "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="text-gray-600">{text || "-"}</span>,
    },
    {
      title: isRtl ? "الحالة" : "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "success" : "default"}>
          {active ? (isRtl ? "مفعل" : "Active") : isRtl ? "معطل" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: isRtl ? "تاريخ الإنشاء" : "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString(isRtl ? "ar-EG" : "en-US") : "-",
    },
    {
      title: isRtl ? "الإجراءات" : "Actions",
      key: "actions",
      render: (_: any, record: ViolationItem) => (
        <Button
          type="text"
          danger
          icon={<Trash2 className="w-4 h-4 text-red-500" />}
          onClick={() => setItemToDelete(record)}
          title={isRtl ? "حذف" : "Delete"}
        />
      ),
    },
  ];

  const historyColumns = [
    {
      title: isRtl ? "اسم المعلم" : "Teacher Name",
      dataIndex: ["teacher", "user", "name"],
      key: "teacherName",
      render: (_: any, record: IssuedViolationHistoryItem) => (
        <span className="font-semibold text-gray-900">{record.teacher?.user?.name || "-"}</span>
      ),
    },
    {
      title: isRtl ? "بند المخالفة" : "Infraction Item",
      dataIndex: "infractionItem",
      key: "infractionItem",
      render: (_: any, record: IssuedViolationHistoryItem) => (
        <span className="text-gray-800 font-medium">
          {isRtl ? record.infractionItem?.title_ar : record.infractionItem?.title_en}
        </span>
      ),
    },
    {
      title: isRtl ? "النوع" : "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "penalty" ? "red" : "gold"} className="px-2 py-0.5 font-medium">
          {type === "penalty"
            ? isRtl
              ? "مخالفة / خصم"
              : "Penalty"
            : isRtl
            ? "تحذير"
            : "Warning"}
        </Tag>
      ),
    },
    {
      title: isRtl ? "قيمة الخصم" : "Deduction Amount",
      dataIndex: "deductionAmount",
      key: "deductionAmount",
      render: (amount: number) => (
        <span className="font-medium text-red-600">
          {amount > 0 ? `${amount} ${isRtl ? "ج.م" : "EGP"}` : isRtl ? "بدون خصم" : "No deduction"}
        </span>
      ),
    },
    {
      title: isRtl ? "السبب" : "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => <span className="text-gray-600">{text || "-"}</span>,
    },
    {
      title: isRtl ? "المشرف الصادر عنه" : "Supervisor",
      dataIndex: ["supervisor", "name"],
      key: "supervisorName",
      render: (_: any, record: IssuedViolationHistoryItem) => (
        <span className="text-gray-700">{record.supervisor?.name || "-"}</span>
      ),
    },
    {
      title: isRtl ? "تاريخ الإصدار" : "Issued At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) =>
        dateStr
          ? new Date(dateStr).toLocaleString(isRtl ? "ar-EG" : "en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "-",
    },
  ];

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRtl ? "المخالفات والتحذيرات" : "Violations & Warnings"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRtl
              ? "إدارة بنود المخالفات ومتابعة سجل التحذيرات والعقوبات الصادرة"
              : "Manage violation items and track issued warnings and penalties history"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="default"
            danger
            icon={<ShieldAlert className="w-4 h-4" />}
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center gap-2"
          >
            {isRtl ? "إصدار مخالفة للمعلم" : "Issue Violation to Teacher"}
          </Button>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            {isRtl ? "إضافة بند جديد" : "Add New Item"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {isRtl ? "إجمالي بنود المخالفات" : "Total Infraction Items"}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {isRtl ? "بنود التحذيرات" : "Warning Items"}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {items.filter((i) => i.defaultType === "warning").length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-gray-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {isRtl ? "البنود النشطة" : "Active Items"}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {items.filter((i) => i.active).length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Pill Segmented Switcher Header */}
      <Card className="shadow-sm border-gray-100 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Pill Segmented Switcher */}
          <div className="inline-flex p-1.5 bg-gray-100/80 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("items")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "items"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <List className="w-4 h-4" />
              <span>{isRtl ? "جدول البنود المحددة" : "Predefined Items"}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "items"
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>{isRtl ? "سجل المخالفات الصادرة" : "Issued Violations History"}</span>
              {(historyPagination?.total !== undefined || historyPagination?.totalItems !== undefined) && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === "history"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {historyPagination?.total ?? historyPagination?.totalItems ?? 0}
                </span>
              )}
            </button>
          </div>

          {/* Filters per tab */}
          {activeTab === "items" ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select
                value={filterType}
                onChange={(val) => setFilterType(val)}
                className="w-full sm:w-48"
                options={[
                  { value: "all", label: isRtl ? "كل الأنواع" : "All Types" },
                  { value: "warning", label: isRtl ? "تحذير" : "Warning" },
                  { value: "penalty", label: isRtl ? "خصم / عقوبة" : "Penalty" },
                ]}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select
                value={historyTypeFilter}
                onChange={(val) => {
                  setHistoryTypeFilter(val);
                  setHistoryPage(1);
                }}
                className="w-full sm:w-48"
                options={[
                  { value: "all", label: isRtl ? "كل السجلات" : "All History" },
                  { value: "warning", label: isRtl ? "التحذيرات فقط" : "Warnings Only" },
                  { value: "penalty", label: isRtl ? "العقوبات فقط" : "Penalties Only" },
                ]}
              />
            </div>
          )}
        </div>

        {/* Tab 1: Predefined Items Table */}
        {activeTab === "items" && (
          <div>
            {isError && (
              <Alert
                type="error"
                message={isRtl ? "حدث خطأ أثناء جلب البيانات" : "Failed to load violation items"}
                description={(error as any)?.message || ""}
                showIcon
                className="mb-4"
              />
            )}

            <Spin spinning={isLoading}>
              <Table
                columns={itemColumns}
                dataSource={filteredItems}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Spin>
          </div>
        )}

        {/* Tab 2: Issued Violations History Table */}
        {activeTab === "history" && (
          <div>
            {isHistoryError && (
              <Alert
                type="error"
                message={isRtl ? "حدث خطأ أثناء جلب سجل المخالفات" : "Failed to load violations history"}
                description={(historyError as any)?.message || ""}
                showIcon
                className="mb-4"
              />
            )}

            <Spin spinning={isHistoryLoading}>
              <Table
                columns={historyColumns}
                dataSource={historyViolations}
                rowKey="id"
                pagination={{
                  current: historyPage,
                  pageSize: historyLimit,
                  total: historyPagination?.total ?? historyPagination?.totalItems ?? 0,
                  onChange: (page) => setHistoryPage(page),
                  showSizeChanger: false,
                }}
                scroll={{ x: true }}
              />
            </Spin>
          </div>
        )}
      </Card>

      {/* Add Infraction Item Modal */}
      <AddViolationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Issue Violation Modal */}
      <IssueViolationModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} />

      {/* Delete Item Confirmation Modal Component */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={isRtl ? "تأكيد حذف بند المخالفة" : "Confirm Item Deletion"}
        message={
          isRtl
            ? `هل أنت تأكد من رغبتك في حذف بند "${itemToDelete?.title_ar}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : `Are you sure you want to delete the item "${itemToDelete?.title_en}"? This action cannot be undone.`
        }
        confirmText={isRtl ? "نعم، احذف" : "Delete"}
        cancelText={isRtl ? "إلغاء" : "Cancel"}
        isLoading={deleteViolationMutation.isPending}
      />
    </div>
  );
}
