import { TodoItem } from '../types'
import { DEFAULT_TODO_LEVEL_COLORS, DEFAULT_TODO_STATUS_GROUP, TIME_WARNING } from './constants'

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

export const colorOfTask = (task: TodoItem): string => {
  const notSolve = (s: string) => s === DEFAULT_TODO_STATUS_GROUP.solving
    || s === DEFAULT_TODO_STATUS_GROUP.unsolved
  if (!task.cronTime || !notSolve(task.status)) return DEFAULT_TODO_LEVEL_COLORS.normal
  
  const time = +task.cronTime - +new Date()
  if (time < 0) return DEFAULT_TODO_LEVEL_COLORS.instant
  if (time < TIME_WARNING) return DEFAULT_TODO_LEVEL_COLORS.urgent
  return DEFAULT_TODO_LEVEL_COLORS.normal
}

export const symbolOfTask = (task: TodoItem): string => {
  return task.status === DEFAULT_TODO_STATUS_GROUP.unsolved ? '⚬' : '●'
}
