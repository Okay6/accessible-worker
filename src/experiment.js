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
    return ChannelWorkerDefinition;
}());
exports.ChannelWorkerDefinition = ChannelWorkerDefinition;
var MyWorker = /** @class */ (function (_super) {
    __extends(MyWorker, _super);
    function MyWorker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyWorker.prototype.send = function (data) {
    };
    MyWorker.prototype.subscribe = function (event) {
    };
    return MyWorker;
}(ChannelWorkerDefinition));
var AccessibleWorkerFactory = /** @class */ (function () {
    function AccessibleWorkerFactory() {
    }
    AccessibleWorkerFactory.register = function (_t) {
        return new ChannelWorkerClient();
    };
    return AccessibleWorkerFactory;
}());
exports.AccessibleWorkerFactory = AccessibleWorkerFactory;
var a = AccessibleWorkerFactory.register(MyWorker);
a.send('Ok');
