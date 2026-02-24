---
title: "【stm32单片机】[操作系统][RT-Thread][2]线程同步"
published: 2024-11-12
updated: 2024-11-15
description: ""
category: 学习笔记
tags:
  - 操作系统
  - RT-Thread
  - STM32
  - 嵌入式软件
---

# RT-Thread Shell

![](/posts/57490/image-20241112231454047.png)

# RT-Thread定时器

![](/posts/57490/image-20241112231531184.png)

-   软定时器：在系统线程timer中执行，通过shell可以查看到系统默认开启了一个timer进程
-   硬定时器：回调函数在中断上下文中执行

## 1. 定时器的创建过程

```c
/*
 * Copyright (c) 2006-2024, RT-Thread Development Team
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-10-17     RT-Thread    first version
 */

#include <rtthread.h>

static rt_thread_t timer1; //定义定时器
static rt_thread_t timer2;

//定义超时回调函数
static void timerout1(void *paramer){
    rt_kprintf("one_shot timeout");
}

static void timerout2(void *paramer){
    rt_kprintf("periodic timeout");
}



int main(void)
{
    /*创建周期定时器*/
    timer1 = rt_timer_create("timer1",  //定时器名称
                              timerout1, //超时函数
                              RT_NULL,  //无参数
                              100,      //时间...
                              RT_TIMER_FLAG_PERIODIC);  //周期性

    //启动定时器
    if(timer1 != RT_NULL) rt_timer_start(timer1);

    /*创建单次定时器*/
    timer2 = rt_timer_create("timer2",  //定时器名称
                              timerout2, //超时函数
                              RT_NULL,  //无参数
                              100,      //时间...
                              RT_TIMER_FLAG_ONE_SHOT);  //单次

    if(timer2 != RT_NULL) rt_timer_start(timer2);

    return 0;
}
```