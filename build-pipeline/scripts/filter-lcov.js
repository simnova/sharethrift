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
  
  if (!fs.existsSync(inputFile)) {
    console.log('No lcov.info file found to filter');
    return;
  }
  
  const content = fs.readFileSync(inputFile, 'utf8');
  const lines = content.split('\n');
  
  let filteredLines = [];
  let currentBlock = [];
  let skip = false;
  
  for (const line of lines) {
    if (line.startsWith('SF:')) {
      // Start of a new file block
      currentBlock = [line];
      
      // Check if this file should be excluded
      const filePath = line.substring(3);
      skip = filePath.includes('/apps/ui-sharethrift/src/components/') ||
             filePath.includes('\\apps\\ui-sharethrift\\src\\components\\');
      
      if (skip) {
        console.log(`Filtering out: ${filePath}`);
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
  
  console.log('LCOV filtering complete');
  console.log(`Original size: ${content.length} bytes`);
  console.log(`Filtered size: ${filteredContent.length} bytes`);
}

filterLcovFile();
