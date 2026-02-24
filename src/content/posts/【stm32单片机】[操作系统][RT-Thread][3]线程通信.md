---
title: "【stm32单片机】[操作系统][RT-Thread][3]线程通信"
published: 2024-11-12
updated: 2024-11-15
description: ""
---

# [](#邮箱)邮箱

邮箱的字节数固定为4个字节。

## [](#紧急消息)紧急消息

## [](#动态和静态分配)动态和静态分配

操作系统中动态分配和静态分配的区别

### [](#1-动态分配)1\. 动态分配

动态分配在**堆**里面，优点是能够灵活分配内存，能够在程序运行中进行内存申请

### [](#2-静态分配)2\. 静态分配

分配在**栈**里面，编译时就会分配好内存

## [](#示例)示例

```c
/* 创建一个容量为4的邮箱 */mb = rt_mb_create("mb", 4, RT_IPC_FLAG_PRIO);
```

容量是什么？

-   容量是邮件的个数，容量是4，表示同时能发送四份邮件。

创建容量为4的邮箱，在堆中会申请4x4Byte的空间。

**邮箱代码例程**

> rt\_mb\_recv(mb, (rt\_uint32\_t\*)&msg, RT\_WAITING\_FOREVER); // 接收邮件
> 
> 这里RT\_WAITING\_FOREVER表示阻塞式等待
> 
> 改成RT\_WAITING\_NO则表示非阻塞式等待

```c
#include <rtthread.h>/* 创建邮箱 */rt_mailbox_t mb;/* 线程1：发送邮件 */void thread_entry1(void *parameter){    char msg = 'A'; // 发送字母'A'作为邮件    rt_kprintf("线程1：发送邮件...\n");    rt_mb_send(mb, (rt_uint32_t)msg); // 发送邮件}/* 线程2：接收邮件 */void thread_entry2(void *parameter){    char msg;    rt_kprintf("线程2：等待接收邮件...\n");    rt_mb_recv(mb, (rt_uint32_t*)&msg, RT_WAITING_FOREVER); // 接收邮件    rt_kprintf("线程2：收到邮件：%c\n", msg); // 打印收到的邮件内容}int main(void){    /* 创建一个容量为4的邮箱 */    mb = rt_mb_create("mb", 4, RT_IPC_FLAG_PRIO);    /* 创建两个线程 */    rt_thread_t tid1 = rt_thread_create("t1", thread_entry1, RT_NULL, 1024, 10, 10);    rt_thread_t tid2 = rt_thread_create("t2", thread_entry2, RT_NULL, 1024, 10, 10);    /* 启动线程 */    rt_thread_startup(tid1);    rt_thread_startup(tid2);    return 0;}
```

通过对邮箱通信的了解后，怎么解决裸机开发中全局变量，在RTOS中的资源抢占问题？

实际开发中，各种传感器的数据结构可能比较复杂，而静态的内存分配机制比较固定，不太适合处理复杂的数据。

我们可以引入消息队列：

## [](#消息队列)消息队列

## [](#信号)信号
