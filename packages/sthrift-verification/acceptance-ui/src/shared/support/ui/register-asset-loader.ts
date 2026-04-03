// Register ESM loader hooks for CSS/image/asset mocking
// This file is imported via NODE_OPTIONS --import flag for UI tests
import { register } from 'node:module';

register('./asset-loader-hooks.mjs', import.meta.url);
