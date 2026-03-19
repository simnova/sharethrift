/**
 * Fixture: Instance members with mixed methods and accessors
 *
 * This class validates that the relaxed instance-member semantics allows
 * mixing methods and accessors within the same instance-member group
 * (as long as they don't violate static vs instance separation).
 */

export class MixedInstanceMembers {
  private value = 0;

  constructor() {
    this.value = 42;
  }

  // Instance method
  public foo(): void {
    // do something
  }

  // Instance getter - allowed to be mixed with methods
  public get bar(): number {
    return this.value;
  }

  // Instance method - allowed after getter
  public baz(): void {
    // do something
  }

  // Instance setter - allowed mixed with methods
  public set bar(v: number) {
    this.value = v;
  }

  // Another instance method after accessor - should be allowed
  public qux(): string {
    return 'ok';
  }
}
