import type { OnboardingPage } from '../onboarding.page.ts';

export type UiOnboardingPage = Pick<OnboardingPage, never>;

export type E2EOnboardingPage = Pick<OnboardingPage, 'completeOnboarding'>;
