import hash from 'hash-it';
import {
    AccessibleWorker,
    AsyncMethodDecorator,
    PrimaryKey,
    TestMethodDecorator,
    WorkerMethodParam
} from "./decorator/wroker_definition";

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

let funcs = {
    add: (a: number, b: number): number => a + b,
    sub: (a: number, b: number): Promise<number> => Promise.resolve(a - b)
}

function proxify<T>(o: T): Proxify<T> {
    return o as unknown as Proxify<T>
}


let b = proxify(funcs)
// b.add(1, 2).then(res => console.log(res))
// b.sub(1, 2).then(r => r)
// b.add(2, 7).then(res => console.log(res))
console.log(b.add(1, 2))
console.log(b.sub(1, 2))
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

    say(msg:string):void;
}

/**
 * 将Function Set 映射为此类的实例并返回给用户进行操作
 */
class FunctionSetWorkerProxy {
    constructor(f: FunctionSet) {
        for (const k in f) {
            const e: Function = f[k] as Function;
            (this as unknown as FunctionSet)[k] = (...args) => {
                const res = e.call(e, ...args)
                return Promise.resolve(res)
            }
        }
    }
}

/**
 * Channel Worker Client，并不导出给User使用，对外只暴露IChannelWorkerClient接口
 * Channel Worker Client Web Worker 实例
 */
class ChannelWorkerClient<I extends EventsMap, O extends EventsMap> implements IChannelWorkerClient<I, O> {

    on<Ev extends UserEventNames<I>>(ev: Ev, listener: UserListener<I, Ev>): void {

    }

    //noinspection all
    emit<Ev extends EventNames<O>>(ev: Ev, ...args: EventParams<O, Ev>): void {

        console.log('=====EMIT=====', args)

    }

    @TestMethodDecorator()
    say(@WorkerMethodParam() msg:string){
        console.log(msg)

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

    // @Subscribe<'PRC_RESOLVE'>('PRC_RESOLVE')
    // customerEvent(@EventData data: { msg: string }) {
    //     /**
    //      * customer logic
    //      */
    //
    //     this.emit()
    // }

}


interface InputEvents {
    CUSTOMER_TO_SERVER_EVENT: (a: string) => void
}

interface OutputEvents {
    CUSTOMER_TO_CLIENT_EVENT: ( a: string) => void
}


@AccessibleWorker()
class MyWorker extends ChannelWorkerDefinition<InputEvents, OutputEvents> {

    @PrimaryKey()
    say = 'ss'
    @AsyncMethodDecorator()
    h(@WorkerMethodParam() s:number):Promise<number>{
       return Promise.resolve(1)
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
        console.log(hash(_t))
        return new ChannelWorkerClient<O, I>();
    }

    /**
     * 将提供的Function Set注册到 AccessibleWorkerFactory 函数表
     *
     */

    public static registerFunctionSet<T extends FunctionSet>( funcSet: T): Proxify<T> {
        /**
         * 该存储到存储结构中，后面使用fetch instance获取指定实例
         */
        console.log(hash(funcSet))
        const f = new FunctionSetWorkerProxy(funcSet)

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

const a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);
AccessibleWorkerFactory.registerFunctionSet(funcs)
const c = AccessibleWorkerFactory.registerFunctionSet({
    go: async () => console.log('go'),
    show: (msg: string): void => console.log(msg),
    add: (a: number, b: number): number => a + b
})
c.go().then()
c.show('HH').then()
c.add(100, 200).then(r => console.log('====calculate result====', r))
a.emit<'CUSTOMER_TO_SERVER_EVENT'>('CUSTOMER_TO_SERVER_EVENT', 'Message come from client . . .')
a.on<'CUSTOMER_TO_CLIENT_EVENT'>('CUSTOMER_TO_CLIENT_EVENT', (res: string) => {

})
