import { isAgent } from 'std-env';

const terminalFormat = isAgent
	? './src/shared/support/formatters/agent-formatter.ts'
	: 'progress-bar';

export default {
	paths: ['../test-support/src/scenarios/feature-files/**/*.feature'],
	import: [
		'src/world.ts',
		'src/contexts/**/step-definitions/**/*.steps.ts',
		'src/shared/support/**/*.ts',
	],
	format: [
		terminalFormat,
		'json:./reports/cucumber-report.json',
		'html:./reports/cucumber-report.html',
	],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 1,
};
