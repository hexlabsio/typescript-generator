import { TsClass } from './class';
import { Dir, FilePart } from './dir';
import { Exported } from './exported';
import { Expression } from './expression';
import { TsFunction } from './function';
import { Printer } from './printer';
import { Variable } from './variable';

export type TopLevelPart = TsClass | Expression | TsFunction | Variable | string;

export class TsFile implements FilePart {
  constructor(
    public name: string,
    public parent?: Dir,
    private parts: (TopLevelPart & { exported?: Exported })[] = []
  ) {}

  append(part: TopLevelPart, exported?: Exported): this {
    if(exported) {
      (part as any).exported = exported;
    }
    this.parts.push(part);
    return this;
  }

  print(): string {
    return Printer.create().printLines(...this.parts).get();
  }

  static create(name: string, parent?: Dir): TsFile {
    return new TsFile(name, parent);
  }
}