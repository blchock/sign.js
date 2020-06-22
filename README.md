# Sign 标记事件管理器
## 版本
 * v1.1 2020/6/13 新增支持跨页面事件和跨页面数据存储set,get,del
  * v1.0 2020/5/22 标记事件管理器：支持mark,trigger,remove

## 函数库
### mark 添加标记
 * 添加标记：定义事件
 * @name 事件名
 * @func 事件回调函数（含一个参数e代表事件本身，事件附带的参数都直接放在e下，比如参数title：e.title）
 * @onPop 是在捕获时响应事件true，还是在冒泡时响应事件false(默认)（事件的机制是先从最外层节点到最内层节点捕获，然后从内向外冒泡）
 * @dom 事件绑定节点（默认为全局：支持跨页面事件）
 * @return 是否创建成功（如果该节点已经有该事件 创建会失败）

### trigger 触发标记
 * 触发：触发标记
 * @name 事件名
 * @params 参数对象（以对象形式存储多个参数，如 {title: 'hello'}）
 * @dom 事件绑定节点（默认为全局：支持跨页面事件），为true则触发所有节点下绑定的该事件
 * @return 返回事件回调函数返回的内容，触发所有节点时会返回带 节点id和ret返回内容 的数组

### remove 删除标记
 * 删除标记
 * @name 事件名（不填写则删除所有该节点下创建过的标记）
 * @dom 事件绑定节点（默认为全局）(true代表删除所有该事件名绑定过的节点上的该事件)
 * @return 是否删除成功（删除失败表示该节点下没有该事件）

 ### setData 跨页面存储对象
 * 跨页面存储对象：使用localStorage存储技术持久化数据，存储方式为键值对
 * @key 键（键名为string类型）
 * @value 值（值内容可以为任意类型，支持对象，不传则为删除）值将会执行JSON.stringify转换为json存储

### getData 跨页面获取对象
* 跨页面获取对象（会执行JSON.parse解析值）
* @key 键（键名为string类型）

### delData 删除存储对象
* 删除存储对象：依据传入的关键字批量删除指定特征的存储对象，如果只删除单个存储对象，建议调用Sign.setData(key)方式删除
 * @keyword 关键字

## 示例
```js
Sign.DEBUG = true // open debug show log
function msgA(e) {
	document.getElementById("a-content").innerHTML = e.data
}
function msgB(e) {
	document.getElementById("b-content").innerHTML = e.data
}
function msgC(e) {
	alert(e.data);
}
Sign.mark('msg',msgA,document.getElementById('a-content'),true);
Sign.mark('msg',msgB,document.getElementById('b-content'));
Sign.mark('msg',msgC);
Sign.trigger('msg',{data:'how are you!'},document.getElementById('a-content'));
Sign.trigger('msg',{data:'I`m fine.'},document.getElementById('b-content'));
Sign.trigger('msg',{data:'global trigger this.'});
Sign.trigger('msg',{data:'foooooooooobar!'}, true);
Sign.remove('msg', document.getElementById('b-content'));
Sign.remove('msg', true);

Sign.setData('Bill', {name:'Bill',age:27,say:'Hello! World'})
document.getElementById('a-content').innerHTML = "Signs: " + JSON.stringify(Sign.getData('signs'));
var bill = Sign.getData('Bill');
if (bill) {
	document.getElementById('b-content').innerHTML = bill.say + ". My name is " + bill.name + " and I`m " + bill.age + " years old.";
}

Sign.setData('Bill')
Sign.remove('msgAno')
Sign.remove()
Sign.del('sign-');   // 删除所有包含sign-的数据
Sign.guid(); // 生成guid
```

## Sign-Extend
提供了多个扩展Sign的函数工具

> 加载有先后顺序，可以单独加载扩展工具包，但如果两个都要使用，请先加载 sign.js/sign.min.js 再加载 sign-ext.js/sign-ext.min.js

### 时间类
* Sign.formatDate(时间,格式) 日期格式化 y年M月d日h时m分s秒
* Sign.formatTDate(timestamp,格式) 时间戳格式化 y年M月d日h时m分s秒
### 字符类
* Sign.cTrim(字符串, type) 去除空格 type 0：去除全部空格，1：去除左边空格，2：去除右边空格
* Sign.toThousands(数值) 千分位显示，常用于价格显示
* Sign.isNumeric(值) 判断值是否是数字(或数字字符串、千分位数字会自动去除逗号)
* Sign.ellipsis(字符串, 保留长度) 字符串超出后省略加...
### 地址类
* Sign.getQueryString(参数名) URL中取参数  返回参数值
### Cookie类
* Sign.getCookie(键名) 获取cookie
* Sign.setCookie(键名, 键值, 过期时间(小时)) 设置cookie
* Sign.delCookie(键名) 删除cookie
### 移动端类
* Sign.getDeviceType() 获取设备号，安卓，ios，web
* Sign.isMobile() 判断是否移动设备访问
* Sign.isWeiXinWeb() 是否微信环境
* Sign.isWechatApplet() 是否小程序环境 isWechatApplet().then(isWechatApp => {}).catch(notInWxapp => {})
* Sign.set()/Sign.get()/Sign.del() 分别对应于setData,getData,delData的小程序版本
### 表单验证类
* Sign.RegExp.checkMobile(字符串) 验证手机号
* Sign.RegExp.checkTell(字符串) 验证国内电话
* Sign.RegExp.checkNomalName(字符串) 验证姓名存在两个汉字
* Sign.RegExp.isEmail(字符串) 验证邮箱
* Sign.RegExp.checkIdCard(字符串) 验证身份证
* Sign.RegExp.idCardMask(字符串) 隐藏身份证
* Sign.RegExp.stringMask(字符串,起始下标,结束下标) 隐藏字符串中一段字符为*
### 数组类
* Sign.arrayMax([arr]) 取数组最大值
* Sign.arrayMin([arr]) 取数组最小值
* Sign.arrayUnion([a],[b]) 返回数组并集
* Sign.arrayIntersect([a],[b]) 返回数组交集
* Sign.arrayDiff([a],[b]) 返回数组差集
* Sign.arrayUnique([arr]) 数组去重
### Dom类
* Sign.scrollTop(位置,时间(毫秒)) 滚动到某位置 Sign.scrollTop(document.getElementById('scrollId').offsetTop, 200)
* Sign.addFavorite(地址,标题) 加入收藏夹
* Sign.setHomepage(地址) 设为首页
* Sign.getPageHeight() 获取页面高度
* Sign.getPageWidth() 获取页面宽度
* Sign.getPageScrollLeft() 获取页面scrollLeft
* Sign.getScrollOffset() 获取页面滚动距离
* Sign.getViewportOffset() 获取窗体可见范围的宽与高
* Sign.getElmentPosition(el) 返回一个元素在文档中的坐标
* Sign.getStyle(el,prop) 获取样式属性(返回的属性值都是计算过的，不存在相对单位,只读)