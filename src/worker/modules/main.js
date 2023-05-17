/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src/experiment.ts":
/*!***************************!*\
  !*** ./src/experiment.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AccessibleWorkerFactory\": () => (/* binding */ AccessibleWorkerFactory),\n/* harmony export */   \"ChannelWorkerDefinition\": () => (/* binding */ ChannelWorkerDefinition)\n/* harmony export */ });\n/* harmony import */ var hash_it__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hash-it */ \"./node_modules/hash-it/dist/esm/index.mjs\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nlet funcs = {\n    add: (a, b) => a + b,\n    sub: (a, b) => Promise.resolve(a - b)\n};\nfunction proxify(o) {\n    return o;\n}\nlet b = proxify(funcs);\n// b.add(1, 2).then(res => console.log(res))\n// b.sub(1, 2).then(r => r)\n// b.add(2, 7).then(res => console.log(res))\nconsole.log(b.add(1, 2));\nconsole.log(b.sub(1, 2));\nclass FunctionSetWorkerProxy {\n    constructor(f) {\n        for (const k in f) {\n            const e = f[k];\n            console.log(e.toString());\n            this[k] = e;\n        }\n    }\n}\n/**\n * Channel Worker Client，并不导出给User使用，对外只暴露IChannelWorkerClient接口\n * Channel Worker Client Web Worker 实例\n */\nclass ChannelWorkerClient {\n    send(data) {\n        console.log(data);\n    }\n    subscribe(callBack) {\n    }\n}\n// eslint-disable-next-line functional/no-class\nclass ChannelWorkerDefinition {\n    constructor() {\n        throw new Error('You should never init this class');\n    }\n    postMessage(data) {\n        self.postMessage(data);\n    }\n}\nclass MyWorker extends ChannelWorkerDefinition {\n    onmessage(event) {\n    }\n}\n/*****************************************************************************/\n/**\n *  AccessibleWorkerFactory负责注册,  存储worker实例\n *  AccessibleWorkerFactory应为单例模式\n *  根使用类型作为参数获取Factory提供的实例进行使用\n *\n *\n */\n/*****************************************************************************/\nclass AccessibleWorkerFactory {\n    /**\n     * 根据ChannelWorkerDefinition构造Worker\n     * @param _t\n     */\n    static registerChannelWorker(_t) {\n        /**\n         * 应该存储到存储结构中，后面使用fetch instance获取指定实例,\n         *\n         */\n        console.log((0,hash_it__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_t));\n        return new ChannelWorkerClient();\n    }\n    /**\n     * 将提供的Function Set注册到 AccessibleWorkerFactory 函数表\n     *\n     */\n    static registerFunctionSet(funcSet) {\n        /**\n         * 该存储到存储结构中，后面使用fetch instance获取指定实例\n         */\n        console.log((0,hash_it__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(funcSet));\n        const f = new FunctionSetWorkerProxy(funcSet);\n        // return proxify(funcSet)\n        return f;\n    }\n}\nconst a = AccessibleWorkerFactory.registerChannelWorker(MyWorker);\nAccessibleWorkerFactory.registerFunctionSet(funcs);\nconst c = AccessibleWorkerFactory.registerFunctionSet({\n    go: () => __awaiter(void 0, void 0, void 0, function* () { return console.log('go'); })\n});\nc.go();\na.send(666);\n\n\n//# sourceURL=webpack://web_worker_research/./src/experiment.ts?");

/***/ }),

/***/ "./node_modules/hash-it/dist/esm/index.mjs":
/*!*************************************************!*\
  !*** ./node_modules/hash-it/dist/esm/index.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ hashIt)\n/* harmony export */ });\n/**\n * based on string passed, get the integer hash value\n * through bitwise operation (based on spinoff of dbj2\n * with enhancements for reduced collisions)\n */\nfunction hash(string) {\n    var index = string.length;\n    var hashA = 5381;\n    var hashB = 52711;\n    var charCode;\n    while (index--) {\n        charCode = string.charCodeAt(index);\n        hashA = (hashA * 33) ^ charCode;\n        hashB = (hashB * 33) ^ charCode;\n    }\n    return (hashA >>> 0) * 4096 + (hashB >>> 0);\n}\n\nvar SEPARATOR = '|';\nvar XML_ELEMENT_REGEXP = /\\[object ([HTML|SVG](.*)Element)\\]/;\nvar CLASSES = {\n    '[object Arguments]': 0,\n    '[object Array]': 1,\n    '[object ArrayBuffer]': 2,\n    '[object AsyncFunction]': 3,\n    '[object AsyncGeneratorFunction]': 4,\n    '[object BigInt]': 5,\n    '[object BigInt64Array]': 6,\n    '[object BigUint64Array]': 7,\n    '[object Boolean]': 8,\n    '[object DataView]': 9,\n    '[object Date]': 10,\n    '[object DocumentFragment]': 11,\n    '[object Error]': 12,\n    '[object Event]': 13,\n    '[object Float32Array]': 14,\n    '[object Float64Array]': 15,\n    '[object Function]': 16,\n    '[object Generator]': 17,\n    '[object GeneratorFunction]': 18,\n    '[object Int8Array]': 19,\n    '[object Int16Array]': 20,\n    '[object Map]': 21,\n    '[object Number]': 22,\n    '[object Object]': 23,\n    '[object Promise]': 24,\n    '[object RegExp]': 25,\n    '[object Set]': 26,\n    '[object SharedArrayBuffer]': 27,\n    '[object String]': 28,\n    '[object Uint8Array]': 29,\n    '[object Uint8ClampedArray]': 30,\n    '[object Uint16Array]': 31,\n    '[object Uint32Array]': 32,\n    '[object WeakMap]': 33,\n    '[object WeakRef]': 34,\n    '[object WeakSet]': 35,\n    CUSTOM: 36,\n    ELEMENT: 37,\n};\nvar ARRAY_LIKE_CLASSES = {\n    '[object Arguments]': 1,\n    '[object Array]': 2,\n};\nvar NON_ENUMERABLE_CLASSES = {\n    '[object Generator]': 1,\n    '[object Promise]': 2,\n    '[object WeakMap]': 3,\n    '[object WeakRef]': 4,\n    '[object WeakSet]': 5,\n};\nvar PRIMITIVE_WRAPPER_CLASSES = {\n    '[object AsyncFunction]': 1,\n    '[object AsyncGeneratorFunction]': 2,\n    '[object Boolean]': 3,\n    '[object Function]': 4,\n    '[object GeneratorFunction]': 5,\n    '[object Number]': 6,\n    '[object String]': 7,\n};\nvar TYPED_ARRAY_CLASSES = {\n    '[object BigInt64Array]': 1,\n    '[object BigUint64Array]': 2,\n    '[object Float32Array]': 3,\n    '[object Float64Array]': 4,\n    '[object Int8Array]': 5,\n    '[object Int16Array]': 6,\n    '[object Uint8Array]': 7,\n    '[object Uint8ClampedArray]': 8,\n    '[object Uint16Array]': 9,\n    '[object Uint32Array]': 10,\n};\nvar RECURSIVE_CLASSES = {\n    '[object Arguments]': 1,\n    '[object Array]': 2,\n    '[object ArrayBuffer]': 3,\n    '[object BigInt64Array]': 4,\n    '[object BigUint64Array]': 5,\n    '[object DataView]': 6,\n    '[object Float32Array]': 7,\n    '[object Float64Array]': 8,\n    '[object Int8Array]': 9,\n    '[object Int16Array]': 10,\n    '[object Map]': 11,\n    '[object Object]': 12,\n    '[object Set]': 13,\n    '[object SharedArrayBuffer]': 14,\n    '[object Uint8Array]': 15,\n    '[object Uint8ClampedArray]': 16,\n    '[object Uint16Array]': 17,\n    '[object Uint32Array]': 18,\n    CUSTOM: 19,\n};\nvar HASHABLE_TYPES = {\n    bigint: 'i',\n    boolean: 'b',\n    empty: 'e',\n    function: 'g',\n    number: 'n',\n    object: 'o',\n    string: 's',\n    symbol: 's',\n};\n\nfunction sortByKey(first, second) {\n    return first[0] > second[0];\n}\nfunction sortBySelf(first, second) {\n    return first > second;\n}\nfunction sort(array, fn) {\n    var subIndex;\n    var value;\n    for (var index = 0; index < array.length; ++index) {\n        value = array[index];\n        for (subIndex = index - 1; ~subIndex && fn(array[subIndex], value); --subIndex) {\n            array[subIndex + 1] = array[subIndex];\n        }\n        array[subIndex + 1] = value;\n    }\n    return array;\n}\n\nfunction namespaceComplexValue(classType, value) {\n    return (HASHABLE_TYPES.object + SEPARATOR + CLASSES[classType] + SEPARATOR + value);\n}\n\nvar NON_ENUMERABLE_CLASS_CACHE = new WeakMap();\nvar refId = 0;\nfunction getUnsupportedHash(value, classType) {\n    var cached = NON_ENUMERABLE_CLASS_CACHE.get(value);\n    if (cached) {\n        return cached;\n    }\n    var toCache = namespaceComplexValue(classType, 'NOT_ENUMERABLE' + SEPARATOR + refId++);\n    NON_ENUMERABLE_CLASS_CACHE.set(value, toCache);\n    return toCache;\n}\n\nvar toString = Object.prototype.toString;\nfunction stringifyComplexType(value, classType, state) {\n    if (RECURSIVE_CLASSES[classType]) {\n        return stringifyRecursiveAsJson(classType, value, state);\n    }\n    if (classType === '[object Date]') {\n        return namespaceComplexValue(classType, value.getTime());\n    }\n    if (classType === '[object RegExp]') {\n        return namespaceComplexValue(classType, value.toString());\n    }\n    if (classType === '[object Event]') {\n        return namespaceComplexValue(classType, [\n            value.bubbles,\n            value.cancelBubble,\n            value.cancelable,\n            value.composed,\n            value.currentTarget,\n            value.defaultPrevented,\n            value.eventPhase,\n            value.isTrusted,\n            value.returnValue,\n            value.target,\n            value.type,\n        ].join());\n    }\n    if (classType === '[object Error]') {\n        return namespaceComplexValue(classType, value.message + SEPARATOR + value.stack);\n    }\n    if (classType === '[object DocumentFragment]') {\n        return namespaceComplexValue(classType, stringifyDocumentFragment(value));\n    }\n    var element = classType.match(XML_ELEMENT_REGEXP);\n    if (element) {\n        return namespaceComplexValue('ELEMENT', element[1] + SEPARATOR + value.outerHTML);\n    }\n    if (NON_ENUMERABLE_CLASSES[classType]) {\n        return getUnsupportedHash(value, classType);\n    }\n    if (PRIMITIVE_WRAPPER_CLASSES[classType]) {\n        return namespaceComplexValue(classType, value.toString());\n    }\n    // This would only be hit with custom `toStringTag` values\n    return stringifyRecursiveAsJson('CUSTOM', value, state);\n}\nfunction stringifyRecursiveAsJson(classType, value, state) {\n    var cached = state.cache.get(value);\n    if (cached) {\n        return namespaceComplexValue(classType, 'RECURSIVE~' + cached);\n    }\n    state.cache.set(value, ++state.id);\n    if (classType === '[object Object]') {\n        return value[Symbol.iterator]\n            ? getUnsupportedHash(value, classType)\n            : namespaceComplexValue(classType, stringifyObject(value, state));\n    }\n    if (ARRAY_LIKE_CLASSES[classType]) {\n        return namespaceComplexValue(classType, stringifyArray(value, state));\n    }\n    if (classType === '[object Map]') {\n        return namespaceComplexValue(classType, stringifyMap(value, state));\n    }\n    if (classType === '[object Set]') {\n        return namespaceComplexValue(classType, stringifySet(value, state));\n    }\n    if (TYPED_ARRAY_CLASSES[classType]) {\n        return namespaceComplexValue(classType, value.join());\n    }\n    if (classType === '[object ArrayBuffer]') {\n        return namespaceComplexValue(classType, stringifyArrayBuffer(value));\n    }\n    if (classType === '[object DataView]') {\n        return namespaceComplexValue(classType, stringifyArrayBuffer(value.buffer));\n    }\n    if (NON_ENUMERABLE_CLASSES[classType]) {\n        return getUnsupportedHash(value, classType);\n    }\n    return namespaceComplexValue('CUSTOM', stringifyObject(value, state));\n}\nfunction stringifyArray(value, state) {\n    var index = value.length;\n    var result = new Array(index);\n    while (--index >= 0) {\n        result[index] = stringify(value[index], state);\n    }\n    return result.join();\n}\nfunction stringifyArrayBufferModern(buffer) {\n    return Buffer.from(buffer).toString('utf8');\n}\nfunction stringifyArrayBufferFallback(buffer) {\n    return String.fromCharCode.apply(null, new Uint16Array(buffer));\n}\nfunction stringifyArrayBufferNone() {\n    return 'UNSUPPORTED';\n}\nfunction stringifyDocumentFragment(fragment) {\n    var children = fragment.children;\n    var index = children.length;\n    var innerHTML = new Array(index);\n    while (--index >= 0) {\n        innerHTML[index] = children[index].outerHTML;\n    }\n    return innerHTML.join();\n}\nvar stringifyArrayBuffer = typeof Buffer !== 'undefined' && typeof Buffer.from === 'function'\n    ? stringifyArrayBufferModern\n    : typeof Uint16Array === 'function'\n        ? stringifyArrayBufferFallback\n        : stringifyArrayBufferNone;\nfunction stringifyMap(map, state) {\n    var result = new Array(map.size);\n    var index = 0;\n    map.forEach(function (value, key) {\n        result[index++] = [stringify(key, state), stringify(value, state)];\n    });\n    sort(result, sortByKey);\n    while (--index >= 0) {\n        result[index] = '[' + result[index][0] + ',' + result[index][1] + ']';\n    }\n    return '[' + result.join() + ']';\n}\nfunction stringifyObject(value, state) {\n    var properties = sort(Object.getOwnPropertyNames(value), sortBySelf);\n    var length = properties.length;\n    var result = new Array(length);\n    var index = length;\n    while (--index >= 0) {\n        result[index] =\n            properties[index] + ':' + stringify(value[properties[index]], state);\n    }\n    return '{' + result.join() + '}';\n}\nfunction stringifySet(set, state) {\n    var result = new Array(set.size);\n    var index = 0;\n    set.forEach(function (value) {\n        result[index++] = stringify(value, state);\n    });\n    return '[' + sort(result, sortBySelf).join() + ']';\n}\nfunction stringify(value, state) {\n    var type = typeof value;\n    if (value == null || type === 'undefined') {\n        return HASHABLE_TYPES.empty + value;\n    }\n    if (type === 'object') {\n        return stringifyComplexType(value, toString.call(value), state || { cache: new WeakMap(), id: 1 });\n    }\n    if (type === 'function' || type === 'symbol') {\n        return HASHABLE_TYPES[type] + value.toString();\n    }\n    if (type === 'boolean') {\n        return HASHABLE_TYPES.boolean + +value;\n    }\n    return HASHABLE_TYPES[type] + value;\n}\n\nfunction hashIt(value) {\n    return hash(stringify(value, undefined));\n}\n\n\n//# sourceMappingURL=index.mjs.map\n\n\n//# sourceURL=webpack://web_worker_research/./node_modules/hash-it/dist/esm/index.mjs?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./src/experiment.ts");
/******/ var __webpack_exports__AccessibleWorkerFactory = __webpack_exports__.AccessibleWorkerFactory;
/******/ var __webpack_exports__ChannelWorkerDefinition = __webpack_exports__.ChannelWorkerDefinition;
/******/ export { __webpack_exports__AccessibleWorkerFactory as AccessibleWorkerFactory, __webpack_exports__ChannelWorkerDefinition as ChannelWorkerDefinition };
/******/ 
