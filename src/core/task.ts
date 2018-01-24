import { DEFAULT_DATABASE } from '../utils/constants'
import { Store } from '../utils/store'


export const removeAndRearrangeTask = async(id: string) => {
  const store = new Store(DEFAULT_DATABASE)
  
  await store.remove({ _id: id })
  const tasks = await store.findAll()
  await store.removeAll()
  await store.saveAll(tasks.map((t, i) => Object.assign(t, { index: i + 1 })))
}
