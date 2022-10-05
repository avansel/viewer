import tsPlugin from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
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
	],
}