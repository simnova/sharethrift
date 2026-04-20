import { isAgent } from 'std-env';

const terminalFormat = isAgent
	? '../verification-shared/src/formatters/agent-formatter.ts'
	: 'progress-bar';

export default {
	paths: ['../verification-shared/src/scenarios/**/*.feature'],
	import: [
		'src/world.ts',
		'src/step-definitions/index.ts',
	],
	format: [
		terminalFormat,
		'json:./reports/cucumber-report-ui.json',
		'html:./reports/cucumber-report-ui.html',
	],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 1,
};
