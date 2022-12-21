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

  it('should make relative dir2', () => {
    const one = TsFile.create('One');
    const oneDir = Dir.create('b').add(one);
    const two = TsFile.create('Two');
    const twoDir = Dir.create('a')
      .add(two)
      .child(oneDir);
    //In a/b/One.ts import {Two} from '../Two';
    expect(Dir.importLocation(Dir.absoluteLocationFor(oneDir), Dir.absoluteLocationFor(two))).toEqual('../Two')
    //In a/Two.ts import {One} from './b/One';
    expect(Dir.importLocation(Dir.absoluteLocationFor(twoDir), Dir.absoluteLocationFor(one))).toEqual('./b/One')

  })
})