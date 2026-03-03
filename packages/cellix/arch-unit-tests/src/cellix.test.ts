import { describe, expect, it } from 'vitest';
import {
  checkCircularDependencies,
  checkUiIsolation,
} from './index';

describe('Cellix Architecture', () => {
  describe('Circular Dependencies', () => {
    it('cellix packages should not have circular dependencies', async () => {
      const violations = await checkCircularDependencies({
        packagesGlob: '../{cellix}/**',
      });
      expect(violations).toStrictEqual([]);
    }, 10000);
  });

  describe('UI Isolation', () => {
    it('cellix ui-core should not depend on sthrift ui-components or app', async () => {
      const violations = await checkUiIsolation({
        uiCoreFolder: '../cellix/ui-core',
        uiComponentsFolder: '../sthrift/ui-components',
        appUiFolder: '../../apps/ui-sharethrift',
      });
      expect(violations).toStrictEqual([]);
    });
  });
});
