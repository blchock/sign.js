/**
 * 标记事件管理器
 * @author Bl.Chock
 * @createTime 2020年5月22日 11:16:51
 * mark 添加标记
 * trigger 触发标记
 * remove 删除标记
 */
var Sign = {}
Sign.lib = {}
Sign.cb = {}
Sign.DEBUG = false

/**
 * 生成guid
 */
Sign.guid = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * 获取节点id（没有就生成一个）
 */
Sign.getDomId = function (dom) {
    if (dom === document) return 0; // document不设置id返回0
    if (dom.id) return dom.id;
    dom.id = Sign.guid();
    if (Sign.DEBUG) console.log("#Sign general a guid for dom:", dom.id);
    return dom.id;
}

/**
 * 通过id获取节点（0则获取document）
 */
Sign.getDom = function (id) {
    if (id == 0) return document;
    return document.getElementById(id);
}

/**
 * 跨页面存储对象
 * @key 键
 * @value 值(不传则为删除)
 */
Sign.setData = function (key, value) {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    if (Sign.DEBUG) console.log("#Sign set store:" + key + "   data:" + value);
}

/**
 * 跨页面获取对象
 * @key 键
 */
Sign.getData = function (key) {
    if (localStorage.getItem(key)) {
        var value = localStorage.getItem(key);
        if (Sign.DEBUG) console.log("#Sign get store:" + key + "   data:" + value);
        return JSON.parse(value);
    }
}

/**
 * 删除存储对象
 * @keyword 关键字
 */
Sign.delData = function (keyword) {
    if (keyword) {
        Object.keys(localStorage).forEach(item => item.indexOf(keyword) != -1 ? localStorage.removeItem(item) : '');
    }
}

/**
 * 添加标记：定义事件
 * @name 事件名
 * @func 事件回调函数（含一个参数e代表事件本身，事件附带的参数都直接放在e下，比如参数title：e.title）
 * @onPop 是在捕获时响应事件true，还是在冒泡时响应事件false(默认)（事件的机制是先从最外层节点到最内层节点捕获，然后从内向外冒泡）
 * @dom 事件绑定节点（默认为全局）
 * @return 是否创建成功（如果该节点已经有该事件 创建会失败）
 */
Sign.mark = function (name, func, dom, onPop) {
    var target = dom || document
    var id = Sign.getDomId(target)
    Sign.lib[id] = Sign.lib[id] || {}
    if (Sign.lib[id][name]) return false;
    Sign.cb[id] = Sign.cb[id] || {}
    Sign.cb[id][name] = func;
    Sign.lib[id][name] = { t: !!onPop }
    if (id === 0) {
        var signs = Sign.getData('signs') || {};
        signs[name] = Sign.lib[id][name];
        Sign.setData('signs', signs);
        Sign.setData('sign-' + name, Sign.cb[id][name].toString());
    }
    target.addEventListener(name, Sign.cb[id][name], onPop);
    if (Sign.DEBUG) console.log("#Sign Mark a sign name:" + name + "   on node:" + id + "   on bubbling trigger:" + !onPop);
    return true
}
/**
 * 触发：触发标记
 * @name 事件名
 * @params 参数对象（以对象形式存储多个参数，如 {title: 'hello'}）
 * @dom 事件绑定节点（默认为全局），为true则触发所有节点下绑定的该事件
 * @return 返回事件回调函数返回的内容，触发所有节点时会返回带 节点id和ret返回内容 的数组
 */
Sign.trigger = function (name, params, dom) {
    var signs = Sign.getData('signs') || {};
    Sign.cb[0] = Sign.cb[0] || {};
    Sign.lib[0] = Sign.lib[0] || {};
    if (signs[name] && !Sign.lib[0][name]) {
        var scb = Sign.getData('sign-' + name);
        Sign.cb[0][name] = eval('(' + scb + ')');
        Sign.lib[0][name] = signs[name];
        document.addEventListener(name, Sign.cb[0][name], Sign.lib[0][name].t);
    }
    var e = new Event(name);
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            e[key] = params[key];
        }
    }
    if (dom === true) {
        var rets = []
        for (const id in Sign.lib) {
            if (Sign.lib.hasOwnProperty(id)) {
                if (Sign.lib[id][name]) {
                    rets.push({
                        id: id,
                        ret: Sign.getDom(id).dispatchEvent(e)
                    });
                }
            }
        }
        if (Sign.DEBUG) console.log("#Sign Triggers sign:" + name + "    params and returns:", params, rets);
        return rets
    }
    var target = dom || document
    e.id = target.id
    var ret = target.dispatchEvent(e);
    if (Sign.DEBUG) console.log("#Sign Trigger a sign name:" + name + "   on node:" + e.id + "   params and function return:", params, ret);
    return ret
}

/**
 * 删除标记
 * @name 事件名（不填写则删除所有该节点下创建过的标记）
 * @dom 事件绑定节点（默认为全局）(true代表删除所有该事件名绑定过的节点上的该事件)
 * @return 是否删除成功（删除失败表示该节点下没有该事件）
 */
Sign.remove = function (name, dom) {
    var target = dom || document
    if (dom === true || Sign.getDomId(target) === 0) {
        if(name) {
            if (Sign.getData('signs') && Sign.getData('signs')[name]) {
                var ss = Sign.getData('signs');
                ss[name] = undefined;
                Sign.setData('signs', ss);
                Sign.setData('sign-' + name);
            }
        } else {
            Sign.setData('signs');
            Sign.delData('sign-');
        }
    }
    if (dom === true) {
        for (const id in Sign.lib) {
            if (Sign.lib.hasOwnProperty(id)) {
                if (Sign.lib[id][name]) {
                    Sign.getDom(id).removeEventListener(name, Sign.lib[id][name].f, Sign.lib[id][name].t);
                }
                Sign.lib[id][name] = undefined
                Sign.cb[id][name] = undefined
            }
        }
        if (Sign.DEBUG) console.log("#Sign remove all node signs with sign name:" + name);
        return true
    }
    var id = Sign.getDomId(target)
    if (Sign.lib[id]) {
        if (name) {
            target.removeEventListener(name, Sign.lib[id][name].f, Sign.lib[id][name].t);
            Sign.lib[id][name] = undefined;
            Sign.cb[id][name] = undefined;
            if (Sign.DEBUG) console.log("#Sign remove a sign:" + name + "    id:" + id);
            return true
        } else {
            for (const key in Sign.lib[id]) {
                if (object.hasOwnProperty(key)) {
                    const e = Sign.lib[id][key];
                    target.removeEventListener(key, e.f, e.t);
                }
                Sign.lib[id] = {};
                Sign.cb[id] = {};
            }
            if (Sign.DEBUG) console.log("#Sign remove all signs, node id:" + id);
            return true
        }
    }
    if (Sign.DEBUG) console.log("#Sign remove fails not fond sign!");
    return false
}