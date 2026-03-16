import { describe, expect, it } from 'vitest';
import { checkFrontendArchitecture } from '../checks/frontend-architecture.js';

export function describeFrontendArchitectureTests(config: { uiSourcePath: string; testName?: string }): void {
  describe(`Frontend Architecture - ${config.testName || 'UI'}`, () => {
    describe('Directory Structure', () => {
      it('should have required top-level directories', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const dirViolations = violations.filter((v) => v.includes('directory'));
        expect(dirViolations).toStrictEqual([]);
      });

      it('should have components/layouts directory', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const layoutViolations = violations.filter((v) => v.includes('layouts'));
        expect(layoutViolations).toStrictEqual([]);
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

    describe('Layout Requirements', () => {
      it('each layout directory should have section-layout.tsx', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const layoutFileViolations = violations.filter((v) =>
          v.includes('section-layout')
        );
        expect(layoutFileViolations).toStrictEqual([]);
      });

      it('each layout directory should have index.tsx', async () => {
        const violations = await checkFrontendArchitecture({
          uiSourcePath: config.uiSourcePath,
        });
        const indexViolations = violations.filter((v) => v.includes('index.tsx'));
        expect(indexViolations).toStrictEqual([]);
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
