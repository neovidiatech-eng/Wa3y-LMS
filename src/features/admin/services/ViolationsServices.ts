import api from "../../../lib/axios";
import {
  ViolationsResponse,
  CreateViolationPayload,
  CreateViolationResponse,
  IssueViolationPayload,
  IssueViolationResponse,
  GetTeacherViolationsParams,
  TeacherViolationsHistoryResponse
} from "../../../types/Violations";

export const getViolations = async (): Promise<ViolationsResponse> => {
    const response = await api.get('/violations/items');
    return response.data;
}

export const createViolation = async (payload: CreateViolationPayload): Promise<CreateViolationResponse> => {
    const response = await api.post('/violations/items', payload);
    return response.data;
}

export const issueViolation = async (payload: IssueViolationPayload): Promise<IssueViolationResponse> => {
    const response = await api.post('/violations/issue', payload);
    return response.data;
}

export const getTeacherViolationsHistory = async (
  params?: GetTeacherViolationsParams
): Promise<TeacherViolationsHistoryResponse> => {
  const response = await api.get('/violations', { params });
  return response.data;
};

export const deleteViolationItem = async (id: string): Promise<{ status: number; message: string }> => {
  const response = await api.delete(`/violations/items/${id}`);
  return response.data;
};


