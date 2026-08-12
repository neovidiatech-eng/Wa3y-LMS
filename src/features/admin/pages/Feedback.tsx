import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFeedback } from "../hooks/useFeedback";
import { useStudents } from "../hooks/useStudents";
import { FeedBackItem } from "../../../types/feedback";
import ViewFeedbackModal from "../../../components/modals/ViewFeedbackModal";
import Pagination from "../../../components/ui/Pagination";
import { Star, Calendar, User, GraduationCap, Clock, Search } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import { Student } from "../../../types/student";
import { AutoComplete, Input } from "antd";

const FeedbackPage = () => {
    const { i18n } = useTranslation();
    const language = i18n.language.split('-')[0] || 'en';
    const [page, setPage] = useState(1);
    const limit = 15;
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: students } = useStudents({ limit: 100 });

    // Reset page to 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm]);

    // Fetch from backend using the debounced search term (with key saerch as requested)
    const { data, isLoading, isError } = useFeedback(page, limit, debouncedSearchTerm);

    const [selectedFeedback, setSelectedFeedback] = useState<FeedBackItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const studentOptions = useMemo(() => {
        return students?.data?.studentsData?.map((student: Student) => {
            return {
                value: String(student?.user?.name || ''),
                label: student?.user?.name || 'Unknown',
                searchText: String(student?.user?.name || '')
            }
        }) || [];
    }, [students])


    const allFeedbacks = data?.data.feedbacks.items || [];
    const pagination = data?.data.feedbacks.pagination;

    const handleCardClick = (feedback: FeedBackItem) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {language === 'ar' ? 'التقارير' : 'Reports'}
                </h1>
                
                <div className="relative w-full md:w-96">
                    <AutoComplete
                        options={studentOptions}
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)}
                        className="w-full"
                        allowClear
                        defaultActiveFirstOption={false}
                        filterOption={(inputValue, option) => {
                            const optionText = String(option?.label || '').toLowerCase();
                            const inputText = inputValue.toLowerCase();
                            // Normalize Arabic letters (Hamza, Taa Marboota, Yaa)
                            const normalize = (str: string) => str.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ي/g, 'ى');
                            return normalize(optionText).includes(normalize(inputText));
                        }}
                    >
                        <Input 
                            size="large" 
                            placeholder={language === 'ar' ? ' ابحث باسم الطالب او المعلم...' : 'Search by student or teacher...'}
                            prefix={<Search className="w-5 h-5 text-gray-400 mr-2 rtl:ml-2 rtl:mr-0" />} 
                            className="rounded-xl h-[46px]"
                        />
                    </AutoComplete>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
            ) : isError ? (
                <div className="text-red-500 text-center p-10 font-bold">{language === 'ar' ? 'حدث خطأ أثناء تحميل التقارير' : 'Error loading reports'}</div>
            ) : allFeedbacks.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-lg">{language === 'ar' ? 'لا توجد تقارير مطابقة' : 'No matching reports found'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {allFeedbacks.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item)}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                    {item.schedule.title}
                                </h3>
                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 gap-1" />
                                    <span className="text-sm font-bold text-yellow-700 ml-1 rtl:mr-1 rtl:ml-0">{item.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                                    <span className="font-medium truncate">
                                        {language === 'ar' ? 'المعلم: ' : 'Teacher: '}
                                        {item.role === 'teacher' ? item.reviewer.name : item.reviewee.name}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <User className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-medium truncate">
                                        {language === 'ar' ? 'الطالب: ' : 'Student: '}
                                        {item.role === 'student' ? item.reviewer.name : item.reviewee.name}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 gap-2 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{formatDate(item.schedule.start_time)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span dir="ltr">{new Date(item.schedule.start_time).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-sm text-gray-500 line-clamp-2 italic">
                                    "{item.comment || (language === 'ar' ? 'لا يوجد تعليق' : 'No comment')}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !isError && pagination && pagination.totalPages >= 1 && (
                <div className="mt-8 overflow-hidden shadow-sm">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.limit}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <ViewFeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                feedback={selectedFeedback}
            />
        </div>
    );
}

export default FeedbackPage;
