import { WorkerModule } from "./worker_module";

/**
 * 需要定义一个此Worker引用的全局ES Module，在Web Worker(.js)woker中引入第三方库
 */

function first() {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
        console.log(target)
        console.log(target[propertyKey].toString())
    };
}

export interface ChannelWorker {
    onmessage(): void;
    postMessage():void;
}



/**
 * 带有指定装饰器的类并符合要求的Class将会被编译为Web Worker(.js)
 */
export class AccessibleChannelWorker {
    /**
     * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局变量
     */
    private workerVariable = 'variable'

    /**
     * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局方法
     */
    @first()
    run() {
        // this引用取消(this.)，直接转为全局引用
        this.workerVariable = 'changed_variable';
        //  
        this.postMessage()
        console.log(WorkerModule.uuidv4())
        console.log(WorkerModule.var + ('1' as unknown as 1))
        console.log(WorkerModule.a + WorkerModule.b)
        type c = string;
        let a:number;
        a= 1;
        let b:number;
        b = 20;
        console.log

        self.postMessage('sss')
    }

    postMessage() {
        // 等价于 self.postMessage()
    }

    onMessage() {
        // 等价于 self.onmessage
    }
    
}


export class AccessibleFunctionalWorker {
    uuid(): string {
        return ''
    }
    caluate(a: number, b: number): number {
        return a + b;
    }
}

const s = new AccessibleChannelWorker()
s.run()