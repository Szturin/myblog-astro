---
title: "【stm32单片机】[Hal库][3]嵌入式工程模板与“任务调度器”"
published: 2024-09-09
---

# 一、任务调度器

## 1. 调度器结构体

**指针函数:**

```c
//调度器类型的结构体类型声明
//任务结构
typedef struct {
    void *task_func(void);//指针函数
    uint32_t rate_ms;//任务运行周期
    uint32_t last_run;//上次运行时间
} scheduler_task_t;
```

``typedef struct {} scheduler_task_t;``是⼀种定义新结构体类型的⽅式，这⾥定义 了⼀个名为  scheduler_task_t 的结构体类型。这个结构体类型包含三个成员。

- ``void *task_func(void);``定义了一个函数指针，用于储存任务函数的地址，便于进行任务调度

- ``rate_ms``表示任务具体的执行周期
- ``last_run``⽤于存储任务上次运⾏的时间戳（以毫秒为单位）。该成员⽤于 记录任务上⼀次被调度执⾏的时间点，以便计算任务是否需要再次执⾏



静态任务数组，每个任务包括任务函数，执行周期，和上次执行时间

```c
void Led_task(){

}

//定义调度器类型的变量 任务
//任务数组
//给scheduler_task_t类型变量tasks赋初值
static scheduler_task_t tasks[] ={
    {Led_task,1000,0}//定义一个任务，任务函数为Led_Proc,执行周期为1000毫秒，初始上次运行时间为0
};
```

## 2. 调度器初始化

```c
void scheduler_init(void){
    //计算任务数组中任务函数的个数，结果储存在tasks_num中
    tasks_num = sizeof(tasks)/sizeof(scheduler_task_t);
}
```

## 3. 调度器函数

遍历任务数组，检查是否有任务需要进行，如果系统当前时间超过任务的执行周期，那么执行任务变更，并且更新上次运行时间

```c
void scheduler_run(void){
    /*任务轮询*/
    for(uint8_t i=0; i< tasks_num; i++){
        //获取当前时间（毫秒）
        uint8_t time_now = HAL_GetTick();
        //检查任务是否到达当前时间点
        if(time_now >= tasks[i].rate_ms + tasks[i].last_run){
            //更新任务的上次运行时间，保存时间戳
            tasks[i].last_run = time_now;//保存当前时间
            tasks[i].task_func();//执行对应指向的任务
        }
    }
}
```

