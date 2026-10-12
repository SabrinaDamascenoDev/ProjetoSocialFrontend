import { passwordRepository } from '../repositories/passwordRepository';

export const passwordService = {
  requestReset(email: string) {
    return passwordRepository.forgotPassword(email.trim().toLowerCase());
  },

  reset(token: string, newPassword: string) {
    return passwordRepository.resetPassword(token, newPassword);
  },
};