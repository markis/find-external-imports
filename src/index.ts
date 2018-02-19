import {
  readdirSync,
  readFileSync,
  statSync,
} from 'fs';
import {
  createSourceFile,
  forEachChild,
  Identifier,
  ImportDeclaration,
  Node,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from 'typescript';

export interface Options {
  dir: string;
  exclusion?: RegExp;
}

export function findExternalImports(opt: Options) {
  if (!opt) {
    throw Error('Find External Imports Error - Options parameter expected');
  }

  const exclusion: (imp: string) => boolean = !!opt.exclusion
    ? (imp: string) => !!opt.exclusion && !opt.exclusion.test(imp || '')
    : () => true;

  const files = getAllFiles(opt.dir);

  const imports = files
    .map(getSourceFile)
    .map(findImportsInSourceFile)
    .reduce((arr: string[], next: string[]) => arr.concat(next), [])
    .filter((imp: string) => exclusion(imp) && imp[0] !== '.');

  return Array.from(new Set(imports));
}

function getSourceFile(fileName: string): SourceFile {
  return createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ScriptTarget.Latest,
  );
}

function findImportsInSourceFile(sourceFile: SourceFile) {
  const imports: string[] = [];
  findImportsInNode(sourceFile);

  function findImportsInNode(node: Node) {
    switch (node && node.kind) {
      case SyntaxKind.ImportDeclaration:
        const importNode = node as ImportDeclaration;
        const moduleSpecifier = importNode.moduleSpecifier as Identifier;
        if (moduleSpecifier && moduleSpecifier.text) {
          imports.push(moduleSpecifier.text);
        }
        break;
    }
    forEachChild(node, findImportsInNode);
  }

  return imports;
}

function getAllFiles(rootDir: string): string[] {
  const walk = (dir: string): string[] => {
    let results: string[] = [];
    const list = readdirSync(dir);
    for (let file of list) {
      file = dir + '/' + file;
      const stat = statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        results.push(file);
      }
    }
    return results;
  };
  return walk(rootDir);
}
