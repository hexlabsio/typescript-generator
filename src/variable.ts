import { Expression } from './expression';
import { Printer } from './printer';
import { TypeExpression } from './type-expression';

export type VariableKeyword = 'var' | 'let' | 'const' | 'none';
export class Variable {

  private constructor(
    private type: VariableKeyword,
    private name: string,
    private expression?: Expression,
    private typeExpression?: TypeExpression,
  ) {}

  withType(type: TypeExpression): this {
    this.typeExpression = type;
    return this;
  }

  static var(name: string, expression?: Expression): Variable {
    return new Variable('var', name, expression);
  }
  static let(name: string, expression?: Expression): Variable {
    return new Variable('let', name, expression);
  }
  static const(name: string, expression?: Expression): Variable {
    return new Variable('const', name, expression);
  }

  static create(name: string, expression?: Expression): Variable {
    return new Variable('none', name, expression);
  }

  print(printer: Printer): string {
    return printer.printSpaced(
      this.type !== 'none' && this.type,
      this.name + (this.typeExpression ? ':' : ''),
      this.typeExpression,
      this.expression && '=',
      this.expression
    ).get();
  }
}