# Hosts 
[![Build Status](https://travis-ci.org/wuguzi/Hosts.svg?branch=master)](https://travis-ci.org/wuguzi/Hosts)
[![Stories in Ready](https://badge.waffle.io/wuguzi/Hosts.png?label=ready&title=Ready)](http://waffle.io/wuguzi/Hosts)

### [下载最新Hosts软件](https://github.com/wuguzi/Hosts/releases)

![](https://github.com/wuguzi/Hosts/blob/master/build/Mac/icon_32x32@2x.png?raw=true)

Hosts是一个基于host的综合管理工具，其中集成了插件管理功能，可用React + nodeJs编写你喜欢的插件！

Hosts和其他Host管理工具在功能上没有太大的差异，但Hosts有着工程师感觉的交互体验，以及清爽的UI视觉

更加令人惊喜的是，前端框架使用了React + Redux + Immutable，这可能是React在其他体系的最佳实践

### v1.3.0以上版本已支持颜色标记

![](https://github.com/wuguzi/Hosts/blob/master/showImg/v1/1.png?raw=true)

### v1.2.0以上版本已支持插件功能（后续给出插件文档）

![](https://github.com/wuguzi/Hosts/blob/master/showImg/9.png?raw=true)

### 教程
了解一下Hosts如何操作！

上面有提到Hosts是一个带有工程师感觉的工具，免去了很多不必要的交互，可能上手需要习惯一下！

![](https://github.com/wuguzi/Hosts/blob/master/showImg/7.png?raw=true)

在此处新建你的新模块，可以回车、可以点击旁边的+号，新的模块被创建了

![](https://github.com/wuguzi/Hosts/blob/master/showImg/3.png?raw=true)

新模块名字叫Hi 我是新模块

左边有一个小红叉，表示删除该模块

双击名称可以编辑新的名字，回车或失去焦点表示保存新名字

右边有一个圆点，灰色表示未激活、绿色表示已激活，点击切换

再在模块右侧的编辑我们新的Host吧，并且支持高亮！

![](https://github.com/wuguzi/Hosts/blob/master/showImg/4.png?raw=true)

当然模块多了，有时需要换一个位置，当然支持，点击模块，拖拽到想要交换的Hosts上，即完成了交换

![](https://github.com/wuguzi/Hosts/blob/master/showImg/6.png?raw=true)

这些基本够用，需要为方便考虑，支持在通知栏切换模块

![](https://github.com/wuguzi/Hosts/blob/master/showImg/1.png?raw=true)

简单的使用教程基本结束了，更多细节还是要自己「把玩」

模块作为Hosts的最小颗粒度，可以很好帮助我们在复杂场景下的页面调试，一些通用的模块可以一直开着，切换有差异的模块，这样我们可以非常有规律的使用Hosts，并且你每次对Hosts进行操作，Hosts都会默默的响应，所以Hosts没有手动保存的操作，如果不放心可以使用cmd+r操作刷新该应用

在调试页面时，随时切换Hosts立即生效

但有时候感觉并没有生效，实际上Hosts切换已经成功，但如果在Chrome下，可爱的Chrome会帮助我们再做一次缓存，这就是没有生效的原因，由于Chrome是一个黑盒操作，目前没有很好的办法解决这个问题，有一个暴力清理的方案，但不是很实用，最后没有放置在Hosts

现在有一个折中方案，如果切换Hosts没有生效，可以在Chrome中进入chrome://net-internals/#sockets，点击红色区域，即可焕然一新，就可以欢快的玩页面！

![](https://github.com/wuguzi/Hosts/blob/master/showImg/5.png?raw=true)

目前支持Mac版，部分Mac机器需要授权才能打开

左上角苹果标志-> 系统偏好设置 -> 安全性与隐私 ，进入后在下面的红色区域会有一个提示，是否仍要打开Hosts，点击仍要打开即可！

![](https://github.com/wuguzi/Hosts/blob/master/showImg/2.png?raw=true)

### 支持系统
Mac
