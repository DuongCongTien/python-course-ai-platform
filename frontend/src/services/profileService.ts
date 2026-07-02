import httpClient from "./httpClient";

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
  phone_number: string;
}

export const profileService = {
  async updateProfile(userId: number, token: string, payload: UpdateProfilePayload): Promise<unknown> {
    const { data } = await httpClient.patch(`/api/v1/users/update/${userId}`, payload, {
      headers: {
        // ⚠️ Nếu backend trả 401/422 báo sai định dạng, đổi thành: token (không có "Bearer ")
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};