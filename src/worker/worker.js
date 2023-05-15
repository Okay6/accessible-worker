import WorkerModules from './modules/main.js'

self.onmessage = (e)=>{
    self.postMessage(WorkerModules.uuidv4())
}