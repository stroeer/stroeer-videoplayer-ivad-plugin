import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'src/plugin.ts',
  output: {
    file: 'dist/StroeerVideoplayer-ivad-plugin.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerIvadPlugin',
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript(),
    json(),
    svg()
  ]
},
{
  input: 'src/plugin.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    svg()
  ]
},
{
  input: 'src/plugin.ts',
  output: [
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    svg()
  ]
}]
