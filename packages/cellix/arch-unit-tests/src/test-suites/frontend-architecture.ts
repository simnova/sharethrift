import { describe, expect, it } from 'vitest';
import { checkFrontendArchitecture } from '../checks/frontend-architecture.js';

export interface FrontendArchitectureTestsConfig {
  uiSourcePath: string;
  testName?: string;
}

export function describeFrontendArchitectureTests(config: FrontendArchitectureTestsConfig): void {
  describe(`Frontend Architecture - ${config.testName || 'UI'}`, () => {
    describe('Directory Structure', () => {
      it('should have required top-level directories', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const dirViolations = violations.filter((v) => v.includes('directory'));
        expect(dirViolations).toStrictEqual([]);
      });

      it('should have components/pages directory', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const pageViolations = violations.filter((v) => v.includes('components/pages'));
        expect(pageViolations).toStrictEqual([]);
      });

      it('should have components/shared directory', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const sharedViolations = violations.filter((v) => v.includes('shared'));
        expect(sharedViolations).toStrictEqual([]);
      });
    });

    describe('Naming Conventions', () => {
      it('all directories should use kebab-case naming', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const namingViolations = violations.filter((v) =>
          v.includes('kebab-case') && !v.includes('File')
        );
        expect(namingViolations).toStrictEqual([]);
      });

      it('container files should use kebab-case naming', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const containerViolations = violations.filter((v) => v.includes('Container'));
        expect(containerViolations).toStrictEqual([]);
      });

      it('story files should use kebab-case naming', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const storyViolations = violations.filter((v) => v.includes('Story'));
        expect(storyViolations).toStrictEqual([]);
      });
    });

    describe('Legacy Structure', () => {
      it('should not use legacy pages or layout directories', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const legacyViolations = violations.filter((v) => v.includes('Legacy'));
        expect(legacyViolations).toStrictEqual([]);
      });
    });

    describe('Overall Compliance', () => {
      it('should pass all frontend architecture checks', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        expect(violations).toStrictEqual([]);
      });
    });
  });
}
