import tsPlugin from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/AvanselViewer/AvanselViewer.ts',
    output: {
      file: 'dist/avanselviewer.js',
      sourcemap: true
    },
    plugins: [
      tsPlugin(),
      nodeResolve({ preferBuiltins: true })
    ],
  }, {
    input: 'src/main.js',
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      tsPlugin(),
      commonjs(),
      nodeResolve({ preferBuiltins: true })
    ]
  }
]