import * as notifier from 'node-notifier'
import { DEFAULT_DATABASE, DEFAULT_TODO_STATUS_GROUP } from './utils/constants'
import { Store } from './utils/store'
import { TodoItem } from './types'

const store = new Store(DEFAULT_DATABASE)
const taskQueue = (task: TodoItem) => {
  const time = +new Date() - (+task.cronTime)
  const timer = setTimeout(() => {
    store.update({ _id: task._id }, Object.assign({}, task, { cronTime: 0 }))
    .then(() => {
      notifier.notify({
        title: `TODO: ${task.title}`,
        message: task.description || '',
      })
      clearTimeout(timer)
    })
    .catch(() => {
      clearTimeout(timer)
    })
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





