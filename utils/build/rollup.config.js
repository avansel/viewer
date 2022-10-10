import tsPlugin from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/Avansel/Avansel.ts',
    output: {
      file: 'build/avansel.js',
      sourcemap: true
    },
    plugins: [
      tsPlugin(),
      json(),
      nodeResolve({ preferBuiltins: true })
    ],
  }, {
    input: 'src/main.js',
    output: {
      file: 'build/main.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      tsPlugin(),
      nodeResolve({ preferBuiltins: true })
    ]
  }
]