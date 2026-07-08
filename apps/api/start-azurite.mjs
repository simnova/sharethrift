import { spawn } from 'node:child_process';

const specs = [
	['azurite-blob', ['--silent', '--blobPort', '10000', '--location', '../../__blobstorage__']],
	['azurite-queue', ['--silent', '--queuePort', '10001', '--location', '../../__queuestorage__']],
	['azurite-table', ['--silent', '--tablePort', '10002', '--location', '../../__tablestorage__']],
];

const processes = specs.map(([command, args]) => {
	const child = spawn(command, args, { stdio: 'inherit' });
	child.on('error', (error) => {
		console.error(`[azurite] failed to start ${command}: ${error.message}`);
		for (const process of processes) process.kill();
		process.exitCode = 1;
	});
	return child;
});

console.log('[azurite] started (blob=10000, queue=10001, table=10002)');

const stop = (signal) => {
	for (const process of processes) process.kill(signal);
};
process.once('SIGINT', () => stop('SIGINT'));
process.once('SIGTERM', () => stop('SIGTERM'));
