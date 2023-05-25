import {AccessibleWorker, GlobalVariable, SubscribeMessage} from "./decorator/worker_definition";
import {AccessibleWorkerModule} from "./worker_module";
import * as experiment from "./experiment";
import * as AWT from "./accessible_worker_type_infer";

/******************************* Accessible Worker Demo **************************************/
// Define I/O events
type InputEvents = {
    COMBINE_MESSAGE: (name: { name: string }) => void
    DOUBLE_NUMBER: (a: number) => void
    RESERVE_STRING: (data: { str: string }) => void
}

type OutputEvents = {
    COMBINED_MESSAGE: (message: string) => void
    DOUBLED_NUMBER: (res: number) => void
    RESERVED_STRING: (res: { str: string }) => void
}

// Define Accessible Worker Description Class
@AccessibleWorker()
class MyAccessibleWorker extends experiment.ChannelWorkerDefinition<InputEvents, OutputEvents> {
    constructor() {
        super()
        this.prefix = 'Hi'
    }

    @GlobalVariable<string>()
    prefix: string = 'Hello'

    @SubscribeMessage<InputEvents>('COMBINE_MESSAGE')
    async combineMessage(data: AWT.InferParameterType<InputEvents, 'COMBINE_MESSAGE'>) {
        console.log(AccessibleWorkerModule.a + AccessibleWorkerModule.b)
        this.emit('COMBINED_MESSAGE', `${this.prefix} ${data.name}`)

    }

    @SubscribeMessage<InputEvents>('DOUBLE_NUMBER')
    async addNumber(data: AWT.InferParameterType<InputEvents, 'DOUBLE_NUMBER'>) {
        this.emit('DOUBLED_NUMBER', data * 2)
    }

    @SubscribeMessage<InputEvents>('RESERVE_STRING')
    async reserveString(data: AWT.InferParameterType<InputEvents, 'RESERVE_STRING'>) {
        const array = []
        for (let i = 0; i < data.str.length; i++) {
            array.push(data.str.at(i))
        }
        const domain = location.protocol + '//' + location.host + (location.port ? `:${location.port}` : '')
        fetch(`http://localhost:3000/accessible_worker_module.js`).then(res => {
            console.log('=========FETCH STATIC=======')
            console.log(res)
        })
        this.emit('RESERVED_STRING', {str: array.reverse().join('')})

    }

}

// Define function  set
const functionSet = {
    add: (a: number, b: number): number => {
        return a + b
    },
    sub: (a: number, b: number): Promise<number> => Promise.resolve(a - b),
    uuid: (): string => new Date().getTime().toString(),
    combine: (msg: string) => new Date().getTime().toString() + ' ' + msg,
    factorial: (num: number): number => new AccessibleWorkerModule.CalculateClass().factorial(num)
}
// register Channel Worker
const channelWorkerClient = experiment.AccessibleWorkerFactory.registerChannelWorker<InputEvents, OutputEvents>(MyAccessibleWorker)
// register Functional Worker
const functionalWorkerClient = experiment.AccessibleWorkerFactory.registerFunctionSet(functionSet)

// Use Functional Client
functionalWorkerClient.then(f => {
    f.sub(3, 1).then(res => {
        console.log(res)
    })
    f.add(1, 3).then(res => {
        console.log(res)
    })
    f.uuid().then(uuid => {
        console.log(uuid)
    })
    f.combine('lee').then(res => {
        console.log(res)
    })
    f.factorial(5).then(res => {
        console.log('=======Factorial Calculate========')
        console.log(res)
    })
    f.factorial(3).then(res=>{
        console.log(res === 6)
    })
})
// Use Channel Client
channelWorkerClient.then(client => {
    client.on('COMBINED_MESSAGE', (msg: string) => {
        console.log('====Combined Message====')
        console.log(msg)
    })
    client.on('DOUBLED_NUMBER', (res: number) => {
        console.log('========DOUBLE_NUMBER========')
        console.log(res)
    })
    client.on('RESERVED_STRING', res => {
        console.log('======RESERVED STRING======')
        console.log(res.str)
    })

    client.emit('COMBINE_MESSAGE', {name:'lee'})
    client.emit('COMBINE_MESSAGE', {name:'okay6'})
    client.emit('DOUBLE_NUMBER', 23)
    client.emit('RESERVE_STRING', {str: 'okay6'})

})
