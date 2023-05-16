"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibleFunctionalWorker = exports.AccessibleChannelWorker = void 0;
/**
 * 需要定义一个此Worker引用的全局ES Module，在Web Worker(.js)woker中引入第三方库
 */
var worker_module_1 = require("./worker_module");
function first() {
    console.log("first(): factory evaluated");
    return function (target, propertyKey, descriptor) {
        var _a;
        console.log("first(): called");
        console.log(target);
        console.log("====".concat(target.toString(), "==="));
        console.log(target[propertyKey]);
        if (descriptor) {
            console.log((_a = descriptor.get) === null || _a === void 0 ? void 0 : _a.call(descriptor));
        }
    };
}
/**
 * 带有指定装饰器的类并符合要求的Class将会被编译为Web Worker(.js)
 */
var AccessibleChannelWorker = exports.AccessibleChannelWorker = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _run_decorators;
    return _a = /** @class */ (function () {
            function AccessibleChannelWorker() {
                /**
                 * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局变量
                 */
                this.workerVariable = (__runInitializers(this, _instanceExtraInitializers), 'variable');
            }
            /**
             * 带有指定装饰器的类级别属性将会被编译为Web Worker(.js)全局方法
             */
            AccessibleChannelWorker.prototype.run = function () {
                // this引用取消(this.)，直接转为全局引用
                this.workerVariable = 'changed_variable';
                //  
                this.postMessage();
                console.log(worker_module_1.WorkerModules["var"]);
            };
            AccessibleChannelWorker.prototype.postMessage = function () {
                // 等价于 self.postMessage()
            };
            AccessibleChannelWorker.prototype.onMessage = function () {
                // 等价于 self.onmessage
            };
            return AccessibleChannelWorker;
        }()),
        (function () {
            _run_decorators = [first()];
            __esDecorate(_a, null, _run_decorators, { kind: "method", name: "run", static: false, private: false, access: { has: function (obj) { return "run" in obj; }, get: function (obj) { return obj.run; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
var AccessibleFunctionalWorker = /** @class */ (function () {
    function AccessibleFunctionalWorker() {
    }
    AccessibleFunctionalWorker.prototype.uuid = function () {
        return '';
    };
    AccessibleFunctionalWorker.prototype.caluate = function (a, b) {
        return a + b;
    };
    return AccessibleFunctionalWorker;
}());
exports.AccessibleFunctionalWorker = AccessibleFunctionalWorker;
var s = new AccessibleChannelWorker();
s.run();
