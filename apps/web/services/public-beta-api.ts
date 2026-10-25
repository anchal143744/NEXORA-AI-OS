import {
  adoptionMetrics,
  aiCustomerSuccessCommands,
  betaCohorts,
  communityThreads,
  customerSuccessAccounts,
  featureRequests,
  feedbackSignals,
  gtmReadinessGates,
  inAppFeedbackChannels,
  npsSegments,
  onboardingMilestones,
  productTours,
  publicBetaMetrics,
} from '@/lib/public-beta';

export async function getPublicBetaSnapshot() {
  return {
    metrics: publicBetaMetrics,
    cohorts: betaCohorts,
    onboarding: onboardingMilestones,
    tours: productTours,
    feedback: feedbackSignals,
    successAccounts: customerSuccessAccounts,
    adoption: adoptionMetrics,
    featureRequests,
    inAppFeedback: inAppFeedbackChannels,
    nps: npsSegments,
    community: communityThreads,
    gtm: gtmReadinessGates,
    copilot: aiCustomerSuccessCommands,
    generatedAt: new Date().toISOString(),
  };
}

export const publicBetaEndpoints = {
  betaApplications: '/v1/public-beta/applications',
  betaInvitations: '/v1/public-beta/invitations',
  betaCohorts: '/v1/public-beta/cohorts',
  onboarding: '/v1/customer-onboarding',
  productTours: '/v1/product-tours',
  feedback: '/v1/feedback-intelligence',
  customerSuccess: '/v1/customer-success',
  adoptionAnalytics: '/v1/product-adoption',
  featureRequests: '/v1/feature-requests',
  nps: '/v1/nps',
  community: '/v1/beta-community',
  gtmReadiness: '/v1/go-to-market-readiness',
};
