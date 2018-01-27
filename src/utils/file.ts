import * as childProcess from 'child_process'
import * as fs from 'fs'
const promisify = require('util.promisify')

const noErrorPromisifyShim: Function = (func: Function) => (...args: any[]) => new Promise(r => {
  func(...args, (...results) => r(...results))
})
const makeNoPromisify: Function = (): Function => {
  const nativePromisify = require('util').promisify
  if (nativePromisify && typeof nativePromisify === 'function') {
    return nativePromisify
  }
  return noErrorPromisifyShim
}
const noErrorPromisify: Function = makeNoPromisify()


export const readdir = promisify(fs.readdir)
export const mkdir = promisify(fs.mkdir)
export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const exists = noErrorPromisify(fs.exists)
export const existsSync = fs.existsSync
export const stat = promisify(fs.stat)
export const spawnSync = childProcess.spawnSync
export const exec = promisify(childProcess.exec)
export const fork = childProcess.fork

