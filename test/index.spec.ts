import { ConstructorParameter, Expression, Parameter, TsClass, TsFile, TsFunction } from '../src';

describe('test', () => {
  it('should', () => {
    const myBuilder = TsClass.create('MyBuilder')
      .withConstructor(constructor =>
          constructor
            .isPrivate()
            .withParameters(
              ConstructorParameter.create('name', 'string').isPrivate().isReadonly()
            )
      )
      .withMethod(
        TsFunction.create('create').makeStatic()
          .withParameters(Parameter.create('name', 'string'))
          .withReturnType('MyBuilder')
          .withBody(body =>
            body
              .add(Expression.create().ifStatement('name === \'s\'', 'return null;'))
              .add('return new MyBuilder(name);')
          )
      );
    console.log(TsFile.create('test-builder.ts').append(myBuilder, { exported: true, isDefault: true }).print());
  })
})