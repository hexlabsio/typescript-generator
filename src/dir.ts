import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import prettier from 'prettier';

export interface FilePart {
  parent?: Dir;
  name: string;
}

export class Dir {
  constructor(
    public name: string,
    public parent?: Dir,
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

  /**
   *
   * @param currentLocation directory location of current file
   * @param imported location of file plus the name of the file
   */
  static importLocation(currentLocation: string[], imported: string[]): string {
    let index = 0;
    const matching = new Array<string>;
    while(index < Math.min(currentLocation.length, imported.length) && imported[index] === currentLocation[index]) {
      matching.push(currentLocation[index]);
      index = index + 1;
    }
    const current = currentLocation.slice(index);
    const importLocation = imported.slice(index);
    if(current.length === 0) {
      return ['.', ...importLocation].join('/');
    }
    return [...current.map(() => '..'), ...importLocation].join('/');
  }

  get(): { name: string; files: FilePart[]; dirs: Dir[] } {
    return { name: this.name, files: this.files, dirs: this.dirs };
  }


  write(location?: string, transform: (file: FilePart) => string = file => prettier.format((file as any).print(), { parser: 'typescript', semi: false})): void {
    const directory = path.join(location ?? '.', this.name).normalize();
    mkdirSync(directory, { recursive: true });
    this.dirs.forEach(it => it.write(directory));
    this.files.forEach(it => {
      writeFileSync(path.join(directory, it.name), transform(it));
    });
  }

  private getNextChild(name: string): Dir {
    const current = this.dirs.find(it => it.name === name);
    if(current) return current;
    const child = Dir.create(name);
    this.child(child);
    return child;
  }

  getChildAt(location?: string): Dir {
    if(!location) return this;
    return location.split('/').reduce((dir, next) => dir.getNextChild(next), this as Dir);
  }

  static create(name: string): Dir {
    return new Dir(name);
  }
}