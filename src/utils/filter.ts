
const pathFormat = (path: string): string => path.replace(/\\/g, '/')

const strEllipsis = (str: string, len: number): string => {
  if (str.length <= len) return str
  return `${str.substr(0, len)}...`
}

export default {
  path: pathFormat,
  strEllipsis,
}
