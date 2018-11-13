// tslint:disable:ban-types

interface Dispatcher {
  listen(event: string, cla: Function, cb: Function): void
  forget(event: string, cla?: Function): void
}

export type ModelEvents =
  | 'retrieved'
  | 'creating'
  | 'created'
  | 'updating'
  | 'updated'
  | 'saving'
  | 'saved'
  | 'restoring'
  | 'restored'
  | 'deleting'
  | 'deleted'
  | 'forceDeleted'

export class HasEvents {
  static dispatcher?: Dispatcher
  /**
   * Register observers with the model.
   *
   * @param classes Classes to register
   */
  static observe(classes: Function | Function[]) {
    const instance = new this()

    if (!Array.isArray(classes)) {
      classes = [classes]
    }
    for (const cla of classes) {
      instance.registerObserver(cla)
    }
  }

  /**
   * Register a retrieved model event with the dispatcher.
   *
   * @param callback Callback
   */
  static retrieved(callback: Function) {
    this.registerModelEvent('retrieved', callback)
  }

  /**
   * Register a saving model event with the dispatcher.
   *
   * @param callback Callback
   */
  static saving(callback: Function) {
    this.registerModelEvent('saving', callback)
  }

  /**
   * Register a saved model event with the dispatcher.
   *
   * @param callback Callback
   */
  static saved(callback: Function) {
    this.registerModelEvent('saved', callback)
  }

  /**
   * Register an updating model event with the dispatcher.
   *
   * @param callback Callback
   */
  static updating(callback: Function) {
    this.registerModelEvent('updating', callback)
  }

  /**
   * Register an updated model event with the dispatcher.
   *
   * @param callback Callback
   */
  static updated(callback: Function) {
    this.registerModelEvent('updated', callback)
  }

  /**
   * Register a creating model event with the dispatcher.
   *
   * @param callback Callback
   */
  static creating(callback: Function) {
    this.registerModelEvent('creating', callback)
  }

  /**
   * Register a created model event with the dispatcher.
   *
   * @param callback Callback
   */
  static created(callback: Function) {
    this.registerModelEvent('created', callback)
  }

  /**
   * Register a deleting model event with the dispatcher.
   *
   * @param callback Callback
   */
  static deleting(callback: Function) {
    this.registerModelEvent('deleting', callback)
  }

  /**
   * Register a deleted model event with the dispatcher.
   *
   * @param callback Callback
   */
  static deleted(callback: Function) {
    this.registerModelEvent('deleted', callback)
  }

  /**
   * Remove all of the event listeners for the model.
   */
  static flushEventListeners() {
    const dispatcher = this.dispatcher
    if (!dispatcher) {
      return
    }
    const instance = new this()

    for (const event of instance.getObservableEvents()) {
      dispatcher.forget(event, this)
    }

    for (const event of instance.dispatchesEvents.values()) {
      dispatcher.forget(event)
    }
  }

  /**
   * Get the event dispatcher instance.
   */
  static getEventDispatcher() {
    return this.dispatcher
  }

  /**
   * Set the event dispatcher instance.
   *
   * @param dispatcher Dispatcher
   */
  static setEventDispatcher(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher
  }

  static unsetEventDispatcher() {
    this.dispatcher = null
  }

  /**
   * Register a model event with the dispatcher.
   *
   * @param event Event
   * @param callback Callback
   */
  protected static registerModelEvent(event: string, callback: Function) {
    const dispatcher = this.dispatcher
    if (dispatcher) {
      dispatcher.listen(event, this, callback)
    }
  }

  /**
   * The event map for the model.
   *
   * Allows for object-based events for native Eloquent events.
   */
  protected dispatchesEvents: Map<string, any> = new Map()

  /**
   * User exposed observable events.
   *
   * These are extra user-defined events observers may subscribe to.
   */
  protected observables: string[] = []

  /**
   * Get the observable event names.
   */
  getObservableEvents(): string[] {
    return [
      'retrieved',
      'creating',
      'created',
      'updating',
      'updated',
      'saving',
      'saved',
      'restoring',
      'restored',
      'deleting',
      'deleted',
      'forceDeleted'
    ].concat(this.observables)
  }

  /**
   * Set the observable event names.
   *
   * @param observables event names
   */
  setObservableEvents(observables: string[]): this {
    this.observables = observables
    return this
  }

  /**
   * Add an observable event name.
   *
   * @param observables event names
   */
  addObservableEvents(observables: string | string[]) {
    if (!Array.isArray(observables)) {
      observables = [observables]
    }
    this.observables = Array.from(new Set(this.observables.concat(observables)))
  }

  /**
   * Remove an observable event name.
   *
   * @param observables event names
   */
  removeObservableEvents(observables: string | string[]) {
    if (!Array.isArray(observables)) {
      observables = [observables]
    }
    this.observables = this.observables.filter(e => !observables.includes(e))
  }

  /**
   * Register a single observer with the model.
   *
   * @param cla
   */
  protected registerObserver(cla: Function) {
    // When registering a model observer, we will spin through the possible events
    // and determine if this observer has that method. If it does, we will hook
    // it into the model's event system, making it convenient to watch these.
    for (const event of this.getObservableEvents()) {
      if (Reflect.has(cla, event)) {
        (this.constructor as typeof HasEvents).registerModelEvent(
          event,
          Reflect.get(cla, event)
        )
      }
    }
  }

  /**
   * Fire the given event for the model.
   *
   * @param event Event
   * @param halt Halt
   */
  protected fireModelEvent(event: string, halt: boolean = true): boolean {
    const dispatcher = (this.constructor as typeof HasEvents).dispatcher
    if (!dispatcher) {
      return true
    }

    const method = halt ? 'until' : 'dispatch'

    const result = this.filterModelEventResults(
      this.fireCustomModelEvent(event, method)
    )

    if (result === false) {
      return false
    }

    return result
      ? result
      : Reflect.apply(Reflect.get(dispatcher, method), dispatcher, [
          event,
          this.constructor,
          this
        ])
  }

  /**
   * Fire a custom model event for the given event.
   *
   * @param event Event
   * @param method Method
   */
  protected fireCustomModelEvent(event: string, method: string) {
    if (!this.dispatchesEvents.has(event)) {
      return
    }
    const type: any = this.dispatchesEvents.get(event)
    const dispatcher = (this.constructor as typeof HasEvents).dispatcher
    const result = Reflect.apply(Reflect.get(dispatcher, method), dispatcher, [
      new type(this)
    ])
    if (result != null) {
      return result
    }
  }

  /**
   * Filter the model event results.
   *
   * @param result Result
   */
  protected filterModelEventResults(result: any) {
    if (Array.isArray(result)) {
      result = result.filter(r => r != null)
    }

    return result
  }
}
