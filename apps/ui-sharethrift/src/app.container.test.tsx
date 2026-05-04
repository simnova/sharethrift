import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppContainer } from './app.container.tsx';
import { AppContainerCurrentUserDocument } from './generated.tsx';

const useAuthMock = vi.fn();
const useQueryMock = vi.fn();

vi.mock('react-oidc-context', () => ({
	useAuth: () => useAuthMock(),
}));

vi.mock('@apollo/client/react', () => ({
	useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

vi.mock('./app.tsx', () => ({
	App: ({ isAuthenticated }: { isAuthenticated: boolean }) => (
		<div>app:{String(isAuthenticated)}</div>
	),
}));

vi.mock('@sthrift/ui-shared', () => ({
	ComponentQueryLoader: ({
		hasDataComponent,
	}: {
		hasDataComponent: ReactNode;
	}) => <>{hasDataComponent}</>,
	UserIdProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('AppContainer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useQueryMock as Mock).mockReturnValue({
			data: {
				currentUserAndCreateIfNotExists: {
					__typename: 'PersonalUser',
					id: 'user-1',
					hasCompletedOnboarding: true,
				},
			},
			loading: false,
			error: undefined,
		});
	});

	it('skips the protected bootstrap query until a usable token exists', () => {
		(useAuthMock as Mock).mockReturnValue({
			isAuthenticated: true,
			user: undefined,
		});

		const markup = renderToStaticMarkup(<AppContainer />);

		expect(useQueryMock).toHaveBeenCalledWith(
			AppContainerCurrentUserDocument,
			expect.objectContaining({ skip: true }),
		);
		expect(markup).toContain('app:false');
	});

	it('runs the protected bootstrap query once an id token is available', () => {
		(useAuthMock as Mock).mockReturnValue({
			isAuthenticated: true,
			user: { id_token: 'id-token-only' },
		});

		const markup = renderToStaticMarkup(<AppContainer />);

		expect(useQueryMock).toHaveBeenCalledWith(
			AppContainerCurrentUserDocument,
			expect.objectContaining({ skip: false }),
		);
		expect(markup).toContain('app:true');
	});
});
