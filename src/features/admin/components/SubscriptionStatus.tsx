import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import type { subscriptionsStatus } from "../../../types/AdminDasboard";
import i18n from "../../../../i18n";

interface SubscriptionsStatus {
  subscriptionStatus?: subscriptionsStatus;
}

const COLORS = {
  active: "#00a8a8",
  expiringSoon: "#daad15",
  expired: "#b92500ff",

};

export default function SubscriptionsStatus({ subscriptionStatus }: SubscriptionsStatus) {
  const { t } = useTranslation();
  const active = subscriptionStatus?.active ?? 0;
  const expiringSoon = subscriptionStatus?.expiringSoon ?? 0;
  const expired = subscriptionStatus?.expired ?? 0;

  const chartData = [
    { name: t("dashboard.active"), value: active, color: COLORS.active },
    { name: t("dashboard.expiringSoon"), value: expiringSoon, color: COLORS.expiringSoon },
    { name: t("dashboard.expired"), value: expired, color: COLORS.expired },
  ];

  const total = active + expiringSoon + expired;
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const expiringSoonPercent = total > 0 ? Math.round((expiringSoon / total) * 100) : 0;
  const expiredPercent = total > 0 ? Math.round((expired / total) * 100) : 0;


  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center h-full">
      <div className={`w-full flex ${i18n.language === "ar" ? "justify-start" : "justify-start"} items-start mb-6`}>
        <div className={`flex flex-col ${i18n.language === "ar" ? "items-start text-right" : "items-start text-left"}`}>
          <h2 className="text-xl font-bold text-gray-800">{t("dashboard.subStatus")}</h2>
          <p className="text-gray-400 text-sm">{t("dashboard.subStatusSubTitle")}</p>
        </div>
      </div>

      <div className="relative w-full h-[220px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={total === 0 ? 0 : 5}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} ${t("dashboard.user")}`, name as string]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-xs font-medium">{t("dashboard.total")}</span>
          <span className="text-3xl font-black text-gray-900">{total}</span>
          <span className="text-gray-400 text-[11px] mt-0.5">{t("dashboard.subs")}</span>
        </div>
      </div>

      <div className="w-full mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 order-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.active }} />
            <span className="text-gray-600 font-medium">{t("dashboard.active")}</span>
          </div>
          <div className="flex items-center gap-2 order-1">
            <span className="text-gray-800 font-black text-base">{active}</span>
            <span className="text-gray-400 text-xs" >({activePercent}%)</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
          style={{ width: `${activePercent}%`, backgroundColor: COLORS.active }}
          />
        </div>

        <div className="flex items-center justify-between text-sm mt-3">
          <div className="flex items-center gap-2 order-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.expiringSoon }} />
            <span className="text-gray-600 font-medium">{t("dashboard.expiringSoon")}</span>
          </div>
          <div className="flex items-center gap-2 order-1">
            <span className="text-gray-800 font-black text-base">{expiringSoon}</span>
            <span className="text-gray-400 text-xs" >({expiringSoonPercent}%)</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
          style={{ width: `${expiringSoonPercent}%`, backgroundColor: COLORS.expiringSoon }}
          />
        </div>

        <div className="flex items-center justify-between text-sm mt-3">
          <div className="flex items-center gap-2 order-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.expired }} />
            <span className="text-gray-600 font-medium">{t("dashboard.expired")}</span>
          </div>
          <div className="flex items-center gap-2 order-1">
            <span className="text-gray-800 font-black text-base">{expired}</span>
            <span className="text-gray-400 text-xs" >({expiredPercent}%)</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
          style={{ width: `${expiredPercent}%`, backgroundColor: COLORS.expired }}
          />
        </div>
      </div>
    </div>
  );
}
