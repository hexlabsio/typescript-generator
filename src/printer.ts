import { Exported } from './exported';

export type Printable = { print(printer: Printer): string; exported?: Exported };

export class Printer {
  private indentChar = '  ';
  private constructor(private indentation = 0, private text: string = '') {
  }

  private currentIndent() {
    return this.indentation > 0 ? new Array(this.indentation).fill(this.indentChar).join('') : '';
  }

  printSpaced(...text: (string | boolean | null | undefined | number | Printable)[]): Printer {
    return this.printSeperated(' ', ...text);
  }

  printSeperated(separator: string, ...text: (string | boolean | null | undefined | number | Printable)[]): Printer {
    return text.filter((it): it is (string | Printable) => !!it)
      .reduce<Printer>((printer, next, index, arr) => {
        return printer.print(index > 0 && index < arr.length && separator).print(next);
      }, this)
  }

  printLine(text?: string | boolean | null | number | Printable): Printer {
    if(!text) return this;
    return this.print(text).print('\n');
  }

  print(text?:  string | boolean | null | undefined | number | Printable): Printer {
    if(!text) return this;
    if(typeof text === 'object') {
      const prefix = text.exported?.exported ? `export${text.exported.isDefault ? ' default': ''} ` : '';
      this.text = `${this.text}${prefix}${text.print(new Printer())}`;
    } else {
      this.text = `${this.text}${text}`;
    }
    return this;
  }

  indent(print: (printer: Printer) => string): this {
    this.text = `${this.text}${print(new Printer(1))}`;
    return this;
  }

  printIndented(...text: (string | boolean | null | undefined | number | Printable)[]): Printer {
    return text.filter((it): it is (string | Printable) => !!it)
      .reduce<Printer>((printer, next) => printer.indent(p => p.print(next).get()), this);
  }

  printLines(...text: (string | boolean | null | undefined | number | Printable)[]): Printer {
    return text.filter((it): it is (string | Printable) => !!it)
      .reduce<Printer>((printer, next) => printer.printLine(next), this);
  }


  get(): string {
    return this.text.split('\n').map((next) => ((!next || next === '\n') ? next : `${this.currentIndent()}${next}`)).join('\n');
  }

  static create(indentation = 0): Printer {
    return new Printer(indentation);
  }
}