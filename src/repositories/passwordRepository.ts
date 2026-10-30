import { api } from '../lib/axios';

export const passwordRepository = {
  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await api.post(
      `/auth/reset-password?token=${encodeURIComponent(token)}`,
      { new_password: newPassword }
    );
    return data;
  },
};