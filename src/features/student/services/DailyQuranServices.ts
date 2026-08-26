import api from "../../../lib/axios";

// Student: get my recitations
export const getMyRecitations = async () => {
  const response = await api.get("/daily-quran-recitation/my-recitations");
  return response.data;
};

// Submit the recitation
export const submitRecitation = async (id: string) => {
  const response = await api.put(`/daily-quran-recitation/submit-recitation/${id}`);
  return response.data;
};



