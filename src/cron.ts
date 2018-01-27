import * as notifier from 'node-notifier'
import { DEFAULT_DATABASE, DEFAULT_TODO_STATUS_GROUP } from './utils/constants'
import { Store } from './utils/store'
import { TodoItem } from './types'

const store = new Store(DEFAULT_DATABASE)
const taskQueue = (task: TodoItem) => {
  const time = +task.cronTime - Date.now()
  const timer = setTimeout(() => {
    notifier.notify({
      title: `TODO (timeout): ${task.title}`,
      message: task.description || '',
    })
    store.update({ _id: task._id }, Object.assign({}, task, { cronTime: null }))
    .then()
    clearTimeout(timer)
  }, time)
}

;(async() => {
  const tasks: TodoItem[] = await store.findAll()
  if (!tasks || !tasks.length) return
  const pass = (s: string) => s === DEFAULT_TODO_STATUS_GROUP.solving
  || s === DEFAULT_TODO_STATUS_GROUP.unsolved
  tasks.forEach(task => {
    if (!pass(task.status)) return
    if (!task.cronTime || +task.cronTime < +new Date()) return
    taskQueue(task)
  })
  
})()





