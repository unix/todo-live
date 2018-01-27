import { DEFAULT_DATABASE, DEFAULT_TODO_STATUS_GROUP } from './utils/constants'
import { Store } from './utils/store'
import { TodoItem } from './types'

const store = new Store(DEFAULT_DATABASE)
const taskQueue = (task: TodoItem) => {
  const time = +task.cronTime - Date.now()
  const timer = setTimeout(() => {
    require('node-notifier').notify({
      title: `TODO (timeout): ${task.title}`,
      message: task.description || ' ',
    })
    if (task.script && typeof task.script === 'string' && task.script.length > 2) {
      require('child_process').execSync(task.script)
    }
    clearTimeout(timer)
  }, time)
}

;(async() => {
  const tasks: TodoItem[] = await store.findAll()
  if (!tasks || !tasks.length) return process.exit(1)
  const pass = (s: string) => s === DEFAULT_TODO_STATUS_GROUP.solving
  || s === DEFAULT_TODO_STATUS_GROUP.unsolved
  
  tasks.forEach(task => {
    if (!pass(task.status)) return
    if (!task.cronTime || (+task.cronTime < Date.now())) return
  
    taskQueue(task)
  })
  
})()





