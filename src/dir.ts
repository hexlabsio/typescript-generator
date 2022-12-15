import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import prettier from 'prettier';

export interface FilePart {
  parent?: Dir;
  name: string;
  print(): string;
}

export class Dir {
  constructor(
    private name: string,
    private parent?: Dir,
    private files: FilePart[] = [],
    private dirs: Dir[] = []
  ) {}

  add(...files: FilePart[]): this {
    this.files.push(...files.map(it => {
      it.parent = this;
      return it;
    }));
    return this;
  }

  child(dir: Dir): this {
    dir.parent = this;
    this.dirs.push(dir);
    return this;
  }

  static absoluteLocationFor(part: FilePart): string[] {
    let parent = part.parent;
    const path = [part.name];
    while(parent) {
      path.push(parent.name);
      parent = parent.parent;
    }
    return path.reverse();
  }

  static relativeLocationFor(part: FilePart, from: FilePart): string {
    const aParts = this.absoluteLocationFor(from);
    const bParts = this.absoluteLocationFor(part);
    let index = 0;
    const matching = new Array<string>;
    while(index < Math.min(aParts.length, bParts.length) && bParts[index] === aParts[index]) {
      matching.push(aParts[index]);
      index = index + 1;
    }
    const numUpTree = bParts.length - matching.length;
    if(numUpTree === 0) {
      return `./${part.name}`
    }
    if(numUpTree === 1) {
      return ['.', ...bParts.slice(matching.length)].join('/')
    }
    return [...new Array(numUpTree - 1).fill('..'), ...bParts.slice(matching.length)].join('/');
  }

  get(): { name: string; files: FilePart[]; dirs: Dir[] } {
    return { name: this.name, files: this.files, dirs: this.dirs };
  }

  write(location?: string, transform: (file: FilePart) => string = file => prettier.format(file.print(), { parser: 'typescript', semi: false})): void {
    const directory = path.join(location ?? '.', this.name).normalize();
    mkdirSync(directory, { recursive: true });
    this.dirs.forEach(it => it.write(directory));
    this.files.forEach(it => {
      writeFileSync(path.join(directory, it.name), transform(it));
    });
  }

  static create(name: string): Dir {
    return new Dir(name);
  }
}