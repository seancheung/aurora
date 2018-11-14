// tslint:disable:ban-types

import { GuardsAttributes, HasAttributes, HasEvents } from './concerns'
import { getMixins, mixin } from './utils'

@mixin(HasEvents)
@mixin(GuardsAttributes)
@mixin(HasAttributes)
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
   * Clear the list of booted models so they will be re-booted.
   */
  static clearBootedModels() {
    this.booted = []
    this.globalScopes = []
  }

  /**
   * Disables relationship model touching for the current class during given callback scope.
   *
   * @param callback Callback
   */
  static withoutTouching(callback: Function) {
    this.withoutTouchingOn([this], callback)
  }

  /**
   * Disables relationship model touching for the given model classes during given callback scope.
   *
   * @param models Models
   * @param callback Callback
   */
  static withoutTouchingOn(models: Function[], callback: Function) {
    const array = this.ignoreOnTouch
    this.ignoreOnTouch = array.concat(models)

    try {
      callback.call(null)
    } finally {
      this.ignoreOnTouch = array
    }
  }

  /**
   * Determine if the given model is ignoring touches.
   *
   * @param cla Class
   */
  static isIgnoringTouch(cla?: Function) {
    cla = cla || this
    for (const ignore of this.ignoreOnTouch) {
      if (cla === ignore || cla instanceof ignore) {
        return true
      }
    }
    return false
  }

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
  protected static booted: Function[] = []

  /**
   * The array of trait initializers that will be called on each new instance.
   */
  protected static traitInitializers: Map<Function, Set<string>> = new Map()

  /**
   * The array of global scopes on the model.
   */
  protected static globalScopes: any[] = []

  /**
   * The list of models classes that should not be affected with touch.
   */
  protected static ignoreOnTouch: Function[] = []

  /**
   * The "booting" method of the model.
   */
  protected static boot() {
    this.bootTraits()
  }

  /**
   * Boot all of the bootable traits on the model.
   */
  protected static bootTraits() {
    const booted: string[] = []
    const inits: Set<string> = new Set()
    this.traitInitializers.set(this, inits)
    const traits = getMixins(this)
    for (const trait of traits) {
      let method = `boot${trait.name}`
      if (Reflect.has(this, method) && !booted.includes(method)) {
        Reflect.apply(Reflect.get(this, method), this, [])
        booted.push(method)
      }
      method = `initialize${trait.name}`
      if (Reflect.has(this, method)) {
        inits.add(method)
      }
    }
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
  constructor(attributes: Record<string, any>) {
    this.bootIfNotBooted()
    this.initializeTraits()
    this.syncOriginal()
    this.fill(attributes)
  }

  protected fireModelEvent(event: string, halt?: boolean): boolean {
    throw new Error('Method not implemented.')
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

  /**
   * Initialize any initializable traits on the model.
   */
  protected initializeTraits() {
    const ctor = this.constructor as typeof Model
    const inits = ctor.traitInitializers.get(ctor)
    for (const method of inits) {
      Reflect.apply(Reflect.get(this, method), this, [])
    }
  }

  protected syncOriginal() {
    // TODO:
  }

  protected fillableFromArray(attributes: string[]): string[] {
    throw new Error('Method not implemented.')
  }

  /**
   * Fill the model with an array of attributes.
   *
   * @param attributes Attributes
   */
  protected fill(attributes: Record<string, any>) {
    const totallyGuarded = ((this as any) as GuardsAttributes).totallyGuarded()
    for (let key of this.fillableFromArray(Object.keys(attributes))) {
      key = this.removeTableFromKey(key)
      if (((this as any) as GuardsAttributes).isFillable(key)) {
        ((this as any) as HasAttributes).setAttribute(key, attributes[key])
      } else if (totallyGuarded) {
        throw new Error(
          'Add [%s] to fillable property to allow mass assignment on [%s].'
        )
      }
    }
    return this
  }

  /**
   * Remove the table name from a given key.
   *
   * @param key Key
   */
  protected removeTableFromKey(key: string) {
    return /\./.test(key) ? key.replace(/.+\.([^.]+)$/, '$1') : key
  }
}
