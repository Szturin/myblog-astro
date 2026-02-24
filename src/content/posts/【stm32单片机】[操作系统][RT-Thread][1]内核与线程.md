---
title: "【stm32单片机】[操作系统][RT-Thread][1]内核与线程"
published: 2024-10-16
updated: 2024-11-08
description: ""
category: 学习笔记
tags:
  - 操作系统
  - RT-Thread
  - STM32
  - 嵌入式软件
---

# 裸机开发与操作系统的区别

## 裸机开发

-   单一任务（阻塞式）
-   手动分配资源
-   缺乏抽象层
-   灵活性、实时性较高

## 操作系统

-   多任务调度
-   自动资源管理
-   硬件抽象层

# RT-Thread的线程

## 线程的概念

在RT-thread中，线程是最小的工作单元。每个线程负责一个任务。RT-Thread根据线程的优先级决定哪个任务先完成.。

RT-Thread 支持多达 256 个优先级。0是最高的优先级。

## 线程的组成部分

1.  线程控制块：线程的名字，线程要执行的任务，线程的优先级，线程的状态
2.  线程栈：保存临时数据
3.  入口函数：线程的任务内容

## 线程的状态

线程有五种工作状态：

1.  初始状态：线程创建还未使用
2.  就绪状态：线程准备好，但是没有拿到资源
3.  运行状态：线程正在执行任务，占用CPU
4.  挂起状态：线程暂时停止工作
5.  关闭状态：线程的任务完成了，线程结束，不再使用

## 线程的优先级

RT-Thread支持256个优先级

## 时间片

时间片是线程允许工作的时间。如果多个线程的优先级相同，则根据”时间片“，执行完任务A后再执行任务B，轮询进行。

# RT-Thread工程

## RT-Thread项目创建

![](/posts/64776/image-20241017014526806.png)

RT-Thread工程创建完毕，硬件底层还没有初始化，需要我们自己进行配置

点击CubeMX_Setting进行联调

![](/posts/64776/image-20241017014950565.png)

CubeMX完成RCC、时钟树、串口、工程选项等关键配置后，生成代码，关闭CubeMX

在RT-Thread Studio中生成了CubemxI相关文件

进行编译后，出现一个小bug

![](/posts/64776/image-20241017020104564.png)

这个时候，需要我们将API更换掉

对cubemx文件夹下的main.c进行分析，发现被进行了弱定义

![](/posts/64776/image-20241017020406174.png)

转到RT-thread重定义的main.c

结论：RT-Thread对Hal库进行了硬件层的抽象

![](/posts/64776/image-20241017020503940.png)

RT-Thread初始化默认集成了Shell

![](/posts/64776/image-20241017021855733.png)

## 创建线程

函数API

```c
rt_thread_t rt_thread_create(const char *name,
                             void (*entry)(void *parameter),
                             void       *parameter,
                             rt_uint32_t stack_size,
                             rt_uint8_t  priority,
                             rt_uint32_t tick)
```
程序实现

```c
#include <rtthread.h>

/*创建线程*/
static rt_thread_t tid1 = RT_NULL;

/*定义入口函数*/
static void thread1_entry(void  *parameter)
{
    int count = 0;
    while(1){
        rt_kprintf("Thread1 is running, count:%d\n",count);
        count++;
        rt_thread_delay(1000);
    }
}

int main(void)
{
    /*创建线程1*/
    //tid为线程id，线程名称为thread1,入口函数为thread1_entry，入口参数为RT_NULL即无入口参数
    //堆栈空间设置为1024
    //优先级为20
    //时间片为10
    tid1 = rt_thread_create("thread1",
                             thread1_entry,RT_NULL,
                             1024,20, 10);

    /*启动线程*/
    if(tid1 != RT_NULL){//判断身份id是否为空
        rt_thread_startup(tid1);//激活线程
    }
    return 0;
}
```
编译后烧写

实验结果：线程在循环运行

![](/posts/64776/image-20241017023340933.png)

> rt_thread_delay()的作用：
> 
> -   休眠当前进程，释放CPU资源
> -   将任务挂起
> 
> rt_thread_delay(1000)即任务以1000ms周期运行
> 
> 注意：
> 
> -   时间片是允许运行的时间
> -   rt_thread_delay作用是运行的周期，并且是非阻塞的。

多线程创建

```c
#include <rtthread.h>

/*创建线程*/
static rt_thread_t tid1 = RT_NULL;//储存线程信息
static rt_thread_t tid2 = RT_NULL;//储存线程信息

/*线程1入口函数*/
static void thread1_entry(void  *parameter)
{
    int count = 0;
    while(1){
        rt_kprintf("Thread1 is running, count:%d\n",count);
        count++;
        rt_thread_delay(1000);
    }
}
/*线程2入口函数*/
static void thread2_entry(void  *parameter)
{
    int count = 0;
    while(1){
        rt_kprintf("Thread2 is running, count:%d\n",count);
        count++;
        rt_thread_delay(1000);
    }
}

int main(void)
{
    /*创建线程1*/
    tid1 = rt_thread_create("thread1",
                             thread1_entry,RT_NULL,
                             1024,20, 10);

    /*创建线程1*/
    tid2 = rt_thread_create("thread2",
                             thread2_entry,RT_NULL,
                             1024,20, 10);
    /*启动线程*/
    if(tid1 != RT_NULL){rt_thread_startup(tid1);}//线程1不为空，激活线程
    if(tid2 != RT_NULL){rt_thread_startup(tid2);}//线程2不为空，激活线程
    return 0;
}
```