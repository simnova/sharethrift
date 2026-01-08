/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { makeNewableMock } from './index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

describeFeature(feature, ({ Scenario,BeforeEachScenario }) => {
  let Impl: any;
  let Mock: any;
  let fn: any;
  let instance: any;
  let result: any;

  BeforeEachScenario(() => {
    Impl = undefined;
    Mock = undefined;
    fn = undefined;
    instance = undefined;
    result = undefined;
  });

  Scenario('Constructor behaviour', ({ Given, When, Then }) => {
    Given('an implementation function that constructs `Impl` instances', () => {
      function ImplCtor(this: any, value: number) {
        this.value = value;
      }
      Impl = ImplCtor;
    });

    When('makeNewableMock is created from that function', () => {
      Mock = makeNewableMock((v: number) => new (Impl as any)(v));
    });

    Then('the returned function can be used as a constructor and produce an `Impl` instance with expected value', () => {
      instance = new (Mock as any)(42);
      expect(instance.value).toBe(42);
      expect(instance).toBeInstanceOf(Impl);
    });
  });

  Scenario('Callable behaviour', ({ Given, When, Then }) => {
    Given('a function that returns the sum of two numbers', () => {
      fn = vi.fn((a: number, b: number) => a + b);
    });

    When('makeNewableMock is created from that function', () => {
      Mock = makeNewableMock((a: number, b: number) => fn(a, b));
    });

    Then('calling the returned function should proxy the call and return the sum', () => {
      result = (Mock as any)(2, 3);
      expect(result).toBe(5);
      expect(fn).toHaveBeenCalledWith(2, 3);
    });
  });
});
