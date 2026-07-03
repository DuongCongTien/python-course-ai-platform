import httpClient from "./httpClient";

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
}

export const profileService = {
  
  async updateProfile(userId: number, payload: UpdateProfilePayload): Promise<unknown> {
    const { data } = await httpClient.patch(`/users/${userId}`, payload);
    return data;
  },

  async updatePassword(userId: number, payload: UpdatePasswordPayload): Promise<unknown> {
    const { data } = await httpClient.patch(`/users/${userId}/password`, payload);
    return data;
  },
};


