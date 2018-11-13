// tslint:disable:ban-types

/**
 * Apply a trait/mixin to a class
 *
 * @param trait Mixin trait to apply with
 */
export function mixin(trait: Function) {
  return (ctor: Function) => {
    Object.getOwnPropertyNames(trait.prototype).forEach(name => {
      ctor.prototype[name] = trait.prototype[name]
    })
  }
}
