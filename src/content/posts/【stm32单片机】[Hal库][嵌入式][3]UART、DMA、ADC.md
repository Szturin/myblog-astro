---
title: "【stm32单片机】[Hal库][嵌入式][3]UART、DMA、ADC"
published: 2024-09-15
updated: 2024-12-15
tags:
  - 算法
  - 计算机语言
  - 机器人
  - 单片机
  - EDA
  - 电子技术学习
description: ""
---

# [](#一-串口中断超时解析)一、串口中断+超时解析

## [](#1-cubemx配置)1\. CubeMX配置

## [](#11-属性配置)1.1 **属性配置**

主要配置波特率，其余默认

.vpyvllnqfgtk{}![image-20240919224239733](/img/loading.gif)

**中断配置**

Preemption Priority：抢占优先级

Sub Priority: 子优先级

![](/img/loading.gif)

**串口的DMA设置**

只开接收DMA即可

DMA的模式：

-   Normol
-   Circual

![](/img/loading.gif) ![](/img/loading.gif)

## [](#2-驱动程序编写)2\. 驱动程序编写

### [](#21-串口重定向)2.1 串口重定向

**在uasrt.c中进行修改**

![](/img/loading.gif)
```c
int fputc(int ch, FILE * str){	HAL_UART_Transmit(&huart1,(uint8_t *)&ch,1,10);    return ch;}
```

### [](#22-app_uartc-变量定义)2.2 **app_uart.c 变量定义**

```c
uint16_t uart_rx_index = 0;uint16_t uart_tx_ticks = 0;uint8_t uart_rx_buffer[128]={0};
```

### [](#23-中断初始化)2.3 **中断初始化**

放入Core->Src->usart.c中

在初始化中使能串口中断，往buffer中每次填充一个字节，触发中断回调

```c
HAL_UART_Receive_IT(&huart1,uart_rx_buffer,1);
```
![](/img/loading.gif)

> Hal库——中断回调函数
> 
> 在 STM32 的 HAL（硬件抽象层）库中，**中断回调函数**用于处理各种外设的中断事件。这些回调函数由 HAL 库提供，用户只需实现这些函数以响应特定的中断。
> 
> ### [](#1-一般函数-vs-回调函数)1\. **一般函数 vs. 回调函数**
> 
> -   **逻辑限定普通函数的调用**：
>     
>     -   逻辑条件通常在调用函数之前进行检查，确保在满足特定条件时再执行该函数。
>     -   这种方式在函数内部或外部使用条件语句（如 `if`）来控制函数的执行。
>     
>     ```c
>     void normalFunction() {    // 执行某些操作}int main() {    if (condition) {  // 条件检查        normalFunction();  // 仅在条件满足时调用    }    return 0;}
>     ```
>     
> -   **回调函数**：
>     
>     -   回调函数通过传递函数指针来实现灵活的调用，调用发生在某个事件或特定条件下。
>     -   这种机制允许外部函数（如事件处理或异步操作）在需要时调用传递的回调，而不需要直接控制逻辑。
>     
>     ```c
>     void callbackFunction() {    // 执行某些操作}          void eventHandler(void (*callback)()) {    // 某个事件发生后调用回调    callback();  // 不需要在这里检查条件}          int main() {    eventHandler(callbackFunction);  // 传递回调函数    return 0;}
>     ```
>     
> 
> ### [](#2-中断函数-vs-回调函数)2\. **中断函数 vs. 回调函数**
> 
> -   **中断函数**：
>     -   直接处理外设中断的代码，通常是在中断服务例程 (ISR) 中实现。
>     -   代码较为复杂，涉及中断向量、优先级、屏蔽等设置。
>     -   可能会引入较长的中断处理时间，不适合执行复杂的任务。
> -   **回调函数**：
>     -   是一个更高层次的抽象，允许用户在中断发生时执行特定的处理逻辑。
>     -   HAL 库提供的回调函数允许用户定义中断后要执行的操作，而不需要直接修改中断服务例程。
>     -   更易于维护和调试，因为用户只需关注回调函数的逻辑，而不需要管理中断相关的低层实现。

### [](#24-回调函数声明)2.4 回调函数声明

**弱定义**

![](/img/loading.gif) ![](/img/loading.gif)

**自定义回调函数**

可以自行声明与弱定义回调函数同名的函数(重写)，会优先执行自定义的函数

Hal库中各种弱定义都是用__weak修饰的

![](/img/loading.gif)

过程：串口接收->触发回调->进入回调函数

PS: void HAL_UART_RxCpliCallback(UART_HandleTypeDef \*huart) 不要用成 void HAL_UART_TxCpliCallback(UART_HandleTypeDef \*huart)

```c
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart){    if(huart->Instance == USART1)    {        uart_rx_ticks = uwTick;        uart_rx_index++;//索引自增        //每次触发回调，都要重新初始化接收中断，定义接收的位置        HAL_UART_Receive_IT(&huart1,&uart_r_buffer[uart_rx_index],1);    }}
```

### [](#25-串口解析)2.5 串口解析

**超时解析**

```c
void uart_proc(void){    if(uart_rx_index == 0) return;        if(uwTick - uart_rx_ticks > 100)//时间超过100    {        printf("uart data:%s\n",uart_rx_buffer);//发送串口接收内容                memset (uart_rx_buffer,0,uart_rx_index);//清空        uart_rx_index = 0;//指针指令        huart1.pRxBuffPtr = uart_rx_buffer;//uart1缓存区指针指向buffer    }}
```

## [](#无dma和环形缓冲区的问题)**\# 无DMA和环形缓冲区的问题**

> **当串口接收速率过快时，如视觉上位机频繁向单片机发送识别到的坐标数据，可能会导致单片机程序阻塞**
> 
> **1\. 串口阻塞的解决方案**
> 
> ![](/img/loading.gif)
> 
> DMA:数据转运
> 
> RingBuffer:环形缓存区
> 
> **2\. # 环形缓冲区的概念：**
> 
> -   头指针
> -   尾指针

## [](#现象)\# 现象：

### [](#1-串口无解析发送上位机)1\. 串口无解析发送上位机

CubeMX未定义串口引脚，未注意STM32外设引脚可复用问题

![](/img/loading.gif)

### [](#2-回调函数名称错误)2\. 回调函数名称错误

![](/img/loading.gif)

# [](#二-dma空闲中断)二、DMA+空闲中断

## [](#dma的作用)\# DMA的作用

> 无DMA：数据->Uart寄存器->CPU访问Uart寄存器->执行其他程序部分
> 
> ​ -------如果串口通信速率过快------>CPU频繁访问Uart寄存器-------->程序阻塞
> 
> 有DMA：数据->Uart->DMA访问Uart数据->存放到单片机内存地址
> 
> ​ CPU与DMA并行工作

在上述配置的基础上对程序文件进行进一步修改。

## [](#空闲中断)\# 空闲中断

> ### [](#1-什么是空闲中断)1\. 什么是空闲中断？
> 
> 空闲中断（Idle Line Interrupt）是串口通信（UART）中常用的一种硬件中断机制。它用于检测串口接收线路在一段时间内没有接收到数据时触发。**空闲中断的核心原理是检测 UART 外设的接收线路在数据传输结束后变为“空闲”状态**（即，停止接收数据，线路上没有任何活动）。
> 
> 当串口在接收数据时，硬件会自动维护一个“忙状态”标志。所有数据帧（包括起始位、数据位和停止位）都被接收完成后，接收线路进入空闲状态，此时 UART 硬件会触发“空闲中断”。这个中断标志仅在接收数据后首次空闲时触发，而不是每次线路空闲都会触发。因此，空闲中断能够用于判断数据帧的结束或检测数据包的传输完成。(比如，一个数据帧的长度为8个字节，在串口通信时每帧间隔一个字节来发送，在间隔的这个字节，触发空闲中断，进而可以在中断程序中处理数据帧)
> 
> ### [](#2-空闲中断在串口通信中的作用)2\. 空闲中断在串口通信中的作用
> 
> 空闲中断主要用于处理非固定长度的串口数据帧和高效的 DMA（Direct Memory Access，直接内存访问）数据传输。其作用和优势如下：
> 
> #### [](#21-非固定长度数据包接收)2.1 **非固定长度数据包接收**
> 
> -   当接收的数据是非固定长度时，很难在接收时预先设定要接收的数据长度。这时，可以利用空闲中断判断数据的结束。
> -   当串口在 DMA 模式下接收数据时，无法使用常规的中断方式逐字节进行处理。使用空闲中断可以更高效地处理数据流，从而判断整个数据包的接收是否完成。
> 
> #### [](#22-提高串口通信的效率)2.2 **提高串口通信的效率**
> 
> -   使用空闲中断能够在 DMA 模式下提高串口通信的效率。当 DMA 缓冲区被填满或者数据接收超时时，空闲中断可以用于自动触发数据处理，避免了使用传统的定时器轮询方式。
> -   通过判断空闲中断触发时间，可以精确判断数据包的传输完成，不必每次都等待接收缓冲区被填满才进行处理，从而提高系统响应速度。
> 
> #### [](#23-降低-cpu-占用)2.3 **降低 CPU 占用**
> 
> -   使用空闲中断配合 DMA 接收，可以降低 CPU 的使用率。在 DMA 接收过程中，数据自动从串口移入缓冲区，不需要 CPU 的参与，只有在接收结束或空闲中断触发时才进行数据处理。
> -   对于接收频繁但数量不定的数据流（如传感器数据、通信协议数据包），使用空闲中断能极大地减少 CPU 的负担。
> 
> ### [](#3-空闲中断在串口通信中的典型应用场景)3\. 空闲中断在串口通信中的典型应用场景
> 
> #### [](#31-接收数据包的完整性判断)3.1 **接收数据包的完整性判断**
> 
> 对于 UART 接收非固定长度的数据包（如 Modbus、串口通信协议），可以使用空闲中断来判断数据帧的结束。
> 
> **典型场景：**  
> 假设通过 UART 接收的数据包长度不定，当接收到一个完整的数据帧时，串口线路会进入空闲状态，此时触发空闲中断，可以认为本次数据接收结束。
> 
> ```plaintext
> c复制代码// 空闲中断回调函数示例void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t Size) {    if (__HAL_UART_GET_FLAG(huart, UART_FLAG_
> ```

## [](#1-变量声明)1\. 变量声明

**声明 uart_rx_dma_buffer变量，用于数据转运**

![](/img/loading.gif)

## [](#2-中断初始化)2\. **中断初始化**

启用DMA相关中断

关闭DMA半中断

![](/img/loading.gif)

**PS: 不再适用串口回调，改用DMA的方法**

![](/img/loading.gif)

## [](#3-串口中断函数)3\. **串口中断函数**

每次触发串口中断，触发DMA中断

![](/img/loading.gif)

**取消使用串口中断回调函数**

![](/img/loading.gif)

**改用空闲中断回调函数**

PS: 不再需要串口超时解析

![](/img/loading.gif) ![](/img/loading.gif)

## [](#现象-2)\# 现象：

![](/img/loading.gif)

## [](#补充中断函数与回调函数的区别)\# 补充——中断函数与回调函数的区别

> 在嵌入式编程中，HAL（硬件抽象层）库的中断函数和回调函数是常见的机制，尤其是在处理外设操作时。这两者的作用有时容易混淆，但它们的概念和使用场景有所不同。下面详细解释它们的区别：
> 
> ### [](#1-中断函数interrupt-service-routine-isr)1\. 中断函数（Interrupt Service Routine, ISR）
> 
> 中断函数是一段处理硬件中断的代码。当外设或处理器触发中断时，处理器会暂停当前的代码执行，转而执行与该中断对应的ISR。一旦中断被处理完毕，程序会恢复到原来的执行状态。
> 
> -   **执行方式**：硬件触发，直接由处理器执行，通常是高优先级。
> -   **响应时间**：要求短小精悍，不能执行耗时的任务，因为会阻塞其他中断。
> -   **位置**：ISR通常定义在HAL库或用户代码中，是一个固定的函数（如`TIM_IRQHandler`等）。
> -   **调用方式**：自动触发，由硬件中断控制器（NVIC）决定何时调用中断处理函数。
> 
> ### [](#2-回调函数callback-function)2\. 回调函数（Callback Function）
> 
> 回调函数是一个函数指针，通过预先注册到某个模块或API中，等到某个事件发生时，由该模块或API负责调用。HAL库中的回调函数通常是在中断处理完毕后，由ISR或HAL库内部调用，用来进一步处理用户逻辑。
> 
> -   **执行方式**：由程序代码（比如ISR或定时器事件）调用，响应某个事件。
> -   **响应时间**：回调函数不要求像中断处理函数那样必须快速完成，往往用于处理稍复杂的业务逻辑。
> -   **位置**：回调函数通常由用户实现，并由HAL库的中断处理函数或其他机制调用（如`HAL_TIM_PeriodElapsedCallback`）。
> -   **调用方式**：回调函数不是直接由硬件触发，而是由软件触发，即当中断函数处理完硬件中断后，再调用用户注册的回调函数。
> 
> ### [](#简单总结区别)简单总结区别：
> 
> -   **触发机制**：中断函数是由硬件事件（如定时器溢出、外部信号等）直接触发，而回调函数是由软件（如ISR）触发。
> -   **职责范围**：中断函数负责处理硬件中断，通常需要快速执行；回调函数则处理用户定义的业务逻辑，通常可以有更多的处理空间和时间。
> -   **优先级**：中断函数的优先级较高，回调函数的执行时间不受硬件中断控制，通常在中断函数结束之后才执行。
> 
> ### [](#典型应用场景)典型应用场景
> 
> 以定时器为例：
> 
> -   当定时器溢出时，触发一个中断，执行定时器的中断函数`TIM_IRQHandler`。
> -   在中断函数内部，可能会调用HAL库的定时器回调函数`HAL_TIM_PeriodElapsedCallback`，用于用户自定义的定时器周期性任务处理。
> 
> 这就是中断函数和回调函数的核心区别。

# [](#三-环形缓冲区)三、环形缓冲区

## [](#环形缓冲区的简介)\# 环形缓冲区的简介

> 环形缓存区，也叫环形缓冲区（Ring Buffer）或循环缓冲区，是一种数据结构。它的特点 是缓存区的头和尾是连接在一起的，形成一个环。当数据写入缓冲区时，指针会不断前进，当到达缓冲区的末尾时，会重新回到开头，这样就实现了一个循环。
> 
> **环形缓冲区的组成**：
> 
> -   缓冲区数组：存放数据
> -   头指针（读指针）
> -   尾指针（写指针）
> 
> 环形缓冲区满足“先进先出的原则”
> 
> **环形缓冲区的优势**：
> 
> -   在普通串口接收中，数据是线性接收的，通常是通过中断或者轮询的方式处理数据。
> -   而环形缓冲区适用于需要持续接收和处理数据的应用，如串口通信
> -   环形缓冲区效率和可靠性高，但是需要复杂的管理逻辑
> 
> **环形缓冲区的原理及实现**：
> 
> [环形缓冲区(ring buffer)原理与实现详解-CSDN博客](https://blog.csdn.net/2401_86353562/article/details/141830232)
> 
> ![](/img/loading.gif)
> 
> **简单代码实现：**
> 
> 缓冲区结构体定义
> 
> ```c
> #define RINGBUFFER_SIZE (30) typedef struct {    uint32_t w;    uint32_t r;    uint8_t buffer[RINGBUFFER_SIZE];    uint32_t itemCount;}ringbuffer_t;
> ```
> 
> 初始化环形缓冲区
> 
> 置零环形缓冲区中的元素
> 
> 这里用到`memset`函数
> 
> -   解释：复制字符 c（一个无符号字符）到参数 str 所指向的字符串的前 n 个字符。
> -   作用：是在一段内存块中填充某个给定的值，它是对较大的结构体或数组进行清零操作的一种最快方法
> -   头文件：C中`#include<string.h>`，C++中`#include<cstring>`
> 
> 这里指向的是环形缓冲区内容buffer，为uint8_t类型的数组变量，数组大小为`RINGBUFFER_SIZE`，使用这段语句将buffer中的内存块内容置零。
> 
> ```c
> // 初始化环形缓冲区void ringbuffer_init(ringbuffer_t *rb){    // 设置读指针和写指针初始值为0    rb->r = 0;    rb->w = 0;    // 将缓冲区内存清零    memset(rb->buffer, 0, sizeof(uint8_t) * RINGBUFFER_SIZE);    // 初始化项目计数为0    rb->itemCount = 0;}
> ```
> 
> 检查缓冲区是否已满
> 
> ```c
> // 检查环形缓冲区是否已满uint8_t ringbuffer_is_full(ringbuffer_t *rb){    // 如果项目计数等于缓冲区大小，返回1（已满），否则返回0（未满）    return (rb->itemCount == RINGBUFFER_SIZE);}
> ```
> 
> 检查缓冲区是否为空
> 
> ```c
> // 检查环形缓冲区是否为空uint8_t ringbuffer_is_empty(ringbuffer_t *rb){    // 如果项目计数为0，返回1（为空），否则返回0（非空）    return (rb->itemCount == 0);}
> ```
> 
> 向环形缓冲区写入数据
> 
> 这里限制了向环形缓冲区写入数据的个数：即限定在环形缓冲区数组索引大小内
> 
> 数据根据写指针当前指向的位置，进行写入。数据完成写入后，写指针递增。如果写指针当前到达缓冲区索引尾部，那么返回索引头部，即指向0
> 
> 此段代码管理逻辑中，如果当前的环形缓冲区已经写满，需要经过将缓冲区的数据取出后，才能继续对缓冲区进行写入操作
> 
> ```c
> // 向环形缓冲区写入数据int8_t ringbuffer_write(ringbuffer_t *rb, uint8_t *data, uint32_t num){    // 如果缓冲区已满，返回-1    if(ringbuffer_is_full(rb))        return -1;            // 将数据写入缓冲区    while(num--)    {        rb->buffer[rb->w] = *data++;  // 写入数据并移动写指针        rb->w = (rb->w + 1) % RINGBUFFER_SIZE;  // 写指针循环递增        rb->itemCount++;  // 增加项目计数    }        return 0;  // 写入成功返回0}
> ```
> 
> 从缓冲区读取数据
> 
> 缓冲区有数据，操作才有效
> 
> 数据根据读指针当前指向的位置，进行读取。数据完成读取后，读指针递增。如果读指针当前到达缓冲区索引尾部，那么返回索引头部，即指向0。
> 
> ```c
> // 从环形缓冲区读取数据int8_t ringbuffer_read(ringbuffer_t *rb, uint8_t *data, uint32_t num){    // 如果缓冲区为空，返回-1    if(ringbuffer_is_empty(rb))        return -1;        // 从缓冲区读取数据    while(num--)    {        *data++ = rb->buffer[rb->r];  // 读取数据并移动读指针        rb->r = (rb->r + 1) % RINGBUFFER_SIZE;  // 读指针循环递增        rb->itemCount--;  // 减少项目计数    }    return 0;  // 读取成功返回0}
> ```

## [](#1-移植环形缓冲区驱动文件)1\. **移植环形缓冲区驱动文件**

```c
ringbuffer_t usart_rb; //定义ringbuffer_t类型结构体变量uint8_t usart_read_buffer[128];//定义环形缓存区数组
```

-   判断ringbuffer是否满
-   写入数据
-   清空结构体

## [](#2-空闲中断回调函数)2\. **空闲中断回调函数**

```c
/**   * @brief UART DMA接收完成回调函数 			将接收到的数据写入环形缓冲区，并清空DMA缓冲区  * @param huart UART句柄   * @param Size 接收到的数据大小   * @retval None  *///空闲中断回调函数void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t Size){	if (huart->Instance == USART1)  // 判断是 USART1 触发的中断	{		//引入环形缓存区		if(!ringbuffer_is_full(&usart_rb))//判断环形缓存区是否为空		{			ringbuffer_write(&usart_rb,uart_rx_dma_buffer,Size);//将DMA缓冲区中的数据写入环形缓冲区			memset(uart_rx_dma_buffer,0,sizeof(uart_rx_dma_buffer));//清空		}			}}
```

## [](#2-修改串口解析)2\. **修改串口解析**

```c
void uart_proc(){    if(ringbuffer_is_empty(&usart_rb))return;    ringbuffer_read(&usart_rb,usart_read_buffer,usart_rb.itemCount);    printf("ringbuffer data:%s\n",usart_read_buffer);    meset(usart_read_buffer,0,sizeof(uint8_t)*128);}
```

**STM32串口通信方法总结:**

-   超时解析
    
-   DMA空闲中断
    
-   环形缓存区
    

# [](#四-adc和dma)四、ADC和DMA

> STM32的ADC（模数转换器）通道IN11指的是STM32微控制器上一个特定的ADC输入通道。每个STM32芯片的ADC都有多个模拟输入引脚，这些引脚标记为`INx`（例如IN0、IN1、IN2等），对应不同的GPIO引脚。
> 
> 具体到**IN11**，它是ADC的第11个输入通道，通常与一个特定的GPIO引脚连接。该引脚用于将模拟信号输入到ADC进行模数转换。
> 
> CT117E原理图：
> 
> ![](/img/loading.gif)

## [](#1-cubemx配置-2)1\. CubeMX配置

### [](#11-adc通道分配)1.1 **ADC通道分配：**

-   ADC1: IN11
-   ADC2: IN15

![](/img/loading.gif)

### [](#12-配置dma)1.2 配置DMA

#### [](#121-配置dma通道)1.2.1 配置DMA通道

![](/img/loading.gif)

#### [](#122-配置为循环模式)1.2.2 配置为循环模式

![](/img/loading.gif)

#### [](#123-配置dma速度)1.2.3 配置DMA速度

设置为中、高均可

![](/img/loading.gif)

### [](#13-配置adc属性)1.3 **配置ADC属性**

-   四分频
-   DMA使能
-   循环使能

![](/img/loading.gif)

### [](#14-配置adc中断)1.4 **配置ADC中断**

优先级为2即可

![](/img/loading.gif)

## [](#2-驱动程序编写-2)2\. 驱动程序编写

### [](#21-创建adc_appc)2.1 **创建adc_app.c**

**变量声明**

![](/img/loading.gif)
```c
#include "adc_app.h"uint32_t dma_buff[2][30];//双通道DMAfloat adc_value[2];
```

**在主程序初始化启用DMA 转运 ADC 数据**

![](/img/loading.gif)

### [](#22-定义adc进程)2.2 **定义ADC进程**

![](/img/loading.gif)

-   读取电压dma储存数据
-   转换为模拟电压值

同样的，记得在任务调度器中添加proc

### [](#23-lcd显示)2.3 **lcd显示**

![](/img/loading.gif)

## [](#动态窗口)\# **动态窗口**

-   使用环形缓存区
-   定义结构体

![](/img/loading.gif) ![](/img/loading.gif)

# [](#多串口通信)多串口通信

## [](#示例一)示例一

使用DMA+环形缓冲区+空闲中断回调的方法，使用串口通信，在解析函数中每次解析对象为串口一次性连续接收到的数据。

所以，在解析函数`uart_proc`中一次完成对串口数据内容的解析即可，不需要再用状态机的判断逻辑。

```c
#include "usart_app.h"uint16_t uart_rx_index = 0;uint16_t uart_rx_ticks = 0;uint8_t uart_rx_buffer[128]={0};uint8_t uart_rx_dma_buffer[128]={0};ringbuffer_t usart_rb; //定义ringbuffer_t类型结构体变量uint8_t usart_read_buffer[128];//定义环形缓存区数组uint8_t uart2_rx_buffer[128]={0};uint8_t uart2_rx_dma_buffer[128]={0};ringbuffer_t usart2_rb; //定义ringbuffer_t类型结构体变量uint8_t usart2_read_buffer[128];//定义环形缓存区数组DataPacket context; // 初始化上下文//串口中断回调函数//void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)//{//    if(huart->Instance == USART1)//    {//        uart_rx_ticks = uwTick;//        uart_rx_index++;//索引自增//        //每次触发回调，都要重新初始化接收中断，定义接收的位置//        HAL_UART_Receive_IT(&huart1,&uart_rx_buffer[uart_rx_index],1);//		//printf("test");//排错//    }//}//空闲中断回调函数void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t Size){	printf("dma data:%s\n",uart2_rx_dma_buffer);//发送串口接收内容		if (huart->Instance == USART1)  // 判断是 USART1 触发的中断	{		//引入环形缓存区		if(!ringbuffer_is_full(&usart_rb))//判断环形缓存区是否为空		{			ringbuffer_write(&usart_rb,uart_rx_dma_buffer,Size);//将DMA缓冲区中的数据写入环形缓冲区			memset(uart_rx_dma_buffer,0,sizeof(uart_rx_dma_buffer));//清空		}			}	else if(huart->Instance == USART2)  // 判断是 USART2 触发的中断	{		if(!ringbuffer_is_full(&usart2_rb))//判断环形缓存区是否为空		{			printf("OK\n");			ringbuffer_write(&usart2_rb,uart2_rx_dma_buffer,Size);//将DMA缓冲区中的数据写入环形缓冲区			memset(uart2_rx_dma_buffer,0,sizeof(uart2_rx_dma_buffer));//清空			}		}}void uart_proc(void){//    if(uart_rx_index == 0) return;//    //    if(uwTick - uart_rx_ticks > 100)//时间超过100//    {//        printf("uart data:%s\n",uart_rx_buffer);//发送串口接收内容//        //        memset (uart_rx_buffer,0,uart_rx_index);//清空//        uart_rx_index = 0;//指针指令//        huart1.pRxBuffPtr = uart_rx_buffer;//uart1缓存区指针指向buffer//    }	// 如果环形缓冲区为空，直接返回 		if(ringbuffer_is_empty(&usart_rb) && ringbuffer_is_empty(&usart2_rb)) return;		// 从环形缓冲区读取数据到读取缓冲区 		//ringbuffer_read(&usart_rb, usart_read_buffer, usart_rb.itemCount);	ringbuffer_read(&usart2_rb, usart2_read_buffer, usart2_rb.itemCount);	// 打印读取缓冲区中的数据 	//printf("ringbuffer data: %s\n", usart_read_buffer);	// 上位机<test协议>	//printf("{plotter}%s\r\n", usart_read_buffer);		//问题1：用状态机写，会导致无法一次性解码；	//使用串口上位机，发现每次发送串口数据，状态机才会+1		/*	if(usart_read_buffer[0] == 0xFF && usart_read_buffer[3] == 0xFB)//帧头帧尾检测	{		if(usart_read_buffer[1] == 0x2A){			context.data_type = 1;//正数		}		else if(usart_read_buffer[1] == 0x2B){			context.data_type = 2;//负数		}				context.data = usart_read_buffer[2];		number_detect = context.data;	}	*/		//parse_buffer(usart_read_buffer,sizeof(usart_read_buffer),&context);	parse_buffer(usart2_read_buffer,sizeof(usart2_read_buffer),&context);	//问题2：无memset会怎么样？	//memset(usart_read_buffer, 0, sizeof(uint8_t) * BUUFER_SIZE);		memset(usart2_read_buffer, 0, sizeof(uint8_t) * BUUFER_SIZE);	}//数据帧解析函数int parse_buffer(uint8_t *buffer,size_t size,DataPacket* data){	if(size < 4)return 0;//数据帧长度小于4，返回 0 表示解析失败		if(buffer[0] == 0xFF && buffer[3] == 0xFB)//帧头帧尾检测	{				if(buffer[1] == 0x2A){			data -> data_type = 1;//正数			data -> data = buffer[2];		}		else if(buffer[1] == 0x2B){			data -> data_type = 2;//负数			data -> data = buffer[2];		}				else{			return 0; //非正确类型，解析失败		}		return 1;//解析成功	}	else{		return 0; //帧头帧尾错误，解析失败	}}void test_proc(){	//printf("%c%c\n", context.state,usart_read_buffer[2]);}
```
