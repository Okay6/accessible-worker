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
- Channel: Server  <-> Client => Channel ( 需要参考Rxjs，Observable实现 )
- Function: Server  <-> Client => Promise<T>
- Description Class, 描述类，利用metadata描述worker.js 定义
- 

 













   
