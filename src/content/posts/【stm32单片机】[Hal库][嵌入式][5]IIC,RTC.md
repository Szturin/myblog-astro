---
title: "【stm32单片机】[Hal库][嵌入式][5]IIC,RTC"
published: 2024-10-07
updated: 2024-10-29
description: ""
---

# [](#iic模块)IIC模块

## [](#一-mcp4017)一、MCP4017

MCP4017 是一款由 Microchip Technology 公司生产的数字电位器。它是一种电子元件，通常用于调整电压、增益或信号强度，类似于传统的机械电位器，但可以通过数字控制来调节。

以下是 MCP4017 的一些主要特点：

1.  **数字电位器**：MCP4017 是一个单通道的 7 位数字电位器，分辨率为 128 个不同的电阻值（2^7 = 128 步）。
2.  **I²C 接口**：它使用 I²C 通信协议进行控制，通过两个引脚（SCL 和 SDA）与主设备通信。I²C 是一种广泛使用的双线通信协议，适合用于低速设备。
3.  **低功耗**：MCP4017 设计为低功耗设备，适合需要节能的应用场景。
4.  **电阻范围**：MCP4017 提供了不同的电阻范围，常见的型号包括 5kΩ、10kΩ、50kΩ 和 100kΩ 等。用户可以通过 I²C 指令在这些范围内调节电阻值。
5.  **非易失性存储器**：该器件不带非易失性存储器（EEPROM），因此每次上电后，电位器的默认设置是中间值（即 64/128 的位置）。
6.  **应用场景**：MCP4017 常用于音频调节、信号处理、传感器校准等需要精确调节电阻的场合。

## [](#二-阅读芯片手册)二、阅读芯片手册

I2C地址：0101111

![](/posts/27956/image-20241007234812331.png)

## [](#三-hal库api)三、Hal库API

## [](#四-cubemx配置)四、CubeMX配置

> ## [](#rtc)RTC :
> 
> STM32 的 **RTC**（实时时钟）是集成在 STM32 微控制器中的一个外设，用于保持时间和日期信息，即使在主系统电源断电时也能继续工作。STM32 的 RTC 是独立的、低功耗的，可以通过外部备用电源（如纽扣电池）或内置备用电源来运行。
> 
> ### [](#stm32-rtc-的主要功能)STM32 RTC 的主要功能：
> 
> 1.  **实时时钟**：提供年、月、日、星期、小时、分钟、秒的时间和日期计时功能。
> 2.  **闹钟功能**：STM32 的 RTC 可以设置定时闹钟，在指定时间触发事件，常用于定时唤醒或触发任务。
> 3.  **时间戳**：能够记录事件发生时的精确时间，例如在外部中断或特定事件发生时。
> 4.  **周期性唤醒**：RTC 支持通过定时唤醒系统进入低功耗模式，如待机模式或休眠模式，帮助实现低功耗设计。
> 5.  **低功耗**：RTC 在超低功耗模式下运行，可以使用独立的低速时钟源（如 LSE，外部 32.768 kHz 晶振）或内部低速时钟（LSI）。
> 
> ### [](#rtc-的时钟源)RTC 的时钟源
> 
> STM32 的 RTC 通常依赖于一个低速的时钟源来保持准确的时间。常见的时钟源有：
> 
> -   **LSE (Low-Speed External)**：外部 32.768 kHz 晶振，精度高，适合精确计时。
> -   **LSI (Low-Speed Internal)**：内部低速 RC 振荡器，功耗低，但精度较差。
> 
> ### [](#常见应用场景)常见应用场景：
> 
> -   **电子钟表、日历**：嵌入式系统中经常需要长时间保持准确时间的设备。
> -   **低功耗设计**：通过 RTC 实现系统定时唤醒和进入低功耗模式，节省电池能量。
> -   **时间戳记录**：在数据记录系统或日志系统中，RTC 用于标记数据生成的时间。

### [](#配置rtc)配置RTC

![](/posts/27956/image-20241008003141122.png)

-   Activate Clock Source：激活时钟源
-   Activate Calendar：激活日历

### [](#配置时钟树)配置时钟树

![](/posts/27956/image-20241008003433105.png) ![](/posts/27956/image-20241008003518489.png)

Asynchronous Predivider和Synchronous Predivider是用来分频的两个寄存器，RTC的时钟源（LSE、LSI或HSE/32）需要经过这些分频器后，才能提供给RTC时钟

-   Asynchronous Predivider value：异步预分器值，125，通常用于降低功耗，
-   Synchronous Predivider value：同步预分频器值，6000，用于精确调节RTC的计时

6000 x 125 = 750KHz，速度最快，精度最高

![](/posts/27956/image-20241008003736355.png)

-   二进制
-   时、分、秒

## [](#五-编写底层驱动)五、编写底层驱动

```c
#include "rtc_app.h"RTC_TimeTypeDef time;//定义时间结构体RTC_DataTypeDef date;//定义日期结构体void rtc_proc(void){    HAL_RTC_GetTime(&hrtc,&time,RTC_FORMAT_BIN);    HAL_RTC_GetDate(&hrtc,&date,RTC_FORMAT_BIN);}
```
```c
#include "rtc.h"#include "bsp_system.h"void rtc_proc(void);
```

**HAL库源码**

1.RTC数据类型

```c
/**  * @brief  RTC Time structure definition  */typedef struct{  uint8_t Hours;            /*!< Specifies the RTC Time Hour.                                 This parameter must be a number between Min_Data = 0 and Max_Data = 12 if the RTC_HourFormat_12 is selected.                                 This parameter must be a number between Min_Data = 0 and Max_Data = 23 if the RTC_HourFormat_24 is selected */  uint8_t Minutes;          /*!< Specifies the RTC Time Minutes.                                 This parameter must be a number between Min_Data = 0 and Max_Data = 59 */  uint8_t Seconds;          /*!< Specifies the RTC Time Seconds.                                 This parameter must be a number between Min_Data = 0 and Max_Data = 59 */  uint8_t TimeFormat;       /*!< Specifies the RTC AM/PM Time.                                 This parameter can be a value of @ref RTC_AM_PM_Definitions */  uint32_t SubSeconds;     /*!< Specifies the RTC_SSR RTC Sub Second register content.                                 This parameter corresponds to a time unit range between [0-1] Second                                 with [1 Sec / SecondFraction +1] granularity */  uint32_t SecondFraction;  /*!< Specifies the range or granularity of Sub Second register content                                 corresponding to Synchronous pre-scaler factor value (PREDIV_S)                                 This parameter corresponds to a time unit range between [0-1] Second                                 with [1 Sec / SecondFraction +1] granularity.                                 This field will be used only by HAL_RTC_GetTime function */  uint32_t DayLightSaving;  /*!< This interface is deprecated. To manage Daylight Saving Time,                                 please use HAL_RTC_DST_xxx functions */  uint32_t StoreOperation;  /*!< This interface is deprecated. To manage Daylight Saving Time,                                 please use HAL_RTC_DST_xxx functions */} RTC_TimeTypeDef;/**  * @brief  RTC Date structure definition  */typedef struct{  uint8_t WeekDay;  /*!< Specifies the RTC Date WeekDay.                         This parameter can be a value of @ref RTC_WeekDay_Definitions */  uint8_t Month;    /*!< Specifies the RTC Date Month (in BCD format).                         This parameter can be a value of @ref RTC_Month_Date_Definitions */  uint8_t Date;     /*!< Specifies the RTC Date.                         This parameter must be a number between Min_Data = 1 and Max_Data = 31 */  uint8_t Year;     /*!< Specifies the RTC Date Year.                         This parameter must be a number between Min_Data = 0 and Max_Data = 99 */} RTC_DateTypeDef;
```

2.RTC函数

```c
HAL_StatusTypeDef HAL_RTC_GetTime(RTC_HandleTypeDef *hrtc, RTC_TimeTypeDef *sTime, uint32_t Format){  uint32_t tmpreg;  /* Check the parameters */  assert_param(IS_RTC_FORMAT(Format));  /* Get subseconds structure field from the corresponding register*/  sTime->SubSeconds = READ_REG(hrtc->Instance->SSR);  /* Get SecondFraction structure field from the corresponding register field*/  sTime->SecondFraction = (uint32_t)(READ_REG(hrtc->Instance->PRER) & RTC_PRER_PREDIV_S);  /* Get the TR register */  tmpreg = (uint32_t)(READ_REG(hrtc->Instance->TR) & RTC_TR_RESERVED_MASK);  /* Fill the structure fields with the read parameters */  sTime->Hours = (uint8_t)((tmpreg & (RTC_TR_HT | RTC_TR_HU)) >> RTC_TR_HU_Pos);  sTime->Minutes = (uint8_t)((tmpreg & (RTC_TR_MNT | RTC_TR_MNU)) >> RTC_TR_MNU_Pos);  sTime->Seconds = (uint8_t)((tmpreg & (RTC_TR_ST | RTC_TR_SU)) >> RTC_TR_SU_Pos);  sTime->TimeFormat = (uint8_t)((tmpreg & (RTC_TR_PM)) >> RTC_TR_PM_Pos);  /* Check the input parameters format */  if (Format == RTC_FORMAT_BIN)  {    /* Convert the time structure parameters to Binary format */    sTime->Hours = (uint8_t)RTC_Bcd2ToByte(sTime->Hours);    sTime->Minutes = (uint8_t)RTC_Bcd2ToByte(sTime->Minutes);    sTime->Seconds = (uint8_t)RTC_Bcd2ToByte(sTime->Seconds);  }  return HAL_OK;}
```

> **枚举类型：HAL\_StatusTypeDef**
> 
> > typedef enum  
> > {  
> > HAL\_OK = 0x00U,  
> > HAL\_ERROR = 0x01U,  
> > HAL\_BUSY = 0x02U,  
> > HAL\_TIMEOUT = 0x03U  
> > } HAL\_StatusTypeDef;
> 
> Hal库封装的一个典型思想

## [](#多串口重定向-适合项目复用)多串口重定向-适合项目复用

```c
int my_printf(UART_HandleTypeDef *huart, const char *format, ...) {    char buffer[512];//创建字符缓冲区    va_list arg;//创建可变参数列表    int len;    va_start(arg, format);// 初始化可变参数列表，获取my_printf传入的可变参数    len = vsnprintf(buffer, sizeof(buffer), format, arg);// 将格式化后的可变参数传入缓存区    va_end(arg);// 结束可变参数列表    HAL_UART_Transmit(huart, (uint8_t *)buffer, (uint16_t)len, 0xFF); // 将字符缓存数组发送出去    return len;}
```
