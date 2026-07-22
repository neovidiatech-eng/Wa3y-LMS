import api from "../../../lib/axios";
import {
  ViolationsResponse,
  CreateViolationPayload,
  CreateViolationResponse,
  IssueViolationPayload,
  IssueViolationResponse
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
