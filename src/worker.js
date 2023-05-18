var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AccessibleWorkerModule } from "./worker_module";
/**
 * 需要定义一个此Worker引用的全局ES Module，在Web Worker(.js)woker中引入第三方库
 */
function first() {
    console.log("first(): factory evaluated");
    return function (target, propertyKey, descriptor) {
        console.log("first(): called");
        console.log(target);
        console.log(target[propertyKey].toString());
    };
}
/**
 * 带有指定装饰器的类并符合要求的Class将会被编译为Web Worker(.js)
 */
export class AccessibleChannelWorker {
    constructor() {
        /**
         * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局变量
         */
        this.workerVariable = 'variable';
    }
    /**
     * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局方法
     */
    run(msg) {
        // this引用取消(this.)，直接转为全局引用
        this.workerVariable = 'changed_variable';
        //  
        this.postMessage();
        console.log(AccessibleWorkerModule.uuidv4());
        console.log(AccessibleWorkerModule.var + '1');
        console.log(AccessibleWorkerModule.a + AccessibleWorkerModule.b);
        let a;
        a = 1;
        let b;
        b = 20;
        console.log;
        console.log(msg.length);
        console.log(msg + 'QWERTY');
        self.postMessage('sss');
        new AccessibleWorkerModule.MyOwnClass().say('sssss');
    }
    postMessage() {
        // 等价于 self.postMessage()
    }
    onMessage() {
        // 等价于 self.onmessage
    }
}
__decorate([
    first(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccessibleChannelWorker.prototype, "run", null);
export class AccessibleFunctionalWorker {
    uuid() {
        return '';
    }
    caluate(a, b) {
        return a + b;
    }
}
const s = new AccessibleChannelWorker();
s.run('Message for run method');
