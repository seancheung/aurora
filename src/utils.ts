// tslint:disable:ban-types

const MIXINS = Symbol()

/**
 * Apply a trait/mixin to a class
 *
 * @param trait Mixin trait to apply with
 */
export function mixin(trait: Function) {
  return (ctor: Function) => {
    if (!Reflect.has(ctor, MIXINS)) {
      Reflect.set(ctor, MIXINS, new Set())
    }
    const mixins: Set<Function> = Reflect.get(ctor, MIXINS)
    if (!mixins.has(trait)) {
      Object.getOwnPropertyNames(trait.prototype).forEach(name => {
        Reflect.set(ctor.prototype, name, Reflect.get(trait, name))
      })
      Object.getOwnPropertyNames(trait).forEach(name => {
        Reflect.set(ctor, name, Reflect.get(trait, name))
      })
      mixins.add(trait)
    }
  }
}

/**
 * Get mixins/traits applied to a class
 *
 * @param ctor Target class
 */
export function getMixins(ctor: Function): Function[] {
  const mixins: Set<Function> = Reflect.get(ctor, MIXINS)
  if (mixins) {
    return Array.from(mixins)
  }
  return []
}
