import { describe, it, expect } from 'vitest';
import { TemplateUtils } from './template-utils.js';
import path from 'node:path';

describe('template-utils', () => {
  it('substitutes variables in template content', () => {
    const utils = new TemplateUtils();
    const content = 'Hello {{name}}, your code is {{status}}!';
    const result = utils.substituteVariables(content, { name: 'Alice', status: 'green' });
    expect(result).toBe('Hello Alice, your code is green!');
  });

  it('loads a JSON template file from assets directory', () => {
    const utils = new TemplateUtils();
    // Ensure the test runs with repo root as CWD
    const assetDir = path.resolve(process.cwd(), 'assets/email-templates');
    expect(assetDir).toBeTypeOf('string');
    const tpl = utils.loadTemplate('reservation-request-notification');
    expect(tpl).toBeDefined();
    expect(tpl).toHaveProperty('subject');
    expect(tpl).toHaveProperty('body');
  });
});
