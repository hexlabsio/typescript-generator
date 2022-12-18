import { Printable, Printer } from './printer';

export class Block {

  private constructor(private bodyParts: (string | Printable)[] = []) {
  }

  parts(): { parts: (string | Printable)[] } {
    return { parts: this.bodyParts }
  }

  add(part: string | Printable): this {
    this.bodyParts.push(part);
    return this;
  }

  static create(): Block {
    return new Block();
  }

  print(printer: Printer): string {
    return this.bodyParts.reduce((p, next) => typeof next === 'string' ? p.printLine(next) : p.print(next), printer).get();
  }
}