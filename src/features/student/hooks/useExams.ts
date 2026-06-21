import { useQuery } from "@tanstack/react-query";
import { getUserExams } from "../services/ExamServices";
import { getStudents } from "../../admin/services/StudentServices";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents({ limit: 1000 }),
  });
};

export const useExams = () => {
  return useQuery({
    queryKey: ["user-exams"],
    queryFn: getUserExams,
  });
};
