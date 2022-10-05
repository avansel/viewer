import tsPlugin from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/AvanselViewer/AvanselViewer.ts',
  output: {
    file: 'dist/avanselviewer.js',
    sourcemap: true
  },
  plugins: [
    tsPlugin(),
    nodeResolve({ preferBuiltins: true })
	],
}