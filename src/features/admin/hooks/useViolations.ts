import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getViolations, createViolation, issueViolation, getTeacherViolationsHistory, deleteViolationItem } from "../services/ViolationsServices"
import { CreateViolationPayload, IssueViolationPayload, GetTeacherViolationsParams } from "../../../types/Violations"

export const useViolations = () => {
    return useQuery({
        queryKey: ['violations'],
        queryFn: getViolations,
    })
}   

export const useTeacherViolationsHistory = (params?: GetTeacherViolationsParams) => {
    return useQuery({
        queryKey: ['teacher-violations-history', params],
        queryFn: () => getTeacherViolationsHistory(params),
    })
}

export const useCreateViolation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateViolationPayload) => createViolation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
        },
    });
};

export const useIssueViolation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IssueViolationPayload) => issueViolation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
            queryClient.invalidateQueries({ queryKey: ['issued-violations'] });
            queryClient.invalidateQueries({ queryKey: ['teacher-violations-history'] });
        },
    });
};

export const useDeleteViolationItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteViolationItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['violations'] });
        },
    });
};


