import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect with jest-dom matchers
expect.extend(matchers);