import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail')
    .email('Informe um e-mail válido'),
});

export type EmailFormData = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, 'A senha deve ter no mínimo 5 caracteres')
      .refine((v) => !/\s/.test(v), 'A senha não pode conter espaços'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;