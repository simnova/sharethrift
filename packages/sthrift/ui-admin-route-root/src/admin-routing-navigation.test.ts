import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));
const packageRoot = resolve(currentDirectory, '..');
const srcRoot = join(packageRoot, 'src');

const getFiles = (directoryPath: string): string[] => {
	return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directoryPath, entry.name);
		return entry.isDirectory() ? getFiles(entryPath) : [entryPath];
	});
};

describe('admin routing and navigation', () => {
	it('wires the new admin operations pages into app routes', () => {
		const appRoutesSource = readFileSync(join(srcRoot, 'app-routes.tsx'), 'utf8');

		expect(appRoutesSource).toContain(
			"./components/pages/admin-listing-operations/pages/admin-listing-operations-page.tsx",
		);
		expect(appRoutesSource).toContain(
			"./components/pages/admin-user-operations/pages/admin-user-operations-page.tsx",
		);
		expect(appRoutesSource).toContain('path="admin-listing-operations"');
		expect(appRoutesSource).toContain('<AdminListingOperationsPage />');
		expect(appRoutesSource).toContain('path="admin-user-operations"');
		expect(appRoutesSource).toContain('<AdminUserOperationsPage />');
		expect(appRoutesSource).not.toContain('AdminDashboardMain');
		expect(appRoutesSource).not.toContain('path="admin-dashboard"');
	});

	it('shows separate listing and user admin operations in the sidebar', () => {
		const sectionLayoutSource = readFileSync(
			join(srcRoot, 'section-layout.tsx'),
			'utf8',
		);

		expect(sectionLayoutSource).toContain(
			"adminListingOperations: 'admin-listing-operations'",
		);
		expect(sectionLayoutSource).toContain(
			"adminUserOperations: 'admin-user-operations'",
		);
		expect(sectionLayoutSource).toContain("key: 'adminListingOperations'");
		expect(sectionLayoutSource).toContain("label: 'Listing Operations'");
		expect(sectionLayoutSource).toContain("key: 'adminUserOperations'");
		expect(sectionLayoutSource).toContain("label: 'User Operations'");
		expect(sectionLayoutSource).not.toContain("adminDashboard: 'admin-dashboard'");
		expect(sectionLayoutSource).not.toContain("label: 'Admin Dashboard'");
	});

	it('removes the old admin dashboard source references', () => {
		const sourceFiles = getFiles(srcRoot).filter(
			(filePath) => !filePath.endsWith('admin-routing-navigation.test.ts'),
		);

		for (const filePath of sourceFiles) {
			const fileSource = readFileSync(filePath, 'utf8');
			expect(fileSource, filePath).not.toContain('AdminDashboardMain');
			expect(fileSource, filePath).not.toContain('admin-dashboard');
		}
	});
});
