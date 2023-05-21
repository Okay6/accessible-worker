import {AccessibleWorkerModule} from './modules/accessible_worker_module.js'

self.a  = 1

self.onmessage = (e) => {
    console.log(AccessibleWorkerModule['var'])
    self.postMessage(AccessibleWorkerModule.uuidv4())
    console.log(self.a)
}