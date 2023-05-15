import {uuidv4} from './modules/main.js'

self.onmessage = (e)=>{
    self.postMessage(uuidv4())
}