import { Printer } from './printer';

export type SimpleType = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'object';

export type TypeExp = SimpleType | string;

export class TypeExpression {
  constructor(private expression: TypeExp) {
  }

  print(printer: Printer): string {
    return printer.print(this.expression).get();
  }

  static create(expression: TypeExp): TypeExpression {
    return new TypeExpression(expression);
  }
}