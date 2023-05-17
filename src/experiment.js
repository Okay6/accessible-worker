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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibleWorkerFactory = exports.ChannelWorkerDefinition = void 0;
var hash_it_1 = require("hash-it");
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
var ChannelWorkerClient = /** @class */ (function () {
    function ChannelWorkerClient() {
    }
    ChannelWorkerClient.prototype.send = function (data) {
        console.log(data);
    };
    ChannelWorkerClient.prototype.subscribe = function (callBack) {
    };
    return ChannelWorkerClient;
}());
// eslint-disable-next-line functional/no-class
var ChannelWorkerDefinition = /** @class */ (function () {
    function ChannelWorkerDefinition() {
        throw new Error('You should never init this class');
    }
    ChannelWorkerDefinition.prototype.postMessage = function (data) {
        self.postMessage(data);
    };
    return ChannelWorkerDefinition;
}());
exports.ChannelWorkerDefinition = ChannelWorkerDefinition;
var MyWorker = /** @class */ (function (_super) {
    __extends(MyWorker, _super);
    function MyWorker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyWorker.prototype.onmessage = function (event) {
    };
    return MyWorker;
}(ChannelWorkerDefinition));
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
        return proxify(funcSet);
    };
    return AccessibleWorkerFactory;
}());
exports.AccessibleWorkerFactory = AccessibleWorkerFactory;
var a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);
AccessibleWorkerFactory.registerFunctionSet(funcs);
AccessibleWorkerFactory.registerFunctionSet({
    go: function () { return console.log('go'); }
});
a.send(666);
