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
} from './checks/graphql-resolver-conventions.js';

// Frontend architecture
export { checkFrontendArchitecture } from './checks/frontend-architecture.js';

// Member ordering
export { checkMemberOrdering } from './checks/member-ordering.js';

// Naming conventions
export { checkGraphqlFileNaming } from './checks/naming-conventions.js';

// Code metrics and quality
export { checkCodeMetrics } from './checks/code-metrics.js';
export { checkCodeQuality } from './checks/code-quality.js';

// Test suites (reusable test describe functions)
export { describeMemberOrderingTests } from './test-suites/member-ordering.js';
export { describeFrontendArchitectureTests } from './test-suites/frontend-architecture.js';
export { describeNamingConventionTests } from './test-suites/naming-conventions.js';
export { describeCodeMetricsTests } from './test-suites/code-metrics.js';
export { describeCodeQualityTests } from './test-suites/code-quality.js';
