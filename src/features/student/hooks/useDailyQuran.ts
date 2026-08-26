import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyRecitations, submitRecitation } from "../services/DailyQuranServices";
import { message } from "antd";

export const useMyRecitations = () => {
  return useQuery({
    queryKey: ["my-recitations"],
    queryFn: getMyRecitations,
  });
};

export const useSubmitRecitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitRecitation(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["my-recitations"] });
      message.success(data?.message || "Recitation submitted successfully");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Failed to submit recitation");
    }
  });
};