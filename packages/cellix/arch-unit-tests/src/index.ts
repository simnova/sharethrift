// Circular dependencies
export {
  checkCircularDependencies,
  checkLayeredArchitecture,
  checkUiIsolation,
  type CircularDependenciesConfig,
  type LayeredArchitectureConfig,
  type UiIsolationConfig,
} from './checks/circular-dependencies.js';

// Domain conventions
export {
  checkRepositoryConventions,
  checkUnitOfWorkConventions,
  checkAggregateRootConventions,
  checkVisaConventions,
  type DomainConventionsConfig,
} from './checks/domain-conventions.js';

// GraphQL resolver conventions
export {
  checkGraphqlResolverDependencies,
  checkGraphqlResolverContent,
  checkGraphqlFlatStructure,
  type GraphqlResolverConventionsConfig,
  type GraphqlFlatStructureConfig,
} from './checks/graphql-resolver-conventions.js';

// GraphQL schema conventions
export {
  checkGraphqlSchemaFileNaming,
  checkGraphqlSchemaTypePrefixing,
  checkGraphqlSchemaMutationResults,
  checkGraphqlSchemaInputNaming,
  checkGraphqlSchemaOrdering,
  checkGraphqlSchemaConventions,
  type GraphqlSchemaConventionsConfig,
} from './checks/graphql-schema-conventions.js';

// Frontend architecture
export {
  checkFrontendArchitecture,
  type FrontendArchitectureConfig,
} from './checks/frontend-architecture.js';

// Member ordering
export {
  checkMemberOrdering,
  type MemberOrderingConfig,
} from './checks/member-ordering.js';

// Naming conventions
export {
  checkGraphqlFileNaming,
  type NamingConventionsConfig,
} from './checks/naming-conventions.js';

// Code metrics and quality
export { checkCodeMetrics, type CodeMetricsConfig } from './checks/code-metrics.js';
export { checkCodeQuality, type CodeQualityConfig } from './checks/code-quality.js';

// File system utilities
export { getAllFiles, getDirectories, directoryExists, fileExists, isKebabCase } from './utils/frontend-helpers.js';

// Test suites (reusable test describe functions)
export { describeDependencyRulesTests, type DependencyRulesTestsConfig } from './test-suites/dependency-rules.js';
export { describeDomainConventionTests, type DomainConventionTestsConfig } from './test-suites/domain-conventions.js';
export { describeGraphqlResolverConventionsTests, type GraphqlResolverConventionsTestsConfig, type GraphqlFlatStructureTestsConfig } from './test-suites/graphql-resolver-conventions.js';
export { describeGraphqlSchemaConventionsTests, type GraphqlSchemaConventionsTestsConfig } from './test-suites/graphql-schema-conventions.js';
export { describeMemberOrderingTests, type MemberOrderingTestsConfig } from './test-suites/member-ordering.js';
export { describeFrontendArchitectureTests, type FrontendArchitectureTestsConfig } from './test-suites/frontend-architecture.js';
export { describeNamingConventionTests } from './test-suites/naming-conventions.js';
export { describeCodeMetricsTests } from './test-suites/code-metrics.js';
export { describeCodeQualityTests } from './test-suites/code-quality.js';
