
export const path = (path: string): string => path.replace(/\\/g, '/')

export const strEllipsis = (str: string, len: number): string => {
  if (str.length <= len) return str
  return `${str.substr(0, len)}...`
}

export const strToTime = (str: string) => {
  // is hour, not include text
  if (!Number.isNaN(+str)) {
    const h = new Date().getHours()
    return new Date().setHours(+str + h)
  }
  
  // is minute
  if (/m/.test(str)) {
    str = str.replace(/m/g, '')
    const m = new Date().getMinutes()
    return Number.isNaN(+str) ? 0 : new Date().setMinutes(+str + m)
  }
  
  // is day
  if (/d/.test(str)) {
    str = str.replace(/d/g, '')
    const d = new Date().getDay()
    return Number.isNaN(+str) ? 0 : new Date().setDate(+str + d)
  }
  
  // wrong
  return 0
}
