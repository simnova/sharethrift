// General/cross-cutting checks and test suites
export {
	checkCircularDependencies,
	checkLayeredArchitecture,
	checkUiIsolation,
	type CircularDependenciesConfig,
	type LayeredArchitectureConfig,
	type UiIsolationConfig,
} from './checks/circular-dependencies.js';

export {
	describeDependencyRulesTests,
	type DependencyRulesTestsConfig,
} from './test-suites/dependency-rules.js';

export { checkCodeMetrics, type CodeMetricsConfig } from './checks/code-metrics.js';
export { checkCodeQuality, type CodeQualityConfig } from './checks/code-quality.js';

export { describeCodeMetricsTests } from './test-suites/code-metrics.js';
export { describeCodeQualityTests } from './test-suites/code-quality.js';

// Member ordering (cross-cutting — applies to domain, persistence, graphql)
export {
	checkMemberOrdering,
	type MemberOrderingConfig,
} from './checks/member-ordering.js';

export {
	describeMemberOrderingTests,
	type MemberOrderingTestsConfig,
} from './test-suites/member-ordering.js';
