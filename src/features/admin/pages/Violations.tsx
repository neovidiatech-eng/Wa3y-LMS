import { useState } from "react";
import { Table, Tag, Card, Row, Col, Select, Spin, Alert, Button } from "antd";
import { ShieldAlert, AlertTriangle, CheckCircle, Filter, Plus } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useViolations } from "../hooks/useViolations";
import { ViolationItem } from "../../../types/Violations";
import AddViolationModal from "../../../components/modals/AddViolationModal";
import IssueViolationModal from "../../../components/modals/IssueViolationModal";

export default function Violations() {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useViolations();

  const items: ViolationItem[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data as any)?.items || [];

  const filteredItems = items.filter((item) => {
    if (filterType === "all") return true;
    return item.defaultType === filterType;
  });

  const columns = [
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
              ? "قائمة البنود والأنواع المعتمدة للمخالفات والتحذيرات"
              : "List of predefined violation and warning items"}
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
          <Card className="shadow-sm border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{isRtl ? "عدد العقوبات / الخصومات" : "Total Penalties"}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {items.filter((v) => v.defaultType === "penalty").length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{isRtl ? "عدد التحذيرات" : "Total Warnings"}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {items.filter((v) => v.defaultType === "warning").length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{isRtl ? "البنود النشطة" : "Active Items"}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {items.filter((v) => v.active).length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter Bar & Table */}
      <Card className="shadow-sm border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {isRtl ? "تصفية حسب النوع:" : "Filter by type:"}
            </span>
            <Select
              defaultValue="all"
              style={{ width: 160 }}
              onChange={(value) => setFilterType(value)}
              options={[
                { value: "all", label: isRtl ? "الكل" : "All" },
                { value: "penalty", label: isRtl ? "خصم / عقوبة" : "Penalty" },
                { value: "warning", label: isRtl ? "تحذير" : "Warning" },
              ]}
            />
          </div>
        </div>

        {isError && (
          <Alert
            type="error"
            message={isRtl ? "حدث خطأ أثناء جلب البيانات" : "Failed to load violations"}
            description={(error as any)?.message || ""}
            showIcon
            className="mb-4"
          />
        )}

        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={filteredItems}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </Spin>
      </Card>

      {/* Add Violation Modal Component */}
      <AddViolationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Issue Violation Modal Component */}
      <IssueViolationModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
      />
    </div>
  );
}
