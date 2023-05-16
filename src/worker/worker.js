import {WorkerModule} from './modules/main.js'

self.onmessage = (e)=>{
    console.log(WorkerModule['var'])
    self.postMessage(WorkerModule.uuidv4())
}