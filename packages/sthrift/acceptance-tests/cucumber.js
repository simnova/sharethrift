import { isAgent } from 'std-env';

const agentMode = isAgent

const terminalFormat = agentMode
	? './src/support/formatters/agent-formatter.ts'
	: 'progress-bar';

export default {
	paths: ['src/contexts/**/features/**/*.feature'],
	import: ['src/**/*.ts'],
	requireModule: ['tsx/esm'],
	format: [
		terminalFormat,
		'json:./reports/cucumber-report.json',
		'html:./reports/cucumber-report.html',
	],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 2,
	publishQuiet: true,
};
