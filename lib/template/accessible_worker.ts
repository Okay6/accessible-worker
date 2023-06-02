/**
 * 将Accessible Worker Class 编译为对应worker.js 的预编译模板
 */
export const TYPESCRIPT_ASYNC_HELPER = `
 var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
`

export const buildWorkerJs = (initialFunc: string, globalFunctions: string, globalVariables: string) =>
    TYPESCRIPT_ASYNC_HELPER +
    `
  /* +++++++++++++++++++++++++++++++++++ */
  /* + Generated by Accessible Worker  + */
  /* +++++++++++++++++++++++++++++++++++ */
  
  /** Global Variable Zone **/
    ${globalVariables}    
  
  /** Global Function Zone **/
    ${globalFunctions}
  
  /** Message Subscribe **/
  self.onmessage = (msg) => {
    self[msg.data.event].apply(self, msg.data.args)
  }
  /** Message Emit **/
    self.emit = function(event, ...args) {

    if (args && Array.isArray(args)) {
        let transfer = []
        const pureParam = []
        for (const p of args) {
            if (p.transfer) {
                transfer = p.transfer
            } else {
                pureParam.push(p)
            }
        }
        
        if(transfer && Array.isArray(transfer) && transfer.length > 0){
            self.postMessage({
            event: event,
            args: pureParam
             }, {transfer:transfer})
        }else{
           self.postMessage({
            event: event,
            args: args
           })
        }
       
    } else {
        let transfer = []
        const pureParam = {}
        if (args && Object.hasOwn(args, 'transfer')) {
            for (const key of Object.keys(args)) {
                if (key === 'transfer') {
                    transfer = args['transfer']
                } else {
                    pureParam[key] = args[key]
                }
            }
        }
        if(transfer && Array.isArray(transfer) && transfer.length > 0){
            self.postMessage({
            event: event,
            args: pureParam
           }, {transfer:transfer})
        }else{
          self.postMessage({
            event: event,
            args: args
           })
        }
        
    }

}
  /** Initial Method **/
     ${initialFunc}
     
     __aw_init__()
      
`

export const buildFunctionalWorkerJs = (globalFunctions: string) =>
    TYPESCRIPT_ASYNC_HELPER +
    `
  /* +++++++++++++++++++++++++++++++++++ */
  /* + Generated by Accessible Worker  + */
  /* +++++++++++++++++++++++++++++++++++ */  
  

  /** Helper **/
  self.isPromise = function (obj){
     return obj && Object.prototype.toString.call(obj) === '[object Promise]'
  }   
  
  /** Global Function Zone **/
    ${globalFunctions}
  
  /** Message Subscribe **/
  self.onmessage = (msg) => {
    const executionRes = self[msg.data.event].apply(self, msg.data.args)
    if (self.isPromise(executionRes)) {
        executionRes.then(res => {
            if (res && Array.isArray(res)) {
                let transfer = []
                const pureParam = []
                for (const p of res) {
                    if (p.transfer) {
                        transfer = p.transfer
                    } else {
                        pureParam.push(p)
                    }
                }
                if (transfer && Array.isArray(transfer) && transfer.length > 0) {
                    self.postMessage({
                        event: msg.data.event,
                        args: pureParam,
                        handlerIndex: msg.data.handlerIndex
                    }, {
                        transfer: transfer
                    })
                } else {
                    self.postMessage({
                        event: msg.data.event,
                        args: res,
                        handlerIndex: msg.data.handlerIndex
                    })
                }

            } else {
                let transfer = []
                const pureParam = {}
                if (res && Object.hasOwn(res, 'transfer')) {
                    for (const key of Object.keys(res)) {
                        if (key === 'transfer') {
                            transfer = res['transfer']
                        } else {
                            pureParam[key] = res[key]
                        }
                    }
                }
                if (transfer && Array.isArray(transfer) && transfer.length > 0) {
                    self.postMessage({
                        event: msg.data.event,
                        args: pureParam,
                        handlerIndex: msg.data.handlerIndex
                    }, {
                        transfer: transfer
                    })
                } else {
                    self.postMessage({
                        event: msg.data.event,
                        args: res,
                        handlerIndex: msg.data.handlerIndex
                    })
                }

            }
        })
    } else {
        if (executionRes && Array.isArray(executionRes)) {
            let transfer = []
            const pureParam = []
            for (const p of executionRes) {
                if (p.transfer) {
                    transfer = p.transfer
                } else {
                    pureParam.push(p)
                }
            }
            if (transfer && Array.isArray(transfer) && transfer.length > 0) {
                self.postMessage({
                    event: msg.data.event,
                    args: pureParam,
                    handlerIndex: msg.data.handlerIndex
                }, {
                    transfer: transfer
                })
            } else {
                self.postMessage({
                    event: msg.data.event,
                    args: executionRes,
                    handlerIndex: msg.data.handlerIndex
                })
            }
        } else {
            let transfer = []
            const pureParam = {}
            if (executionRes && Object.hasOwn(executionRes, 'transfer')) {
                for (const key of Object.keys(executionRes)) {
                    if (key === 'transfer') {
                        transfer = executionRes['transfer']
                    } else {
                        pureParam[key] = executionRes[key]
                    }
                }
            }
            if (transfer && Array.isArray(transfer) && transfer.length > 0) {
                self.postMessage({
                    event: msg.data.event,
                    args: pureParam,
                    handlerIndex: msg.data.handlerIndex
                }, {
                    transfer: transfer
                })
            } else {
                self.postMessage({
                    event: msg.data.event,
                    args: executionRes,
                    handlerIndex: msg.data.handlerIndex
                })
            }
        }
    }
}
 
`

export const buildGlobalVariables = (globalVariables: string[]): string => {
    let variables: string[] = []
    globalVariables.forEach(variable => variables.push(`var ${variable}`))
    return variables.join('\n');
}
export const buildGlobalFunctions = (globalFunctions: Record<string, string>): string => {
    let functions: string[] = []
    for (const key of Object.keys(globalFunctions)) {
        functions.push(`self.${key} = ${globalFunctions[key]}`)
    }
    return functions.join('\n');

}