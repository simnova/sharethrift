#!/usr/bin/env node

/**
 * ShareThrift Local HTTPS Certificate Setup
 * Automatically installs mkcert and generates wildcard SSL certificates for local development
 * Runs idempotently - safe to run multiple times
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CERT_DIR = join(__dirname, '..', '.certs');
const CERT_FILE = join(CERT_DIR, 'sharethrift.localhost.pem');
const KEY_FILE = join(CERT_DIR, 'sharethrift.localhost-key.pem');

function exec(command, options = {}) {
	try {
		return execSync(command, { stdio: 'inherit', ...options });
	} catch (error) {
		if (!options.ignoreError) throw error;
		return null;
	}
}

function checkCommand(command) {
	try {
		execSync(`command -v ${command}`, { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

function main() {
	console.log(' ShareThrift Local HTTPS Certificate Setup\n');

	// Check if certificates already exist
	if (existsSync(CERT_FILE) && existsSync(KEY_FILE)) {
		console.log(' Certificates already exist - skipping setup\n');
		return;
	}

	console.log(' Setting up local HTTPS certificates...\n');

	// Check if mkcert is installed
	if (!checkCommand('mkcert')) {
		console.log(' Installing mkcert...');
		
		const platform = process.platform;
		
		if (platform === 'darwin') {
			// macOS
			if (checkCommand('brew')) {
				exec('brew install mkcert');
			} else {
				console.error(' Error: Homebrew not found. Please install Homebrew first:');
				console.error('   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
				process.exit(1);
			}
		} else if (platform === 'linux') {
			// Linux
			if (checkCommand('apt-get')) {
				exec('sudo apt-get update && sudo apt-get install -y mkcert');
			} else if (checkCommand('yum')) {
				exec('sudo yum install -y mkcert');
			} else {
				console.error(' Error: Package manager not supported. Please install mkcert manually:');
				console.error('   https://github.com/FiloSottile/mkcert#installation');
				process.exit(1);
			}
		} else if (platform === 'win32') {
			// Windows
			if (checkCommand('choco')) {
				exec('choco install mkcert -y');
			} else if (checkCommand('scoop')) {
				exec('scoop install mkcert');
			} else {
				console.error(' Error: Please install mkcert manually:');
				console.error('   https://github.com/FiloSottile/mkcert#windows');
				process.exit(1);
			}
		} else {
			console.error(' Error: OS not supported. Please install mkcert manually:');
			console.error('   https://github.com/FiloSottile/mkcert#installation');
			process.exit(1);
		}
		
		console.log(' mkcert installed\n');
	} else {
		console.log(' mkcert already installed\n');
	}

	// Install the local CA
	console.log(' Installing local Certificate Authority...');
	exec('mkcert -install');
	console.log(' CA installed\n');

	// Generate wildcard certificate
	console.log(' Generating wildcard certificate for *.sharethrift.localhost...');
	process.chdir(CERT_DIR);
	exec('mkcert "*.sharethrift.localhost" "sharethrift.localhost" localhost 127.0.0.1 ::1');

	// Rename files to standard names
	const generatedFiles = execSync('ls *.localhost+4*.pem 2>/dev/null || true', { 
		encoding: 'utf-8',
		cwd: CERT_DIR 
	}).trim().split('\n').filter(Boolean);

	for (const file of generatedFiles) {
		if (file.includes('-key.pem')) {
			execSync(`mv "${file}" sharethrift.localhost-key.pem`, { cwd: CERT_DIR });
		} else if (file.includes('.pem')) {
			execSync(`mv "${file}" sharethrift.localhost.pem`, { cwd: CERT_DIR });
		}
	}

	console.log(' Certificates generated\n');
	console.log(' Certificate location:');
	console.log(`   ${CERT_DIR}\n`);
	console.log(' Your local domains are now trusted for HTTPS:');
	console.log('   • https://sharethrift.localhost:3000 (UI)');
	console.log('   • https://data-access.sharethrift.localhost:7443 (API)');
	console.log('   • https://docs.sharethrift.localhost:3002 (Docs)');
	console.log('   • https://mock-auth.sharethrift.localhost:4000 (Auth)');
	console.log('   • https://mock-payment.sharethrift.localhost:3001 (Payment)');
	console.log('   • https://mock-messaging.sharethrift.localhost:10000 (Messaging)');
	console.log('   • mongodb://localhost:50000 (MongoDB - no HTTPS)\n');
	console.log(' Setup complete! Run: pnpm run dev\n');
}

main();
