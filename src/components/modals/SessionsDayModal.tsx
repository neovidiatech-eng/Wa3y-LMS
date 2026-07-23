import { useLanguage } from '../../contexts/LanguageContext';
import { X, Calendar, Clock } from "lucide-react";
import { AgendaSession } from "../../types/Agenda";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  sessions: AgendaSession[];
  studentMap?: Map<string, string>;
  teacherMap?: Map<string, string>;
}

const getPersonName = (person: any, id?: string, idMap?: Map<string, string>): string => {
  if (id && idMap && idMap.has(id)) {
    return idMap.get(id)!;
  }
  if (!person) return "-";
  if (typeof person === "string") return person;
  if (typeof person === "object") {
    if (person.user?.name) return person.user.name;
    if (person.name) return person.name;
    if (person.name_ar) return person.name_ar;
    if (person.name_en) return person.name_en;
    if (person.email) return person.email;
  }
  return "-";
};

const getStatusBadge = (status?: string, language: string = "ar") => {
  const s = status?.toLowerCase();
  const isAr = language.startsWith("ar");
  switch (s) {
    case "scheduled":
      return { label: isAr ? "مجدولة" : "Scheduled", className: "bg-blue-50 text-blue-700 border-blue-200" };
    case "planned":
      return { label: isAr ? "مخطط لها" : "Planned", className: "bg-purple-50 text-purple-700 border-purple-200" };
    case "completed":
      return { label: isAr ? "مكتملة" : "Completed", className: "bg-green-50 text-green-700 border-green-200" };
    case "cancelled":
    case "canceled":
      return { label: isAr ? "ملغاة" : "Cancelled", className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { label: status || "-", className: "bg-gray-100 text-gray-700 border-gray-200" };
  }
};

export default function SessionsDayModal({
  isOpen,
  onClose,
  date,
  sessions,
  studentMap,
  teacherMap,
}: Props) {
  const { language } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* HEADER */}
        <div className="sticky top-0 bg-primary text-white flex justify-between items-center px-6 py-4 rounded-t-2xl z-50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'ar' ? `حصص يوم - ${date}` : `Sessions - ${date}`}
          </h2>

          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              {language === 'ar' ? 'لا توجد حصص في هذا اليوم' : 'No sessions found'}
            </p>
          ) : (
            sessions.map((s) => {
              const teacherName = getPersonName(s.teacher, s.teacherId, teacherMap);
              const studentName = getPersonName(s.student, s.studentId, studentMap);
              const badge = getStatusBadge(s.status, language);

              return (
                <div key={s.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  {s.description && <p className="text-sm text-gray-600">{s.description}</p>}

                  <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{teacherName}</span>
                      <span className="text-gray-500 font-semibold">{language === 'ar' ? 'المعلم:' : 'Teacher:'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{studentName}</span>
                      <span className="text-gray-500 font-semibold">{language === 'ar' ? 'الطالب:' : 'Student:'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 pt-1 border-t border-gray-200">
                    <Clock className="w-4 h-4 text-primary" />
                    <span dir="ltr">
                      {s.display_start_time && s.display_end_time
                        ? `${s.display_start_time} - ${s.display_end_time}`
                        : `${new Date(s.start_time).toLocaleTimeString()} - ${new Date(s.end_time).toLocaleTimeString()}`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
