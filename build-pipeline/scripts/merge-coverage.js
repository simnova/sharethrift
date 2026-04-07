#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const INCLUDED_PACKAGE_DIRS = [
  'packages/sthrift-verification/acceptance-api',
  'packages/sthrift-verification/acceptance-ui',
  'apps/api',
  'apps/docs',
  'packages/cellix/api-services-spec',
  'packages/cellix/arch-unit-tests',
  'packages/cellix/domain-seedwork',
  'packages/cellix/event-bus-seedwork-node',
  'packages/cellix/mongoose-seedwork',
  'packages/cellix/server-messaging-seedwork',
  'packages/cellix/server-mongodb-memory-seedwork',
  'packages/cellix/server-oauth2-seedwork',
  'packages/cellix/server-payment-seedwork',
  'packages/cellix/service-blob-storage',
  'packages/cellix/service-messaging-base',
  'packages/cellix/service-messaging-mock',
  'packages/cellix/service-messaging-twilio',
  'packages/cellix/service-mongoose',
  'packages/cellix/service-otel',
  'packages/cellix/service-payment-base',
  'packages/cellix/service-payment-cybersource',
  'packages/cellix/service-payment-mock',
  'packages/cellix/service-sendgrid',
  'packages/cellix/service-token-validation',
  'packages/cellix/test-utils',
];

/**
 * Simple LCOV merger that combines multiple lcov.info files
 */
function processLcovContent(content, packagePath) {
  const lines = content.split('\n');
  const processedLines = [];
  
  for (const line of lines) {
    if (line.startsWith('SF:')) {
      // Extract the file path after 'SF:'
      const filePath = line.substring(3);
      // Prefix with package path, ensuring no double slashes
      const prefixedPath = path.join(packagePath, filePath).replace(/\\/g, '/');
      processedLines.push(`SF:${prefixedPath}`);
    } else {
      processedLines.push(line);
    }
  }
  
  return processedLines.join('\n');
}

function mergeLcovFiles() {
  const rootDir = process.cwd();
  const outputFile = path.join(rootDir, 'coverage', 'lcov.info');
  
  // Create output directory
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const lcovFiles = INCLUDED_PACKAGE_DIRS
    .map((packageDir) => path.join(rootDir, packageDir, 'coverage', 'lcov.info'))
    .filter((lcovPath) => fs.existsSync(lcovPath));
  
  console.log(`Found ${lcovFiles.length} LCOV files:`);
  lcovFiles.forEach(file => console.log(`  - ${file}`));
  
  if (lcovFiles.length === 0) {
    console.log('No LCOV files found. Creating empty coverage file.');
    fs.writeFileSync(outputFile, '');
    return;
  }
  
  // Merge all LCOV files
  let mergedContent = '';
  
  for (const lcovFile of lcovFiles) {
    try {
      const content = fs.readFileSync(lcovFile, 'utf8');
      if (content.trim()) {
        // Compute the package path relative to monorepo root
        const packageDir = path.dirname(path.dirname(lcovFile)); // Go up from coverage/ to package/
        const packagePath = path.relative(rootDir, packageDir);
        
        // Process the LCOV content to prefix SF: paths
        const processedContent = processLcovContent(content, packagePath);
        
        mergedContent += processedContent;
        if (!processedContent.endsWith('\n')) {
          mergedContent += '\n';
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${lcovFile}: ${error.message}`);
    }
  }
  
  // Write merged content
  fs.writeFileSync(outputFile, mergedContent);
  
  console.log(`Merged coverage report written to: ${outputFile}`);
  console.log(`Total size: ${mergedContent.length} characters`);
  
  // Count records
  const records = (mergedContent.match(/end_of_record/g) || []).length;
  console.log(`Coverage records: ${records}`);
}

// Run the merger
mergeLcovFiles();
