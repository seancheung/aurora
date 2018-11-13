import { expect } from 'chai'
import { Model } from './model'
import { getMixins } from './utils'

describe('model test', function() {
  it('expect model traits to work properlly', function() {
    class User extends Model {}
    const traits = getMixins(User)
    expect(traits)
      .to.be.an('array')
      .with.lengthOf(2)
    expect(User).to.have.property('unguard')
  })
})
