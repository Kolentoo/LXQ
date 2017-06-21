
/*!
 * jsonchou 实体接口
 * v: 1.1
 * d: 2014-3-6
*/

/*global navigator */

var _env = 'real'; //real,dev

var _host = document.location.host;
if (_host.indexOf('localhost:') > -1 || _host.indexOf('127.0.0.1') > -1 || _host.indexOf('10.1.') > -1 || location.href.toLowerCase().indexOf('file://') > -1) {
    _env = 'dev';
}

var _hotline = '1010-9898';
var _domain = 'uzai.com';
var _ua = navigator.userAgent.toLowerCase();
var _uzw = window._uzw || {}; //外部暴露
var _atom = window._atom || {}; //原子类,统一私有方法
var _util = window._util || {}; //简单通用方法

var _terminal = 'pc';//跟踪类型 默认pc浏览器 app/app/weixin/pc

_atom = {
    pop: {}
};

_util = {
    url: {},
    check: {},
    array: {},
    localStorage: {},
    unicode: {},
    user: {},
    cdn:{},
    string: {},
    file:{},
    apis: {}
};

//url://m.uzai.com?source=weixin&man=jsonchou
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

_util.check = {
    isIE: _ua.indexOf('trident') > -1,//是否是IE
    isIE6: !!window.ActiveXObject && !window.XMLHttpRequest,//是否是IE6
    isIE7: _ua.indexOf("msie 7.0") > -1,//是否是IE7
    isIE8: _ua.indexOf("msie 8.0") > -1,//是否是IE8
    isIE9: _ua.indexOf('msie 9.0') > -1,//是否是IE9
    isIE678: /\bmsie [678]\.0\b/.test(_ua)//是否是IE678
};

//数据跨域APIs
//业务层信息接口,返回业务信息
_util.apis = {
    //获取服务器时间
    getServerDate: function () {
        var df = $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiIPHelp/GetDate/',
            type: 'GET',
            dataType: "jsonp",
            cache: false
        });
        return df;
    },
    //获取用户IP
    getUserIP: function () {
        var df = $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiIPHelp/IPCityName/',
            type: 'GET',
            dataType: "jsonp",
            cache: false
        });
        return df;
    }
};

//文件载入
_util.file = {
    //fix cdn timespan bug
    load: function (url, cb) {
        if (url.indexOf('.css') > -1) {
            $("head").append("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            cb && cb();
        } else if (url.indexOf('.js') > -1) {
            $.ajax({
                cache: true,
                type: 'GET',
                url: url,
                dataType:'script',
                success: function () {
                    cb && cb();
                }
            });
        }
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
    },
    uniqueObject: function (array) {
        if (array.length) {
            //对象数组去重
            var re = [];
            for (var i = 0, les = array.length; i < les; i++) {
                if (typeof array[i]._uniqObjects === "undefined") {
                    //添加标签
                    array[i]._uniqObjects = 1;
                    re.push(array[i]);
                }
            }
            //取出标签
            for (var j = 0, les2 = re.length; j < les2; j++) {
                delete re[j]._uniqObjects;
            }
            return re;
        }


        //适合简单对象去重
        //var x = { z: 1 };
        //var y = { q: 2 };
        //uniqObjects([x, y, x]);
    },
    //返回数组中的位置，-1表示不存在
    inArray: function (flag,arr) {
        if (typeof flag === 'string' || typeof flag === 'number') {
            if (arr && arr.length) {
                for (var i = 0; i < arr.length; i++) {
                    if (flag === arr[i]) {
                        return i;
                    }
                }
                return -1;
            }
            return -1;
        }
        return -1;
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

        if (!_uzw.cookie.get(ckn)) {
            _util.localStorage.remove(lsName);
            _uzw.cookie.set(ckn, '1', expday || 1);
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
        if (!v) {
            return '';
        }
        tag = tag || ' ';
        ntag = ntag || '';
        return v.replace(new RegExp(tag + '$', 'gi'), ntag);
    },
    //v: 字符
    //tag: 要过滤的文本/标签
    //ntag: 替换成
    //abs：强制最后一个字符 暂搁置
    //替换第一个字符
    replaceFirst: function (v, tag, ntag) {
        if (!v) {
            return '';
        }
        tag = tag || ' ';
        ntag = ntag || '';
        if (v.indexOf(tag) === 0) {
            return v.replace(new RegExp(tag, 'i'), ntag);
        }
        return v;
    },
    GUID: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
};

_uzw = {
    env: _env,//real 正式， dev 开发环境
    cookie: {},
    user: {},
    regex: {},
    cooperate: {}, //合作
    mobile: {},
    domain: {},
    ui: {},
    iframe: {},
    apis:{},
    clear:null
};

//清理CDN CSS缓存
_uzw.clear = function () {
    _util.cdn.clear();
};

_uzw.domain = {
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
    dingzhi: 'http://dingzhi.uzai.com',
    search: 'http://search.uzai.com',
    manager: 'http://manager.uzai.com',
    api: 'http://api.uzai.com',
    wapi: '//wapi.uzai.com',
    weixinapi: '//weixinapi.uzai.com'
};

_uzw.ui = {
    loader: _uzw.domain.cdn + '/content/m/images/common/gray.gif',
    preloader: _uzw.domain.cdn + '/content/m/images/common/preloader.gif',
    tab: function (node,cb) {
        var nd=$('#'+node);
        if (!nd.get(0)) {
            nd = $('.' + node);
        }
        var tabEvent = nd.attr('data-event') === 'hover' ? 'mouseenter' : 'click';
        if (window._tap === 'tap') {
            tabEvent = 'tap';
        }
        if (nd.get(0)) {
            nd.children('.hd').on(tabEvent, 'li', function () {
                var o = $(this);
                var op = o.parents('.hd');
                var os = o.siblings('li');
                var index = o.index();

                os.removeClass('on');
                o.addClass('on');

                var items = op.siblings('.bd').children('.item');
                items.hide();
                items.eq(index).show();

                var otab = op.parent();

                cb && cb(index, otab);

            });
        }
    },
    mask: {
        show: function (callback) {
            $('.fn-mask').remove();
            var fmh = (_util.check.isIE6 ? document.body.clientHeight : '100%');
            var css = {
                'height': fmh,
                'opacity': '0.5'
            };
            $('body').append("<div class='fn-mask'></div>");
            $('.fn-mask').css(css);
            if (callback) {
                callback();
            }
        },
        hide: function (callback) {
            $('.fn-mask').css({ 'opacity': '0', 'z-index': '-1' });
            //$('.fn-mask').remove();
            if (callback) {
                callback();
            }
        }
    },
    pop: function (node, paClass, afterCb, beforeCb, closeCb, yAxis) {
        /*
        * node（必需）: 弹框根节点
        * paClass（可选）: 父类（需要关闭对象的类名）
        * afterCb（可选）: 显示之后回调函数，参数为弹框根对象
        * beforeCb（可选）: 显示之前回调函数，参数为弹框根对象
        * closeCb（可选）: 弹框关闭回调函数，参数为弹框根对象
        * yAxis（可选）: IE6下，距离浏览器视窗顶部距离（默认为浏览器视窗高度的一半）
        */
        var obj = $('#' + node);
        yAxis = yAxis || $(window).height() / 2;
        paClass = paClass || '.ui-pop';
        obj = (!obj.get(0)) ? $('.' + node) : obj;

        beforeCb && beforeCb(obj);

        _uzw.ui.mask.show();
        obj.show();
        obj.on('click', '.j_popClose', function () {
            var oThis = $(this);
            oThis.parents(paClass).hide();
            _uzw.ui.mask.hide();
            closeCb && closeCb(obj);
        });

        afterCb && afterCb(obj);

        //IE6下的定位
        if (_util.check.isIE6) {
            obj.css('top', $(document).scrollTop() + yAxis);
            $(window).on('scroll', function () {
                obj.css('top', $(document).scrollTop() + yAxis);
            });
        }
    }
};

_uzw.regex = {
    idcard: "^[1-9]([0-9]{14}|[0-9]{17})$",
    qq: "^[1-9]*[1-9][0-9]*$",
    email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
    mobile: "^(13|14|15|17|18)[0-9]{9}$",
    tel: "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$"
};

_uzw.regexForm = {
    empty: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv)
            return false;
        return true;
    },
    idcard: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzw.regex.idcard)) {
            return true;
        }
        return false;
    },
    qq: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzw.regex.qq)) {
            return true;
        }
        return false;
    },
    email: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzw.regex.email)) {
            return true;
        }
        return false;
    },
    mobile: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzw.regex.mobile)) {
            return true;
        }
        return false;
    },
    tel: function (v) {
        var nv = _util.string.replaceAll(v, ' ', '');
        if (nv && nv.match(_uzw.regex.tel)) {
            return true;
        }
        return false;
    }
};

_uzw.cookie = {
    set: function (k, v, day) {
        if (location.protocol === 'file:') {
            return;
        }
        day = (arguments.length === 3) ? day : 7;
        try {
            v = encodeURIComponent(v);
        } catch (ex) {
            v = escape(v);
        }
        $.cookie(k, v, { expires: day, path: '/', domain: _uzw.env === 'real' ? _domain : '' });
    },
    get: function (k) {
        if (location.protocol === 'file:') {
            return;
        }
        var ck = $.cookie(k);
        if (ck) {
            try {
                ck = decodeURIComponent(ck);
            } catch (ex) {
                ck = unescape(ck);
            }
            return ck;
        }
        return null;
    },
    del: function (k) {
        if (location.protocol === 'file:') {
            return;
        }
        var ck = _uzw.cookie.get(k);
        if (ck) {
            $.cookie(k, '', { expires: -1, path: '/', domain: _uzw.env === 'real' ? _domain : '' });
        }
    }
};

//统一线上
_uzw.user = {
    login: function (cb) {
        this.refresh(cb);
    },
    logout: function (cb) {
        _uzw.cookie.del('user');
        this.refresh(cb);
    },
    //刷新user cookie
    refresh: function (cb) {
        var u = _uzw.cookie.get('user');
        this.userid = _util.url.get(u,'userid');
        this.userName = _util.url.get(u,'userName');
        this.nickname = _util.url.get(u,'nickname');
        this.realname = _util.url.get(u,'realname');
        this.Email = _util.url.get(u,'Email');
        this.Mobile = _util.url.get(u,'Mobile');
        this.islogin = _util.url.get(u,'islogin');
        this.userGrade = _util.url.get(u,'userGrade');
        this.headUrl = _util.url.get(u, 'headUrl') || _uzw.domain.cdnRandom() + '/v1/images/common/avator.png';
        loadUser();
        cb && cb();
    }
};

_uzw.mobile = {
    isForce: false,
    isIpad: _ua.match(/ipad/i) == 'ipad',
    isIphone: _ua.match(/iphone os/i) == "iphone os",
    isAndroid: _ua.match(/android/i) == "android",
    isWC: _ua.match(/windows ce/i) == "windows ce",
    isWM: _ua.match(/windows mobile/i) == "windows mobile",
    isWP: _ua.match(/windows phone/i) == "windows phone",
    isWebOS: _ua.match(/webos/i) == "webos",
    isBlackberry: _ua.match(/blackberry/i) == "blackberry",
    isWeiXin: _ua.match(/micromessenger/i) == 'micromessenger',
    isUC: _ua.match(/ucweb/i) == 'ucweb' || _ua.match(/ucbrowser/i) == 'ucbrowser',
    isPC: function () {
        return !(this.isIphone || this.isAndroid || this.isWC || this.isWM || this.isWP || this.isWebOS || this.isBlackberry || this.isUC);//check PC
    }
};

_uzw.iframe = {
    pop: function (url, w, h, scrolling) {

        var sW = screen.width;
        var sH = screen.height;
        var bH = $('body').height();
        var cH = document.documentElement.clientHeight;
        var sT = $(window).scrollTop();//滚动高度

        var width = w || 640;
        var height = h || 280;

        scrolling = scrolling || 'no';

        bH = cH > bH ? cH : bH;

        $('body').append("<div id='layer'></div>");
        $('body').append("<iframe id='WidgetEditor'></iframe>");

        //set mask style
        var maskCssConfig = {
            'z-index': '10001',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'height': bH,//mask height
            'width': '100%',
            'background-color': '#000',
            'opacity': '.3'
        };

        $('#layer').css(maskCssConfig);

        //set iframe style
        var iframeCssConfig = {
            'z-index': '10002',
            'width': width,
            'height': height,
            'position': 'absolute',
            'left': '50%',
            'top': '50%',
            'margin-left': '-' + width / 2 + 'px',
            'margin-top': (sT - height / 2) + 'px'
        };

        //set iframe attribute
        var iframeAttrConfig = {
            'name': 'Widget Editor',
            'scrolling': scrolling,
            'src': url,
            'frameborder': 0
        };

        $('#WidgetEditor').css(iframeCssConfig).attr(iframeAttrConfig);

    },
    close: function (eve) {
        $('#WidgetEditor').remove();
        $('#layer').remove();
        eve && eve();
    }
};

//兼容过去写法
function closeEditor () {
    $('#WidgetEditor').remove();
    $('#layer').remove();
}

//for lower ie
if (!window.console) {
    window.console = {
        log: function () { },
        info: function () { },
        table: function () { },
        time: function () { },
        timeEnd: function () { }
    };
}

_uzw.apis = {
    getUserInfo: function () {
        //获取用户未支付订单数量，未点评线路数量，是否验证手机、邮箱，U币数量
        //([{"unOrderNum":"12","unDianPinNum":"1","isValidatePhone":"1","isValidateEmail":"1","userUB":"111"}])
        var df = $.ajax({
            type: "GET",
            cache: false,
            async: false,
            url: _uzw.domain.u + '/OrderBackTip',
            dataType: "jsonp"
        });
        return df;
    },
    sendEmail: function (type) {
        type = type || "CDN JS文件拼接错误";
        var url = location.href.toLowerCase();
        var df = $.ajax({
            type: "GET",
            cache: false,
            url: _uzw.domain.wapi + '/api/webSendEmail/Get?url=' + encodeURIComponent(url) + '&type=' + encodeURIComponent(type),
            dataType: "jsonp"
        });
        return df;
    }
};
