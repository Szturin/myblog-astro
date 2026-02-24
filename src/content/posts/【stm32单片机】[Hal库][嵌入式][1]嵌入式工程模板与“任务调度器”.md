---
title: "【stm32单片机】[Hal库][嵌入式][1]嵌入式工程模板与“任务调度器”"
published: 2024-09-09
updated: 2024-12-16
description: ""
---

# [](#一-任务调度器)一、任务调度器

## [](#1-调度器结构体)1\. 调度器结构体

**函数指针和指针函数:**[C语言基础知识：函数指针&指针函数（定义格式、作用及用法说明）\_指针函数的定义-CSDN博客](https://blog.csdn.net/baidu_37973494/article/details/83150266)

PS: 函数指针本身上还是一个指针，和一般指针没有区别，指向函数的执行地址

```c
//调度器类型的结构体类型声明//任务结构typedef struct {    void (*task_func)(void);//函数指针    uint32_t rate_ms;//任务运行周期    uint32_t last_run;//上次运行时间} scheduler_task_t;
```

`typedef struct {} scheduler_task_t;`是⼀种定义新结构体类型的⽅式，这⾥定义 了⼀个名为 scheduler\_task\_t 的结构体类型。这个结构体类型包含三个成员。

-   `void *task_func(void);`定义了一个函数指针，用于储存任务函数的地址，便于进行任务调度
    
-   `rate_ms`表示任务具体的执行周期
    
-   `last_run`⽤于存储任务上次运⾏的时间戳（以毫秒为单位）。该成员⽤于 记录任务上⼀次被调度执⾏的时间点，以便计算任务是否需要再次执⾏
    

静态任务数组，每个任务包括任务函数，执行周期，和上次执行时间

```c
void Led_task(){}//定义调度器类型的变量 任务//任务数组//给scheduler_task_t类型变量tasks赋初值static scheduler_task_t tasks[] ={    {Led_task,1000,0}//定义一个任务，任务函数为Led_Proc,执行周期为1000毫秒，初始上次运行时间为0};
```

## [](#2-调度器初始化)2\. 调度器初始化

```c
void scheduler_init(void){    //计算任务数组中任务函数的个数，结果储存在tasks_num中    tasks_num = sizeof(tasks)/sizeof(scheduler_task_t);}
```

## [](#3-调度器函数)3\. 调度器函数

遍历任务数组，检查是否有任务需要进行，如果系统当前时间超过任务的执行周期，那么执行任务变更，并且更新上次运行时间

```c
void scheduler_run(void){    /*任务轮询*/    for(uint8_t i=0; i< tasks_num; i++){        //获取当前时间（毫秒）        uint8_t time_now = HAL_GetTick();        //检查任务是否到达当前时间点        if(time_now >= tasks[i].rate_ms + tasks[i].last_run){            //更新任务的上次运行时间，保存时间戳            tasks[i].last_run = time_now;//保存当前时间            tasks[i].task_func();//执行对应指向的任务        }    }}
```

## [](#为什么不能用-void-task_functionvoid-定义函数指针)\# **为什么不能用 `void * task_function(void)` 定义函数指针？**

> void \* task\_function(void)和void(\*task\_function)(void)的区别
> 
> ### [](#)
> 
> #### [](#误解)误解：
> 
> 许多人误以为 `void * task_function(void)` 可以定义函数指针，但实际上这是一个函数声明，而不是一个函数指针定义。
> 
> #### [](#区别)区别：
> 
> -   `void(*task_function)(void)` 是函数指针，表示一个指针可以存储函数地址。
> -   `void * task_function(void)` 是函数声明，表示一个函数本身会返回 `void *` 类型值。
> 
> #### [](#问题)问题：
> 
> 如果误用 `void * task_function(void)` 来定义函数指针，代码会产生语法错误或逻辑错误，因为这两种定义的含义完全不同。
> 
> * * *
> 
> ### [](#4-如何正确地使用函数指针)4\. **如何正确地使用函数指针？**
> 
> 函数指针需要通过明确的语法进行定义和使用。以下是常见用法：
> 
> #### [](#1函数指针定义)（1）函数指针定义
> 
> 定义与函数原型匹配的指针：
> 
> ```c
> void my_function(void);void (*task_function)(void);  // 定义函数指针task_function = my_function;  // 将函数地址赋值给指针task_function();              // 调用函数
> ```
> 
> #### [](#2函数指针作为参数)（2）函数指针作为参数
> 
> 函数指针可以作为另一个函数的参数，用于动态调用不同的函数：
> 
> ```c
> void execute_task(void (*task)(void)) {    task();  // 调用传入的函数}void task1(void) {    printf("Executing Task 1\n");}void task2(void) {    printf("Executing Task 2\n");}int main() {    execute_task(task1);  // 传入 Task 1    execute_task(task2);  // 传入 Task 2    return 0;}
> ```
> 
> #### [](#3函数指针数组)（3）函数指针数组
> 
> 用函数指针数组管理多个函数：
> 
> ```c
> void func1(void) { printf("Function 1\n"); }void func2(void) { printf("Function 2\n"); }void func3(void) { printf("Function 3\n"); }void (*func_array[])(void) = {func1, func2, func3};int main() {    for (int i = 0; i < 3; i++) {        func_array[i]();  // 调用每个函数    }    return 0;}
> ```
> 
> * * *
> 
> ### [](#5-总结)5\. **总结**
> 
> -   **`void(*task_function)(void)`** 是定义函数指针的正确语法。
> -   **`void * task_function(void)`** 是定义返回 `void *` 类型的普通函数的语法，与函数指针无关。
> -   函数指针是 C 中动态函数调用的强大工具，用于在运行时决定调用哪个函数。
