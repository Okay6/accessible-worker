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

   
