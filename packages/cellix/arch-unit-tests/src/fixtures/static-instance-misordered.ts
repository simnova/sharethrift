/**
 * Fixture: Static and instance members incorrectly interleaved
 *
 * This class intentionally violates the member ordering convention by
 * putting a static method after an instance method, which should produce violations.
 * This ensures the rule still enforces the static vs instance grouping.
 */

export class StaticInstanceMisordered {
  // Instance method first
  instanceMethod(): void {
    // do something
  }

  // Static method AFTER instance - VIOLATION!
  static staticMethod(): void {
    // do something
  }
}
