import '@testing-library/jest-dom';
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// Preload lazy-loaded modules to prevent "Failed to fetch dynamically imported module" race conditions
await Promise.all([
	// Preload lazy-loaded app pages to prevent race conditions
	import('../src/components/layouts/app/pages/home/pages/all-listings-page.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/view-listing/pages/view-listing-page.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/create-listing/pages/create-listing-page.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/my-listings/index.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/my-reservations/index.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/messages/index.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/account/index.tsx').catch(() => {}),
	import('../src/components/layouts/app/pages/admin-dashboard/pages/admin-dashboard-main.tsx').catch(() => {}),
	// Preload signup lazy-loaded pages
	import('../src/components/layouts/signup/pages/select-account-type-page.tsx').catch(() => {}),
	import('../src/components/layouts/signup/pages/account-setup-page.tsx').catch(() => {}),
	import('../src/components/layouts/signup/pages/profile-setup-page.tsx').catch(() => {}),
	import('../src/components/layouts/signup/pages/payment-page.tsx').catch(() => {}),
	import('../src/components/layouts/signup/pages/terms-page.tsx').catch(() => {}),
]);

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);


