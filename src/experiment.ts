import {
    AccessibleWorker,
    AccessibleWorkerFactoryConfig,
    GlobalVariable,
    MessageData,
    SubscribeMessage,
    WORKER_DEFINITION,
    WORKER_INITIAL_FUNC,
    WorkerConfig,
    WorkerDefinition,
    WorkThread
} from "./decorator/worker_definition";
import {
    buildFunctionalWorkerJs,
    buildGlobalFunctions,
    buildGlobalVariables,
    buildWorkerJs
} from "./template/accessible_worker";
/// <reference path = './decorator/beautify.min.d.ts' />
import * as jsBeautify from './decorator/beautify.min.js'

/**
 * An events map is an interface that maps event names to their value, which
 * represents the type of the `on` listener.
 */
export interface EventsMap {
    [key: string]: any
}

/**
 * The default events map, used if no EventsMap is given. Using this EventsMap
 * is equivalent to accepting all event names, and any data.
 */
export interface DefaultEventsMap {
    [key: string]: Func
}

/**
 * Returns a union type containing all the keys of an event map.
 */
export type EventNames<Map extends EventsMap> = keyof Map & (string | symbol);


/** The tuple type representing the parameters of an event listener */
export type EventParams<Map extends EventsMap,
    Ev extends EventNames<Map>> = Parameters<Map[Ev]>


/**
 * The event names that are either in ReservedEvents or in UserEvents
 */
export type UserEventNames<UserEvents extends EventsMap> = EventNames<UserEvents>;

/**
 * Type of a listener of a user event or a reserved event. If `Ev` is in
 * `ReservedEvents`, the reserved event listener is returned.
 */
export type UserListener<UserEvents extends EventsMap,
    Ev extends keyof UserEvents> = UserEvents[Ev]


/****************************************************/
/**
 * 1.如果本身就返回Promise类型，就不对其类型进行包装
 * 2.如果本身返回类型不是Promise，则使用Promise对返回类型进行包装
 */
type PromiseWrapper<Value> =
    Value extends Promise<any> ? Value : Promise<Value>;


type wrap<C, D extends Array<any>> = (...arg: D) => C extends Func ? PromiseWrapper<ReturnType<C>> : never


type Proxify<T> = {
    [P in keyof T]: wrap<T[P], T[P] extends Func ? Parameters<T[P]> : []>;
};


type Func = (...args: never[]) => never | void

export  type  FunctionSet = {
    [key: string | symbol]: Func
}


function proxify<T>(o: T): Proxify<T> {
    return o as unknown as Proxify<T>
}



/****************************************************/
export type  SubscribeCallBack<I> = {
    // eslint-disable-next-line functional/no-return-void
    readonly onData: (data: I) => void;
    // eslint-disable-next-line functional/no-return-void
    readonly onError: (error: never) => void;
}

export interface IChannelWorkerClient<ListenEvents extends EventsMap, EmitEvents extends EventsMap> {
    on<Ev extends UserEventNames<ListenEvents>>(ev: Ev, listener: UserListener<ListenEvents, Ev>): void;

    // Parameters 在 Web Storm 中 报错 Rest parameter must be an array type or a generic with array constraint，但编译通过，暂时忽略
    //noinspection all
    emit<Ev extends EventNames<EmitEvents>>(ev: Ev, ...args: EventParams<EmitEvents, Ev>): void;

}

/**
 * 将Function Set 映射为此类的实例并返回给用户进行操作
 */
class FunctionSetWorkerProxyClient<F extends FunctionSet> {
    threadPool = new Map<number, WorkThread>()
    private handlerQueue: Record<string, (...args: any) => void | any> = {}
    private readonly worker!: Worker

    getMaxHandlerIndex(): string {
        const allKeys: number[] = Object.keys(this.handlerQueue).map(it => Number.parseInt(it))
        if (allKeys.length === 0) {
            return '0'
        } else {
            let sorted = allKeys.sort()
            return String(sorted[sorted.length - 1] + 1)
        }
    }

    constructor(f: FunctionSet, workerSourceCode: string) {
        const workerBlob = new Blob([workerSourceCode], {type: "text/javascript"});
        const workerUrl = URL.createObjectURL(workerBlob);
        this.worker = new Worker(workerUrl)
        this.worker.onmessage = (e: MessageEvent<{ event: string; args: any, handlerIndex: string }>) => {
            const handler = this.handlerQueue[e.data.handlerIndex];
            handler.apply(handler, [e.data.args])
        }
        for (const k in f) {
            (this as unknown as FunctionSet)[k] = (...args) => {
                const handlerIndex = this.getMaxHandlerIndex()
                this.worker.postMessage({event: k, args: args, handlerIndex: handlerIndex})
                return new Promise<any>((resolve: (...args: any) => void | any) => {
                    this.handlerQueue[handlerIndex] = resolve
                })
            }
        }
    }
}

/**
 * Channel Worker Client，并不导出给User使用，对外只暴露IChannelWorkerClient接口
 * Channel Worker Client Web Worker 实例
 */

class ChannelWorkerClient<I extends EventsMap, O extends EventsMap> implements IChannelWorkerClient<I, O> {
    threadPool = new Map<number, WorkThread>();
    taskQueue: Array<keyof O> = []
    workerConfig!: WorkerConfig

    private worker!: Worker

    constructor(workerSourceCode: string) {
        const workerBlob = new Blob([workerSourceCode], {type: "text/javascript"});
        const workerUrl = URL.createObjectURL(workerBlob);
        this.worker = new Worker(workerUrl)
        this.worker.onmessage = (e: MessageEvent<{ event: string, args: any }>) => {
            const handler =  this.eventHandlerRecord[e.data.event];
            if(handler){
                handler.apply(handler, e.data.args)
            }
        }
    }

    private eventHandlerRecord: Record<string | symbol, Func> = {}

    on<Ev extends UserEventNames<I>>(ev: Ev, listener: UserListener<I, Ev>): void {
        this.eventHandlerRecord[ev] = listener
    }

    //noinspection all
    emit<Ev extends EventNames<O>>(ev: Ev, ...args: EventParams<O, Ev>): void {
        // 1. 查看threadPool 是否存在空闲线程
        // 2. 如果存在，直接使用空闲线程
        // 3. 如果不存在，查看WorkerConfig 的strategy，如果是PERFORMANCE，则创建新线程并提交任务
        // 如果的strategy为MEMORY_SAVE，则将任务放入taskQueue，等待空闲线程调度
        //
        this.worker.postMessage({event: ev, args: args})


    }


}

// eslint-disable-next-line functional/no-class
export abstract class ChannelWorkerDefinition<ListenEvents extends EventsMap,
    EmitEvents extends EventsMap> {
    constructor() {
        throw new Error('You should never init this class')

    }

    //noinspection all
    emit<Ev extends EventNames<EmitEvents>>(ev: Ev, ...args: EventParams<EmitEvents, Ev>): void {

    }

    terminalAll() {

    }

    // @Subscribe<'PRC_RESOLVE'>('PRC_RESOLVE')
    // customerEvent(@EventData data: { msg: string }) {
    //     /**
    //      * customer logic
    //      */
    //
    //     this.emit()
    // }

}


type InferParameterType<E extends EventsMap, K extends keyof EventsMap> =
    Parameters<E[K]> extends Array<any> ? Parameters<E[K]>[0] : never

/****************************************************************************/
interface InputEvents {
    COMBINE_MESSAGE: (name: string) => void
}

interface OutputEvents {
    COMBINED_MESSAGE: (message: string) => void

}

@AccessibleWorker()
class MyAccessibleWorker extends ChannelWorkerDefinition<InputEvents, OutputEvents> {
    constructor() {
        super()
    }

    @GlobalVariable<string>()
    prefix: string = 'Hello'

    @SubscribeMessage<InputEvents>('COMBINE_MESSAGE')
    async combineMessage(@MessageData() data: InferParameterType<InputEvents, 'CUSTOMER_TO_SERVER_EVENT'>) {
        this.emit('COMBINED_MESSAGE', `${this.prefix} ${data}`)

    }
}

/*****************************************************************************/
/**
 *  AccessibleWorkerFactory负责注册,  存储worker实例
 *  AccessibleWorkerFactory应为单例模式
 *  根使用类型作为参数获取Factory提供的实例进行使用
 *
 *
 */

/*****************************************************************************/
@AccessibleWorkerFactoryConfig({})
export class AccessibleWorkerFactory {
    /**
     * 根据ChannelWorkerDefinition构造Worker
     * @param _t
     */
    public static registerChannelWorker<I extends EventsMap, O extends EventsMap>(_t: new () => ChannelWorkerDefinition<I, O>): IChannelWorkerClient<O, I> {
        /**
         * 应该存储到存储结构中，后面使用fetch instance获取指定实例,
         *
         */
        const workerDefinition: WorkerDefinition = Reflect.getOwnMetadata(WORKER_DEFINITION, _t.prototype)

        const initialFunc = Reflect.getOwnMetadata(WORKER_INITIAL_FUNC, _t)
        let workerSourceCode: string = ''
        if (workerDefinition && initialFunc) {
            const globalVariables: string = buildGlobalVariables(workerDefinition.globalVariables)
            const globalFunctions: string = buildGlobalFunctions(workerDefinition.globalFunctions)
            workerSourceCode = buildWorkerJs(initialFunc, globalFunctions, globalVariables)
            workerSourceCode = jsBeautify.js_beautify(workerSourceCode, {preserve_newlines: false})

        }

        return new ChannelWorkerClient<O, I>(workerSourceCode);
    }

    /**
     * 将提供的Function Set注册到 AccessibleWorkerFactory 函数表
     *
     */

    public static registerFunctionSet<T extends FunctionSet>(funcSet: T, config?: {}): Proxify<T> {
        const functionRecord: Record<string, string> = {}
        for (const key of Object.keys(funcSet)) {
            const func = funcSet[key].toString().replace(/[^\.\[\]\(\)\{\};,&|]+(?=.AccessibleWorkerModule)\./g, '');
            functionRecord[key] = func
        }
        const globalFunctions = buildGlobalFunctions(functionRecord)
        let functionalWorkerCode = buildFunctionalWorkerJs(globalFunctions)
        functionalWorkerCode = jsBeautify.js_beautify(functionalWorkerCode, {preserve_newlines: false})
        /**
         * 该存储到存储结构中，后面使用fetch instance获取指定实例
         */
        const f = new FunctionSetWorkerProxyClient<T>(funcSet, functionalWorkerCode)

        // return proxify(funcSet)
        return f as Proxify<T>
    }

    public static getChannelWorkerClient<I extends EventsMap, O extends EventsMap>(_t: new () => ChannelWorkerDefinition<I, O>):
        IChannelWorkerClient<I, O> {
        return null as any
    }

    public static getWorkerEnabledFunctionSet<T extends FunctionSet>(funcSet: T): Proxify<T> {
        return null as any
    }

}

const funcs = {
    add: (a: number, b: number): number => {
        return a + b
    },
    sub: (a: number, b: number): Promise<number> => Promise.resolve(a - b)
}

const workerClient = AccessibleWorkerFactory.registerChannelWorker(MyAccessibleWorker)

const functionWorker = AccessibleWorkerFactory.registerFunctionSet(funcs)
functionWorker.sub(3, 1).then(res => {
    console.log(res)
})
functionWorker.add(1, 3).then(res => {
    console.log(res)
})
workerClient.on('COMBINED_MESSAGE', (msg: string) => {
    console.log('====Combined Message====')
    console.log(msg)
})
workerClient.emit('COMBINE_MESSAGE', 'lee')