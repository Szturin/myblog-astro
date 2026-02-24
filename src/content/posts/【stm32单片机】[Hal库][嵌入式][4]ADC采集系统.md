---
title: "【stm32单片机】[Hal库][嵌入式][4]ADC采集系统"
published: 2024-09-29
updated: 2024-10-29
tags:
  - 算法
  - 计算机语言
  - 机器人
  - 单片机
  - EDA
  - 电子技术学习
description: ""
---

# [](#vscode配置stm32编译调试环境)**\# VsCode配置STM32编译调试环境**

[【保姆】vscode配置单片机编译调试烧录环境（以STM32为例）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1BJeJehEkb/?spm_id_from=333.337.search-card.all.click&vd_source=7026df729530ac261e29b43864230918)

# [](#一-adc采集系统)一、ADC采集系统

## [](#1-adc通道外部电路)1\. ADC通道(外部电路)

![](/img/loading.gif)

## [](#2-功能要求)2\. 功能要求

![](/img/loading.gif)

## [](#3-动态窗口)3\. 动态窗口

![](/img/loading.gif)

**"动态"的含义：3秒的实时采集窗口随着时间自行移动，adc采集的值动态实时更新在3s的窗口数据内**

![](/img/loading.gif)

# [](#二-功能实现)二、功能实现

## [](#1-adc解算)1\. ADC解算

```c
uint32_t dma_buff[2][30];//双通道DMAfloat adc_value[2];void adc_proc() {	for(uint8_t i=0;i<30;i++) 	{		adc_value[0] += (float)dma_buff[0][i]; 		adc_value[1] += (float)dma_buff[1][i];	}        //10进制模拟量电压	//adc_value[0] = adc_value[0] / 30 *3.3f / 4096; 	//adc_value[1] = adc_value[1] / 30 *3.3f / 4096;	    //不对分辨率和参考电压进行解算    //16进制数字量电压	adc_value[0] = adc_value[0] / (30+1);	adc_value[1] = adc_value[1] / (30+1);}
```

## [](#2-lcd底层实现)2\. LCD底层实现

### [](#21-变量定义)2.1 **变量定义**

```c
uint8_t lcd_disp_mode;//lcd显示模式uint16_t ph_value;//PH值uint16_t pd_value;//PD值
```

参数界面

![](/img/loading.gif)

记录界面

![](/img/loading.gif)

### [](#22-lcd进程)2.2 **LCD进程**

由于4T官方提供的LCD底层驱动，当显示的数据位数增加时，显示的位数会增加，但是当位数减小时，却不能对旧的数据进行清空。

所以这里用“空格”来覆盖刷新，达到位数减小显示缩减的效果。

```c
void lcd_proc(){    switch(lcd_disp_mode){        case 0:            	LCD_Sprintf(Line1,"        DATA");            	LCD_Sprintf(Line3,"   R37:%d    ",(int)adc_value[0]);            	LCD_Sprintf(Line4,"   R38:%d    ",(int)adc_value[1]);            break;        case 1:                }}
```

### [](#lcd背光-问题)#LCD背光 问题

**现象：如图所示，只有在对LCD写入的片段，LCD才有正常的背景**

![](/img/loading.gif)

**原因：未对LCD进行初始化清屏**

```c
/* USER CODE BEGIN 2 */system_init();LCD_Init();LCD_Clear(Black);LCD_SetTextColor(White);LCD_SetBackColor(Black);scheduler_init();
```

**来源：lcd.c**

```c
/******************************************************************************** Function Name  : LCD_Clear* Description    : Clears the hole LCD.* Input          : Color: the color of the background.* Output         : None* Return         : None*******************************************************************************/void LCD_Clear(u16 Color){    u32 index = 0;    LCD_SetCursor(0x00, 0x0000);    LCD_WriteRAM_Prepare(); /* Prepare to write GRAM */    for(index = 0; index < 76800; index++)    {        LCD_WR_DATA(Color);    }}
```

### [](#23-led功能和初始化状态)2.3 LED功能和初始化状态

![](/img/loading.gif)

### [](#24-lcd底层完整代码实现)2.4 LCD底层完整代码实现

```c
#include "bsp_system.h"uint8_t lcd_disp_mode;    // lcd显示模式uint16_t ph_value = 2000; // PH值uint16_t pd_value = 1000; // PD值uint16_t vh_value;        // PH值uint16_t vd_value;        // PD值/** * @brief  格式化字符串并显示在指定的LCD行上。 * * 该函数接受一个行号和一个格式化字符串（类似于printf）， * 格式化字符串后，将其显示在LCD的指定行上。 * * @param  Line    要显示字符串的LCD行号。 * @param  format  格式化字符串，后跟要格式化的参数。 * * 该函数内部使用 `vsprintf` 来格式化字符串，然后 * 调用 `LCD_DisplayStringLine` 在LCD上显示格式化后的字符串。 * * 示例用法: * @code * LcdSprintf(0, "Temperature: %d C", temperature); * @endcode */void LcdSprintf(uint8_t Line, char *format, ...){    char String[21];                     // 缓冲区用于存储格式化后的字符串    va_list arg;                         // 参数列表用于存储可变参数    va_start(arg, format);               // 使用格式化字符串初始化参数列表    vsprintf(String, format, arg);       // 格式化字符串并存储在缓冲区中    va_end(arg);                         // 清理参数列表    LCD_DisplayStringLine(Line, String); // 在LCD的指定行显示格式化后的字符串}void lcd_proc(){    switch (lcd_disp_mode)    {    case 0: //测量界面        LcdSprintf(Line1, "        DATA");        LcdSprintf(Line3, "   R37:%d    ", (int)adc_value[0]);        LcdSprintf(Line4, "   R38:%d    ", (int)adc_value[1]);        break;    case 1: //参数界面        LcdSprintf(Line1, "        PARA");        LcdSprintf(Line3, "   PH:%d    ", ph_value);        LcdSprintf(Line4, "   PD:%d    ", pd_value);        break;    case 2: //参数界面        LcdSprintf(Line1, "        RECD");        LcdSprintf(Line3, "   VH:%d    ", vh_value);        LcdSprintf(Line4, "   VD:%d    ", vd_value);        break;    }}
```

## [](#3-按键底层)3\. 按键底层

uwTick：在Systick（系统滴答定时器）中断中自增，可以用作单片机运行的时间戳

[HAL库与Cubemx系列|Systick-系统滴答定时器详解-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1861964)

### [](#31-按键处理进程)3.1 按键处理进程

```c
uint8_t ph_pd_flag; //参数修改切换标志位/** * @brief 按键处理函数 * * 该函数用于扫描按键的状态，并更新按键按下和释放的标志 */void key_proc(void){	// 读取当前按键状态	key_val = key_read();	// 计算按下的按键（当前按下状态与前一状态异或，并与当前状态相与）	key_down = key_val & (key_old ^ key_val);	// 计算释放的按键（当前未按下状态与前一状态异或，并与前一状态相与）	key_up = ~key_val & (key_old ^ key_val);	// 更新前一按键状态	key_old = key_val;	if (key_down == 3)	{		if (lcd_disp_mode == 1)		{			ph_pd_flag ^= 1;	//参数选择标志位取反		}		else if(lcd_disp_mode == 2)		{			key_tick = uwTick; //记录按键按下时的时间		}	}	if(key_up == 3)	{		if(lcd_disp_mode == 2)		{			if(uwTick - key_tick > 2000)			{				key_tick = 0;		//清理按键时间戳				vd_value = vh_value = 0;			}		}	}	switch (key_down)	{		case 4:			if (++lcd_disp_mode == 3)//模式切换			{				lcd_disp_mode = 0;			}			break;		case 1:			if (lcd_disp_mode == 1)//参数切换界面s			{				//创建一个指针，根据参数选择标志位切换指向				//这样，使用逻辑语句和一个指针变量就可以实现对两个参数的地址指向->数据内容更改				uint16_t *p = (ph_pd_flag) ? &ph_value : &pd_value;				*p += 100;				if (*p > 4096)				{					*p = 4096;				}			}			break;		case 2:			if (lcd_disp_mode == 1)			{				uint16_t *p = (ph_pd_flag) ? &ph_value : &pd_value;				*p -= 100;				if (*p == 65536 - 100)				{					*p = 0;				}			}			break;	}}
```

## [](#4-adc采集)4\. adc采集

### [](#41-变量定义)4.1 变量定义

```c
#include "adc_app.h"uint32_t dma_buff[2][30];//DMA接收缓存float adc_value[2];//ADC采样数组#define WINDOWS_SIZE 3000 //动态窗口的大小为3秒adc_data_t adc_buffer[BUFFER_SIZE];//adc采集周期为100ms,动态窗口大小为3sint buffer_start = 0;//头指针int buffer_end = 0;//尾指针uint8_t vd_flag;//标志位，表示当前窗口内是否检测到突变
```

### [](#42-添加数据到动态串口缓冲区)4.2 添加数据到动态串口（缓冲区）

本例中,ADC采样的环形缓冲区比较特殊，具备动态时间窗口的特性

-   和一般的环形缓冲区一样，具备头指针和尾指针的概念，环形存取数据。
-   缓冲区具备“时间窗口”的概念，那么就要让缓冲区中最老的数据，存在时间不能超过三秒，超过则移除（实际上是写指针移位，相当于队这个无用的数据不再进行读取，环形缓冲区中读取数据，就相当于将这个数据移除缓存区，因为索引指针不会再指向这个数据。）

```c
/**  * @brief			添加adc采集数据，当前时间到adc缓冲区(环形)  * @param			adc采集数据，当前时间，指定的buffer  * @retval 		无  */void add_adc_data(uint32_t adc,uint32_t current_time,adc_data_t *buffer){	buffer[buffer_end].timestamp = current_time;//记录当前时间到尾指针指向的缓冲区	buffer[buffer_end].adc = adc;//记录adc采集值到尾指针指向的缓冲区 	buffer_end = (buffer_end + 1) % BUFFER_SIZE;//表示尾指针自加，0~30	if(buffer_end == buffer_start)// 如果缓冲区满了，调整buffer_start，使得窗口始终保持在3秒内	{		buffer_start = (buffer_start + 1) % BUFFER_SIZE;//头指针移位	}	//判断当前时间是否超过窗口时间戳3秒，即操作时间超过3秒,// 移除超出3秒窗口的数据	while((current_time - buffer[buffer_start].timestamp > WINDOWS_SIZE))	{		buffer_start = (buffer_start + 1) % BUFFER_SIZE;//头指针移位	}}
```

### [](#43-检查缓冲区的突变)4.3 检查缓冲区的突变

对当前窗口进行极大值，极小值的检测。

注意区分极大值，极小值和最大值最小值的区别。

```c
/**  * @brief			检测当前窗口是否发生ADC突变  * @param			突变计数，adc缓冲区  * @retval 		无  */void check_adc_sudden_change(uint16_t *sudden_change_count,adc_data_t *buffer){	uint16_t f_max = buffer[buffer_start].adc;	// uint16_t f_min = buffer[buffer_end].adc;	uint16_t f_min = buffer[buffer_start].adc;	int index = buffer_start;	while(index != buffer_end)//读取完整个环形缓冲区	{		//极大值		if(buffer[index].adc > f_max)		{			f_max = buffer[index].adc;		}		//极小值		if(buffer[index].adc < f_min)		{			f_min = buffer[index].adc;		}		//指针加1		index = (index + 1) % BUFFER_SIZE;	}	uint16_t diff = f_max - f_min;	//检测ADC突变	if(diff < pd_value)	{		vd_flag = 1;	}	else if(vd_flag == 1)	{		vd_flag = 0;		(*sudden_change_count) ++;	}	ucLed[2] = (diff > pd_value)?1:0;}
```

### [](#44-adc解析进程)4.4 ADC解析进程

```c
void adc_proc() {	uint32_t Time_tick = HAL_GetTick();	//获取当前时间	static uint8_t vh_flag;//超限标志位	//对adc1,adc2两个adc通道进行数据采集	for(uint8_t i=0;i<30;i++) 	{		adc_value[0] += (float)dma_buff[0][i]; //采集30次		adc_value[1] += (float)dma_buff[1][i]; //采集30次	}	adc_value[0] = adc_value[0] / (30 + 1); //采集30后，但是累加值是(30+1)次，因为采集30次之前本身adc_value[0]就有值	adc_value[1] = adc_value[1] / (30 + 1); //否则会出现如采集到的ADC值大于4096的现象	add_adc_data(adc_value[0],Time_tick,adc_buffer);//将adc采集值写入缓冲区	check_adc_sudden_change(&vd_value,adc_buffer);//判断是否发生值突变	if(adc_value[1] < ph_value) 	{		vh_flag = 0; //当adc_value小于参数时，标志位才会置0	}	else if(vh_flag == 0) // adc_value大于参数且标志位为0	{		vh_flag = 1;//标志位置1		vh_value++;	//超限次数加1	}}
```

## [](#5-led底层)5\. LED底层

## [](#51-led显示进程)5.1 LED显示进程

```c
/** * @brief LED 显示处理函数 * * 每次调用该函数时，LED 灯根据 ucLed 数组中的值来决定是开启还是关闭 */void led_proc(void){    // 显示当前 Led_Pos 位置的 LED 灯状态    ucLed[0] = (lcd_disp_mode == 0);//当前界面为数据采集时LED1点亮     ucLed[1] = adc_value[1] > ph_value ? 1 : 0;    //ucLed[2] = (adc_value[0] > pd_value);//放入窗口突变判断中        led_disp(ucLed);}
```

## [](#6-串口通信)6\. 串口通信

### [](#61-串口通信进程)6.1 串口通信进程

> **`sscanf`**:
> 
> -   `sscanf` 是一个格式化输入函数，主要用于从字符串中提取数据。
> -   它按照指定的格式读取输入字符串，并将解析后的数据存储到指定的变量中。
> -   语法：`int sscanf(const char *str, const char *format, ...)`
> 
> **`strcmp`**:
> 
> -   `strcmp` 是一个字符串比较函数，用于比较两个字符串是否相等。
> -   它返回一个整数，表示两个字符串的字典顺序。
> -   语法：`int strcmp(const char *str1, const char *str2)`
> -   返回值：
>     -   小于 0：`str1` 小于 `str2`
>     -   等于 0：`str1` 等于 `str2`
>     -   大于 0：`str1` 大于 `str2`
> 
> 总结：
> 
> sscanf：将stream内容取出，并根据入口参数的格式化过滤内容，取出数据
> 
> strcmp：比较两个字符串的内容

```c
void uart_proc(void){	if(ringbuffer_is_empty(&usart_rb)) return;	// 从环形缓冲区读取数据到读取缓冲区 	ringbuffer_read(&usart_rb, usart_read_buffer, usart_rb.itemCount);		uint16_t value;	uint16_t *p = NULL;//创建一个空指针	    // 解析串口数据，如果匹配，那么将解释后的数据存入value中	if(sscanf((const char*)usart_read_buffer,"$PD(%hu)",&value) == 1)	{        // 指针指向pd_value		p = &pd_value;	}	else if(sscanf((const char*)usart_read_buffer,"$PH(%hu)",&value) == 1)	{        // 指针指向ph_value		p = &ph_value;	}	else if(strcmp((const char*)usart_read_buffer,"#VH") == 0)	{		printf("VH:%d\n",vh_value);	}	else if(strcmp((const char*)usart_read_buffer,"#VD") == 0)	{		printf("VD:%d\n",vd_value);	}		    // 判断参数范围是否合法	if(value < 4096)	{        // 通过指针解引用修改数据		*p = value; 	}	    // 清空缓冲区	memset(usart_read_buffer, 0, sizeof(uint8_t) * BUUFER_SIZE);	}
```
