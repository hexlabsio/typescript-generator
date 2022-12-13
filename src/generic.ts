import { Printer } from './printer';

export class Generic {
  constructor(
    private name: string,
    private extension?: string
  ) {
  }

  print(printer: Printer): string {
    return printer.printSpaced(this.name, this.extension && ` extends ${this.extension}`).get();
  }

  static create(name: string): Generic {
    return new Generic(name);
  }
}