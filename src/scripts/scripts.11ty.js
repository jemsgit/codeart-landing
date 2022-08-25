const path = require('path');
//const vite = require('vite');
const esbuild = require('esbuild');

const { NODE_ENV = 'production' } = process.env

const isProduction = NODE_ENV === 'production'


module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.build({
      entryPoints: ['src/scripts/index.js'],
      bundle: true,
      minify: isProduction,
      outdir: 'public/scripts',
      sourcemap: !isProduction,
      target: isProduction ? 'es6' : 'esnext'
    })
  }

  // async render() {
  //   await vite.build(vite.defineConfig({
  //     root: path.resolve(__dirname, '../../public/'),
  //       build: {
  //         outDir: path.resolve(__dirname, '../../public/scripts'),
  //         assetsDir: '',
  //         minify: false,
  //         rollupOptions: {
  //           input: [path.resolve(__dirname, './index.js')],
  //           output: {
  //             entryFileNames: '[name].js',
  //           }
  //         }
  //       },
  //     }))
  // }
}