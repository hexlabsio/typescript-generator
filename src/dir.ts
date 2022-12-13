export interface FilePart {
  parent?: Dir;
  name: string;
}

export class Dir {
  constructor(
    private name: string,
    private parent?: Dir,
    private files: FilePart[] = [],
    private dirs: Dir[] = []
  ) {
    console.log(parent, files, dirs);
  }

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
    const matching = [];
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

  static create(name: string): Dir {
    return new Dir(name);
  }
}