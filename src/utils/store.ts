import { StoreBase, UserStore, FileKeyValue, StoreQuery } from './store.base'

export class Store extends StoreBase implements UserStore {
  
  constructor(database: string = 'test') {
    super(database)
  }
  
  async find(query: StoreQuery): Promise<any[]> {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return []
    const queryFilters: Function[] | null = this.parseQuery(query)
    
    if (!queryFilters) return contents
    return contents.filter(v => queryFilters.every(f => f(v)))
  }
  
  async update(query: StoreQuery, document: any) : Promise<any> {
    const doc = await this.findOne(query)
    if (!doc) return
    const next: any = Object.assign({}, doc, document)
    const list = await this.findAll()
    const nextList = list.map(item => item._id === next._id ? next : item)
    await this.setAll(nextList)
  }
  
  async remove(query: StoreQuery): Promise<void> {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return
    const queryFilters: Function[] | null = this.parseQuery(query)
    if (!queryFilters) return
  
    const nextContents = contents.map(v => queryFilters.every(f => f(v)) ? null : v)
      .filter(r => r)
    await this.setAll(nextContents)
  }
  
  async removeAll(): Promise<void> {
    await this.setAll([])
  }
  
  async findAll(): Promise<any> {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return []
    return contents
  }
  
  async count(): Promise<number> {
    return await this.countReg()
  }
  
  async findOne(query: StoreQuery): Promise<any> {
    const contents: FileKeyValue[] = await this.getFile()
    if (!contents || !contents.length) return {}
    const queryFilters: Function[] | null = this.parseQuery(query)
    if (!queryFilters) return contents[0]
    
    const val: any = contents.find(v => queryFilters.every(f => f(v)))
    return val || {}
  }
  
  async save(document: any = null): Promise<any> {
    if (!document) return
    if (!document._id) {
      document._id = Math.random().toString(16).slice(-12)
    }
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
      return v => v[key] && eval(`${v[key]} ${oper} ${queryVal[operKey]}`) // tslint:disable-line
    })
  }
  
}
