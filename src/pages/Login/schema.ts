import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .email('Digite um e-mail válido'),

  password: z
    .string()
    .min(1, 'Digite sua senha'),
})

export type LoginFormData = z.infer<typeof loginSchema>