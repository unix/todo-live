import File from './file'
import Filter from './filter'

export type FindExp = {
  [key: string]: string,
}

export interface UserStore {
  find: (key: any) => any[],
  findOne: (key) => any,
  findAll: () => any[],
  save: (key: string, value: any) => void,
}

export class StoreBase {
  
  readonly root: string = Filter.path(`${__dirname}../../.storage`)
  private database: string = 'todo'
  private url: string
  
  static CheckWorkEnv(root: string): void {
    !File.exists(root) && File.spawnSync('mkdir', [root])
  }
  
  constructor(database: string) {
    StoreBase.CheckWorkEnv(this.root)
    this.use(database)
  }
  
  protected use(database: string): StoreBase {
    this.database = database
    this.init()
    return this
  }
  
  private init(): void {
    const path = Filter.path(`${this.root}/${this.database}.json`)
    if (File.exists(path)) return (this.url = path)
    File.spawnSync('touch', [path])
    this.url = path
  }
  
}
