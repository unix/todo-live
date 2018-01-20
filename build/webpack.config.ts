import * as path from 'path'
import * as fs from 'fs'
import * as webpack from 'webpack'
import { promisify } from 'util'
const lintConfig = require('../tslint.json')
const readDir = promisify(fs.readdir)
const manifest = require('../package.json')

export type Externals = {
  [key: string]: string,
}

module.exports = (async() => {
  
  const externals: Externals = Object.keys(manifest.dependencies).reduce((pre, next) =>
    Object.assign({}, pre, { [next]: `require('${next}')`}), {})
  
  const entries: string[] = await readDir(path.join(__dirname, '../src/bin'))
  
  const entryName: (f: string) => string = fileName => `bin/${fileName.split('.ts')[0]}`
  
  const entriesMap: Externals = entries.reduce((pre, next) => Object.assign({},
    pre, { [entryName(next)]: path.resolve(__dirname, `../src/bin/${next}`) }), {})
  
  const base = {
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js',
    },
  
    target: 'node',
  
    node: {
      __dirname: false,
      __filename: true,
    },
  
    resolve: {
      extensions: [ '.ts', '.js'],
      modules: [
        path.join(__dirname, '../node_modules'),
      ],
    },
  
    module: {
      rules: [
        {
          test: /\.ts/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'tslint-loader',
          options: {
            configuration: lintConfig,
          },
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json'),
          }
        },
      ],
    },
  
    plugins: [
      new webpack.BannerPlugin({
        raw: true,
        banner: '#!/usr/bin/env node',
        exclude: 'index.js',
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
      }),
    ],
    
    entry: entriesMap,
    
    externals: externals,
    
  }
  
  return base
})()
