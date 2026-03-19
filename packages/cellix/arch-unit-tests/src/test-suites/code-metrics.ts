import { describe, it } from 'vitest';
import { checkCodeMetrics } from '../checks/code-metrics.js';

export function describeCodeMetricsTests(): void {
  describe('Code Metrics', () => {
    describe('Line of Code Limits', () => {
      it.skip('files should be under 1000 lines of code', async () => {
        // Currently skipped - code metrics checks are aspirational
        await checkCodeMetrics({
          tsconfigPath: './tsconfig.json',
          sourcePaths: ['../**/src/**/*.ts'],
          maxLinesOfCode: 1000,
        });
      });
    });

    describe('Statement Count Limits', () => {
      it.skip('functions should have limited statement count', async () => {
        // Currently skipped - code metrics checks are aspirational
        await checkCodeMetrics({
          tsconfigPath: './tsconfig.json',
          sourcePaths: ['../**/src/**/*.ts'],
          maxStatements: 250,
        });
      });
    });

    describe('Complexity Limits', () => {
      it.skip('classes should not have too many methods', async () => {
        // Currently skipped - code metrics checks are aspirational
        await checkCodeMetrics({
          tsconfigPath: './tsconfig.json',
          sourcePaths: ['../**/src/**/*.ts'],
          maxMethods: 20,
        });
      });

      it.skip('classes should not have too many fields', async () => {
        // Currently skipped - code metrics checks are aspirational
        await checkCodeMetrics({
          tsconfigPath: './tsconfig.json',
          sourcePaths: ['../**/src/**/*.ts'],
          maxFields: 15,
        });
      });

      it.skip('files should have limited imports', async () => {
        // Currently skipped - code metrics checks are aspirational
        await checkCodeMetrics({
          tsconfigPath: './tsconfig.json',
          sourcePaths: ['../**/src/**/*.ts'],
          maxImports: 20,
        });
      });
    });
  });
}
