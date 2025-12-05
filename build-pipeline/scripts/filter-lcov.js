#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

/**
 * Filters out UI component coverage from the merged lcov.info file
 * This ensures UI components don't affect overall coverage metrics
 */
function filterLcovFile() {
  const rootDir = process.cwd();
  const inputFile = path.join(rootDir, 'coverage', 'lcov.info');
  
  console.log('=== LCOV Filter Script ===');
  console.log(`Working directory: ${rootDir}`);
  console.log(`Looking for: ${inputFile}`);
  
  if (!fs.existsSync(inputFile)) {
    console.log('❌ No lcov.info file found to filter');
    return;
  }
  
  console.log('✅ Found lcov.info file');
  
  const content = fs.readFileSync(inputFile, 'utf8');
  const lines = content.split('\n');
  
  console.log(`Total lines in lcov.info: ${lines.length}`);
  
  // Count SF: lines to see total files
  const totalFiles = lines.filter(l => l.startsWith('SF:')).length;
  console.log(`Total files in coverage: ${totalFiles}`);
  
  let filteredLines = [];
  let currentBlock = [];
  let skip = false;
  let filteredCount = 0;
  
  for (const line of lines) {
    if (line.startsWith('SF:')) {
      // Start of a new file block
      currentBlock = [line];
      
      // Check if this file should be excluded
      const filePath = line.substring(3);
      // Match various path formats: apps/ui-sharethrift/src/components/ or /apps/ui-sharethrift/src/components/
      skip = filePath.includes('apps/ui-sharethrift/src/components/') ||
             filePath.includes('apps\\ui-sharethrift\\src\\components\\') ||
             filePath.match(/ui-sharethrift[/\\]src[/\\]components[/\\]/);
      
      if (skip) {
        console.log(`🚫 Filtering out: ${filePath}`);
        filteredCount++;
      }
    } else if (line.startsWith('end_of_record')) {
      // End of file block
      currentBlock.push(line);
      
      if (!skip) {
        filteredLines.push(...currentBlock);
      }
      
      // Reset for next block
      currentBlock = [];
      skip = false;
    } else {
      // Middle of file block
      currentBlock.push(line);
    }
  }
  
  // Write filtered content back
  const filteredContent = filteredLines.join('\n');
  fs.writeFileSync(inputFile, filteredContent);
  
  console.log('');
  console.log('=== Filtering Complete ===');
  console.log(`Files filtered out: ${filteredCount}`);
  console.log(`Files remaining: ${totalFiles - filteredCount}`);
  console.log(`Original size: ${content.length} bytes`);
  console.log(`Filtered size: ${filteredContent.length} bytes`);
  console.log(`Reduction: ${((1 - filteredContent.length / content.length) * 100).toFixed(2)}%`);
}

filterLcovFile();
