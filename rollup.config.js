import typescript from 'rollup-plugin-typescript2';

const external = [
  'assert',
  'fs',
  'path',
  'source-map-support',
  'typescript'
];
const plugins = [
  typescript({
    typescript: require('typescript'),
    tsconfigOverride: {
      module: "es2015",
      declaration: false,
    }
  }),
];

export default [{
  input: './src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
    sourcemap: true,
  },
  external,
  plugins
}, {
  input: './src/index.ts',
  output: {
    file: 'index.es.js',
    format: 'es',
    sourcemap: true,
  },
  external,
  plugins,
}, {
  input: './test/index.ts',
  output: {
    file: 'test.js',
    format: 'cjs',
    sourcemap: true,
  },
  external,
  plugins,
}];