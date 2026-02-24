---
title: "【stm32单片机】[1] stm32工程创建"
published: 2024-02-27
category: 学习笔记
  - 单片机
  - stm32单片机
---

# stm32点亮LED

## 一、配置寄存器方式

```c
#include <stm32f10x.h> 			//Device header 

int main(void)
{
	/*使用配置寄存器的方式进行点灯操作*/
	RCC->APB2ENR = 0x00000010;
	GPIOC->CRH = 0x00300000;
	GPIOC->ODR = 0x00002000; 
	//缺点：配置繁琐，操作多

}
```

## 二、库函数方式

```c
#include <stm32f10x.h> 			//Device header

int main(void)
{
	/*使用库函数的方式进行点灯操作*/
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC,ENABLE);//配置GPIOC的外设时钟
	//函数的本质还是配置寄存器，但是封装好了完整可靠的功能
	//不会影响到寄存器的其他位，不需要手动计算寄存器
    
	GPIO_InitTypeDef GPIO_InitSructure;//定义结构体变量
	GPIO_InitSructure.GPIO_Mode = GPIO_Mode_Out_PP;//选择推挽输出模式
	GPIO_InitSructure.GPIO_Pin = GPIO_Pin_13;//选择13号引脚
	GPIO_InitSructure.GPIO_Speed = GPIO_Speed_50MHz;//GPIO最大频率50MHZ
    
	GPIO_Init(GPIOC,&GPIO_InitSructure);//根据配置的结构体，各个成员变量的参数，初始化GPIO口
	//GPIO_SetBits(GPIOC,GPIO_Pin_13);//设置PC13口为高电平
	GPIO_ResetBits(GPIOC,GPIO_Pin_13);//设置PC13口为低电平
	while(1)
	{
		
	}
}
```

> 对GPIO_InitTypeDef GPIO_InitSructure的理解
>
> 转到GPIO_InitTypeDef的定义

```c
typedef struct
{
  uint16_t GPIO_Pin;             /*!< Specifies the GPIO pins to be configured.
                                      This parameter can be any value of @ref GPIO_pins_define */

  GPIOSpeed_TypeDef GPIO_Speed;  /*!< Specifies the speed for the selected pins.
                                      This parameter can be a value of @ref GPIOSpeed_TypeDef */

  GPIOMode_TypeDef GPIO_Mode;    /*!< Specifies the operating mode for the selected pins.
                                      This parameter can be a value of @ref GPIOMode_TypeDef */
}GPIO_InitTypeDef;
```

### #结构体

```c
struct Stu//类
{
	//成员变量
	struct B sb;//结构体的成员可以是另外的结构体
	char name[20];//名字
	int age;//年龄
	char id[20];
} s1, s2;//s1和s2也是结构体变量
//s1,s2是全局变量
//结构体的调用
int main1()
{
	//s是局部变量
	struct Stu s = { {'w',20,3.14 }, "张三", 30, "20200534" };//对象

	printf("%c\n",s.sb.c);
	printf("%s\n", s.id);
	
	struct Stu* ps = &s;//结构体指针
	printf("%c\n",(*ps).sb.c);
	printf("%c\n", ps->sb.c);//ps是指针可以用->操作符,sb是变量不是指针只能用.操作符

	return 0;
}
```

```c
typedef struct//typedef为成员列表提供了一个GPIO_InitTypeDef的名字
{
}GPIO_InitTypeDef;
```

