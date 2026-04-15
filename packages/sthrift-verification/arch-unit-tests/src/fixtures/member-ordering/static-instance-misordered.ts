export class StaticInstanceMisordered {
  doThing(): string {
    return 'instance';
  }

  static fromFixture(): StaticInstanceMisordered {
    return new StaticInstanceMisordered();
  }
}
