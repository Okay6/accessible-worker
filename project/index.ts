/******************************* Accessible Worker Demo **************************************/
import {
    AccessibleWorker,
    AccessibleWorkerFactory,
    ChannelWorkerDefinition,
    GlobalVariable,
    InferParams,
    SubscribeMessage
} from "accessible-worker";
import {MyOwnModule} from "./worker_module";


// Define I/O events
type InputEvents = {
    COMBINE_MESSAGE: (name: { name: string }) => void
    DOUBLE_NUMBER: (a: number) => void
    RESERVE_STRING: (data: { str: string }) => void
    BEGIN_COUNT: () => void
    INIT_CANVAS: (params: { canvas: OffscreenCanvas, transfer: Transferable[] }) => void
    DRAW_RECT: (params: { width: number, height: number })=>void
}

type OutputEvents = {
    COMBINED_MESSAGE: (message: string) => void
    DOUBLED_NUMBER: (res: number) => void
    RESERVED_STRING: (res: { str: string }) => void
    SEND_COUNT: (count: number) => void
}

// Define Accessible Worker Description Class
@AccessibleWorker({
    module: {
        name: 'MyOwnModule',
        relativePath: 'accessible_worker_module'
    }
})
class MyAccessibleWorker extends ChannelWorkerDefinition<InputEvents, OutputEvents> {
    constructor() {
        super()
        this.prefix = 'Hi'
    }

    @GlobalVariable<string>()
    prefix: string = 'Hello'
    @GlobalVariable<number>()
    count = 0
    @GlobalVariable<any>()
    timer: any

    @GlobalVariable<OffscreenCanvas>()
    canvas!: OffscreenCanvas

    @SubscribeMessage<InputEvents>('COMBINE_MESSAGE')
    async combineMessage(data: InferParams<InputEvents, 'COMBINE_MESSAGE'>) {
        console.log(MyOwnModule.a + MyOwnModule.b)
        this.emit('COMBINED_MESSAGE', `${this.prefix} ${data.name}`)

    }

    @SubscribeMessage<InputEvents>('DOUBLE_NUMBER')
    async addNumber(data: InferParams<InputEvents, 'DOUBLE_NUMBER'>) {
        this.emit('DOUBLED_NUMBER', data * 2)
    }

    @SubscribeMessage<InputEvents>('RESERVE_STRING')
    async reserveString(data: InferParams<InputEvents, 'RESERVE_STRING'>) {
        const array = []
        for (let i = 0; i < data.str.length; i++) {
            array.push(data.str.at(i))
        }
        const domain = location.protocol + '//' + location.host + (location.port ? `:${location.port}` : '')
        console.log('======DOMAIN INNER WORKER=======')
        console.log(domain)
        fetch(`http://localhost:3000/accessible_worker_module.js`).then(res => {
            console.log('=========FETCH STATIC=======')
            console.log(res)
        })
        this.emit('RESERVED_STRING', {str: array.reverse().join('')})

    }

    @SubscribeMessage<InputEvents>('BEGIN_COUNT')
    async onCount() {
        clearInterval(this.timer)
        this.count = 0
        this.timer = setInterval(() => {
            this.count++
            this.emit('SEND_COUNT', this.count)
        }, 1000)

    }

    @SubscribeMessage<InputEvents>('INIT_CANVAS')
    async initCanvas(param: InferParams<InputEvents, 'INIT_CANVAS'>) {
        if (!this.canvas) {
            this.canvas = param.canvas
        }
    }

    @SubscribeMessage<InputEvents>('DRAW_RECT')
    async drawRect(param: InferParams<InputEvents, 'DRAW_RECT'>) {
        const _w = this.canvas.width
        this.canvas.width = _w
        const ctx = this.canvas.getContext('2d')
        if (ctx) {
            const _ctx = ctx as OffscreenCanvasRenderingContext2D
            _ctx.rect(20, 20, param.width, param.height);
            _ctx.fillStyle = 'red';
            _ctx.fill()
        }
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
    factorial: (num: number): number => new MyOwnModule.CalculateClass().factorial(num),
    getMsg: (): string => 'Accessible Worker &^<>^&',
    realUUID: () => MyOwnModule.uuid(),
    endsWith: (str: string, suffix: string) => MyOwnModule.endWith(str, suffix)
}
// register Channel Worker
const channelWorkerClient = AccessibleWorkerFactory.registerChannelWorker<InputEvents, OutputEvents>(MyAccessibleWorker)
// register Functional Worker
const functionalWorkerClient = AccessibleWorkerFactory
    .registerFunctionSet(functionSet,
        {
            module: {
                name: 'MyOwnModule',
                relativePath: 'accessible_worker_module'
            }
        })

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
    f.factorial(3).then(res => {
        console.log(res === 6)
    })
    f.getMsg().then(res => {
        console.log(res)
    })
    f.realUUID().then(uuid => {
        console.log(uuid)
    })
    f.endsWith('lee', 'e').then(res => {
        console.log('=====END WITH===')
        console.log(res ? 'YES' : 'NO')
    })


})
const begin = document.getElementById('begin-count') as HTMLButtonElement

const countP = document.getElementById('count') as HTMLParagraphElement
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const offscreenCanvas = canvas.transferControlToOffscreen()
const drawRect = document.getElementById('draw-rect') as HTMLButtonElement
const drawRec1 = document.getElementById('draw-rect1') as HTMLButtonElement
// Use Channel Client
channelWorkerClient.then(client => {
    if (begin) {
        begin.addEventListener('click', () => client.emit('BEGIN_COUNT'))
    }
    client.emit('INIT_CANVAS',{canvas: offscreenCanvas, transfer: [offscreenCanvas]})
    if (drawRect) {
        drawRect.onclick = () => {
            client.emit('DRAW_RECT', {width: 100, height: 100})
        }
    }
    if(drawRec1){
        drawRec1.onclick = () => {
            client.emit('DRAW_RECT', {width: 200, height: 200})
        }
    }

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
    client.on('SEND_COUNT', count => {
        if (countP) {
            countP.innerText = String(count)
        }
    })


    client.emit('COMBINE_MESSAGE', {name: 'lee'})
    client.emit('COMBINE_MESSAGE', {name: 'okay6'})
    client.emit('DOUBLE_NUMBER', 23)
    client.emit('RESERVE_STRING', {str: 'okay6'})

})
