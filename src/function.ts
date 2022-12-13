import { Block } from './block';
import { Generic } from './generic';
import { AccessKeyword } from './keywords';
import { Printer } from './printer';
import { TypeExp, TypeExpression } from './type-expression';

export class Parameter {
  protected constructor(
    private name: string,
    private typeExpression?: TypeExpression,
    private spread?: boolean
  ) {}

  spreadArg(): this {
    this.spread = true;
    return this;
  }

  withType(typeExpression: TypeExpression | TypeExp): this {
    if(typeExpression instanceof TypeExpression)
      this.typeExpression = typeExpression;
    else {
      this.typeExpression = TypeExpression.create(typeExpression);
    }
    return this;
  }

  print(printer: Printer): string {
    return printer.printSpaced(this.spread && '...', `${this.name}${this.typeExpression ? ': ' : ''}`)
      .print(this.typeExpression).get()
  }

  static create(name: string, typeExpression?: TypeExpression | TypeExp): Parameter {
    if(typeExpression === undefined || typeExpression instanceof TypeExpression)
      return new Parameter(name, typeExpression);
    return new Parameter(name, TypeExpression.create(typeExpression));
  }
}

export class TsFunction {
  private constructor(
    private name?: string,
    private method = false,
    private isAsynchronous = false,
    private access?: AccessKeyword,
    private isStatic?: boolean,
    private isAbstract?: boolean,
    private parameters: Parameter[] = [],
    private generics: Generic[] = [],
    private returnType?: TypeExpression,
    private body?: Block,
    private type: 'lambda' | 'named' = 'named'
  ) {}

  isAsync(): this {
    this.isAsynchronous = true;
    return this;
  }

  makeStatic(): this {
    this.isStatic = true;
    return this;
  }

  withReturnType(typeExpression: TypeExpression | TypeExp): this {
    if(typeExpression instanceof TypeExpression)
      this.returnType = typeExpression;
    else {
      this.returnType = TypeExpression.create(typeExpression);
    }
    return this;
  }

  withBody(body: Block): this
  withBody(body: (builder: Block) => Block): this
  withBody(body: Block | ((builder: Block) => Block)): this {
    if(body instanceof Block) {
      this.body = body;
    } else {
      this.body = body(Block.create());
    }
    return this;
  }

  withParameters(...params: Parameter[]): this {
    this.parameters = params;
    return this;
  }

  isLambda(): this {
    this.type = 'lambda';
    return this;
  }

  genericArgs(...args: Generic[]): this {
    this.generics = args;
    return this;
  }

  isPrivate(): this {
    this.access = 'private';
    return this;
  }

  isProtected(): this {
    this.access = 'protected';
    return this;
  }

  isPublic(): this {
    this.access = 'public'
    return this;
  }

  isMethod(): this {
    this.method = true;
    return this;
  }

  private printGenericArgs(printer: Printer): Printer {
    if(this.generics.length) {
      return printer.print('<').printSeperated(', ', ...this.generics).print('>');
    }
    return printer;
  }

  print(printer: Printer): string {
    const indented = printer.print();
    const start = (this.type === 'lambda' ? indented : indented.printSpaced(
      this.access,
      this.isStatic && 'static',
      this.isAbstract && 'abstract',
      this.isAsynchronous && 'async',
      !this.method && 'function',
      this.name
    ))
    return this.printGenericArgs(start)
      .print('(')
      .printSeperated(', ', ...this.parameters)
      .print(')')
      .print(this.returnType && ': ')
      .print(this.returnType)
      .print((this.returnType ? ' {' : '{') + (this.body ? '\n' : ''))
      .printIndented(this.body)
      .printLine('}\n')
      .get();
  }

  static create(name?: string): TsFunction {
    return new TsFunction(name);
  }
}