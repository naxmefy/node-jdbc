import * as Promise from 'bluebird'
import * as j from 'java'
import * as mvn from 'node-java-maven'
import * as sync from 'synchronize'

import { EventEmitter } from 'events'

declare module 'java' {
  export interface NodeAPI {
    callStaticMethodAsync(className: string, methodName: string, ...args: any[]): Promise<any>
  }
}

const java: j.NodeAPI = <j.NodeAPI>Promise.promisifyAll(j)

let instance: Java = null

export class Java {
  public java: j.NodeAPI
  public events: EventEmitter

  constructor(useXrs: boolean = true, useMaven: boolean = true) {
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
        const mvnDependencies: string[] = sync.await(mvn(sync.defer()))
        this.addClasspath(mvnDependencies)
      } catch (err) {
        throw err
      }
    }

    return instance
  }

  isJvmCreated(): boolean {
    return this.java.isJvmCreated()
  }

  addOption(option: string) {
    if (this.isJvmCreated() === false) {
      this.java.options.push(option)
    } else {
      throw new Error(`Can not add option '${option}', because JVM instance is already created`)
    }
  }

  addClasspath(dependencies: string[]) {
    if (this.isJvmCreated() === false) {
      this.java.classpath.push.apply(this.java.classpath, dependencies)
    } else {
      throw new Error(`Can not add classpath dependencies, because JVM instance is already created.\n\nDependencies: ${dependencies}`)
    }
  }

  static getInstance(): Java {
    return instance
  }
}
