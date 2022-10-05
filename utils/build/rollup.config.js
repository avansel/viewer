import tsPlugin from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import gzipPlugin from 'rollup-plugin-gzip'

export default {
  input: 'src/AvanselViewer/AvanselViewer.ts',
  output: {
    file: 'dist/avanselviewer.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    tsPlugin(),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    gzipPlugin()
	],
}