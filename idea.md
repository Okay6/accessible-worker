# Accessible Worker

## Why

- web worker需要创建独立脚本文件，不太符合OOP的specific
- 对web worker进行包装，使得其更易理解

## How

- 使用TypeScript装饰器，将符合规范的class编译为worker.js
- 使用WorkerFactory获取一个指定的WorkerLike实例，workerlike
- WorkerLike，分为Channel和Callable
- Channel类似传统的woker，可以接收消息，发送消息
- Callable用于在worker中执行耗时函数，执行Callable()后返回Promise结果

## Compile

- 需要将TypeScript 引用编译为 一个模块集合，给Web Worker中函数使用
- 函数中不可以使用类型声明以及一些TypeScript语法

## Worker Factory

- register，注册worker
- get， 获取一个包装的worker
- Channel Worker
- Function Worker

## Objects

- Interface
- Abstract class
- Decorator
- Compiler

## Description

- Channel 双向通道， send， subscribe， post，强制send事件参数类型和post事件参数类型

- Functional，强制入参和返回值类型

- WorkerChannel

- 禁止使用self. 在webworker中调用，会导致不可控的问题

- ES6 Class +  TypeScript 装饰器

## Function Copy

- 使用 Function.toString()  获取函数Definition
- 对函数进行检查，查看是否符合Web Worker Inner Function 的标准
- 将符合标准的函数进行处理后以字符串形式保存
- Channel Worker 描述类中的类级别属性需要copy到worker,js中作为全局变量
- 分别针对Channel和 Function 创建通信终端
- Channel: Server  <-> Client => Channel ( 参考SocketIO的事件通信机制类型设计)
- Function: Server  <-> Client => Promise<T>
- Description Class, 描述类，利用metadata描述worker.js 定义

## TypeScript Decorator

- ####  类装饰器

  类装饰器是在类声明之前声明的, 类的装饰器用于类的构造函数, 可以观察,修改,替换类定义,

  类装饰器表达式在运行时作为函数调用, 装饰类的构造函数作为其唯一参数

  如果类的装饰器返回一个值, 它将用提供的构造函数替换类声明

- #### 属性装饰器

  属性装饰器*是在属性声明之前声明的,属性装饰器的表达式将在运行时作为函数调用，

  并带有以下两个参数：

  1. `target`: 静态成员的类构造函数, 或实例成员的类的原型
  2. `name`: 成员名称
  
- #### 方法装饰器
  
   方法装饰器在方法声明之前声明, 作用于类属性的装饰器函数表达式会在运行时调用
  
  方法装饰器的函数表达式将在运行时调用, 并带有以下三个参数
  
  1. `target`: 静态成员的类的构造函数, 或者实例成员的类的原型
  2. `name`: 成员的名称
  3. `descriptor`: 成员的属性描述符
  
  如果你熟悉 `Object.defineProperty`，你会立刻发现这正是 `Object.defineProperty`的三个参数。
  
  如果方法装饰器返回一个值, 它将用作该方法的属性描述符
  
- #### 方法参数装饰器
  参数装饰器表达式会在运行时当作函数被调用，以使用参数装饰器为类的原型上附加一些元数据，
  
  传入下列3个参数 target、name、index：
  
  1. target: 对于静态成员来说是类的构造函数, 对于实例成员来说是类的原型对象
  2. name: 成员的名字  
  3. index: 参数在函数参数列表中的索引
  
- #### 装饰器工厂
  
  装饰器工厂就是一个简单的函数，它返回一个装饰器函数，以供装饰器在运行时调用。
  
  通过装饰器工厂方法，可以`额外传参`，普通装饰器无法传参
  
- #### 装饰器执行参数
  ```typescript
  function color(val:string){
    // 装饰器工厂
    return function(target){
      // 装饰器
    }
  }
  ```
  

```typescript
// 类装饰器
function classDecorator (){
  console.log('类装饰器')
}

// 属性装饰器
function attrDecorator (){
  console.log('属性装饰器')
}

// 方法装饰器
function methodsDecorator (){
  console.log('方法装饰器')
}

// 参数装饰器
function argumentDecorator (target:any, name:string ,index: number){
  console.log('参数装饰器', index)
}


// 类装饰器
@classDecorator
class Person {
  // 属性装饰器
  @attrDecorator
  name: string

  // 方法装饰器(参数装饰器)
  @methodsDecorator
  sayHello(@argumentDecorator name:string , @argumentDecorator age:number){
    console.log('name', name, age)
  }

}

/*
 装饰器执行顺序:
      属性装饰器
      参数装饰器 1
      参数装饰器 0
      方法装饰器
      类装饰器
*/

```

## Accessible Module

- ```accessible_worker_module.js``` 如果需要引入第三方依赖或者自身依赖，需要在构建工具中配置单独的entry
- 所有模块导入都需要在AccessibleModule中先导入，然后以 ```AccessibleModule.uuid()``` 的方式进行使用

## Reflect Metadata

-  使用```reflect-metadata``` 配合 decorator 对class method property 进行元数据的获取与定义

## Endpoint 通信

- 4 CustomEvent

## Category

- 在注册阶段，ChannelWorkerDefinition  将会被编译为Worker.js  (Server  端)
- 在构造 ChannelWorkerClient  和 FunctionSetWorkerProxyClient阶段  (Client 端)
- worker.js, 线程池,线程注册表全都都放在Client端中
- 



 















   
