export interface Options {
    dir: string;
    exclusion?: RegExp;
}
export declare function findExternalImports(opt: Options): string[];
