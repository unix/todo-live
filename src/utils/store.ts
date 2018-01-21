import { StoreBase, UserStore, FileKeyValue, StoreQuery } from './store.base'

export default class Store extends StoreBase implements UserStore {
  
  constructor(database: string) {
    super(database)
  }
  
  async find(query: StoreQuery): any[] {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return []
    const queryFilters: Function[] | null = this.parseQuery(query)
    if (!queryFilters) return contents
    return contents.filter(v => queryFilters(v))
  }
  
  async findAll(): any {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return []
    return contents
  }
  
  async findOne(query: StoreQuery): any {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return {}
    
    const queryFilters: Function[] | null = this.parseQuery(query)
    if (!queryFilters) return contents[0]
    
    const val: any = contents.find(v => queryFilters(v))
    return val || {}
  }
  
  async save(document: any = null): any {
    if (!document) return
    if (!document._id) {
      document._id = Math.random().toString(16).slice(-12)
    }
    await this.setFile(document)
  }
  
  private parseQuery(query: StoreQuery = {}): Function[] | null {
    const queryKeys: string[] = Object.keys(query)
    if (!queryKeys.length) return null
    let queryVal: any, type: string
    return queryKeys.map(key => {
      queryVal = query[key]
      type = typeof queryVal
      if (type !== 'object') return v => v[key] && v[key] === queryVal
      const operKey: string = Object.keys(queryVal || {})[0]
      const oper: string = StoreBase.queryOperator(operKey)
      return v => v[key] && eval(`${v[key]} ${oper} ${queryVal[operKey]}`)
    })
  }
  
}
