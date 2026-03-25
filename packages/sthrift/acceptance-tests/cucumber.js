import { isAgent } from 'std-env';

const terminalFormat = isAgent
	? './src/support/formatters/agent-formatter.ts'
	: 'progress-bar';

export default {
	paths: ['src/contexts/**/features/**/*.feature'],
	import: ['src/**/*.ts'],
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
