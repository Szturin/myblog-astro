---
title: "【Python】01 - Python基础（入门）"
published: 2024-05-19
updated: 2024-11-08
category: 学习笔记
description: ""
tags:
  - Python
  - 编程语言
---

# 第一个Python程序

```plaintext
(base) C:\Users\123>python
Python 3.11.7 | packaged by Anaconda, Inc. | (main, Dec 15 2023, 18:05:47) [MSC v.1916 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> print('Hello world')
Hello world
>>> print("Hello world")
Hello world
>>> name = input('请输入你的名字')
请输入你的名字'Turin'
>>> print(name)
'Turin'
>>> print('Hello',name)
Hello 'Turin'
>>> 2**10
1024
>>>
```
[数据类型和变量 - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1016959663602400/1017063826246112)

## [prompt运行.py](http://xn--prompt-8w2r549b.py)

**prompt窗口1**

```plaintext
PS D:\7_python_project\1-1 python base> python 1-1第一个python程序.py
hello world
hello worldhello world
hello world hello world
300
1024*1024 = 1048576
please enter your name: Turin
hello, Turin
PS D:\7_python_project\1-1 python base>
```
**.py文件**

```python
print("hello world"); #Python中的分号可以省略，主要通过换行来识别语句的结束
print("hello world""hello world");  
print("hello world","hello world"); #print()会依次打印每个字符串，遇到逗号“,”会输出一个空格，因此，输出的字符串是拼起来的
print(100 + 200)
print('1024*1024 =',1024*1024)
name = input('please enter your name: ')
print('hello,', name)
```
**prompt窗口2**

```plaintext
版权所有 (C) Microsoft Corporation。保留所有权利。

尝试新的跨平台 PowerShell https://aka.ms/pscore6

PS D:\7_python_project> cd '.\1-1 python base\'
PS D:\7_python_project\1-1 python base> python 1-1第一个python程序.py
hello world
hello worldhello world
hello world hello world
300
1024*1024 = 1048576
Turin
PS D:\7_python_project\1-1 python base> python 1-1第一个python程序.py
hello world
hello world hello world
300
1024*1024 = 1048576
w
PS D:\7_python_project\1-1 python base> python 1-1第一个python程序.py
hello world
hello worldhello world
300
1024*1024 = 1048576
w
PS D:\7_python_project\1-1 python base>
PS D:\7_python_project\1-1 python base>
PS D:\7_python_project\1-1 python base> python
Python 3.10.2 (tags/v3.10.2:a58ebcc, Jan 17 2022, 14:12:15) [MSC v.1929 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> name = input()
Turin
>>> print(name)
Turin
>>> name = input('please enter your name: ')
please enter your name: print('hello,', name)
>>>
>>>
>>>
KeyboardInterrupt

PS D:\7_python_project\1-1 python base> python 1-1第一个python程序.py
hello world
hello worldhello world
hello world hello world
300
1024*1024 = 1048576
please enter your name: Turin
hello, Turin
PS D:\7_python_project\1-1 python base> print('1024 * 768 ='1024 * 768 )
所在位置 行:1 字符: 21
+ print('1024 * 768 ='1024 * 768 )
+                     ~~~~
表达式或语句中包含意外的标记“1024”。
所在位置 行:1 字符: 21
+ print('1024 * 768 ='1024 * 768 )
+                     ~
表达式中缺少右“)”。
所在位置 行:1 字符: 32
+ print('1024 * 768 ='1024 * 768 )
+                                ~
表达式或语句中包含意外的标记“)”。
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : UnexpectedToken

PS D:\7_python_project\1-1 python base> print('1024 * 768 ='1024 * 768 ^C
PS D:\7_python_project\1-1 python base> print('1024 * 768 ='1024 * 768 ^C
PS D:\7_python_project\1-1 python base> ^C
PS D:\7_python_project\1-1 python base> python
Python 3.10.2 (tags/v3.10.2:a58ebcc, Jan 17 2022, 14:12:15) [MSC v.1929 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> print('1024 * 768 ='1024 * 768 )
  File "<stdin>", line 1
    print('1024 * 768 ='1024 * 768 )
          ^^^^^^^^^^^^^^^^^^^^^^^^
SyntaxError: invalid syntax. Perhaps you forgot a comma?
>>>
KeyboardInterrupt
>>> print('\\\t\\')
\       \
>>> print(r'\\\t\\')
\\\t\\
>>> print(''' line1
... ...line2
... ...line3''')
 line1
...line2
...line3
>>>
>>> print('''line1
... line2
... line3
... '''
... ^Z
KeyboardInterrupt
>>> print('''line1
... line2
... line3''')
line1
line2
line3
>>> True
True
>>> True
True
>>> 3 > 0
True
>>> False or False
False
>>> not 1 = 1
  File "<stdin>", line 1
    not 1 = 1
    ^^^^^
SyntaxError: cannot assign to expression
>>> not 1==1
False
>>> n = 123
>>> f = 456.789
>>> s1 = 'Hello, world'
>>> s2 = 'Hello, \'Adam\''
>>> s3 = r'Hello, "Bart"'
>>> s4 = r'''Hello,
... Lisa!'''
>>> print(n\n,f,s1,s2,s3,s4)
  File "<stdin>", line 1
    print(n\n,f,s1,s2,s3,s4)
            ^
SyntaxError: unexpected character after line continuation character
>>> n = 123
>>> f = 456.789
>>> s1 = 'Hello, world'
>>> s2 = 'Hello, \'Adam\''
>>> s3 = r'Hello, "Bart"'
>>> s4 = r'''Hello,
... Lisa!'''
>>> print(n\t,f,s1,s2,s3,s4)
  File "<stdin>", line 1
    print(n\t,f,s1,s2,s3,s4)
            ^
SyntaxError: unexpected character after line continuation character
>>> n = 123
>>> f = 456.789
>>> s1 = 'Hello, world'
>>> s2 = 'Hello, \'Adam\''
>>> s3 = r'Hello, "Bart"'
>>> s4 = r'''Hello,
... Lisa!'''
>>> print('n\n,f,s1,s2,s3,s4')
n
,f,s1,s2,s3,s4
>>> ord('A')
65
>>> ord('中')
20013
>>> chr(66)
'B'
>>> chr(66)
'B'
>>> '\u4e2d\u6587'
'中文'
>>> x = b'ABC'
>>> 'ABC'.encode('ascii')
b'ABC'
>>> '中文'.encode('UTF-8')
b'\xe4\xb8\xad\xe6\x96\x87'
>>> '中文'.encode('ascii')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-1: ordinal not in range(128)
>>> b'ABC'.decode('UTF-8')
'ABC'
>>> len('中文')
2
>>> len('中文'.encode('utf-8'))
6
>>> 'Hello, %s' % 'world'
'Hello, world'
>>> 'Hello,%s' & 'world'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unsupported operand type(s) for &: 'str' and 'str'
>>> 'Hello,%s' %'world'
'Hello,world'
>>> 'Hi,&s,You have %d
**PS:当`str`和`bytes`互相转换时,没有特殊要求，指定使用UTF-8编码**

# 问题及解决方案

-   [Vscode提示“无法在只读编辑器中编辑”解决方法\_vscode编辑器关闭只读模式-CSDN博客](https://blog.csdn.net/m0_52592128/article/details/120798138)
 %('Meter',100000)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: %d format: a real number is required, not str
>>> 'Hi,%s,You have %d
**PS:当`str`和`bytes`互相转换时,没有特殊要求，指定使用UTF-8编码**

# 问题及解决方案

-   [Vscode提示“无法在只读编辑器中编辑”解决方法\_vscode编辑器关闭只读模式-CSDN博客](https://blog.csdn.net/m0_52592128/article/details/120798138)
 %('Meter',100000)
'Hi,Meter,You have 100000
**PS:当`str`和`bytes`互相转换时,没有特殊要求，指定使用UTF-8编码**

# 问题及解决方案

-   [Vscode提示“无法在只读编辑器中编辑”解决方法\_vscode编辑器关闭只读模式-CSDN博客](https://blog.csdn.net/m0_52592128/article/details/120798138)

>>> 'Hi,&s,You have %d
**PS:当`str`和`bytes`互相转换时,没有特殊要求，指定使用UTF-8编码**

# 问题及解决方案

-   [Vscode提示“无法在只读编辑器中编辑”解决方法\_vscode编辑器关闭只读模式-CSDN博客](https://blog.csdn.net/m0_52592128/article/details/120798138)
 %('Meter',100000)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: %d format: a real number is required, not str
>>> print('%2d-%02d' % (3, 1))
 3-01
>>> print('%.2f' % 3.1415926)
3.14
>>> 'Age: %s. Gender: %s' % (25, True)
'Age: 25. Gender: True'
>>> 'growth rate: %d %%' % 7
'growth rate: 7 %'
>>> '中文'.encode('gb2312')
b'\xd6\xd0\xce\xc4'
>>> 'Hello,{0}的成绩提高了{1:.1f}'.format('小明',17.125)
'Hello,小明的成绩提高了17.1'
>>> print(f'^Z')
KeyboardInterrupt
>>> s = '小明'
>>> a = '85'
>>> print(f'Hello,{s}的成绩为{a}')
Hello,小明的成绩为85
>>> s1=72
>>> s2=85
>>> rate = s1/85
>>> print(f'小明的成绩从去年的{s1}分提升到了今年的{s2}分，提升了{rate}%')
小明的成绩从去年的72分提升到了今年的85分，提升了0.8470588235294118%
>>> s1=72
>>> s2=85
>>> rate = s1/85
>>> s2=85^Z^Z^Z^Z^Z^Z^Z^Z^Z^Z^Z^Z^Z
KeyboardInterrupt
>>>
```
**PS:当`str`和`bytes`互相转换时,没有特殊要求，指定使用UTF-8编码**

# 问题及解决方案

-   [Vscode提示“无法在只读编辑器中编辑”解决方法_vscode编辑器关闭只读模式-CSDN博客](https://blog.csdn.net/m0_52592128/article/details/120798138)
