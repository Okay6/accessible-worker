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

    abstract subscribe(event: MessageEvent<I>): void

    abstract send(data: O): void

}


class MyWorker extends ChannelWorkerDefinition<number, string> {

    send(data: string): void {

    }

    subscribe(event: MessageEvent<number>): void {

    }

}


export class AccessibleWorkerFactory {
    public static register<I, O>(_t: new () => ChannelWorkerDefinition<I, O>): IChannelWorkerClient<I, O> {
        return new ChannelWorkerClient<I, O>();
    }
}


const a = AccessibleWorkerFactory.register(MyWorker);

a.send('Ok')

