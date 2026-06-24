import api from "../../../lib/axios";
import { Student, StudentsFetchResponse } from "../../../types/student";
import { StudentFormData } from "../../../lib/schemas/StudentSchema";

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  planId?: string;
}

export const getStudents = async (params: GetStudentsParams = {}): Promise<StudentsFetchResponse> => {
  const { page, limit, search, country, planId } = params;

  const queryParams: Record<string, string | number> = {};
  if (page !== undefined) queryParams.page = page;
  if (limit !== undefined && limit !== 1000) queryParams.limit = limit;
  if (search) queryParams.search = search;
  if (country && country !== "all") queryParams.country = country;
  if (planId && planId !== "all") queryParams.planId = planId;

  // If we need all records (limit=1000), fetch the first page to get totalPages, then fetch the rest
  if (limit === 1000) {
    queryParams.page = 1;
    const firstResponse = await api.get("/students", { params: queryParams });
    const data = firstResponse.data;
    
    if (data.data?.pagination?.totalPages > 1) {
      const totalPages = data.data.pagination.totalPages;
      const promises = [];
      for (let i = 2; i <= totalPages; i++) {
        promises.push(api.get("/students", { params: { ...queryParams, page: i } }));
      }
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res.data?.data?.studentsData) {
          data.data.studentsData = data.data.studentsData.concat(res.data.data.studentsData);
        }
      });
    }
    return data;
  }

  const response = await api.get("/students", {
    params: queryParams
  });
  return response.data;
};

export const searchStudent = async (
  search: string,
): Promise<StudentsFetchResponse> => {
    const response = await api.get(`/students?search=${search}`);
    return response.data;

};

export const getStudentById = async (
  id: string,
): Promise<StudentsFetchResponse> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};
export const updateStudent = async (
  id: string,
  data: StudentFormData | Partial<Student>,
) => {
  const response = await api.patch(`/students/update/${id}`, data);
  return response.data;
};
export const deleteStudent = async (id: string) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
export const createStudent = async (
  data: StudentFormData | Partial<Student>,
) => {
  const response = await api.post(`/students/create`, data);
  return response.data;
};
