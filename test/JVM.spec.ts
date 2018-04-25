import {Java} from '../src/Java'
import {JDBC} from '../src/JDBC'

describe('JVM', () => {
    let java = new Java()
    it('should be created cuz other tests call a java instance', () => {
        java.isJvmCreated().should.be.true()
    })
})