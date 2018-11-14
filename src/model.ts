import Bluebird from 'bluebird'
import knex, { Config, QueryBuilder } from 'knex'

interface OrderBy {
  columnName: string
  direction?: string
}
interface Scope {
  where?: Record<string, any>
  select?: Record<string, string> | Array<string | [string, string]>
  orderBy?: OrderBy
  limit?: number
  offset?: number
  groupBy?: string[]
  distinct?: string[]
}
interface Resolver {
  connection(connection: string): Config
}
interface ModelClass<T = Model> {
  new (attributes?: Record<string, any>): T
}

export abstract class Model {
  /**
   * The name of the "created at" column.
   */
  static readonly CREATED_AT: string = 'created_at'

  /**
   * The name of the "updated at" column.
   */
  static readonly UPDATED_AT: string = 'updated_at'

  /**
   * Open connections
   */
  static readonly CONNS: Record<string, knex> = {}

  /**
   * Resolve a connection instance.
   *
   * @param connection Connection
   */
  static resolveConnection(connection: string) {
    if (!this.CONNS[connection]) {
      const config = this.resolver.connection(connection)
      this.CONNS[connection] = knex(config)
    }
    return this.CONNS[connection]
  }

  /**
   * Get all of the models from the database.
   *
   * @param columns
   */
  public static all<T extends Model>(
    this: ModelClass<T>,
    columns: string[] = ['*']
  ) {
    const ctor = this
    return new ctor().newModelQuery().all(columns)
  }

  /**
   * The connection resolver instance.
   */
  protected static resolver: Resolver
  /**
   * The event dispatcher instance.
   */
  protected static dispatcher: any
  /**
   * The array of global scopes on the model.
   */
  protected static globalScopes: Record<string, Scope> = {}
  /**
   * Indicates if the model exists.
   */
  $exists: boolean = false
  /**
   * Indicates if the model was inserted during the current request lifecycle.
   */
  $wasRecentlyCreated: boolean = false
  /**
   * The connection name for the model.
   */
  protected $connection: string
  /**
   * The table associated with the model.
   */
  protected $table: string
  /**
   * The primary key for the model.
   */
  protected $primaryKey: string = 'id'
  /**
   * The "type" of the auto-incrementing ID.
   */
  protected $keyType: string = 'int'
  /**
   * Indicates if the IDs are auto-incrementing.
   */
  protected $incrementing: boolean = true
  /**
   * The relations to eager load on every query.
   */
  protected $with: Function[]
  /**
   * The relationship counts that should be eager loaded on every query.
   */
  protected $withCount: number[]
  /**
   * The number of models to return for pagination.
   */
  protected $perPage: number = 15

  constructor(attributes?: Record<string, any>) {
    //
  }

  /**
   * Get the database connection for the model.
   */
  getConnection() {
    const ctor = this.constructor as typeof Model
    return ctor.resolveConnection(this.$connection)
  }

  /**
   * Create a new instance of the given model.
   *
   * @param attributes Attributes
   * @param exists Exists
   */
  newInstance(attributes: Record<string, any>, exists = false) {
    const ctor = this.constructor as ModelClass
    const model = new ctor(attributes)
    model.$exists = exists
    model.$connection = this.$connection
    model.$table = this.$table

    return model
  }

  /**
   * Get a new query builder that doesn't have any global scopes or eager loading.
   */
  newModelQuery<T extends Model>(this: T) {
    const query = this.getConnection()
    return new ModelQuery<T>(
      this.constructor as ModelClass<T>,
      query(this.$table)
    )
  }
}

export class ModelQuery<T extends Model> {
  protected type: ModelClass<T>
  protected builder: QueryBuilder
  constructor(type: ModelClass<T>, builder: QueryBuilder) {
    this.type = type
    this.builder = builder
  }

  all(columns: string[] = ['*']): Bluebird<T[]> {
    return this.builder.select(columns).map(this.create)
  }

  protected create(data: any) {
    return new this.type(data)
  }
}
