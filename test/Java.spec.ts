import * as should from 'should'
import {Java} from '../src/Java'

describe('Java', () => {
  let java = new Java()
  it('should be a Singleton Class', () => {
    should(new Java()).be.equal(java)
  })

  describe('mavenClass', () => {
    it('should be an Array', () => {
      should(java.mavenClasspath).be.an.Array()
    })
    it('should contain h2database classpath', () => {
      should(java.mavenClasspath.filter(c => c.indexOf('h2database') !== -1).length)
        .be.equal(1)
    })
  })

  describe('mavenDependencies', () => {
    it('should be an Object', () => {
      should(java.mavenDependencies).be.an.Object()
    })
    it('should contain h2database dependency', () => {
      should(Object.keys(java.mavenDependencies).filter(c => c.indexOf('h2database') !== -1).length)
        .be.equal(1)
    })
  })
  
  describe('addOption', () => {
    it('should throw cuz jvm is already created', () => {
      should(() => java.addOption('anything')).throw()
    })
  })
  
  describe('addClasspath', () => {
    it('should throw cuz jvm is already created', () => {
      should(() => java.addClasspath(['anything'])).throw()
    })
  })
})
