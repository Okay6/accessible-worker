import {
    WORKER_DEFINITION,
    WORKER_INITIAL_FUNC,
    WORKER_REGISTER_PARAMS,
    WorkerConfig,
    WorkerDefinition,
    WorkerRegisterParams,
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
export type EventsMap = {
    [key: string]: (arg: any) => void
}

/**
 * The default events map, used if no EventsMap is given. Using this EventsMap
 * is equivalent to accepting all event names, and any data.
 */
export interface DefaultEventsMap {
    [key: string]: PureFunction
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
export type PromiseWrapper<Value> =
    Value extends Promise<any> ? Value : Promise<Value>;


export type WrapToPromise<C, D extends Array<any>> = (...arg: D) => C extends PureFunction ? PromiseWrapper<ReturnType<C>> : never


export type Proxify<T extends FunctionSet> = {
    [P in keyof T]: WrapToPromise<T[P], T[P] extends PureFunction ? Parameters<T[P]> : []>;
};


export type PureFunction = (...args: never[]) => never | void

export  type  FunctionSet = {
    [key: string | symbol]: PureFunction
}
export type InferParams<E extends EventsMap, K extends keyof EventsMap> =
    Parameters<E[K]> extends Array<any> ? Parameters<E[K]>[0] : never



export interface IChannelWorkerClient<ListenEvents extends EventsMap, EmitEvents extends EventsMap> {
    on<Ev extends UserEventNames<ListenEvents>>(ev: Ev, listener: UserListener<ListenEvents, Ev>): void;

    // Parameters 在 Web Storm 中 报错 Rest parameter must be an array type or a generic with array constraint，但编译通过，暂时忽略
    //noinspection all
    emit<Ev extends EventNames<EmitEvents>>(ev: Ev, ...arg: EventParams<EmitEvents, Ev>): void;

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
        this.worker = new Worker(workerUrl, {type: "module"})
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
        this.worker = new Worker(workerUrl, {type: "module"})
        this.worker.onmessage = (e: MessageEvent<{ event: string, args: any }>) => {
            const handler = this.eventHandlerRecord[e.data.event];
            if (handler) {
                handler.apply(handler, e.data.args)
            }
        }
    }

    private eventHandlerRecord: Record<string | symbol, PureFunction> = {}

    on<Ev extends UserEventNames<I>>(ev: Ev, listener: UserListener<I, Ev>): void {
        this.eventHandlerRecord[ev] = listener
    }

    //noinspection all
    emit<Ev extends EventNames<O>>(ev: Ev, ...arg: EventParams<O, Ev>): void {
        this.worker.postMessage({event: ev, args: arg})
    }

}

// eslint-disable-next-line functional/no-class
export abstract class ChannelWorkerDefinition<ListenEvents extends EventsMap,
    EmitEvents extends EventsMap> {
    constructor() {
        throw new Error('You should never init this class')

    }

    //noinspection all
    emit<Ev extends EventNames<EmitEvents>>(ev: Ev, ...arg: EventParams<EmitEvents, Ev>): void {

    }
}


/*****************************************************************************/
export class AccessibleWorkerFactory {
    private constructor() {
    }
    /**
     * 根据ChannelWorkerDefinition构造Worker
     * @param _t
     */
    public static registerChannelWorker<I extends EventsMap, O extends EventsMap>(_t: new () => ChannelWorkerDefinition<I, O>): Promise<IChannelWorkerClient<O, I>> {
        /**
         * 应该存储到存储结构中，后面使用fetch instance获取指定实例,
         *
         */
        const workerDefinition: WorkerDefinition = Reflect.getOwnMetadata(WORKER_DEFINITION, _t.prototype)
        const workerRegisterParams: WorkerRegisterParams = Reflect.getOwnMetadata(WORKER_REGISTER_PARAMS, _t)

        let initialFunc = Reflect.getOwnMetadata(WORKER_INITIAL_FUNC, _t)
        let workerSourceCode: string = ''
        if (workerDefinition && initialFunc) {
            const globalVariables: string = buildGlobalVariables(workerDefinition.globalVariables)
            let globalFunctions: string = buildGlobalFunctions(workerDefinition.globalFunctions)
            if (workerRegisterParams.module) {
                const r = new RegExp(`[\\d\\w]+(?=.${workerRegisterParams.module.name})\\.`, 'g')
                globalFunctions = globalFunctions.replace(r, '')
                initialFunc = initialFunc.replace(r, '')
            }
            workerSourceCode = buildWorkerJs(initialFunc, globalFunctions, globalVariables)
            workerSourceCode = jsBeautify.js_beautify(workerSourceCode, {preserve_newlines: false})

        }
        let resolveFunc: (arg: IChannelWorkerClient<O, I>) => void = () => {
        };
        // return proxify(funcSet)
        const p = new Promise<IChannelWorkerClient<O, I>>((resolve => {
            resolveFunc = resolve
        }))

        if (workerRegisterParams && workerRegisterParams.module) {
            fetch(`/${workerRegisterParams.module.relativePath}.js`).then(moduleSource => {
                if (moduleSource.ok) {
                    moduleSource.text().then(source => {
                        let replaceName: string = 'None';
                        const r = new RegExp(`(?<=export\\s{0,}\\{\\s{0,})[\\w_]+(?=\\s{0,}as\\s{0,}${workerRegisterParams.module?.name}\\s{0,}\\})`, 'g')
                        const exportName = source.match(r);
                        if (exportName && exportName.length > 0) {
                            replaceName = exportName[0]
                            const replaceExport = new RegExp(`export\\s*\\{\\s*[\\w_]+\\sas\\s${workerRegisterParams.module?.name}\\s*\\};*`,'g');
                            source = source.replace(replaceExport,'')
                        }

                        const accessibleModule = source + '\n' + `var ${workerRegisterParams.module?.name} = ${replaceName}`


                        const client = new ChannelWorkerClient<O, I>(accessibleModule + '\n' + workerSourceCode);

                        resolveFunc(client)

                    })
                } else {
                    return Promise.reject({
                        status: moduleSource.status,
                        statusText: moduleSource.statusText
                    })
                }
            }).catch(err => {
                throw new Error(`Accessible Worker register error when fetching module:${JSON.stringify(workerRegisterParams.module)}|${JSON.stringify(err)}`)
            })
            return p
        } else {
            const client = new ChannelWorkerClient<O, I>(workerSourceCode);
            return Promise.resolve<IChannelWorkerClient<O, I>>(client)
        }

    }

    /**
     * 将提供的Function Set注册到 AccessibleWorkerFactory 函数表
     *
     */

    public static registerFunctionSet<T extends FunctionSet>(funcSet: T, workerRegisterParams?: WorkerRegisterParams): Promise<Proxify<T>> {
        const functionRecord: Record<string, string> = {}
        for (const key of Object.keys(funcSet)) {
            let func = funcSet[key].toString()
            if (workerRegisterParams && workerRegisterParams.module) {
                const r = new RegExp(`[\\d\\w]+(?=.${workerRegisterParams.module.name})\\.`, 'g')
                func = func.replace(r, '')
            }
            functionRecord[key] = func
        }
        const globalFunctions = buildGlobalFunctions(functionRecord)
        let functionalWorkerCode = buildFunctionalWorkerJs(globalFunctions)
        functionalWorkerCode = jsBeautify.js_beautify(functionalWorkerCode, {preserve_newlines: false})
        let resolveFunc: (arg: Proxify<T>) => void = () => {
        };
        /**
         * 该存储到存储结构中，后面使用fetch instance获取指定实例
         */
        const p = new Promise<Proxify<T>>((resolve => {
            resolveFunc = resolve
        }))

        if (workerRegisterParams && workerRegisterParams.module) {
            fetch(`/${workerRegisterParams.module.relativePath}.js`).then(moduleSource => {
                moduleSource.text().then(source => {
                    let replaceName: string = 'None';
                    const r = new RegExp(`(?<=export\\s{0,}\\{\\s{0,})[\\w_]+(?=\\s{0,}as\\s{0,}${workerRegisterParams.module?.name}\\s{0,}\\})`, 'g')
                    const exportName = source.match(r);
                    if (exportName && exportName.length > 0) {
                        replaceName = exportName[0]
                        const replaceExport = new RegExp(`export\\s*\\{\\s*[\\w_]+\\sas\\s${workerRegisterParams.module?.name}\\s*\\};*`,'g');
                        source = source.replace(replaceExport,'')
                    }
                    const accessibleModule = source + '\n' + `var ${workerRegisterParams.module?.name} = ${replaceName}`

                    const f = new FunctionSetWorkerProxyClient<T>(funcSet, accessibleModule + '\n' + functionalWorkerCode)
                    resolveFunc(f as Proxify<T>)

                })
            })

            return p
        } else {
            const f = new FunctionSetWorkerProxyClient<T>(funcSet, functionalWorkerCode)

            return Promise.resolve<Proxify<T>>(f as Proxify<T>)
        }
    }

    public static getChannelWorkerClient<I extends EventsMap, O extends EventsMap>(_t: new () => ChannelWorkerDefinition<I, O>):
        IChannelWorkerClient<I, O> {
        return null as any
    }

    public static getWorkerEnabledFunctionSet<T extends FunctionSet>(funcSet: T): Proxify<T> {
        return null as any
    }

}
