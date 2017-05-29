import {Java} from '../src/Java'

describe('Java', () => {
  let java = new Java()
  it('should be a Singleton Class', () => {
    (new Java()).should.be.eql(java)
  })

  describe('mavenClass', () => {
    it('should be an Array', () => {
      java.mavenClasspath.should.be.an.Array()
    })
    it('should contain h2database classpath', () => {
      java.mavenClasspath.filter(c => c.indexOf('h2database') !== -1).length.should.be.eql(1)
    })
  })

  describe('mavenDependencies', () => {
    it('should be an Object', () => {
      java.mavenDependencies.should.be.an.Object()
    })
    it('should contain h2database dependency', () => {
      Object.keys(java.mavenDependencies).filter(c => c.indexOf('h2database') !== -1).length.should.be.eql(1)
    })
  })
})
