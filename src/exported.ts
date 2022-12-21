
export interface Exported {
  exported?: boolean;
  isDefault?: boolean;
}

export interface Import {
  name: string;
  from: string;
  alias?: string;
  isDefault?: boolean;
}

export class Imports {
  private constructor(private imports: Import[] = []) {}

  addImport(name: string, from: string, alias?: string) {
    this.imports.push({ name, from, alias });
  }
  addDefaultImport(from: string, alias?: string) {
    this.imports.push({ isDefault: true, from, alias, name: 'default' });
  }

  getImports() {
    const allFroms = [...new Set(this.imports.map(it => it.from))];
    return allFroms.map(from => {
      const imports = this.imports.filter(it => it.from === from);
      const defaultImport = imports.find(it => it.isDefault);
      const otherImports = imports.filter(it => !it.isDefault || it.alias);
      const importStrings = [...new Set(otherImports.map(it => `${it.name}${it.alias ? ` as ${it.alias}` : ''}`))].join(', ')
      const strings = [
        (defaultImport && !defaultImport.alias) ? defaultImport.name : undefined,
        importStrings ? `{ ${importStrings} }` : undefined
      ].filter(it => !!it).join(', ');
      return `import ${strings} from '${from}'`
    }).join('\n');
  }

  static create(): Imports {
    return new Imports();
  }
}