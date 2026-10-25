import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberDevice: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(12, 'Use at least 12 characters'),
  companyName: z.string().min(2, 'Enter an organization name'),
  role: z.string().min(2, 'Select your role'),
});

export const ssoSchema = z.object({
  domain: z.string().min(3, 'Enter your company domain'),
});

export const forgotPasswordSchema = z.object({
  tenantId: z.string().uuid('Enter a valid tenant ID'),
  email: z.string().email('Enter a valid work email'),
});

export const resetPasswordSchema = z.object({
  tenantId: z.string().uuid('Enter a valid tenant ID'),
  token: z.string().min(12, 'Enter the reset token from your email'),
  newPassword: z.string().min(12, 'Use at least 12 characters'),
  confirmPassword: z.string().min(12, 'Confirm your new password'),
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export const requestVerificationSchema = z.object({
  tenantId: z.string().uuid('Enter a valid tenant ID'),
  email: z.string().email('Enter a valid work email'),
});

export const verifyEmailSchema = z.object({
  tenantId: z.string().uuid('Enter a valid tenant ID'),
  token: z.string().min(12, 'Enter the verification token'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type SsoFormValues = z.infer<typeof ssoSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type RequestVerificationFormValues = z.infer<typeof requestVerificationSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
