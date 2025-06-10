import apiClient from "@/lib/api-client";

export async function fetchUserData(userId: string) {
  const response = await apiClient.get(`users/${userId}`);
  return response.data;
}
