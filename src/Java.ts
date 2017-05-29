import * as Promise from 'bluebird'
import * as j from 'java'
import * as mvn from 'node-java-maven'
import * as deasync from 'deasync'

import {EventEmitter} from 'events'

declare module 'java' {
  export interface NodeAPI {
    callStaticMethodAsync (className: string, methodName: string, ...args: any[]): Promise<any>
  }
}

const java: j.NodeAPI = Promise.promisifyAll(j) as j.NodeAPI

let instance: Java = null

export class Java {
  public java: j.NodeAPI
  public events: EventEmitter

  public mavenClasspath: string[] = []
  public mavenDependencies: {} = {}

  constructor (useXrs: boolean = true, useMaven: boolean = true) {
    if (!instance) {
      instance = this
    }

    this.java = java
    this.events = new EventEmitter()

    if (useXrs) {
      this.addOption('-Xrs')
    }

    if (useMaven) {
      try {
        let done: boolean = false
        mvn((err: Error, deps) => {
          if (err) throw err
          this.mavenClasspath = deps.classpath
          this.mavenDependencies = deps.dependencies
          done = true
        })
        deasync.loopWhile(() => !done)
        this.addClasspath(this.mavenClasspath)
      } catch (err) {
        throw err
      }
    }

    return instance
  }

  static getInstance (): Java {
    if (!instance) {
      instance = new Java()
    }
    return instance
  }

  isJvmCreated (): boolean {
    return this.java.isJvmCreated()
  }

  addOption (option: string) {
    if (this.isJvmCreated() === false) {
      this.java.options.push(option)
    } else {
      throw new Error(`Can not add option '${option}', because JVM instance is already created`)
    }
  }

  addClasspath (dependencies: string[]) {
    if (this.isJvmCreated() === false) {
      this.java.classpath.push.apply(this.java.classpath, dependencies)
    } else {
      throw new Error(`Can not add classpath dependencies, because JVM instance is already created.\n\nDependencies: ${dependencies}`)
    }
  }
}
