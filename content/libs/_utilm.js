/*! 共用util
* jsonchou
* v: 1.1
* d: 2016-8-12
*/

var _env = 'real'; //real,dev

var _host = document.location.host;
if (_host.indexOf('localhost:') > -1 || _host.indexOf('127.0.0.1') > -1 || _host.indexOf('10.1.') > -1) {
    _env = 'dev';
}

var _hotline = '1010-9898';
var _domain = 'uzai.com';
var _ua = navigator.userAgent.toLowerCase();
var _tap = "tap";
var _terminal = "wap";//来自内嵌还是手机浏览器 wap/app/weixin/pc
if ((typeof (_scale) === 'boolean') && (_scale === true)) {
    _scale = {};//页面是否需要缩放
}
var _uzm = window._uzm || {};//外部暴露
var _util = window._util || {};//简单通用方法

_util = {
    url: {},
    user: {},
    array: {},
    localStorage: {},
    unicode: {},
    string: {},
    cdn: {},
    file: {}
};

//url:http://m.uzai.com?source=weixin&man=jsonchou
_util.url = {
    get: function (url, tag) {//通过location.href，tag获取参数tag值
        if (!url) {
            return '';
        }
        if (arguments.length === 1) {
            tag = url;
            url = location.search;//#tag
        } else {
            var idx = url.indexOf('?');//?userid=1
            if (idx > -1) {
                url = url.substr(url.indexOf('?'));
            } else {
                url = '?' + url;
            }
        }
        var reg = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)", "i");
        var rex = url.substr(1).match(reg);
        if (rex) {
            return decodeURIComponent(rex[2]);
        }
        return "";
    },
    set: function (tag, tagV) {//重新拼接URL
        var search = decodeURIComponent(location.search);
        var seaArr = [];
        if (search) {
            search = search.replace('?', '');
            seaArr = search.split('&');
            for (var i = 0; i < seaArr.length; i++) {
                var item = seaArr[i].split('=');
                if (item[0].toLowerCase() == tag.toLowerCase()) {
                    seaArr[i] = (tag + '=' + tagV);//修改标识，不做边界值删除校验
                    break;
                }
            }
            //追加标识
            if (seaArr.join('&').toLowerCase().indexOf(tag.toLowerCase() + '=') == -1) {
                seaArr.push(tag + '=' + tagV);//不做边界值校验
            }
        }

        if (seaArr.length) {
            //追加标识
            return location.origin + location.pathname + '?' + seaArr.join('&') + (location.hash || '');
        }
        return location.href;
    },
    del: function (tag) {
        var search = decodeURIComponent(location.search);
        if (search) {
            search = search.replace('?', '');
            var seaArr = search.split('&');
            for (var i = 0; i < seaArr.length; i++) {
                var item = seaArr[i].split('=');
                if (item[0].toLowerCase() == tag.toLowerCase()) {
                    seaArr.splice(i, 1);//删除标识
                    break;
                }
            }
            return location.origin + location.pathname + '?' + seaArr.join('&') + (location.hash || '');
        }
        return location.href;
    }
};

/*css添加版本号，用于CDN css调试*/
_util.cdn.clear = function (ver) {
    var o = $('head').find('link[rel=stylesheet]');
    var v = (ver === undefined) ? Math.random() : ver;
    for (var i = 0; i < o.length; i++) {
        var oo = o[i];
        var oos = oo.getAttribute('href').split('?')[0];
        oo.setAttribute('href', oos + '?v=' + v);
    }
};

//文件载入
_util.file = {
    //fix cdn timespan bug
    load: function (url, cb, force) {
        url = url.toLowerCase();
        if (url.indexOf('.css') > -1) {
            $("head").append("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            cb && cb();
        } else if (url.indexOf('.js') > -1) {
            //$.ajax dataType occur cross domain
            if (force) {
                //force:true 强制外部domain JS载入
                var nhd = document.getElementsByTagName('head')[0];
                var nst = document.createElement('script');
                nst.setAttribute('type', 'text/javascript');
                nst.setAttribute('src', url);
                nst.setAttribute('async', true);
                if (cb) {
                    nst.onload = nst.onreadystatechange = function () {
                        if (nst.ready) {
                            return false;
                        }
                        if (!nst.readyState || nst.readyState == "loaded" || nst.readyState == 'complete') {
                            nst.ready = true;
                            cb();
                        }
                    };
                }
                nhd.appendChild(nst);
            } else {
                $.ajax({
                    cache: true,
                    type: 'GET',
                    async:false,
                    url: url,
                    dataType: 'script',
                    success: function () {
                        cb && cb();
                    }
                });
            }

        }
    }
};

_util.array = {
    unique: function (arr) {
        if (arr.length) {
            //数组去重
            var res = [];
            var json = {};
            for (var i = 0; i < arr.length; i++) {
                if (!json[arr[i]]) {
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        }
        return arr;
    },
    uniqueObject: function (array) {
        if (array.length) {
            //对象数组去重
            var re = [], i, l;
            for (i = 0, l = array.length; i < l; i++) {
                if (typeof array[i]._uniqObjects === "undefined") {
                    //添加标签
                    array[i]._uniqObjects = 1;
                    re.push(array[i]);
                }
            }
            //取出标签
            for (i = 0, l = re.length; i < l; i++) {
                delete re[i]._uniqObjects;
            }
            return re;
        }


        //适合简单对象去重
        //var x = { z: 1 };
        //var y = { q: 2 };
        //uniqObjects([x, y, x]);
    },
    //返回数组中的位置，-1表示不存在
    inArray: function (flag, arr) {
        return arr.indexOf(flag);
    },
    //获取两个数据的交集
    crosArray: function (a, b) {
        var ai = 0, bi = 0;
        var result = [];
        while (ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) { ai++; }
            else if (a[ai] > b[bi]) { bi++; }
            else
            {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }
        return result;
    }
};

_util.localStorage = {
    ok: window.localStorage,
    set: function (k, v) {
        if (this.ok) {
            window.localStorage.setItem(k, v);
        }
    },
    get: function (k) {
        if (this.ok) {
            return window.localStorage.getItem(k);
        }
    },
    remove: function (k) {
        if (this.ok) {
            window.localStorage.removeItem(k);
        }
    },
    clear: function () {
        if (this.ok) {
            window.localStorage.clear();
        }
    },
    cache: function (lsName, expday, dfr, cb) {
        var ok = window.localStorage;
        var ckn = lsName + "-EndTime";//localStorage expire flag cookie

        if (typeof dfr !== 'function') {
            return;
        }

        if (!_uzm.cookie.get(ckn)) {
            _util.localStorage.remove(lsName);
            _uzm.cookie.set(ckn, '1', expday || 1);
        }

        var _don = function (mydfr) {
            mydfr.done(function (data) {
                cb(data);
                if (data) {
                    if (typeof (JSON) !== 'undefined') {
                        try {
                            if (typeof (data) == 'object') {
                                _util.localStorage.set(lsName, JSON.stringify(data));
                            }
                        } catch (e) {

                        }
                    }
                }
            });
        };

        var _get = function () {
            var mydfr = dfr();

            var doneExt = mydfr.doneExt;
            if (typeof doneExt !== 'undefined') {
                mydfr.doneExt(function () {
                    _don(mydfr);
                });
            } else {
                _don(mydfr);
            }

        };

        if (ok) {
            if (_util.localStorage.get(lsName)) {
                var data = _util.localStorage.get(lsName);
                if (typeof (JSON) !== 'undefined') {
                    try {
                        cb(JSON.parse(data));
                    } catch (e) {
                        _get();
                    }
                } else {
                    _get();
                }
            } else {
                _get();
            }
        } else {
            _get();
        }
    }
};

_util.unicode = {
    to: function (v) {
        return escape(v).replace(/%/g, "\\").toLowerCase();
    },
    un: function (v) {
        return unescape(v.replace(/\\/g, "%"));
    }
};

_util.string = {
    //半角转换为全角函数
    toDBC: function (v) {
        var tmp = "";
        for (var i = 0; i < v.length; i++) {
            if (v.charCodeAt(i) == 32) {
                tmp = tmp + String.fromCharCode(12288);
            }
            if (v.charCodeAt(i) < 127) {
                tmp = tmp + String.fromCharCode(v.charCodeAt(i) + 65248);
            }
        }
        return tmp;
    },
    //全角转换为半角函数
    toCDB: function (v) {
        var tmp = "";
        for (var i = 0; i < v.length; i++) {
            if (v.charCodeAt(i) > 65248 && v.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(v.charCodeAt(i) - 65248);
            }
            else {
                tmp += String.fromCharCode(v.charCodeAt(i));
            }
        }
        return tmp;
    },
    //字符串全过滤
    //v: 字符
    //tag: 要过滤的文本/标签
    //ntag: 替换成
    replaceAll: function (v, tag, ntag) {
        if (v) {
            var str = v;
            try {
                str = v.replace(new RegExp(tag, 'g'), ntag);
            } catch (e) {

            }
            return str;
        }
        return '';
    },
    //v: 字符
    //tag: 要过滤的文本/标签
    //ntag: 替换成
    //abs：强制最后一个字符 暂搁置
    //替换最后一个字符，从右往左依次查找
    replaceLast: function (v, tag, ntag) {
        tag = tag || ' ';
        ntag = ntag || '';
        return v.replace(new RegExp((tag || ' ') + '$', 'gi'), ntag);
    },
    GUID: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
};

_uzm = {
    env: _env,//real 正式， dev 开发环境
    cookie: {},
    array: {},
    user: {},
    regex: {},
    pop: {},
    mask: {},
    mobile: {},
    ui: {},
    pkg: {},
    terminal: {}
};

_uzm.regex = {
    idcard: "^[1-9]([0-9]{14}|[0-9]{17})$",
    qq: "^[1-9]*[1-9][0-9]*$",
    email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
    mobile: "^(13|14|15|17|18)[0-9]{9}$",
    tel: "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$"
};

_uzm.regexForm = {
    empty: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv)
            return false;
        return true;
    },
    idcard: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzm.regex.idcard)) {
            return true;
        }
        return false;
    },
    qq: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzm.regex.qq)) {
            return true;
        }
        return false;
    },
    email: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzm.regex.email)) {
            return true;
        }
        return false;
    },
    mobile: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzm.regex.mobile)) {
            return true;
        }
        return false;
    },
    tel: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzm.regex.tel)) {
            return true;
        }
        return false;
    }
};

_uzm.mobile = {
    isForce: false,
    isIpad: _ua.match(/ipad/i) == 'ipad',
    isIphone: _ua.match(/iphone os/i) == "iphone os",
    isAndroid: _ua.match(/android/i) == "android",
    isWC: _ua.match(/windows ce/i) == "windows ce",
    isWM: _ua.match(/windows mobile/i) == "windows mobile",
    isWP: _ua.match(/windows phone/i) == "windows phone",
    isWebOS: _ua.match(/webos/i) == "webos",
    isWeiXin: _ua.match(/micromessenger/i) == 'micromessenger',
    isBlackberry: _ua.match(/blackberry/i) == "blackberry",
    isUC: _ua.match(/ucweb/i) == 'ucweb' || _ua.match(/ucbrowser/i) == 'ucbrowser',
    isPC: function () {
        return !(this.isIpad || this.isIphone || this.isAndroid || this.isWC || this.isWM || this.isWP || this.isWebOS || this.isBlackberry || this.isUC || this.isWeiXin);//检测PC
    }
};

//页面来源
_uzm.terminal = {
    source: 'wap'//基本参数
};

//清理CDN CSS缓存
_uzm.clear = function () {
    _util.cdn.clear();
};

_uzm.domain = {
    m: 'http://m.uzai.com',
    u: '//u.uzai.com',//用户中心域
    cdn: '//r.uzaicdn.com',
    cdnRandom: function (type) {
        type = type || 'static';//static,dynamic,file,contract
        var arr = [];
        switch (type) {
            case 'dynamic':
                arr = ['r04', 'r05', 'r06', 'r07', 'r08'];
                break;
            case 'file':
                arr = ['r09'];
                break;
            case 'contract':
                arr = ['r10'];
                break;
            default:
                arr = ['r', 'r01', 'r02', 'r03'];
        }
        var rd = Math.floor(Math.random() * arr.length);
        return '//' + arr[rd] + '.uzaicdn.com';
    },
    buy: '//buy.uzai.com',
    pay: '//pay.uzai.com',
    sijia: 'http://sijia.uzai.com',
    search: 'http://search.uzai.com',
    manager: 'http://manager.uzai.com',
    api: 'http://api.uzai.com',
    wapi: '//wapi.uzai.com',
    weixinapi: '//weixinapi.uzai.com'
};

_uzm.ui = {
    loader: _uzm.domain.cdn + '/content/m/images/common/gray.gif',
    preloading: function (timer, cb) {
        if (typeof arguments[0] === 'function') {
            cb = timer;
            timer = null;
        }
        var uip = $('.ui-preloading');
        if (!uip.get(0)) {
            $('body').append("<div class='ui-preloading'><div class='ui-preloading-inner'><i class='i1'></i><i class='i2'></i><i class='i3'></i></div></div>");
            uip = $('.ui-preloading');
            setTimeout(function () {
                uip.addClass('ui-preloading-fade');//ui隐藏
                cb && cb();
                setTimeout(function () {
                    uip.remove();//ui移除
                }, 500);
            }, timer || 3000);
        }
    },
    wxTopTip: {
        show: function (cb) {
            $('.g-wx-tip').remove();
            _uzm.mask.show(function () {
                $('body').append("<div class='g-wx-tip'> 点击下载没反应？<br />请点右上角的按钮，选择“<b class='red'>在浏览器中打开</b>”，即可免费下载APP！</div>");
                $('.g-wx-tip').css({'opacity': '1'});
            });
            cb && cb();
        },
        hide: function (cb) {
            _uzm.mask.hide(function () {
                $('.g-wx-tip').css({ 'opacity': '0', 'z-index': '-1' });
            });
            cb && cb();
        }
    }

};

_uzm.pkg = {
    iphone: "https://itunes.apple.com/cn/app/you-zai-lu-you/id519653239?mt=8",
    ipad: "https://itunes.apple.com/cn/app/you-zai-lu-you-hd/id588951281?mt=8",
    android: _uzm.domain.cdn + "/uzaitravel.apk"
};

//cookie api
_uzm.cookie = {
    set: function (k, v, day) {
        day = (arguments.length === 3) ? day : 7;
        try {
            v = encodeURIComponent(v);
        } catch (ex) {
            v = escape(v);
        }
        $.cookie(k, v, { expires: day, path: '/', domain: _uzm.env === 'real' ? _domain : '' });
    },
    get: function (k) {
        var ck = $.cookie(k), v;
        if (ck) {
            try {
                v = decodeURIComponent(ck);
            } catch (ex) {
                v = unescape(ck);
            }
            return v;
        }
        return null;
    },
    del: function (k) {
        var ck = _uzm.cookie.get(k);
        if (ck) {
            $.cookie(k, '', { expires: -1, path: '/', domain: _uzm.env === 'real' ? _domain : '' });
        }
    }
};

//统一线上
_uzm.user = {
    login: function (cb) {
        this.refresh(cb);
    },
    logout: function (cb) {
        _uzm.cookie.del('user');
        this.refresh(cb);
    },
    //刷新user cookie
    refresh: function (cb) {
        var u = _uzm.cookie.get('user');
        this.userid = _util.url.get(u, 'userid');
        this.userName = _util.url.get(u, 'userName');
        this.nickname = _util.url.get(u, 'nickname');
        this.realname = _util.url.get(u, 'realname');
        this.Email = _util.url.get(u, 'Email');
        this.Mobile = _util.url.get(u, 'Mobile');
        this.islogin = _util.url.get(u, 'islogin');
        this.userGrade = _util.url.get(u, 'userGrade');
        this.headUrl = _util.url.get(u, 'headUrl') || _uzm.domain.cdnRandom() + '/v1/images/common/avator.png';
        cb && cb();
    }
};

/***************************************************************************************common.js******************************************************************************************/

_uzm.pop = {
    toast: function (s, time) {
        $('.fn-toast').remove();
        $('body').append("<div class='fn-toast " + (window._scale ? 'f30' : '') + " '>" + s + "</div>");
        var pui = $('.fn-toast');
        pui.css({ 'opacity': '1' });
        time = time || 2000;
        //点击关闭
        pui.on('click', function () {
            pui.css({ "opacity": "0", 'z-index': '-1' });
        });
        setTimeout(function () {
            pui.trigger('click');
        }, time);
    },
    snackbar: function (s,actxt, time) {
        $('.fn-snackbar').remove();

        if (typeof actxt !== 'undefined') {
            if (!isNaN(actxt)) {
                //是数字
                time = actxt;
                actxt = '';
            }
        }

        (typeof time === 'undefined') && (time = 1500);

        $('body').append("<div class='fn-snackbar " + (window._scale ? 'f30' : '') + " '>" + (actxt ? "<span class='action-btn fr'>" + actxt + "</span>" : "") + "<div class=' " + (actxt ? "action" : "") + " '>" + s + "</div></div>");
        var pui = $('.fn-snackbar');
        setTimeout(function () {
            pui.css({ 'top': '0%' });
        }, 100);

        //点击关闭
        if (actxt) {
            pui.find('.action-btn').on('click', function () {
                pui.css({ "top": "-50%" });
            });
            if (time && typeof time === 'function') {
                time && time();
            }
        } else {
            pui.on('click', function () {
                pui.css({ "top": "-50%" });
            });
            setTimeout(function () {
                pui.trigger('click');
            }, time);
        }
    },
    cup: function (s, time) {
        $('.fn-cup').remove();

        $('body').append("<div class='fn-cup " + (window._scale ? 'f30' : '') + " '>" + s + "</div>");
        var pui = $('.fn-cup');
        pui.css({ 'opacity': '1' });
        time = time || 60000;

        //点击关闭
        pui.on('click', function () {
            pui.css({ "opacity": "0", 'z-index': '-1' });
        });
        setTimeout(function () {
            pui.trigger('click');
        }, time);
    },
    confirm: function (s, callback) {
        $('.fn-confirm').remove();
        _uzm.mask.show();//展示mask

        $('body').append("<div class='fn-confirm " + (window._scale ? 'f30' : '') + " '><div class='txt'>" + s + "</div><div class='ok'>确定</div></div>");
        var pui = $('.fn-confirm');
        pui.css({ 'opacity': '1' });

        //点击关闭
        pui.find('.ok').on('click', function () {
            pui.css({ "opacity": "0", 'margin-top': '-100px', 'z-index': '-1' });
            _uzm.mask.hide();//隐藏mask
            callback && callback();
        });

    },
    prompt: function (s, callback) {
        $('.fn-prompt').remove();
        _uzm.mask.show();//展示mask

        $('body').append("<div class='fn-prompt " + (window._scale ? 'f30' : '') + " '><div class='tit'>提示信息</div><div class='txt'>" + s + "</div><div class='control'><div class='cancel'>取消</div><div class='ok'>确定</div></div></div>");
        var pui = $('.fn-prompt');
        pui.css({ 'opacity': '1' });

        //点击ok，cancel
        pui.find('.ok,.cancel').on('click', function () {
            pui.css({ "opacity": "0", 'margin-top': '-100px', 'z-index': '-1' });
            _uzm.mask.hide();//隐藏mask
            callback && callback($(this).hasClass('ok') ? true : false);
        });
    }
};

//mask
_uzm.mask = {
    show: function (cb) {
        var mask = $('.fn-mask');
        mask.remove();
        $('body').append("<div class='fn-mask'></div>");
        mask = $('.fn-mask');
        mask.css({'opacity': '1'});
        cb && cb(mask);
    },
    hide: function (cb) {
        var mask = $('.fn-mask');
        mask.css({ 'opacity': '0', 'z-index': '-1' });
        cb && cb(mask);
    }
};

/****************************************************************************************UI Modules**************************************************************************************************/

//BEGIN M站去seajs化，临时过渡使用 *********************************************************************
var seajs = window.seajs || {};
var seapath = _uzm.domain.cdnRandom() + '/content/m/v2/sea-modules';
var seabag = {
    'unveil': seapath + '/jquery/unveil/1.0/jquery.unveil.min.js',
    'autocomplete': seapath + '/jquery/autocomplete/1.1.0/jquery.autocomplete.min.js',
    'swipe': seapath + '/swipe/swipe/2.0/swipe.js'
};

var _sealoadjs = function (arr) {
    var _arr = $.map(arr, function (scr) {
        return _util.file.load(scr.toLowerCase() + '.js');
    });

    _arr.push($.Deferred(function (deferred) {
        $(deferred.resolve);
    }));

    return $.when.apply($, _arr);
};

seajs.use = function (arr, cb) {
    _sealoadjs(arr).done(function (cbd) {
        $(function () {
            cb && cb();
        });
    });
};
//END *************************************************************************************************
