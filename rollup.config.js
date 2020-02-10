import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const noDeclarationFiles = { compilerOptions: { declaration: false } };

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const globals = {
  redux: 'redux',
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-redux': 'ReactRedux'
}

export default [
  // ES
  {
    input: 'src/index.ts',
    output: {
      file: 'es/alienStore.js',
      format: 'es',
      indent: false
    },
    external,
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },
  // ES for Browsers
  {
    input: 'src/index.ts',
    output: { 
      file: 'es/alienStore.mjs', 
      format: 'es', indent: false
     },
    external,
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  // UMD Development
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/alienStore.js',
      format: 'umd',
      name: 'alienStore',
      indent: false,
      globals,
    },
    external,
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx']
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/alienStore.min.js',
      format: 'umd',
      name: 'alienStore',
      indent: false,
      globals,
    },
    external,
    plugins: [
      commonjs({
        namedExports: {
          react: ['useEffect', 'useState']
        }
      }),
      nodeResolve({
        extensions: ['.tsx'],
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
