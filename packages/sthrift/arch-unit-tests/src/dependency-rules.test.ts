import { describe, expect, it } from 'vitest';
import {
  checkCircularDependencies,
  checkLayeredArchitecture,
  checkUiIsolation,
} from '@cellix/arch-unit-tests';

describe('Dependency Rules', () => {
  describe('Circular Dependencies', () => {
    it('apps should not have circular dependencies', async () => {
      const violations = await checkCircularDependencies({
        appsGlob: '../../apps/**',
      });
      expect(violations).toStrictEqual([]);
    }, 30000);

    it('packages should not have circular dependencies', async () => {
      const violations = await checkCircularDependencies({
        packagesGlob: '../**',
      });
      expect(violations).toStrictEqual([]);
    }, 10000);
  });

  describe('api', () => {
    it('domain layer should not depend on persistence layer', async () => {
      const violations = await checkLayeredArchitecture({
        domainFolder: '../domain',
        persistenceFolder: '../persistence',
      });
      expect(violations).toStrictEqual([]);
    });

    it('domain layer should not depend on infrastructure layer', async () => {
      const violations = await checkLayeredArchitecture({
        domainFolder: '../domain',
        infrastructurePattern: '../../cellix/service-*/**',
      });
      expect(violations).toStrictEqual([]);
    });

    it('domain layer should not depend on application services', async () => {
      const violations = await checkLayeredArchitecture({
        domainFolder: '../domain',
        applicationServicesFolder: '../application-services',
      });
      expect(violations).toStrictEqual([]);
    });

    it('application services should not depend on infrastructure', async () => {
      const violations = await checkLayeredArchitecture({
        applicationServicesFolder: '../application-services',
        infrastructurePattern: '../../cellix/service-*/**',
      });
      expect(violations).toStrictEqual([]);
    });

    it('GraphQL API layer should not depend on infrastructure directly', async () => {
      const violations = await checkLayeredArchitecture({
        graphqlFolder: '../graphql',
        infrastructurePattern: '../../cellix/service-*/**',
      });
      expect(violations).toStrictEqual([]);
    });

    it('REST API layer should not depend on infrastructure directly', async () => {
      const violations = await checkLayeredArchitecture({
        restFolder: '../rest',
        restInfrastructurePattern: '../service-*/**',
      });
      expect(violations).toStrictEqual([]);
    });
  });

  describe('ui-community', () => {
    it('ui-core should not depend on ui-components', async () => {
      const violations = await checkUiIsolation({
        uiCoreFolder: '../../cellix/ui-core',
        uiComponentsFolder: '../ui-components',
      });
      expect(violations).toStrictEqual([]);
    });

    it('ui-core should not depend on ui-sharethrift app', async () => {
      const violations = await checkUiIsolation({
        uiCoreFolder: '../../cellix/ui-core',
        appUiFolder: '../../apps/ui-sharethrift',
      });
      expect(violations).toStrictEqual([]);
    });

    it('ui-components should not depend on ui-sharethrift app', async () => {
      const violations = await checkUiIsolation({
        uiComponentsFolder: '../ui-components',
        appUiFolder: '../../apps/ui-sharethrift',
      });
      expect(violations).toStrictEqual([]);
    });
  });
});
