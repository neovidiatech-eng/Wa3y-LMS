import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getViolations, createViolation, issueViolation } from "../services/ViolationsServices"
import { CreateViolationPayload, IssueViolationPayload } from "../../../types/Violations"

export const useViolations = () => {
    return useQuery({
        queryKey: ['violations'],
        queryFn: getViolations,
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
        },
    });
};
