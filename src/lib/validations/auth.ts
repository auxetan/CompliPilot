import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
    email: z.string().email('Adresse email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caracteres')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const magicLinkSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caracteres')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const onboardingStep1Schema = z.object({
  name: z.string().min(2, "Le nom de l'organisation est requis"),
  industry: z.string().min(1, "L'industrie est requise"),
  country: z.string().min(1, 'Le pays est requis'),
  employeeCount: z.number().min(1, "Le nombre d'employes est requis"),
});

export type OnboardingStep1Values = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  regulations: z
    .array(z.enum(['eu_ai_act', 'gdpr', 'nis2', 'dora']))
    .min(1, 'Selectionnez au moins une reglementation'),
});

export type OnboardingStep2Values = z.infer<typeof onboardingStep2Schema>;

export const onboardingStep3Schema = z.object({
  aiToolRange: z.enum(['1-5', '6-20', '20+']),
});

export type OnboardingStep3Values = z.infer<typeof onboardingStep3Schema>;
