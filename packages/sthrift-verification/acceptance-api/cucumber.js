import { isAgent } from 'std-env';

const terminalFormat = isAgent
	? './src/shared/support/formatters/agent-formatter.ts'
	: 'progress-bar';

export default {
	paths: ['../test-support/src/scenarios/feature-files/**/*.feature'],
	import: [
		'src/world.ts',
		'src/step-definitions/index.ts',
	],
	format: [
		terminalFormat,
		'json:./reports/cucumber-report-api.json',
		'html:./reports/cucumber-report-api.html',
	],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 1,
};
