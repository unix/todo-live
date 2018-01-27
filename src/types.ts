
export type TodoItemLeveL = 'plan' | 'normal' | 'urgent' | 'instant'

export type TodoItemStatus = 'unsolved' | 'solving' | 'solved' | 'archived'

export type Note = {
  content: string,
  createAt: string,
}

export type TodoItem = {
  createAt: string,
  title: string,
  description?: string,
  level?: TodoItemLeveL,
  status: TodoItemStatus,
  notes?: Note[],
  _id?: string,
  cronTime?: number,
  scripts?: string,
  index: number,
}


export type TodoLiveStore = {
  todoList: TodoItem[],
}

export type Config = {
  pid?: number,
}
