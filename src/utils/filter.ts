import { TodoItem } from '../types'
import { DEFAULT_TODO_LEVEL_COLORS, DEFAULT_TODO_STATUS_GROUP, TIME_WARNING } from './constants'

export const path = (path: string): string => path.replace(/\\/g, '/')

export const strEllipsis = (str: string, len: number): string => {
  if (str.length <= len) return str
  return `${str.substr(0, len)}...`
}

export const strToTime = (str: string): number => {
  const timer = new Date()
  const d = timer.getDay()
  const h = timer.getHours()
  const m = timer.getMinutes()
  const s = timer.getSeconds()
  const getChildTime = (time: number) => ~~(time % 1 * 60)
  // is hour, not include text
  if (!Number.isNaN(+str)) {
    const next = +str + h
    timer.setHours(~~next)
    return timer.setMinutes(getChildTime(next) + m)
  }
  
  // is minute
  if (/m/.test(str)) {
    str = str.replace(/m/g, '')
    const next = Number(str) + m
    timer.setMinutes(~~next)
    timer.setSeconds(getChildTime(next) + s)
    return Number.isNaN(+str) ? 0 : +timer
  }
  
  // is day
  if (/d/.test(str)) {
    str = str.replace(/d/g, '')
    const next = +str + d
    timer.setDate(~~next)
    timer.setHours(getChildTime(next) + h)
    return Number.isNaN(+str) ? 0 : +timer
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

export const date = (time: number | string): string => {
  const d: Date = new Date(Number(time))
  if (!date || Number.isNaN(+d)) return null
  const dateArr: string[] = d.toLocaleString().split(' ')
  return `${dateArr[0].substr(5, 4)}/${dateArr[1].substr(0, 5)}`
}
