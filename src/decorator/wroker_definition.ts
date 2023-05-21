import {ChannelWorkerDefinition, EventsMap} from "../experiment";
import "reflect-metadata"
import {Node, parse} from 'acorn'
import {full} from 'acorn-walk'

export interface WorkThread {

}

export const WORKER_DEFINITION = Symbol('WORKER_DEFINITION')

export interface WorkerConfig {
    ttl: number;
    strategy: 'PERFORMANCE' | 'MEMORY_SAVE';
    minActive: number;
}

export interface WorkerDefinition {
    ttl: number
}

// regard as specific T constructor
type Type<T> = new (...args: any[]) => T;

export interface IdentifierNode {
    type: 'Identifier';
    start: number;
    end: number;
    name: string;
}

type ValueMatchedKey<Type, Value> = {
    [Key in keyof Type]: Type[Key] extends Value ? Key : never;
}[keyof Type];


/*******************************************************/
export const AccessibleWorker = () => {
    return (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>) => {
        const workerDefinition: WorkerDefinition = Reflect.getOwnMetadata(WORKER_DEFINITION, target) || {ttl: 10 * 3000}
        workerDefinition.ttl = 10000
        Reflect.defineMetadata(WORKER_DEFINITION, workerDefinition, target)
    }

}

export const GlobalVariable = <T>() =>
    <ChannelWorkerDefinition>(
        target: ChannelWorkerDefinition,
        field: ValueMatchedKey<ChannelWorkerDefinition, T>
    ) => {


    };


export const SubscribeMessage = <E extends EventsMap>(msg: keyof E) => {
    return (
        target: ChannelWorkerDefinition<E, EventsMap>,
        propertyKey: PropertyKey,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        const func = Reflect.getOwnPropertyDescriptor(target, propertyKey) as TypedPropertyDescriptor<(...args: any[]) => any>

        console.log('==========method info==========')
        if (func && func.value) {

            const funcStr = 'function ' + func["value"].toString()
            const thisExps: { start: number; end: number }[] = [];
            full(parse(funcStr, {ecmaVersion: 2015}), (node: Node,
                                                       state: any,
                                                       type: string) => {
                // check if 'self' reference used;
                if (type === 'Identifier') {
                    const identifierNode = node as IdentifierNode;
                    if (identifierNode.name === 'self') {
                        console.log(identifierNode)
                        console.log(funcStr.substring(identifierNode.start, identifierNode.end))
                        throw new Error("You should never use 'self' in Accessible Worker method")

                    }
                }
                if (type === 'ThisExpression') {
                    const identifierNode = node as IdentifierNode;
                    thisExps.push({start:identifierNode.start,end:identifierNode.end})
                }
            })
            const funcSplit  =funcStr.split('')
            for(const thisExp of thisExps){
                for(let i=0;i<=3;i++){
                    funcSplit[thisExp.start + i] = 'self'[i]
                }
            }
            console.log(funcSplit.join(''))
        }
        /**
         * 1. 检查self. 引用操作, 发现即报错
         * 2. this. 引用操作全部替换为self.
         * 3.
         *
         */


    };
};


export const MessageData = () => (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>, name: PropertyKey, index: number) => {


}
