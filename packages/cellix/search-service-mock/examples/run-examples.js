#!/usr/bin/env node

/**
 * LiQE Filtering Examples Runner
 * 
 * Simple Node.js script to run the LiQE filtering examples.
 * 
 * Usage:
 *   node examples/run-examples.js
 *   npm run examples
 * 
 * @fileoverview Executable script for running LiQE filtering examples
 * @author ShareThrift Development Team
 * @since 1.0.0
 */

import { runAllExamples } from './liqe-filtering-examples.js';

console.log('🔍 LiQE Advanced Filtering Examples');
console.log('===================================');
console.log('This will demonstrate all the advanced OData-style filtering');
console.log('capabilities provided by the LiQE integration.\n');

runAllExamples().catch(error => {
  console.error('❌ Failed to run examples:', error);
  process.exit(1);
});
