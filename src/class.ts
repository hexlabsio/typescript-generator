import { Block } from './block';
import { Parameter, TsFunction } from './function';
import { AccessKeyword } from './keywords';
import { Printer } from './printer';
import { TypeExp, TypeExpression } from './type-expression';

export class ConstructorParameter extends Parameter {

  private constructor(
    name: string,
    typeExpression?: TypeExpression,
    spread?: boolean,
    private access?: AccessKeyword,
    private readonly?: boolean
  ) {
    super(name, typeExpression, spread);
  }

  isReadonly(): this {
    this.readonly = true;
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
    this.access = 'public';
    return this;
  }

  print(printer: Printer): string {
    return printer.printSpaced(this.access, this.readonly && 'readonly', { print: super.print.bind(this) }).get();
  }

  static create(name: string, typeExpression?: TypeExpression | TypeExp): ConstructorParameter {
    if(typeExpression === undefined || typeExpression instanceof TypeExpression)
      return new ConstructorParameter(name, typeExpression);
    return new ConstructorParameter(name, TypeExpression.create(typeExpression));
  }
}

export class Constructor {

  private constructor(
    private parameters: ConstructorParameter[] = [],
    private access?: AccessKeyword,
    private body?: Block
  ) {
  }

  withParameters(...params: ConstructorParameter[]): this {
    this.parameters = params;
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
    this.access = 'public';
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

  print(printer: Printer): string {
    return printer.printSpaced(
        this.access,
        'constructor'
      )
      .print('(')
      .printSeperated(', ', ...this.parameters)
      .print('){')
      .print(this.body && '\n')
      .printIndented(this.body)
      .printLine('}\n')
      .get();
  }

  static create(): Constructor {
    return new Constructor();
  }
}
export class TsClass{
  constructor(
    private name: string,
    private isAbstract: boolean = false,
    private extension?: string,
    private implementing: string[] = [],
    private creator?: Constructor,
    private body?: Block,
    private methods: TsFunction[] = []
  ) {}

  makeAbstract(): this {
    this.isAbstract = true;
    return this;
  }

  makeExtend(extension: string): this {
    this.extension = extension;
    return this;
  }

  implement(...parts: string[]): this {
    this.implementing = parts;
    return this;
  }

  withConstructor(builder: (constructor: Constructor) => Constructor): this;
  withConstructor(constructor: Constructor): this
  withConstructor(arg: ((constructor: Constructor) => Constructor) | Constructor): this {
    if(arg instanceof Constructor)
      this.creator = arg;
    else {
      this.creator = arg(Constructor.create());
    }
    return this;
  }

  withBody(body: Block): this {
    this.body = body;
    return this;
  }

  withMethod(method: TsFunction): this {
    this.methods.push(method.isMethod());
    return this;
  }

  print(printer: Printer): string {
    return printer.print().printSpaced(
      this.isAbstract && 'abstract',
      'class',
      this.name,
      this.extension && `extends ${this.extension}`,
      this.implementing.length && `implements ${this.implementing.join(', ')}`,
      '{\n\n'
    )
      .printIndented(this.body, this.creator, ...this.methods)
      .printLine('}')
      .get();
  }

  static create(name: string): TsClass {
    return new TsClass(name);
  }
}