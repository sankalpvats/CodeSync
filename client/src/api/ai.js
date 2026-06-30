import api from "./axios";

export const aiAction = async (action, language, code) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/ai/review",
    { action, language, code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.review;
};