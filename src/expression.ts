import { Printer } from './printer';

export class Expression {
  constructor(private expression: string = '') {
  }

  print(printer: Printer): string {
    return printer.print(this.expression).get();
  }

  ifStatement(predicate: Expression | string, then?: Expression | string, falseExpression?: Expression | string): this {
    const printer = Printer.create().print('if (').print(predicate).printLine('){');
    if(then) {
      printer.indent(p => p.printLine(then).get());
    }
    printer.print('}');
    if(!falseExpression) printer.print('\n');
    else {
      printer.printLine(' else {').indent(p => p.printLine(falseExpression).get()).printLine('}');
    }
    this.expression = printer.get();
    return this;
  }

  static create(expression?: string): Expression {
    return new Expression(expression);
  }
}