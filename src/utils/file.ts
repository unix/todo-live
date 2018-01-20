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

export default {
  readdir: promisify(fs.readdir),
  mkdir: promisify(fs.mkdir),
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  exists: noErrorPromisify(fs.exists),
  stat: promisify(fs.stat),
  spawnSync: childProcess.spawnSync,
  exec: promisify(childProcess.exec),
}

