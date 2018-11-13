import { HasEvents } from './mixins/hasEvents'
import { mixin } from './utils'

@mixin(HasEvents)
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
   * The connection resolver instance.
   */
  protected static resolver: any
  /**
   * The event dispatcher instance.
   */
  protected static dispatcher: any
  /**
   * The array of booted models.
   */
  protected static booted: any[] = []
  /**
   * The array of trait initializers that will be called on each new instance.
   */
  protected static traitInitializers: any[] = []
  /**
   * The array of global scopes on the model.
   */
  protected static globalScopes: any[] = []
  /**
   * The list of models classes that should not be affected with touch.
   */
  protected static ignoreOnTouch: Model[] = []

  /**
   * The "booting" method of the model.
   */
  protected static boot() {
    //
  }

  private static _this(e: Model): typeof Model {
    return e.constructor as any
  }
  /**
   * Indicates if the model exists.
   */
  exists: boolean = false
  /**
   * Indicates if the model was inserted during the current request lifecycle.
   */
  wasRecentlyCreated: boolean = false
  /**
   * The connection name for the model.
   */
  protected connection: string
  /**
   * The table associated with the model.
   */
  protected table: string
  /**
   * The primary key for the model.
   */
  protected primaryKey: string = 'id'
  /**
   * The "type" of the auto-incrementing ID.
   */
  protected keyType: string = 'int'
  /**
   * Indicates if the IDs are auto-incrementing.
   */
  protected incrementing: boolean = true
  /**
   * The relations to eager load on every query.
   */
  protected with: any[]
  /**
   * The relationship counts that should be eager loaded on every query.
   */
  protected withCount: number[]
  /**
   * The number of models to return for pagination.
   */
  protected perPage: number = 15

  /**
   * Create a new Eloquent model instance.
   *
   * @param attributes Attributes
   */
  constructor(attributes: string[]) {
    //
  }

  protected fireModelEvent(event: string, halt: boolean = true): boolean {
    throw new Error('not implemented')
  }

  /**
   * Check if the model needs to be booted and if so, do it.
   */
  protected bootIfNotBooted() {
    const ctor = this.constructor as typeof Model
    if (!ctor.booted.includes(ctor)) {
      ctor.booted.push(ctor)
      this.fireModelEvent('booting', false)
      ctor.boot()
      this.fireModelEvent('booted', false)
    }
  }
}
