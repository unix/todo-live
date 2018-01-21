import { StoreBase, UserStore, FileKeyValue, StoreQuery } from './store.base'

export class Store extends StoreBase implements UserStore {
  
  constructor(database: string = 'test') {
    super(database)
  }
  
  async find(query: StoreQuery): any[] {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return []
    const queryFilters: Function[] | null = this.parseQuery(query)
    
    if (!queryFilters) return contents
    return contents.filter(v => queryFilters.every(f => f(v)))
  }
  
  async remove(query: StoreQuery): void {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return
    const queryFilters: Function[] | null = this.parseQuery(query)
    if (!queryFilters) return
  
    const nextContents = contents.map(v => queryFilters.every(f => f(v)) ? null : v)
      .filter(r => r)
    await this.setAll(nextContents)
  }
  
  async removeAll(): void {
    await this.setAll([])
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
    
    const val: any = contents.find(v => queryFilters.every(f => f(v)))
    return val || {}
  }
  
  async save(document: any = null): any {
    if (!document) return
    // always cover _id (not check the repeatability of _id)
    document._id = Math.random().toString(16).slice(-12)
    await this.setOne(document)
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
