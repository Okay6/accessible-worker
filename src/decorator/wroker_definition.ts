import {ChannelWorkerDefinition, EventsMap} from "../experiment";
import "reflect-metadata"

const requiredMetadataKey = Symbol("required")

// regard as specific T constructor
type Type<T> = new (...args: any[]) => T;

type ValueMatchedKey<Type, Value> = {
    [Key in keyof Type]: Type[Key] extends Value ? Key : never;
}[keyof Type];


/*******************************************************/
export const PrimaryKey =
    () =>
        <ChannelWorkerDefinition>(
            target: ChannelWorkerDefinition,
            field: ValueMatchedKey<ChannelWorkerDefinition, string>
        ) => {
            // ...
        };


export const AsyncMethodDecorator = () => (
    target: ChannelWorkerDefinition<EventsMap, EventsMap>,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<number>>
) => {
    // ...
    let existingRequiredParameters: PropertyKey[] = Reflect.getOwnMetadata(requiredMetadataKey, target) || [];
    console.log('===========Marked Parameters====')
    console.log(existingRequiredParameters)

    console.log('========Function Info Fetched From Decorator======')
    const func: TypedPropertyDescriptor<(...args: any[]) => Promise<number>> | undefined =
        Reflect.getOwnPropertyDescriptor(target, propertyKey)
    if (func && func.value) {
        console.log(func.value.toString())
    }
};


export const TestMethodDecorator = () => (
    target: object,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
) => {
    // ...

};


export const SubscribeMessage = <E extends EventsMap>(msg: keyof E) => (
    target: ChannelWorkerDefinition<E, EventsMap>,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
) => {
    // ...

};

export const AccessibleWorker = () => {
    return (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>) => {


    }

}

export const WorkerMethodParam = () => (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>, name: PropertyKey, index: number) => {
    let existingRequiredParameters: PropertyKey[] = Reflect.getOwnMetadata(requiredMetadataKey, target) || [];
    existingRequiredParameters.push(name);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target);

}



