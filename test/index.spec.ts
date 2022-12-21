import { ConstructorParameter, Expression, Parameter, TsClass, TsFile, TsFunction, Dir } from '../src';

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

  it('should make relative dir', () => {
    const other = TsFile.create('Other');
    const childDir = Dir.create('xyz').add(other);
    const test = TsFile.create('Test');
     Dir.create('models')
      .add(test)
      .child(childDir);
     expect(Dir.absoluteLocationFor(other)).toEqual(['models', 'xyz', 'Other']);
     expect(Dir.absoluteLocationFor(test)).toEqual(['models', 'Test']);
     //import Test from inside Other file
     expect(Dir.relativeLocationFor(test, other)).toEqual('../Test')
     expect(Dir.relativeLocationBetween('Test', ['models', 'xyz', 'X'], ['models', 'Test'])).toEqual('../Test')
  })
})