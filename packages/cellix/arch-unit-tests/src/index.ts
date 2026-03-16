// Circular dependencies
export {
  checkCircularDependencies,
  checkLayeredArchitecture,
  checkUiIsolation,
} from './checks/circular-dependencies.js';

// Domain conventions
export {
  checkRepositoryConventions,
  checkUnitOfWorkConventions,
  checkAggregateRootConventions,
  checkVisaConventions,
} from './checks/domain-conventions.js';

// GraphQL resolver conventions
export {
  checkGraphqlResolverDependencies,
  checkGraphqlResolverContent,
  checkGraphqlFlatStructure,
} from './checks/graphql-resolver-conventions.js';

// GraphQL schema conventions
export {
  checkGraphqlSchemaFileNaming,
  checkGraphqlSchemaTypePrefixing,
  checkGraphqlSchemaMutationResults,
  checkGraphqlSchemaInputNaming,
  checkGraphqlSchemaOrdering,
  checkGraphqlSchemaConventions,
} from './checks/graphql-schema-conventions.js';

// Frontend architecture
export { checkFrontendArchitecture } from './checks/frontend-architecture.js';

// Member ordering
export { checkMemberOrdering } from './checks/member-ordering.js';

// Naming conventions
export { checkGraphqlFileNaming } from './checks/naming-conventions.js';

// Code metrics and quality
export { checkCodeMetrics } from './checks/code-metrics.js';
export { checkCodeQuality } from './checks/code-quality.js';

// File system utilities
export { getAllFiles, getDirectories, directoryExists, fileExists, isKebabCase } from './utils/frontend-helpers.js';

// Test suites (reusable test describe functions)
export { describeDependencyRulesTests } from './test-suites/dependency-rules.js';
export { describeDomainConventionTests } from './test-suites/domain-conventions.js';
export { describeGraphqlResolverConventionsTests, type GraphqlFlatStructureTestsConfig } from './test-suites/graphql-resolver-conventions.js';
export { describeGraphqlSchemaConventionsTests } from './test-suites/graphql-schema-conventions.js';
export { describeMemberOrderingTests } from './test-suites/member-ordering.js';
export { describeFrontendArchitectureTests } from './test-suites/frontend-architecture.js';
export { describeNamingConventionTests } from './test-suites/naming-conventions.js';
export { describeCodeMetricsTests } from './test-suites/code-metrics.js';
export { describeCodeQualityTests } from './test-suites/code-quality.js';
