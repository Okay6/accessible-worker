"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibleWorkerFactory = exports.ChannelWorkerDefinition = void 0;
var hash_it_1 = require("hash-it");
var wroker_definition_1 = require("./decorator/wroker_definition");
var funcs = {
    add: function (a, b) { return a + b; },
    sub: function (a, b) { return Promise.resolve(a - b); }
};
function proxify(o) {
    return o;
}
var b = proxify(funcs);
// b.add(1, 2).then(res => console.log(res))
// b.sub(1, 2).then(r => r)
// b.add(2, 7).then(res => console.log(res))
console.log(b.add(1, 2));
console.log(b.sub(1, 2));
/**
 * 将Function Set 映射为此类的实例并返回给用户进行操作
 */
var FunctionSetWorkerProxy = /** @class */ (function () {
    function FunctionSetWorkerProxy(f) {
        var _loop_1 = function (k) {
            var e = f[k];
            this_1[k] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = e.call.apply(e, __spreadArray([e], args, false));
                return Promise.resolve(res);
            };
        };
        var this_1 = this;
        for (var k in f) {
            _loop_1(k);
        }
    }
    return FunctionSetWorkerProxy;
}());
/**
 * Channel Worker Client，并不导出给User使用，对外只暴露IChannelWorkerClient接口
 * Channel Worker Client Web Worker 实例
 */
var ChannelWorkerClient = /** @class */ (function () {
    function ChannelWorkerClient() {
    }
    ChannelWorkerClient.prototype.on = function (ev, listener) {
    };
    //noinspection all
    ChannelWorkerClient.prototype.emit = function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('=====EMIT=====', args);
    };
    return ChannelWorkerClient;
}());
// eslint-disable-next-line functional/no-class
var ChannelWorkerDefinition = /** @class */ (function () {
    function ChannelWorkerDefinition() {
        throw new Error('You should never init this class');
    }
    //noinspection all
    ChannelWorkerDefinition.prototype.emit = function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    return ChannelWorkerDefinition;
}());
exports.ChannelWorkerDefinition = ChannelWorkerDefinition;
var MyWorker = function () {
    var _classDecorators = [(0, wroker_definition_1.AccessibleWorker)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _say_decorators;
    var MyWorker = _classThis = /** @class */ (function (_super) {
        __extends(MyWorker_1, _super);
        function MyWorker_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            __runInitializers(_this, _instanceExtraInitializers);
            return _this;
        }
        MyWorker_1.prototype.say = function () {
        };
        return MyWorker_1;
    }(ChannelWorkerDefinition));
    __setFunctionName(_classThis, "MyWorker");
    (function () {
        _say_decorators = [(0, wroker_definition_1.AccessibleWorker)()];
        __esDecorate(_classThis, null, _say_decorators, { kind: "method", name: "say", static: false, private: false, access: { has: function (obj) { return "say" in obj; }, get: function (obj) { return obj.say; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        MyWorker = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MyWorker = _classThis;
}();
/*****************************************************************************/
/**
 *  AccessibleWorkerFactory负责注册,  存储worker实例
 *  AccessibleWorkerFactory应为单例模式
 *  根使用类型作为参数获取Factory提供的实例进行使用
 *
 *
 */
/*****************************************************************************/
var AccessibleWorkerFactory = /** @class */ (function () {
    function AccessibleWorkerFactory() {
    }
    /**
     * 根据ChannelWorkerDefinition构造Worker
     * @param _t
     */
    AccessibleWorkerFactory.registerChannelWorker = function (_t) {
        /**
         * 应该存储到存储结构中，后面使用fetch instance获取指定实例,
         *
         */
        console.log((0, hash_it_1.default)(_t));
        return new ChannelWorkerClient();
    };
    /**
     * 将提供的Function Set注册到 AccessibleWorkerFactory 函数表
     *
     */
    AccessibleWorkerFactory.registerFunctionSet = function (funcSet) {
        /**
         * 该存储到存储结构中，后面使用fetch instance获取指定实例
         */
        console.log((0, hash_it_1.default)(funcSet));
        var f = new FunctionSetWorkerProxy(funcSet);
        // return proxify(funcSet)
        return f;
    };
    AccessibleWorkerFactory.getChannelWorkerClient = function (_t) {
        return null;
    };
    AccessibleWorkerFactory.getWorkerEnabledFunctionSet = function (funcSet) {
        return null;
    };
    return AccessibleWorkerFactory;
}());
exports.AccessibleWorkerFactory = AccessibleWorkerFactory;
var a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);
AccessibleWorkerFactory.registerFunctionSet(funcs);
var c = AccessibleWorkerFactory.registerFunctionSet({
    go: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, console.log('go')];
    }); }); },
    show: function (msg) { return console.log(msg); },
    add: function (a, b) { return a + b; }
});
c.go().then();
c.show('HH').then();
c.add(100, 200).then(function (r) { return console.log('====calculate result====', r); });
a.emit('CUSTOMER_TO_SERVER_EVENT', 'Message come from client . . .');
a.on('CUSTOMER_TO_CLIENT_EVENT', function (res) {
});
