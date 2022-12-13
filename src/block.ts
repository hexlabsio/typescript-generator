import { Printable, Printer } from './printer';

export class Block {

  private constructor(private parts: (string | Printable)[] = []) {
  }

  add(part: string | Printable): this {
    this.parts.push(part);
    return this;
  }

  static create(): Block {
    return new Block();
  }

  print(printer: Printer): string {
    return this.parts.reduce((p, next) => typeof next === 'string' ? p.printLine(next) : p.print(next), printer).get();
  }
}