var Sign = Sign || {}


////////////////////////////////////// 时间 //////////////////////////////////////

// 日期格式化
Sign.formatDate = function (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
    }
    return fmt
}

// 时间戳转为格式化时间
Sign.formatTDate = function (timestamp, formats) {
    var formatDigit = function (n) {
        return n.toString().replace(/^(\d)$/, '0$1');
    };
    formats = formats || 'Y-M-D';
    var myDate = timestamp ? new Date(timestamp) : new Date();
    var year = myDate.getFullYear();
    var month = formatDigit(myDate.getMonth() + 1);
    var day = formatDigit(myDate.getDate());
    var hour = formatDigit(myDate.getHours());
    var minute = formatDigit(myDate.getMinutes());
    var second = formatDigit(myDate.getSeconds());
    return formats.replace(/y|M|d|h|m|s/g, function (matches) {
        return ({
            y: year,
            M: month,
            d: day,
            h: hour,
            m: minute,
            s: second
        })[matches];
    });
}

////////////////////////////////////// 字符串 //////////////////////////////////////

// 去除空格 type   0：去除全部空格，1：去除左边空格，2：去除右边空格
Sign.cTrim = function (sInputString, type) {
    var sTmpStr = ' ';
    var i = -1;
    if (type == 0 || type == 1) {
        while (sTmpStr == ' ') {
            ++i;
            sTmpStr = sInputString.substr(i, 1);
        }
        sInputString = sInputString.substring(i);
    }
    if (type == 0 || type == 2) {
        sTmpStr = ' ';
        i = sInputString.length;
        while (sTmpStr == ' ') {
            --i;
            sTmpStr = sInputString.substr(i, 1);
        }
        sInputString = sInputString.substring(0, i + 1);
    }
    return sInputString;
}

// 千分位显示，常用于价格显示
Sign.toThousands = function (num) {
    return parseFloat(num).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,");
}

// 判断是否数字
Sign.isNumeric = function (txt) {
    if (txt == "") {
        return false;
    }
    if (txt.indexOf(",") > 0) {
        txt = txt.replace(",", "");
    }
    if (isNaN(txt)) {
        return false;
    }
    else {
        return true;
    }
}

// 字符串超出后省略加...
Sign.ellipsis = function (restr, len) {
    var wlength = restr.replace(/[^\x00-\xff]/g, "**").length;
    if (wlength > len) {
        for (var k = len / 2; k < restr.length; k++) {
            if (restr.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
                return restr.substr(0, k) + "...";
            }
        }
    }
    return restr
}

////////////////////////////////////// 浏览器存储 //////////////////////////////////////

// url中取参数
Sign.getQueryString = function (name) {
    if (undefined == window.location) return null
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2].replace(/\%20/g, '+'))
    } else {
        return null
    }
}
// 获取cookie第二种方法
Sign.getCookie = function (name = '') {
    if (document.cookie.length > 0) {
        let start = document.cookie.indexOf(name + '=')
        if (start !== -1) {
            start = start + name.length + 1
            let end = document.cookie.indexOf(';', start)
            if (end === -1) end = document.cookie.length
            return unescape(document.cookie.substring(start, end))
        }
    }
    return null
}
// 设置cookie
Sign.setCookie = function (name, value, expireHours) {
    let exDate = new Date()
    exDate.setTime(exDate.getTime() + expireHours * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + (typeof expireHours === 'undefined' ? '' : ';expires=' + exDate.toGMTString())
}
// 删除cookie
Sign.delCookie = function (name = '') {
    let exDate = new Date()
    exDate.setTime(exDate.getTime() - 1)
    let value = getCookie(name)
    if (value !== null) {
        document.cookie = name + '=' + escape(value) + ';expires=' + exDate.toGMTString()
    }
}

////////////////////////////////////// 表单验证相关 //////////////////////////////////////

Sign.RegExp = {
    // 检测手机号
    checkMobile(s) {
        var regu = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (regu.test(s)) {
            return true
        } else {
            return false
        }
    },
    // 匹配国内电话号码（0511-4405222 或 021-87888822) //////// 
    checkTell(str) {
        var result = str.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
        if (result == null) return false;
        return true;
    },
    // 检测姓名 必须要有两个汉字
    checkNomalName(s) {
        var regu = /^[\u4e00-\u9fa5]{2,}$/;
        if (regu.test(s)) {
            return true;
        } else {
            return false;
        }
    },
    // 检测邮箱
    isEmail(str) {
        var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if (myReg.test(str)) return true;
        return false;
    },
    //  检测身份证 
    checkIdCard(idCard) {
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if (regIdCard.test(idCard)) {
            if (idCard.length == 18) {
                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)  //将前17位加权因子保存在数组里
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2) //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum = 0 //用来保存前17位各自乖以加权因子后的总和
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
                }
                var idCardMod = idCardWiSum % 11 //计算出校验码所在数组的位置
                var idCardLast = idCard.substring(17) //得到最后一位身份证号码
                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == 'X' || idCardLast == 'x') {
                        return true
                    } else {
                        return false
                    }
                } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        } else {
            return false
        }
    },
    idCardMask(idCard = '') {
        return idCard.substr(0, 1) + idCard.slice(1, -4).replace(/\d/g, '*') + idCard.substr(-4)
    },
    stringMask(str, start, end) {
        return str.substr(0, start) + str.slice(start, end).replace(/\d/g, '*') + str.substr(end)
    }
}

////////////////////////////////////// 移动端 //////////////////////////////////////

// 获取设备号，安卓，ios，web
Sign.getDeviceType = function () {
    var deviceType = 'WEB' //其他
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isAndroid) {
        deviceType = 'ANDROID'
    } else if (isiOS) {
        deviceType = 'IOS'
    }
    return deviceType
}
// 判断是否移动设备访问
Sign.isMobile = function () {
    return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
}
// 微信环境
Sign.isWeiXinWeb = function () {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1
}
// 小程序环境
// isWechatApplet().then(isWechatApp => {}).catch(notInWxapp => {})
Sign.isWechatApplet = function () {
    const ua = window.navigator.userAgent.toLowerCase()
    return new Promise(resolve => {
        if (ua.indexOf('micromessenger') == -1) {
            //不在微信或者小程序中
            resolve(false)
        } else {
            wx.miniProgram.getEnv(res => {
                if (res.miniprogram) {
                    //在小程序中
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        }
    })
}

////////////////////////////////////// 数组方法 //////////////////////////////////////

// 数组最大值
Sign.arrayMax = function (arr) {
    return Math.max.apply(null, arr)
}
// 数组最小值
Sign.arrayMin = function (arr) {
    return Math.min.apply(null, arr)
}
// 数组并集
Sign.arrayUnion = function (arr1, arr2) {
    return [...new Set([...arr1, ...arr2])]
}
// 数组交集
Sign.arrayIntersect = function (arr1, arr2) {
    // let arr3 = [...arr1].filter(value => arr2.includes(value))
    // return [...new Set([...arr3])]
    return [...new Set([...arr1].filter(value => arr2.includes(value)))]
}
// 数组差集
Sign.arrayDiff = function (arr1, arr2) {
    return [...new Set([...arr1].filter(value => !arr2.includes(value)))]
}
// 数组去重
Sign.arrayUnique = function (arr) {
    return [...new Set([...arr])]
}

////////////////////////////////////// dom //////////////////////////////////////

// js操作页面，滚动到具体位置
// 简单的方法 参数一是时间，参数二是距离，但是有些机型，并不能兼容这个方法
// window.scrollTo(10, 200)
// 模拟滚动  参数一是距离，参数二是时间
// 将页面滚动到某个元素 Sign.scrollTop(document.getElementById('scrollId').offsetTop, 200)
Sign.scrollTop = function (number = 0, time) {
    if (!time) {
        document.body.scrollTop = document.documentElement.scrollTop = number
        return number
    }
    const spacingTime = 20
    let spacingInex = time / spacingTime
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop
    let everTop = (number - nowTop) / spacingInex
    let scrollTimer = setInterval(() => {
        if (spacingInex > 0) {
            spacingInex--
            scrollTop((nowTop += everTop))
        } else {
            clearInterval(scrollTimer)
        }
    }, spacingTime)
}
// 加入收藏夹
Sign.addFavorite = function (sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle)
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "")
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加")
        }
    }
}
// 设为首页
Sign.setHomepage = function (homeurl) {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(homeurl)
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', homeurl)
    }
}
// 获取页面高度
Sign.getPageHeight = function () {
    var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat" ? a : g.documentElement;
    return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
}
// 获取页面宽度
Sign.getPageWidth = function () {
    var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat" ? a : g.documentElement;
    return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
}
// 获取页面scrollLeft
Sign.getPageScrollLeft = function () {
    var a = document;
    return a.documentElement.scrollLeft || a.body.scrollLeft;
}
// 获取页面滚动距离
Sign.getScrollOffset = function () {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {//IE8及以下
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}
// 获取窗体可见范围的宽与高
Sign.getViewportOffset = function () {
    if (window.innerWidth) {
        return {
            x: window.innerWidth,
            y: window.innerHeight
        }
    } else {//IE8及以下
        if (document.compatMode == "BackCompat") {//如果是怪异模式、混杂模式
            return {
                x: document.body.clientWidth,
                y: document.body.clientHeight
            }
        } else {
            return {
                x: document.documentElement.clientWidth,//标准模式
                y: document.documentElement.clientHeight
            }
        }
    }
}
// 返回一个元素在文档中的坐标
Sign.getElmentPosition = function (el) {
    if (el.offsetParent == body) {
        return {
            x: el.offsetLeft,
            y: el.offsetTop
        }
    }
}
// 获取样式属性
Sign.getStyle = function (elem, prop) {
    if (window.getcomputedStyle) {
        return window.getComputedStyle(elem, null)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}