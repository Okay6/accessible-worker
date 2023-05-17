/****************************************************/
type PromiseWrapper<Value> =
    Value extends Promise<any> ? Value : Promise<Value>;


type wrap<C, D> = (...arg: D extends Array<any> ? D: never) => C extends Func ? PromiseWrapper<ReturnType<C>> : never


type Proxify<T> = {
    [P in keyof T]: wrap<T[P], T[P] extends Func ? Parameters<T[P]> : []>;
};


type Func = (...args) => {}

export  type  FunctionSet = {
    [key: string | symbol]: Func
}

let funcs = {
    add: (a: number, b: number): number => a + b,
    sub: (a: number, b: number): Promise<number> => Promise.resolve(1)
}

function proxify<T>(o: T): Proxify<T> {

    return o as Proxify<T>
}


let b = proxify(funcs)
// b.add(1, 2).then(res => console.log(res))
// b.sub(1, 2).then(r => r)
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


export class AccessibleWorkerFactory {
    public static registerChannelWorker<I, O>(_t: new () => ChannelWorkerDefinition<I, O>): IChannelWorkerClient<O, I> {
        return new ChannelWorkerClient<O, I>();
    }

    public static registerFunctionSet(funcSet: FunctionSet): Proxify<FunctionSet> {
        return proxify(funcSet)
    }
}


const a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);
a.send(22)

