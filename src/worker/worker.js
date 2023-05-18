import {AccessibleWorkerModule} from './modules/accessible_worker_module.js'


self.onmessage = (e)=>{
    console.log(AccessibleWorkerModule['var'])
    self.postMessage(AccessibleWorkerModule.uuidv4())
}