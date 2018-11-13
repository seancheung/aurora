// tslint:disable:ban-types

export class GuardsAttributes {
  /**
   * Disable all mass assignable restrictions.
   *
   * @param state State
   */
  static unguard(state: boolean = true) {
    this.unguarded = state
  }

  /**
   * Enable the mass assignment restrictions.
   */
  static reguard() {
    this.unguarded = false
  }

  /**
   * Determine if current state is "unguarded".
   */
  static isUnguarded() {
    return this.unguarded
  }

  /**
   * Run the given callable while being unguarded.
   *
   * @param callback Callback
   */
  static setUnguarded(callback: Function) {
    if (this.unguarded) {
      return callback.call(null)
    }

    this.unguard()

    try {
      callback.call(null)
    } finally {
      this.reguard()
    }
  }

  /**
   * Indicates if all mass assignment is enabled.
   */
  protected static unguarded: boolean = false

  /**
   * The attributes that are mass assignable.
   */
  protected fillable: string[] = []

  /**
   * The attributes that aren't mass assignable.
   */
  protected guarded: string[] = ['*']

  /**
   * Get the fillable attributes for the model
   */
  getFillable() {
    return this.fillable
  }

  /**
   * Set the fillable attributes for the model.
   *
   * @param fillable Fillable
   */
  setFillable(fillable: string[]): this {
    this.fillable = fillable
    return this
  }

  /**
   * Get the guarded attributes for the model.
   */
  getGuarded() {
    return this.guarded
  }

  /**
   * Set the guarded attributes for the model.
   *
   * @param guarded Guarded
   */
  guard(guarded: string[]): this {
    this.guarded = guarded
    return this
  }

  /**
   * Determine if the given attribute may be mass assigned.
   *
   * @param key Key
   */
  isFillable(key: string) {
    const ctor = this.constructor as typeof GuardsAttributes
    if (ctor.unguarded) {
      return true
    }
    // If the key is in the "fillable" array, we can of course assume that it's
    // a fillable attribute. Otherwise, we will check the guarded array when
    // we need to determine if the attribute is black-listed on the model.
    if (this.getFillable().includes(key)) {
      return true
    }

    // If the attribute is explicitly listed in the "guarded" array then we can
    // return false immediately. This means this attribute is definitely not
    // fillable and there is no point in going any further in this method.
    if (this.isGuarded(key)) {
      return false
    }

    return this.getFillable().length === 0 && !key.startsWith('_')
  }

  /**
   * Determine if the given key is guarded.
   *
   * @param key Key
   */
  isGuarded(key: string) {
    return this.getGuarded().includes(key) || this.getGuarded()[0] === '*'
  }

  /**
   * Determine if the model is totally guarded.
   */
  totallyGuarded() {
    return this.getFillable().length === 0 && this.getGuarded()[0] === '*'
  }

  /**
   * Get the fillable attributes of a given array.
   *
   * @param attributes Attributes
   */
  protected fillableFromArray(attributes: string[]) {
    const ctor = this.constructor as typeof GuardsAttributes
    const fillable = this.getFillable()
    if (fillable.length > 0 && !ctor.unguarded) {
      return attributes.filter(a => fillable.includes(a))
    }
    return attributes
  }
}
