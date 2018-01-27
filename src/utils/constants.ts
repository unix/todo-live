import { TodoItemLeveL } from '../types'

export const DEFAULT_DATABASE = 'todo_list'
export const ARCHIVE_DATABASE = 'todo_archive'
export const CRON_DATABASE = 'todo_cron'

export const enum DEFAULT_TODO_STATUS_GROUP {
  unsolved = 'unsolved',
  solving = 'solving',
  solved = 'solved',
  archived = 'archived',
  default = 'unsolved',
}

export const DEFAULT_TODO_LEVEL_GROUP: TodoItemLeveL[] = [
  'plan',
  'normal',
  'urgent',
  'instant',
]

export const DEFAULT_TODO_LEVEL: TodoItemLeveL = 'normal'

export const DEFAULT_TODO_LEVEL_COLORS = {
  plan: '#8F99AC',
  normal: '#EEF2F4',
  urgent: '#DC3C44',
  instant: '#C72A39',
}

export const TIME_WARNING: number = 1800000