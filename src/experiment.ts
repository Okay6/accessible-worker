import hash from 'hash-it';

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


type Func = (...args) => any|void

export  type  FunctionSet = {
    [key: string | symbol]: Func
}

let funcs = {
    add: (a: number, b: number): number => a + b,
    sub: (a: number, b: number): Promise<number> => Promise.resolve(a - b)
}

function proxify<T>(o: T): Proxify<T> {
    return o as Proxify<T>
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

export interface IChannelWorkerClient<I, O> {
    subscribe(callBack: SubscribeCallBack<I>): void;

    send(data: O): void;
}

class ChannelWorkerClient<I, O> implements IChannelWorkerClient<I, O> {
    send(data: O): void {
        console.log(data)
    }

    subscribe(callBack: SubscribeCallBack<I>): void {
    }

}

type GetMyClassT<C extends ChannelWorkerDefinition<any, any>> = C extends ChannelWorkerDefinition<infer T, infer O> ? [T, O] : [never, never];


// eslint-disable-next-line functional/no-class
export abstract class ChannelWorkerDefinition<I, O> {

    constructor() {
        throw new Error('You should never init this class')
    }

    abstract onmessage(event: MessageEvent<I>): void

    protected postMessage(data: O): void {
        self.postMessage(data)
    }
}


class MyWorker extends ChannelWorkerDefinition<number, string> {

    onmessage(event: MessageEvent<number>): void {

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
    public static registerChannelWorker<I, O>(_t: new () => ChannelWorkerDefinition<I, O>): IChannelWorkerClient<O, I> {
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
    public static registerFunctionSet<T extends FunctionSet>(funcSet: T): Proxify<T> {
        /**
         * 该存储到存储结构中，后面使用fetch instance获取指定实例
         */
        console.log(hash(funcSet))
        return proxify(funcSet)
    }
}

const a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);
AccessibleWorkerFactory.registerFunctionSet(funcs)
AccessibleWorkerFactory.registerFunctionSet({
    go: () => console.log('go')
})
a.send(666)