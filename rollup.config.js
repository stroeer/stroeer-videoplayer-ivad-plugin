import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'

const isDevMode = Boolean(process.env.ROLLUP_WATCH)
console.log('is dev mode', isDevMode)

export default [{
  input: 'src/plugin.ts',
  output: {
    file: 'dist/StroeerVideoplayer-ivad-plugin.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerIvadPlugin',
    sourcemap: isDevMode
  },
  plugins: [
    resolve(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg()
  ]
},
{
  input: 'src/plugin.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg()
  ]
},
{
  input: 'src/plugin.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'default',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg()
  ]
}]
