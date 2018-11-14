type Attributes = Record<string, any>

export class HasAttributes {
  /**
   * Indicates whether attributes are snake cased on arrays.
   */
  static snakeAttributes: boolean = true
  /**
   * The cache of the mutated attributes for each class.
   */
  protected static mutatorCache: Attributes = {}
  /**
   * The model's attributes.
   */
  protected attributes: Attributes = {}
  /**
   * The model attribute's original state.
   */
  protected original: Attributes = {}
  /**
   * The changed model attributes.
   */
  protected changes: string[] = []
  /**
   * The attributes that should be cast to native types.
   */
  protected casts: string[] = []
  /**
   * The attributes that should be mutated to dates.
   */
  protected dates: string[] = []
  /**
   * The storage format of the model's date columns.
   */
  protected dateFormat: string
  /**
   * The accessors to append to the model's array form.
   */
  protected appends: string[] = []

  /**
   * Convert the model's attributes to an array.
   */
  attributesToArray() {
    //
  }

  /**
   * Get the model's relationships in array form.
   */
  relationsToArray() {
    //
  }

  /**
   * Get an attribute from the model.
   *
   * @param key Key
   */
  getAttribute(key: string) {
    //
  }

  /**
   * Get a plain attribute (not a relationship).
   *
   * @param key Key
   */
  getAttributeValue(key: string) {
    //
  }

  /**
   * Determine if a get mutator exists for an attribute.
   *
   * @param key Key
   */
  hasGetMutator(key: string) {
    //
  }

  /**
   * Set a given attribute on the model.
   *
   * @param key Key
   * @param value Value
   */
  setAttribute(key: string, value: any) {
    //
  }

  /**
   * Determine if a set mutator exists for an attribute.
   *
   * @param key Key
   */
  hasSetMutator(key: string) {
    //
  }

  /**
   * Set a given JSON attribute on the model.
   *
   * @param key Key
   * @param value Value
   */
  fillJsonAttribute(key: string, value: any) {
    //
  }

  /**
   * Add the date attributes to the attributes array.
   *
   * @param attributes Attributes
   */
  protected addDateAttributesToArray(attributes: Attributes) {
    //
  }

  /**
   * Add the mutated attributes to the attributes array.
   *
   * @param attributes Attributes
   * @param mutatedAttributes Mutated attributes
   */
  protected addMutatedAttributesToArray(
    attributes: Attributes,
    mutatedAttributes: Attributes
  ) {
    //
  }

  /**
   * Add the casted attributes to the attributes array.
   *
   * @param attributes Attributes
   * @param mutatedAttributes Mutated attributes
   */
  protected addCastAttributesToArray(
    attributes: Attributes,
    mutatedAttributes: Attributes
  ) {
    //
  }

  /**
   * Get an attribute array of all arrayable attributes.
   */
  protected getArrayableAttributes() {
    //
  }

  /**
   * Get all of the appendable values that are arrayable.
   */
  protected getArrayableAppends() {
    //
  }

  /**
   * Get an attribute array of all arrayable relations.
   */
  protected getArrayableRelations() {
    //
  }

  /**
   * Get an attribute array of all arrayable values.
   *
   * @param values Values
   */
  protected getArrayableItems(values: any[]) {
    //
  }

  /**
   * Get an attribute from the attributes array.
   *
   * @param key Key
   */
  protected getAttributeFromArray(key: string) {
    //
  }

  /**
   * Get a relationship.
   *
   * @param key Key
   */
  protected getRelationValue(key: string) {
    //
  }

  /**
   * Get a relationship value from a method.
   *
   * @param method Method
   */
  protected getRelationshipFromMethod(method: string) {
    //
  }

  /**
   * Get the value of an attribute using its mutator.
   *
   * @param key Key
   * @param value Value
   */
  protected mutateAttribute(key: string, value: any) {
    //
  }

  /**
   * Get the value of an attribute using its mutator for array conversion.
   *
   * @param key Key
   * @param value Value
   */
  protected mutateAttributeForArray(key: string, value: any) {
    //
  }

  /**
   * Cast an attribute to a native JavaScript type.
   *
   * @param key Key
   * @param value Value
   */
  protected castAttribute(key: string, value: any) {
    //
  }

  /**
   * Get the type of cast for a model attribute.
   *
   * @param key Key
   */
  protected getCastType(key: string) {
    //
  }

  /**
   * Determine if the cast type is a custom date time cast.
   *
   * @param cast Cast
   */
  protected isCustomDateTimeCast(cast: string) {
    //
  }

  /**
   * Determine if the cast type is a decimal cast.
   *
   * @param cast Cast
   */
  protected isDecimalCast(cast: string) {
    //
  }

  /**
   * Set the value of an attribute using its mutator.
   *
   * @param key Key
   * @param value Value
   */
  protected setMutatedAttributeValue(key: string, value: any) {
    //
  }

  /**
   * Determine if the given attribute is a date or date castable.
   *
   * @param key Key
   */
  protected isDateAttribute(key: string) {
    //
  }

  /**
   * Get an array attribute with the given key and value set.
   *
   * @param path Path
   * @param key Key
   * @param value Value
   */
  protected getArrayAttributeWithValue(path: string, key: string, value: any) {
    //
  }

  /**
   * Get an array attribute or return an empty array if it is not set.
   *
   * @param key Key
   */
  protected getArrayAttributeByKey(key: string) {
    //
  }

  /**
   * Cast the given attribute to JSON.
   *
   * @param key Key
   * @param value Value
   */
  protected castAttributeAsJson(key: string, value: any) {
    //
  }

  /**
   * Encode the given value as JSON.
   *
   * @param value Value
   */
  protected asJson(value: any) {
    //
  }

  /**
   * Decode the given JSON back into an array or object.
   *
   * @param value Value
   * @param asObject As object
   */
  protected fromJson(value: any, asObject: boolean = false) {
    //
  }
}
