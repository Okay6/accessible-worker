import {ChannelWorkerDefinition, EventsMap} from "../experiment";
import "reflect-metadata"
import {Node, parse} from 'acorn'
import {full} from 'acorn-walk'

/// <reference path = './beautify.min.d.ts' />
import * as jsBeautify from './beautify.min.js'

export interface WorkThread {

}

export const WORKER_DEFINITION = Symbol('WORKER_DEFINITION')
export const WORKER_INITIAL_FUNC = Symbol('WORKER_INITIAL_FUNC')

export interface WorkerConfig {
    ttl: number;
    strategy: 'PERFORMANCE' | 'MEMORY_SAVE';
    minActive: number;
}

/**
 * Worker Definition， 包含了 Compiled Web Worker 所有信息
 */
export interface WorkerDefinition {
    globalFunctions: Record<string, string>;
    globalVariables: string[]
}

// regard as specific T constructor
type Type<T> = new (...args: any[]) => T;

export interface IdentifierNode {
    type: 'Identifier';
    start: number;
    end: number;
    name: string;
}

export interface MethodDefinition {
    type: "MethodDefinition";
    start: number;
    end: number;
    static: boolean;
    computed: boolean;
    kind: string,
    value: FunctionExpression;
}

export interface FunctionExpression {
    type: "FunctionExpression",
    start: number,
    end: number,
    id: null,
    expression: boolean,
    generator: boolean,
    params: IdentifierNode []
}

export interface ExpressionStatement {
    type: "ExpressionStatement";
    start: number;
    end: number;
    expression: Expression;
}

export interface Expression {
    type: string;
    start: number;
    end: number;
    callee?: {
        type: string;
        start: number;
        end: number;
        object: {
            type: string;
            start: number;
            end: number;
        }
    }
}

type ValueMatchedKey<Type, Value> = {
    [Key in keyof Type]: Type[Key] extends Value ? Key : never;
}[keyof Type];


/*******************************************************/
export const AccessibleWorker = () => {
    return (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>) => {


        // 检查 Class 构造器

        const classStr = target.prototype.constructor.toString();

        let constructorPosition: { start: number; end: number } = {start: 0, end: 0}
        let superCallPositions: { start: number; end: number } [] = []
        let constructorParams: IdentifierNode[] = []
        let _node: Node
        try {
            _node = parse(classStr, {ecmaVersion: 2015})
        } catch (e: any) {
            throw new Error(e.message)
        }
        full(_node, (node: Node,
                     state: any,
                     type: string) => {

                if (type === 'MethodDefinition') {
                    const constructorDefinition = node as MethodDefinition;
                    if (constructorDefinition.kind === 'constructor') {
                        constructorPosition = {start: constructorDefinition.start, end: constructorDefinition.end}
                        if (constructorDefinition.value) {
                            if (constructorDefinition.value.params) {
                                constructorParams = constructorDefinition.value.params
                            }
                        }
                    }
                }
                if (type === 'ExpressionStatement') {
                    const expressionDefinition = node as ExpressionStatement;
                    if (expressionDefinition.expression && expressionDefinition.expression.callee &&
                        (expressionDefinition.expression.callee.type === 'Super' || expressionDefinition.expression.callee.object &&
                            expressionDefinition.expression.callee.object.type === 'Super')) {
                        superCallPositions.push({start: expressionDefinition.start, end: expressionDefinition.end})
                    }
                }

            }
        )
        // extract constructor
        const accessibleWorkerClassSplit = classStr.split('')
        for (const superCall of superCallPositions) {
            for (let i = superCall.start; i < superCall.end; i++) {
                accessibleWorkerClassSplit[i] = ' ';
            }
        }
        for (const param of constructorParams) {
            for (let i = param.start; i < param.end; i++) {
                accessibleWorkerClassSplit[i] = ' ';
            }
        }
        const cleanedAccessibleWorkerClass = accessibleWorkerClassSplit.join('')
        const constructorStr = cleanedAccessibleWorkerClass.substring(constructorPosition.start, constructorPosition.end);
        // replace this reference to self
        const _thisExps: { start: number; end: number }[] = [];
        const constructorFunc = 'function ' + constructorStr;
        let node: Node;
        try {
            node = parse(constructorFunc, {ecmaVersion: 2015})
        } catch (e: any) {
            throw new Error(e.message)
        }
        full(node, (node: Node,
                    state: any,
                    type: string) => {

            // check if 'self' reference used;
            if (type === 'Identifier') {
                const identifierNode = node as IdentifierNode;
                if (identifierNode.name === 'self') {
                    throw new Error("You should never use 'self' in Accessible Worker constructor")

                }
            }

            if (type === 'ThisExpression') {
                const identifierNode = node as IdentifierNode;
                _thisExps.push({start: identifierNode.start, end: identifierNode.end})
            }
        })
        const funcSplit = constructorFunc.split('')
        for (const thisExp of _thisExps) {
            for (let i = 0; i <= 3; i++) {
                funcSplit[thisExp.start + i] = 'self'[i]
            }
        }
        const initFunc = funcSplit.join('')
        let initWorker = initFunc.replace(/(?<=function\s).+(?=\()/, '__aw_init__')
        initWorker = jsBeautify.js_beautify(initWorker)

        Reflect.defineMetadata(WORKER_INITIAL_FUNC, initWorker, target)

    }

}

export const GlobalVariable = <T>() =>
    <ChannelWorkerDefinition extends object>(
        target: ChannelWorkerDefinition,
        field: ValueMatchedKey<ChannelWorkerDefinition, T>
    ) => {
        let workerDefinition: WorkerDefinition = Reflect.getOwnMetadata(WORKER_DEFINITION, target)
        if(!workerDefinition){
            workerDefinition = {globalFunctions:{},globalVariables:[]}
        }
        workerDefinition.globalVariables.push(field.toString())
        workerDefinition.globalVariables = [...workerDefinition.globalVariables]
        Reflect.defineMetadata(WORKER_DEFINITION, workerDefinition, target)

    };


export const SubscribeMessage = <E extends EventsMap>(msg: keyof E) => {
        return (
            target: ChannelWorkerDefinition<E, EventsMap>,
            propertyKey: PropertyKey,
            descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
        ) => {
            const func = Reflect.getOwnPropertyDescriptor(target, propertyKey) as TypedPropertyDescriptor<(...args: any[]) => any>


            if (func && func.value) {

                const funcStr = 'function ' + func["value"].toString()
                const thisExps: { start: number; end: number }[] = [];
                let node: Node;
                try {
                    node = parse(funcStr, {ecmaVersion: 2015})
                } catch (e: any) {
                    throw new Error(e.message)
                }
                full(node, (node: Node,
                            state: any,
                            type: string) => {
                    // check if 'self' reference used;
                    if (type === 'Identifier') {
                        const identifierNode = node as IdentifierNode;
                        if (identifierNode.name === 'self') {

                            throw new Error("You should never use 'self' in Accessible Worker method")

                        }
                    }
                    if (type === 'ThisExpression') {
                        const identifierNode = node as IdentifierNode;
                        thisExps.push({start: identifierNode.start, end: identifierNode.end})
                    }
                })
                const funcSplit = funcStr.split('')
                for (const thisExp of thisExps) {
                    for (let i = 0; i <= 3; i++) {
                        funcSplit[thisExp.start + i] = 'self'[i]
                    }
                }

                let workerDefinition: WorkerDefinition = Reflect.getOwnMetadata(WORKER_DEFINITION, target)
                if(!workerDefinition){
                    workerDefinition = {globalFunctions:{},globalVariables:[]}
                }
                workerDefinition.globalFunctions[msg.toString()] = funcSplit.join('')
                workerDefinition.globalFunctions = {... workerDefinition.globalFunctions}
                Reflect.defineMetadata(WORKER_DEFINITION, workerDefinition, target)


            }
        }
    }
;


export const MessageData = () => (target: Type<ChannelWorkerDefinition<EventsMap, EventsMap>>, name: PropertyKey, index: number) => {


}
