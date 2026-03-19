import { projectFiles } from 'archunit';

export interface CircularDependenciesConfig {
  appsGlob?: string;       // e.g. '../../apps/**'
  packagesGlob?: string;   // e.g. '../{cellix,sthrift}/**'
}

/**
 * Check for circular dependencies in apps and packages
 */
export async function checkCircularDependencies(config: CircularDependenciesConfig): Promise<string[]> {
  const violations: string[] = [];

  // Check apps for circular dependencies
  if (config.appsGlob) {
    try {
      const appsRule = projectFiles().inFolder(config.appsGlob).should().haveNoCycles();
      try {
        await appsRule.check();
      } catch (e) {
        violations.push(`Apps have circular dependencies: ${String(e)}`);
      }
    } catch {
      // Silently skip if no apps found
    }
  }

  // Check packages for circular dependencies
  if (config.packagesGlob) {
    try {
      const packagesRule = projectFiles().inFolder(config.packagesGlob).should().haveNoCycles();
      try {
        await packagesRule.check();
      } catch (error_) {
        violations.push(`Packages have circular dependencies: ${String(error_)}`);
      }
    } catch {
      // Silently skip if no packages found
    }
  }

  return violations;
}

export interface LayeredArchitectureConfig {
  domainFolder?: string;              // e.g. '../sthrift/domain'
  persistenceFolder?: string;         // e.g. '../sthrift/persistence'
  applicationServicesFolder?: string; // e.g. '../sthrift/application-services'
  graphqlFolder?: string;             // e.g. '../sthrift/graphql'
  restFolder?: string;                // e.g. '../sthrift/rest'
  infrastructurePattern?: string;     // e.g. '../cellix/service-*/**'
  restInfrastructurePattern?: string; // e.g. '../sthrift/service-*/**'
}

/**
 * Check layered architecture dependency rules
 */
export async function checkLayeredArchitecture(config: LayeredArchitectureConfig): Promise<string[]> {
  const violations: string[] = [];

  // Domain should not depend on persistence
  if (config.domainFolder && config.persistenceFolder) {
    try {
      const rule = projectFiles()
        .inFolder(config.domainFolder)
        .shouldNot()
        .dependOnFiles()
        .inFolder(config.persistenceFolder);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`Domain depends on persistence layer: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // Domain should not depend on infrastructure
  if (config.domainFolder && config.infrastructurePattern) {
    try {
      const rule = projectFiles()
        .inFolder(config.domainFolder)
        .shouldNot()
        .dependOnFiles()
        .inPath(config.infrastructurePattern);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`Domain depends on infrastructure: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // Domain should not depend on application services
  if (config.domainFolder && config.applicationServicesFolder) {
    try {
      const rule = projectFiles()
        .inFolder(config.domainFolder)
        .shouldNot()
        .dependOnFiles()
        .inFolder(config.applicationServicesFolder);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`Domain depends on application services: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // Application services should not depend on infrastructure
  if (config.applicationServicesFolder && config.infrastructurePattern) {
    try {
      const rule = projectFiles()
        .inFolder(config.applicationServicesFolder)
        .shouldNot()
        .dependOnFiles()
        .inPath(config.infrastructurePattern);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`Application services depend on infrastructure: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // GraphQL should not depend on infrastructure
  if (config.graphqlFolder && config.infrastructurePattern) {
    try {
      const rule = projectFiles()
        .inFolder(config.graphqlFolder)
        .shouldNot()
        .dependOnFiles()
        .inPath(config.infrastructurePattern);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`GraphQL depends on infrastructure: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // REST should not depend on infrastructure
  if (config.restFolder && config.restInfrastructurePattern) {
    try {
      const rule = projectFiles()
        .inFolder(config.restFolder)
        .shouldNot()
        .dependOnFiles()
        .inPath(config.restInfrastructurePattern);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`REST depends on infrastructure: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  return violations;
}

export interface UiIsolationConfig {
  uiCoreFolder?: string;         // e.g. '../cellix/ui-core'
  uiComponentsFolder?: string;   // e.g. '../sthrift/ui-components'
  appUiFolder?: string;          // e.g. '../../apps/ui-sharethrift'
}

/**
 * Check UI package isolation rules
 */
export async function checkUiIsolation(config: UiIsolationConfig): Promise<string[]> {
  const violations: string[] = [];

  // ui-core should not depend on ui-components
  if (config.uiCoreFolder && config.uiComponentsFolder) {
    try {
      const rule = projectFiles()
        .inFolder(config.uiCoreFolder)
        .shouldNot()
        .dependOnFiles()
        .inFolder(config.uiComponentsFolder);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`ui-core depends on ui-components: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // ui-core should not depend on app UI
  if (config.uiCoreFolder && config.appUiFolder) {
    try {
      const rule = projectFiles()
        .inFolder(config.uiCoreFolder)
        .shouldNot()
        .dependOnFiles()
        .inFolder(config.appUiFolder);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`ui-core depends on app UI: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  // ui-components should not depend on app UI
  if (config.uiComponentsFolder && config.appUiFolder) {
    try {
      const rule = projectFiles()
        .inFolder(config.uiComponentsFolder)
        .shouldNot()
        .dependOnFiles()
        .inFolder(config.appUiFolder);
      try {
        await rule.check();
      } catch (error_) {
        violations.push(`ui-components depends on app UI: ${String(error_)}`);
      }
    } catch {
      // Silently skip
    }
  }

  return violations;
}
