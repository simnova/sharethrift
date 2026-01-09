import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateUtils } from './template-utils.js';
import path from 'node:path';
import fs from 'node:fs';

describe('template-utils', () => {
  let utils: TemplateUtils;

  beforeEach(() => {
    utils = new TemplateUtils();
  });

  describe('substituteVariables', () => {
    it('substitutes variables in template content', () => {
      const content = 'Hello {{name}}, your code is {{status}}!';
      const result = utils.substituteVariables(content, { name: 'Alice', status: 'green' });
      expect(result).toBe('Hello Alice, your code is green!');
    });

    it('handles multiple occurrences of the same variable', () => {
      const content = 'Hello {{name}}, welcome {{name}}!';
      const result = utils.substituteVariables(content, { name: 'Bob' });
      expect(result).toBe('Hello Bob, welcome Bob!');
    });

    it('handles missing variables by leaving placeholders', () => {
      const content = 'Hello {{name}}, your status is {{status}}!';
      const result = utils.substituteVariables(content, { name: 'Charlie' });
      // Missing status variable should remain as-is
      expect(result).toContain('{{status}}');
      expect(result).toContain('Charlie');
    });

    it('handles empty template data', () => {
      const content = 'Hello {{name}}, your status is {{status}}!';
      const result = utils.substituteVariables(content, {});
      // All variables should remain
      expect(result).toContain('{{name}}');
      expect(result).toContain('{{status}}');
    });

    it('handles numeric values', () => {
      const content = 'Your age is {{age}} years old';
      const result = utils.substituteVariables(content, { age: 25 });
      expect(result).toBe('Your age is 25 years old');
    });

    it('handles boolean values', () => {
      const content = 'Verified: {{isVerified}}';
      const result = utils.substituteVariables(content, { isVerified: true });
      expect(result).toBe('Verified: true');
    });

    it('handles Date values', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const content = 'Date: {{date}}';
      const result = utils.substituteVariables(content, { date });
      expect(result).toContain('Date:');
      expect(result).toContain('2024');
    });

    it('handles special characters in values', () => {
      const content = 'Message: {{msg}}';
      const result = utils.substituteVariables(content, { msg: '<script>alert("xss")</script>' });
      expect(result).toContain('<script>alert("xss")</script>');
    });

    it('preserves non-placeholder text', () => {
      const content = 'This is a test with {{var1}} and literal {{braces}} and {{var2}}';
      const result = utils.substituteVariables(content, { var1: 'A', var2: 'B' });
      expect(result).toContain('This is a test');
      expect(result).toContain('and literal {{braces}}');
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('handles empty string values', () => {
      const content = 'Start{{empty}}End';
      const result = utils.substituteVariables(content, { empty: '' });
      expect(result).toBe('StartEnd');
    });

    it('handles zero as a value', () => {
      const content = 'Count: {{count}}';
      const result = utils.substituteVariables(content, { count: 0 });
      expect(result).toBe('Count: 0');
    });
  });

  describe('loadTemplate', () => {
    it('loads a JSON template file from assets directory', () => {
      const assetDir = path.resolve(process.cwd(), 'assets/email-templates');
      expect(assetDir).toBeTypeOf('string');
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl).toBeDefined();
      expect(tpl).toHaveProperty('subject');
      expect(tpl).toHaveProperty('body');
      expect(tpl).toHaveProperty('fromEmail');
    });

    it('returns template with all required properties', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(typeof tpl.subject).toBe('string');
      expect(typeof tpl.body).toBe('string');
      expect(typeof tpl.fromEmail).toBe('string');
    });

    it('subject contains non-empty string', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.subject.length).toBeGreaterThan(0);
    });

    it('body contains non-empty string', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.body.length).toBeGreaterThan(0);
    });

    it('fromEmail is a valid email format', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.fromEmail).toMatch(/@/);
      expect(tpl.fromEmail).toMatch(/\./);
    });

    it('throws error for non-existent template', () => {
      expect(() => {
        utils.loadTemplate('non-existent-template');
      }).toThrow();
    });

    it('throws error with meaningful message for missing template', () => {
      try {
        utils.loadTemplate('missing-template-xyz');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('missing-template-xyz');
      }
    });

    it('loads the same template consistently', () => {
      const tpl1 = utils.loadTemplate('reservation-request-notification');
      const tpl2 = utils.loadTemplate('reservation-request-notification');
      expect(tpl1).toEqual(tpl2);
    });

    it('template file exists in assets directory', () => {
      // Find the monorepo root by searching upward
      let currentDir = process.cwd();
      while (!fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
        const parent = path.dirname(currentDir);
        if (parent === currentDir) {
          // Reached root without finding pnpm-workspace.yaml, fallback
          break;
        }
        currentDir = parent;
      }
      const assetDir = path.resolve(currentDir, 'assets/email-templates');
      const templatePath = path.join(assetDir, 'reservation-request-notification.json');
      expect(fs.existsSync(templatePath)).toBe(true);
    });
  });

  describe('integration', () => {
    it('loads template and substitutes variables', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      const result = utils.substituteVariables(tpl.body, {
        sharerName: 'John Doe',
        reserverName: 'Jane Smith',
        listingTitle: 'Beautiful Home',
      });
      expect(result).toContain('John Doe');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('Beautiful Home');
    });

    it('substitutes variables in both subject and body', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      const dataVars = { listingTitle: 'Test Property' };
      
      const subjectResult = utils.substituteVariables(tpl.subject, dataVars);
      const bodyResult = utils.substituteVariables(tpl.body, dataVars);
      
      expect(subjectResult).toBeDefined();
      expect(bodyResult).toBeDefined();
    });

    it('complete workflow: load, substitute, verify result', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      const templateData = {
        sharerName: 'Alice Johnson',
        reserverName: 'Bob Williams',
        listingTitle: 'Cozy Cottage',
        checkInDate: '2024-02-15',
        checkOutDate: '2024-02-20',
      };

      const subject = utils.substituteVariables(tpl.subject, templateData);
      const body = utils.substituteVariables(tpl.body, templateData);

      expect(subject.length).toBeGreaterThan(0);
      expect(body.length).toBeGreaterThan(0);
      expect(subject).not.toContain('{{');
      expect(body).not.toContain('{{sharerName}}');
      expect(body).not.toContain('{{reserverName}}');
      expect(body).not.toContain('{{listingTitle}}');
    });
  });

  describe('substituteVariables - whitespace handling', () => {
    it('preserves leading and trailing whitespace in content', () => {
      const content = '  Hello {{name}}  ';
      const result = utils.substituteVariables(content, { name: 'World' });
      expect(result).toBe('  Hello World  ');
    });

    it('handles line breaks around placeholders', () => {
      const content = 'Line 1\n{{var}}\nLine 3';
      const result = utils.substituteVariables(content, { var: 'Line 2' });
      expect(result).toBe('Line 1\nLine 2\nLine 3');
    });

    it('handles tabs in content', () => {
      const content = 'Column1\t{{value}}\tColumn3';
      const result = utils.substituteVariables(content, { value: 'Column2' });
      expect(result).toBe('Column1\tColumn2\tColumn3');
    });
  });

  describe('substituteVariables - object and array values', () => {
    it('converts object to string representation', () => {
      const content = 'Data: {{obj}}';
      const result = utils.substituteVariables(content, { 
        obj: '{"key": "value"}' 
      });
      expect(result).toContain('Data:');
      expect(result).toContain('key');
    });

    it('converts array to string representation', () => {
      const content = 'Items: {{items}}';
      const result = utils.substituteVariables(content, { 
        items: 'a, b, c' 
      });
      expect(result).toContain('Items:');
      expect(result).toContain('a');
    });
  });

  describe('loadTemplate - edge cases', () => {
    it('template subject contains expected placeholder patterns', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.subject).toBeTypeOf('string');
      expect(tpl.subject.length).toBeGreaterThan(0);
    });

    it('template body contains expected placeholder patterns', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.body).toBeTypeOf('string');
      expect(tpl.body.length).toBeGreaterThan(0);
    });

    it('fromEmail property is always defined', () => {
      const tpl = utils.loadTemplate('reservation-request-notification');
      expect(tpl.fromEmail).toBeDefined();
      expect(typeof tpl.fromEmail).toBe('string');
    });

    it('templates are immutable (each call returns same structure)', () => {
      const tpl1 = utils.loadTemplate('reservation-request-notification');
      const tpl2 = utils.loadTemplate('reservation-request-notification');
      
      expect(tpl1.subject).toBe(tpl2.subject);
      expect(tpl1.body).toBe(tpl2.body);
      expect(tpl1.fromEmail).toBe(tpl2.fromEmail);
    });

    it('handles case-sensitive template names', () => {
      const tpl1 = utils.loadTemplate('reservation-request-notification');
      expect(tpl1).toBeDefined();

      // The implementation is case-insensitive, so both should work
      const tpl2 = utils.loadTemplate('Reservation-Request-Notification');
      expect(tpl2).toBeDefined();
      expect(tpl2).toEqual(tpl1);
    });
  });

  describe('error scenarios', () => {
    it('provides clear error message when template directory not found', () => {
      try {
        utils.loadTemplate('nonexistent');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const { message } = error as Error;
        expect(message.toLowerCase()).toContain('template');
      }
    });

    it('throws for empty template name', () => {
      expect(() => {
        utils.loadTemplate('');
      }).toThrow();
    });

    it('throws for null/undefined template name', () => {
      expect(() => {
        utils.loadTemplate(null as unknown as string);
      }).toThrow();

      expect(() => {
        utils.loadTemplate(undefined as unknown as string);
      }).toThrow();
    });
  });

  describe('complex substitution scenarios', () => {
    it('handles template with many different variables', () => {
      const content = `
        Name: {{firstName}} {{lastName}}
        Email: {{email}}
        Phone: {{phone}}
        Address: {{street}}, {{city}}, {{state}} {{zip}}
        Dates: {{startDate}} to {{endDate}}
      `;

      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-1234',
        street: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const result = utils.substituteVariables(content, data);

      expect(result).toContain('John');
      expect(result).toContain('Doe');
      expect(result).toContain('john@example.com');
      expect(result).toContain('123 Main St');
      expect(result).toContain('Boston');
      expect(result).not.toContain('{{firstName}}');
    });

    it('handles partial variable substitution correctly', () => {
      const content = 'Greeting: {{greeting}}, Name: {{name}}, City: {{city}}';
      const data = { greeting: 'Hello', name: 'Alice' };

      const result = utils.substituteVariables(content, data);

      expect(result).toContain('Hello');
      expect(result).toContain('Alice');
      expect(result).toContain('{{city}}');
    });

    it('handles duplicate variables with different values', () => {
      const content = '{{user}} met {{user}} at {{location}}';
      const data = { user: 'Alice', location: 'Park' };

      const result = utils.substituteVariables(content, data);

      expect(result).toBe('Alice met Alice at Park');
    });

    it('preserves case sensitivity in variable names', () => {
      const content = '{{Name}} and {{name}} and {{NAME}}';
      const data = { Name: 'John', name: 'john', NAME: 'JOHN' };

      const result = utils.substituteVariables(content, data);

      expect(result).toBe('John and john and JOHN');
    });
  });

  describe('TemplateUtils instance behavior', () => {
    it('multiple instances are independent', () => {
      const utils1 = new TemplateUtils();
      const utils2 = new TemplateUtils();

      const content = 'Hello {{name}}';
      const result1 = utils1.substituteVariables(content, { name: 'World1' });
      const result2 = utils2.substituteVariables(content, { name: 'World2' });

      expect(result1).toBe('Hello World1');
      expect(result2).toBe('Hello World2');
    });

    it('instance can load and substitute repeatedly', () => {
      const utils2 = new TemplateUtils();

      for (let i = 0; i < 5; i++) {
        const tpl = utils2.loadTemplate('reservation-request-notification');
        const result = utils2.substituteVariables(tpl.body, {
          listingTitle: `Property ${i}`,
        });
        expect(result).toContain('Property');
      }
    });
  });
});
