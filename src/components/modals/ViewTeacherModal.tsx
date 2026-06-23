import { X, Phone, Mail, GraduationCap, DollarSign, Calendar, CheckCircle, Clock, Star, Users, TrendingUp, Wallet } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Teacher } from '../../types/teachers';
import { useTeacherById } from '../../features/admin/hooks/useTeacher';

interface ViewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export default function ViewTeacherModal({ isOpen, onClose, teacher }: ViewTeacherModalProps) {
  const { language, t } = useLanguage();
  const { data: fetchedTeacher, isLoading } = useTeacherById(isOpen && teacher ? teacher.id : undefined);

  if (!isOpen || !teacher) return null;

  const activeTeacher: Teacher = fetchedTeacher || teacher;

  // --- Real stats from the API ---
  const stats = activeTeacher.stats;
  const fin = stats?.financials;

  const totalStudents    = stats?.totalStudents    ?? 0;
  const completedSessions = stats?.completedSessions ?? 0;
  const todaySessions    = stats?.todaySessions    ?? 0;
  const upcomingSessions = stats?.upcomingSessions  ?? 0;

  const totalHours       = fin?.totalHours       ?? 0;
  const hourPrice        = fin?.hourPrice        ?? activeTeacher.hour_price ?? 0;
  const totalDue         = fin?.totalDue         ?? 0;
  const completedEarnings = fin?.completedEarnings ?? 0;
  const completedHours   = fin?.completedHours   ?? 0;
  const pendingEarnings  = fin?.pendingEarnings  ?? 0;
  const pendingHours     = fin?.pendingHours     ?? 0;
  const availableBalance = fin?.availableBalance ?? 0;
  const pendingWithdrawals = fin?.pendingWithdrawals ?? 0;

  const avgRating    = activeTeacher.avgRating   ?? 0;
  const totalReviews = activeTeacher.totalReviews ?? 0;

  // Currency: prefer embedded currency object from API, fallback to symbol
  const currency = activeTeacher.currency;
  const currencySymbol = currency?.symbol || currency?.code || 'EGP';
  const currencyName = language === 'ar' ? (currency?.name_ar || currency?.name_en) : (currency?.name_en || currency?.name_ar);

  // Subjects
  const subjects = (activeTeacher.teacherSubjects || []).map((s: any) => {
    if (s.subject) return s.subject.name_ar || s.subject.name_en || '';
    return '';
  }).filter(Boolean);

  // Render stars
  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{activeTeacher.user?.name}</h2>
            {isLoading && (
              <div
                className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                title={t('loading') || 'Loading...'}
              />
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeTeacher.user?.name}</h3>

            {/* Rating */}
            {(avgRating > 0 || totalReviews > 0) && (
              <div className="flex items-center gap-2 mb-3">
                {renderStars(avgRating)}
                <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({totalReviews} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            )}

            {/* Contact */}
            <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
              <a
                href={`tel:${activeTeacher.user?.code_country}${activeTeacher.user?.phone}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{activeTeacher.user?.code_country} {activeTeacher.user?.phone}</span>
              </a>
              <a
                href={`mailto:${activeTeacher.user?.email}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">{activeTeacher.user?.email}</span>
              </a>
            </div>

            {/* Subjects */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {subjects.map((sub, index) => (
                <span key={index} className="inline-flex px-3 py-1 bg-primary-100 text-blue-700 rounded-lg text-sm font-medium">
                  {sub}
                </span>
              ))}
            </div>

            {/* Status / Hourly rate / Currency */}
            <div className="flex gap-3 items-center flex-wrap justify-center">
              <div className={`rounded-xl px-6 py-3 text-center border ${activeTeacher.active ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-500 mb-1">{t('status')}</p>
                <p className={`text-lg font-bold ${activeTeacher.active ? 'text-green-700' : 'text-gray-600'}`}>
                  {activeTeacher.active ? t('active') : t('inactive')}
                </p>
              </div>
              <div className="bg-primary-50 rounded-xl px-6 py-3 text-center border border-blue-100">
                <p className="text-xs text-blue-600 mb-1">{t('hourlyRate') || (language === 'ar' ? 'السعر بالساعة' : 'Hourly Rate')}</p>
                <p className="text-lg font-bold text-blue-700">{hourPrice.toFixed(2)} {currencySymbol}</p>
              </div>
              {currencyName && (
                <div className="bg-gray-50 rounded-xl px-6 py-3 text-center border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'العملة' : 'Currency'}</p>
                  <p className="text-lg font-bold text-gray-700">{currencyName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Session Statistics */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 justify-start">
              <h4 className="text-lg font-bold text-gray-900">{t('statistics') || (language === 'ar' ? 'الإحصائيات' : 'Statistics')}</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-primary-50 w-fit mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1 text-start">{t('students') || (language === 'ar' ? 'عدد الطلاب' : 'Students')}</p>
                <p className="text-2xl font-bold text-gray-900 text-start">{totalStudents}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-orange-50 w-fit mb-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1 text-start">{t('todaySessions') || (language === 'ar' ? 'حصص اليوم' : "Today's Sessions")}</p>
                <p className="text-2xl font-bold text-gray-900 text-start">{todaySessions}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-green-50 w-fit mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1 text-start">{t('completedSessions') || (language === 'ar' ? 'حصص مكتملة' : 'Completed')}</p>
                <p className="text-2xl font-bold text-gray-900 text-start">{completedSessions}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-yellow-50 w-fit mb-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1 text-start">{t('upcomingSessions') || (language === 'ar' ? 'حصص قادمة' : 'Upcoming')}</p>
                <p className="text-2xl font-bold text-gray-900 text-start">{upcomingSessions}</p>
              </div>
            </div>
          </div>

          {/* Earnings Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 justify-start">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-bold text-gray-900">{t('earningsDetails') || (language === 'ar' ? 'تفاصيل الأرباح' : 'Earnings Details')}</h4>
            </div>

            {/* Formula */}
            <div className="bg-primary-50 border border-blue-200 rounded-xl p-4 mb-4 text-start">
              <p className="text-xs text-blue-700 font-semibold mb-1">{t('formula') || (language === 'ar' ? 'المعادلة الحسابية' : 'Formula')}</p>
              <p className="text-sm text-blue-800 font-mono">
                {language === 'ar'
                  ? `الأرباح = عدد الساعات × ${hourPrice} ${currencySymbol}/ساعة`
                  : `Earnings = Hours × ${hourPrice} ${currencySymbol}/hour`}
              </p>
            </div>

            {/* Row 1: Total hours / rate / total due */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="rounded-xl p-5 bg-primary-50 text-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 opacity-70" />
                  <p className="text-sm opacity-80">{t('totalHours') || (language === 'ar' ? 'إجمالي الساعات' : 'Total Hours')}</p>
                </div>
                <p className="text-2xl font-bold text-start">{totalHours.toFixed(1)} {language === 'ar' ? 'ساعة' : 'hrs'}</p>
              </div>
              <div className="rounded-xl p-5 bg-white text-gray-900 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 opacity-50" />
                  <p className="text-sm opacity-80">{t('ratePerHour') || (language === 'ar' ? 'السعر / ساعة' : 'Rate / Hour')}</p>
                </div>
                <p className="text-2xl font-bold text-start">{hourPrice.toFixed(2)} {currencySymbol}</p>
              </div>
              <div className="rounded-xl p-5 bg-green-50 text-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 opacity-70" />
                  <p className="text-sm opacity-80">{t('totalOwed') || (language === 'ar' ? 'إجمالي المستحق' : 'Total Owed')}</p>
                </div>
                <p className="text-2xl font-bold text-start">{totalDue.toFixed(2)} {currencySymbol}</p>
              </div>
            </div>

            {/* Row 2: completed / pending / available */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="rounded-xl p-5 bg-green-50 text-green-700">
                <p className="text-sm mb-2 text-start opacity-80">{t('completedEarnings') || (language === 'ar' ? 'أرباح الحصص المكتملة' : 'Completed Earnings')}</p>
                <p className="text-2xl font-bold text-start">{completedEarnings.toFixed(2)} {currencySymbol}</p>
                <p className="text-xs opacity-60 text-start mt-1">{completedHours.toFixed(1)} {language === 'ar' ? 'ساعة' : 'hrs'}</p>
              </div>
              <div className="rounded-xl p-5 bg-orange-50 text-orange-700">
                <p className="text-sm mb-2 text-start opacity-80">{t('pendingEarnings') || (language === 'ar' ? 'أرباح معلقة' : 'Pending Earnings')}</p>
                <p className="text-2xl font-bold text-start">{pendingEarnings.toFixed(2)} {currencySymbol}</p>
                <p className="text-xs opacity-60 text-start mt-1">{pendingHours.toFixed(1)} {language === 'ar' ? 'ساعة' : 'hrs'}</p>
              </div>
              <div className="rounded-xl p-5 bg-gray-50 text-gray-700 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 opacity-60" />
                  <p className="text-sm opacity-80">{t('availableForWithdrawal') || (language === 'ar' ? 'رصيد متاح للسحب' : 'Available Balance')}</p>
                </div>
                <p className="text-2xl font-bold text-start">{availableBalance.toFixed(2)} {currencySymbol}</p>
              </div>
            </div>

            {/* Pending withdrawals */}
            <div className="rounded-xl p-5 bg-red-50 text-red-700">
              <p className="text-sm mb-2 text-start opacity-80">{t('pendingWithdrawalRequests') || (language === 'ar' ? 'طلبات سحب معلقة' : 'Pending Withdrawal Requests')}</p>
              <p className="text-2xl font-bold text-start">{pendingWithdrawals.toFixed(2)} {currencySymbol}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button onClick={onClose} className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium">
            {t('close') || (language === 'ar' ? 'إغلاق' : 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
