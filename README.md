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

 ### set 跨页面存储对象
 * 跨页面存储对象：使用localStorage存储技术持久化数据，存储方式为键值对
 * @key 键（键名为string类型）
 * @value 值（值内容可以为任意类型，支持对象，不传则为删除）值将会执行JSON.stringify转换为json存储

### get 跨页面获取对象
* 跨页面获取对象（会执行JSON.parse解析值）
* @key 键（键名为string类型）

### del 删除存储对象
* 删除存储对象：依据传入的关键字批量删除指定特征的存储对象，如果只删除单个存储对象，建议调用Sign.set(key)方式删除
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

Sign.set('Bill', {name:'Bill',age:27,say:'Hello! World'})
document.getElementById('a-content').innerHTML = "Signs: " + JSON.stringify(Sign.get('signs'));
var bill = Sign.get('Bill');
if (bill) {
	document.getElementById('b-content').innerHTML = bill.say + ". My name is " + bill.name + " and I`m " + bill.age + " years old.";
}

Sign.set('Bill')
Sign.remove('msgAno')
Sign.remove()
Sign.del('sign-');   // 删除所有包含sign-的数据
Sign.guid(); // 生成guid
```