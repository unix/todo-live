import { TodoItemLeveL } from '../types'

export const DEFAULT_DATABASE = 'todo_list'

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
