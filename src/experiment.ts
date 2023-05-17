/****************************************************/
type PromiseWrapper<Value> =
    Value extends Promise<any> ? Value : Promise<Value>;


type wrap<Func, Params> = (...arg: Params) => PromiseWrapper<ReturnType<Func>>


type Proxify<T> = {
    [P in keyof T]: wrap<T[P], Parameters<T[P]>>;
};


type Func = (...args) => {}

export  type  FunctionSet = {
    [key: string | Symbol]: Func
}

let funcs = {
    add: (a: number, b: number): number => a + b,
    sub: (a: number, b: number): Promise<number> => Promise<number>.resolve(1)
}

function proxify<T>(o: T): Proxify<T> {

    return
}


function wrapperFunctions(funcSet: FunctionSet): Proxify<FunctionSet> {
    // 将function set 中的每个function进行包装，而后由proxify对类型进行封装后返回

    return proxify(funcSet)
}


let b = proxify(funcs)
b.add(1, 2).then(res => console.log(res))
b.sub(1, 2).then(r => r)
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
    public static register<I, O>(_t: new () => ChannelWorkerDefinition<I, O>): IChannelWorkerClient<O, I> {
        return new ChannelWorkerClient<O, I>();
    }
}


const a = AccessibleWorkerFactory.register(MyWorker);

