import { z } from 'zod';

export const businessProfileSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  businessType: z.string().min(2, 'Business type is required'),
  industry: z.string().min(2, 'Industry is required'),
  country: z.string().min(2, 'Country is required'),
  revenueRange: z.string().min(1, 'Select a revenue range'),
  teamSize: z.string().min(1, 'Select a team size'),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
});

export const aiSetupSchema = z.object({
  copilotTone: z.enum(['executive', 'operator', 'analyst']),
  enabledAgents: z.array(z.string()).min(1, 'Select at least one agent'),
  automationLevel: z.enum(['recommend', 'approval_required', 'auto_low_risk']),
});

export const inviteSchema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.string().min(2, 'Select a role'),
  team: z.string().optional(),
});

export const roleAssignmentSchema = z.object({
  role: z.string().min(2, 'Select a role'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
export type AiSetupFormValues = z.infer<typeof aiSetupSchema>;
export type InviteFormValues = z.infer<typeof inviteSchema>;
export type RoleAssignmentFormValues = z.infer<typeof roleAssignmentSchema>;
