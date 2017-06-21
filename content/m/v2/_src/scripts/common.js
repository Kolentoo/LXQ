/*! 共用web
* jsonchou
* v: 1.1
* d: 2017-01-18
*/

_uzm.web = {
    init: function () {
        _uzm.user.login();
        this.gdownapp();//底部导航app下载方法
        this.gDEV();//通过ucache,开发环境调试
        this.gCheckTerminal();
        this.gPageScale();
        this.gFixTap();
        this.gTel();
        this.gMlinks();
        this.gTrackSource();
        this.gNotice();
        this.gBackAction();
        this.gUesrLoginStatus();
        this.gTopDownloadTip();
    },
    gdownapp:function(){

        var source=_util.url.get('source'),
            devicetype=_util.url.get('devicetype'),
            downbtn=$('.com-footer-nav .block:last-child');

        if(downbtn.length!==0){
            //app下载
            downbtn.click(function(){
                var mlinks,code='AADe';

                var _terminal = 'wap';
                var _isWeixin = navigator.userAgent.toLowerCase().match(/micromessenger/i) == 'micromessenger';

                if (_isWeixin) {
                    _terminal = 'weixin';
                }
                if (source==='android'||source==='iphone'||devicetype==='android'||devicetype==='iphone') {
                    _terminal = 'app';
                }
                window.location.href = 'https://a.mlinks.cc/' + code + '?channel=' + _terminal + '&&mw_ck=' + _terminal;
            });
        }
    },
    gDEV: function () {
        winLoadFix(function () {
            var ucc = _util.url.get('ucache');
            //param|ua|href|link|css|cookie|delcookie

            //param 弹出全局变量
            //ua 弹出ua
            //css 清空CDN缓存
            //href 弹出当前链接地址
            //link 弹出当前链接地址
            //cookie 弹出cookie,通过"," 获取多个
            //delcookie  删除cookie,通过"," 删除多个，常用于微信清空cookie

            var evtArr = [];
            if (ucc) {
                var uArr = ucc.split('|');
                for (var i = 0; i < uArr.length; i++) {
                    var item = uArr[i];
                    var ievt;
                    if (item.indexOf(':') > -1) {
                        var ita = item.split(':')[0];
                        var itb = item.split(':')[1];
                        var evList = itb.split(',');
                        for (var j = 0; j < evList.length; j++) {
                            var sub = evList[j];
                            //propagation
                            if (ita === 'cookie') {
                                (function (evtArr, sub) {
                                    evtArr.push(function () {
                                        window.alert(_uzm.cookie.get(sub));
                                    });
                                })(evtArr, sub);
                            } else if (ita === 'delcookie') {
                                _uzm.cookie.del(sub);
                                (function (evtArr, sub) {
                                    evtArr.push(function () {
                                        window.alert(sub + "的cookie已删除！");
                                    });
                                })(evtArr, sub);
                            } else if (ita === 'param') {
                                (function (evtArr, sub) {
                                    evtArr.push(function () {
                                        var wsb = window[sub];
                                        if (wsb && typeof wsb === 'object') {
                                            window.alert(JSON.stringify(wsb));
                                        } else {
                                            if (!wsb) {
                                                window.alert('没有找到变量' + sub);
                                            } else {
                                                window.alert(window[sub]);
                                            }
                                        }
                                    });
                                })(evtArr, sub);
                            }
                        }
                    } else {
                        switch (item) {
                            case 'reload':
                                location.reload(true);
                                break;
                            case 'ua':
                                ievt = function () {
                                    window.alert(navigator.userAgent);
                                };
                                break;
                            case 'href':
                            case 'url':
                                ievt = function () {
                                    window.alert(decodeURIComponent(location.href));
                                };
                                break;
                            case 'css':
                                ievt = function () {
                                    _util.cdn.clear();
                                };
                                break;
                            case 'cookie':
                                ievt = function () {
                                    window.alert(document.cookie);
                                };
                                break;
                            case 'viewport':
                                ievt = function () {
                                    window.alert($('meta[name=viewport]').attr('content'));
                                };
                                break;
                        }
                    }
                    evtArr.push(ievt);
                }
            }
            if (evtArr.length) {
                for (var m = 0; m < evtArr.length; m++) {
                    var msub = evtArr[m];
                    msub && msub();
                }
            }
        });
    },
    gBarCheck: {
        show: function () {
            $('.fn-header').show();
            $('.fn-footer').show();
        },
        hide: function () {
            var hd = $('.fn-header');
            $('.fn-footer').hide();
            hd.hide();
            hd.next('section').css({ 'margin-top': '0' });
            var hdn = hd.next();
            if (hdn.css('position') === 'absolute') {
                hdn.css({ 'top': 0 });
            }
        }
    },
    gCheckTerminal: function () {
        //Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 uzai/5.4.1(iOS; iPhone)
        //Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/45.0.2454.95 Mobile Safari/537.36 uzai/5.4.0(android; extension txt; extension txt)
        var apps = ['iphone', 'ipad', 'android', 'wp'];
        var u = document.location.href.toLowerCase();
        var sce = _util.url.get('source');

        //终端永远写入weixin
        if (_uzm.mobile.isWeiXin) {
            _terminal = "weixin";
        }

        //内嵌app 永远赋值
        if (apps.indexOf(sce) > -1) {

            _terminal = "app";//app 内嵌

            _uzm.terminal.version = _util.url.get('version');
            _uzm.terminal.channel = _util.url.get('channel');
            _uzm.terminal.phoneid = _util.url.get('phoneid');

            _uzm.terminal.from = _util.url.get('from');
            _uzm.terminal.userid = _util.url.get('userid');
            _uzm.terminal.token = _util.url.get('token');//t default mobile app url param

            _uzm.terminal.city = _util.url.get('city');
            _uzm.terminal.tamper = _util.url.get('tamper');

        }

        //有source 永远写入
        //订单来源,wap,iphone,android,weixin,weixinhand
        //terminal: wap/app/weixin/pc

        if (sce) {
            //从URL读取
            _uzm.cookie.set('uzmSource', sce, 1);
        } else {
            //从参数读取
            //微信
            if (_uzm.mobile.isWeiXin) {
                _uzm.cookie.set('uzmSource', _terminal, 1);
            } else {
                var ck = _uzm.cookie.get('uzmSource');
                if (ck) {
                    if (apps.indexOf(ck) > -1) {
                        _terminal = 'app';
                    }
                } else {
                    //wap
                }
            }
        }

        if (_terminal == 'app' || _terminal == 'weixin') {
            this.gBarCheck.hide();
        } else if (_terminal === 'wap') {
            this.gBarCheck.show();
        }

    },
    gPageScale: function () {
        //scale page
        try {
            if (_scale) {
                //set body lazy load 300ms
                $('body').addClass('body-on');

                var ow = $('.w');
                var sh = 0;
                var sw = _scale.width || 640;//750,兼容过去
                var rem = _scale.rem || false;

                //set viewport scale
                var width = window.screen.width || sw;
                var scale = width / sw;
                document.querySelector("meta[name=viewport]").setAttribute("content", "target-densitydpi=device-dpi,width=" + sw + ",user-scalable='no',initial-scale=" + scale);
                sh = window.innerHeight || window.outerHeight || document.body.clientHeight || screen.height;

                if (_terminal == 'app' && _uzm.mobile.isAndroid) { // fix android app scale bug
                    width < sw && ow.width(sw);
                    ow.height() < sh && ow.height(sh);
                }
                //set html root font
                if (rem) {
                    (function (doc, win) {
                        var docEl = doc.documentElement;
                        var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

                        //load css sugar
                        var fts = [];
                        var mps = [];//margin,padding
                        var sigma = [5, 10];
                        for (var i = 10; i <= 36; i++) {
                            fts.push('.f' + i + '{font-size:' + i / 10 + 'rem}');
                        }
                        for (var j = 0; j < 2; j++) {
                            var sig=sigma[j];
                            mps.push('.m' + sig + '{margin:' + sig / 10 + 'rem}');
                            mps.push('.mt' + sig + '{margin-top:' + sig / 10 + 'rem}');
                            mps.push('.mr' + sig + '{margin-right:' + sig / 10 + 'rem}');
                            mps.push('.mb' + sig + '{margin-bottom:' + sigma[j] / 10 + 'rem}');
                            mps.push('.ml' + sig + '{margin-left:' + sigma[j] / 10 + 'rem}');
                            mps.push('.p' + sig + '{padding:' + sigma[j] / 10 + 'rem}');
                            mps.push('.pt' + sig + '{padding-top:' + sigma[j] / 10 + 'rem}');
                            mps.push('.pr' + sig + '{padding-right:' + sigma[j] / 10 + 'rem}');
                            mps.push('.pb' + sig + '{padding-bottom:' + sigma[j] / 10 + 'rem}');
                            mps.push('.pl' + sig + '{padding-left:' + sigma[j] / 10 + 'rem}');
                        }
                        $('body').append('<style>' + (fts.join('') + mps.join('')) + '</style>');

                        var recalc = function () {
                            var clientWidth = docEl.clientWidth;
                            if (!clientWidth) {
                                return;
                            }
                            docEl.style.fontSize = 10 * (clientWidth / sw) + 'px';//62.5%=10px=1rem
                        };
                        if (!doc.addEventListener) {
                            return;
                        }
                        if (_uzm.mobile.isPC) {
                            recalc();
                        }
                        win.addEventListener(resizeEvt, recalc, false);
                        doc.addEventListener('DOMContentLoaded', recalc, false);
                    })(document, window);
                }

            }
        } catch (ee) { }
    },
    gFixTap: function () {
        if (typeof (Zepto) == 'function') {
            _tap = _uzm.mobile.isPC() ? "click" : "tap";//初始化点击事件
        } else {
            _tap = 'click';
        }
    },
    gTel: function () {
        var gtl = $('.j_Gtel');
        if (!gtl.get(0)) {
            //return;  pc 和 m 站区别
        }

        var dfr = function () {
            return $.ajax({
                url: _uzm.domain.wapi + '/api/UzaiHotline/GetUzaiHotline',
                type: 'GET',
                dataType: "jsonp",
                cache: true
            });
        };

        var ur = location.href.toLowerCase();

        try {
            //fix malformed URI sequence bug
            ur = decodeURIComponent(ur);
        } catch (e) {
            ur = unescape(ur);
        }

        var refer = document.referrer;
        ur = ur.replace(location.hash, '').replace('#', '');//remove hash
        ur = ur.split('?')[1];
        ur = '?' + ur; // 有些来源会带有问号，如： "b": "?360&"

        //360网盟
        //"SEM-360:4008796175:r000000212"
        var ckName = 'uzmCooperateSource';

        var unitCK = function (ckv) {
            if (ckv) {
                var ckArr = ckv.split(':');
                gtl.text(ckArr[1] || _hotline);
            }
        };

        var unitFixHotline = function (item) {
            if (window._uzw !== 'undefined') {
                gtl.text(item.d || _hotline);//pc
            } else {
                gtl.html('<a href="tel:' + (item.d || _hotline) + '" >' + (item.d || _hotline) + '</a>'); //m
            }
            _uzm.cookie.set(ckName, item.a + ':' + item.d + ':' + item.e, 1);
        };

        var unitEvt = function () {
            if (ur) {
                _util.localStorage.cache('uzmGtel', 1, dfr, function (data) {
                    if (data) {
                        var lst = data.listUzaiDicTable;
                        var items = [];
                        var i, j, k, nt, ntArr, ntc, urlsid, iMin;

                        urlsid = _util.url.get('sourceid');

                        if (urlsid) {
                            //check url sourceid
                            for (i = 0; i < lst.length; i++) {
                                var sid = lst[i].e;
                                if (sid && sid.toLowerCase() === urlsid.toLowerCase()) {
                                    unitFixHotline(lst[i]);
                                    return;
                                }
                            }
                        }
        

                        for (i = 0, k = 0; i < lst.length; i++) {
                            nt = decodeURIComponent(lst[i].b).toLowerCase();
                            ntArr = nt.split('|');
                            for (j = 0; j < ntArr.length; j++) {
                                ntc = ntArr[j];
                                //判断是不是登录的返回地址
                                if (ur.indexOf(ntc) > -1 && ur.toLowerCase().indexOf('reurl') < 0 ) {
                                    items[k] = lst[i];
                                    k++;
                                    break;
                                }
                            }
                        }

                        iMin = items[0];

                        if (iMin) {
                            for (i = 0; i < items.length - 1; i++) { // 多来源，优先值小的优先
                                iMin = items[i].c < items[i + 1].c ? items[i] : items[i + 1];
                            }

                            unitFixHotline(iMin);
                            return;
                        } 
                    }

                    unitCK(_uzm.cookie.get(ckName));

                });
            } else {
                unitCK(_uzm.cookie.get(ckName));
            }
        };

        //判断回车||手动输入链接
        if (!refer && !ur) {
            _uzm.cookie.del(ckName);//回车清空追踪的cookie
        }

        // 如URL上面有sourceid先把url上的sourceid写进去
        var sourceid = _util.url.get('sourceid');
        if(sourceid){
            _uzm.cookie.set(ckName,'::'+sourceid);
        }

        unitEvt();

    },
    gTrackSource: function () {
        var refer = document.referrer;
        var url = document.location.href.replace('#', '').toLowerCase();
        var ckRName = "uzmURLRefer";//统一线上
        var vc = _uzm.cookie.get(ckRName);
        var cid, wi;

        //有cookie的回车
        //refergetUrlParam
        if (refer) {
            if (vc && (vc.indexOf('utm_source=') > -1 || vc.indexOf('utm_medium=') > -1)) {
                if (url.indexOf('utm_source=') > -1 || url.indexOf('utm_medium=') > -1) {
                    _uzm.cookie.set(ckRName, url, 1);
                }
            } else {
                //console.log(vc);
                //console.log(refer);
                if (url.indexOf('utm_source=') > -1 || url.indexOf('utm_medium=') > -1) {
                    _uzm.cookie.set(ckRName, url, 1);
                } else {
                    if (refer.indexOf('.uzai.com') <= -1) {
                        _uzm.cookie.set(ckRName, refer, 1);
                    }
                }
            }
        } else {
            if (!vc) {
                _uzm.cookie.set(ckRName, url, 1);
            }
            else {
                if (url.indexOf('utm_source=') > -1 || url.indexOf('utm_medium=') > -1) {
                    _uzm.cookie.set(ckRName, url, 1);
                }
            }
        }

        var cnl = _util.url.get('channel');
        var src = _util.url.get('src');
        if (cnl && src) {
            cid = _util.url.get('cid');
            wi = _util.url.get('wi');
            url = _util.url.get('url');
            _uzm.cookie.set('wapcps', '{"src":"' + src + '","cid":"' + cid + '","wi":"' + wi + '","channel":"' + cnl + '","url":"' + url + '"}', 30);
        }

    },
    gMlinks: function () {

        if (_terminal === 'app') {
            return;
        }

        //main shelf list campaign detail temai udesign
        //prepend download tip node in pages
        // 增加 m.uzai.com/sh/outbound/ 和 m.uzai.com/bj/outbound/
        var pages = ['//mdingzhi.uzai.com', '//m.uzai.com/sale', '//m.uzai.com/waptour-', '//m.uzai.com/trip/wap/', '//m.uzai.com/wd/?word=', '//m.uzai.com/sh/youlun', '//m.uzai.com/navlink/', '//m.uzai.com/subject', '//m.uzai.com/sh/outbound/','//m.uzai.com/bj/outbound/' ,_uzm.domain.m + '/'];
        var pagescode = ['AA2v', 'AA2u', 'AA28', 'AA28', 'AA2s', 'AA2s', 'AA2t', 'AA2r','AA2s','AA2s', 'AADe'];
        var pageidx = -1;
        var gacode = ["udesign", "temai", "detail", "detail", "list", "youlun", "shelf", "campaign", "main"];
        var pagelen = pagescode.length;
        var pagepfx = 'http://a.mlinks.cc/';
        var pagelink = '';
        var ur = location.href.toLowerCase();
        var inArr = pages.some(function (item, idx, arr) {
            if (idx !== pagelen - 1) {
                if (ur.indexOf(item) > -1) {
                    pagelink = pagepfx + pagescode[idx];
                    pageidx = idx;
                    return true;
                }
            } else {
                //check index page
                if (location.origin + location.pathname + location.search === item) {
                    pagelink = pagepfx + pagescode[idx];
                    pageidx = idx;
                    return true;
                }
            }
        });

        if (inArr) {
            var gtip = $('.g-download-tip');
            var ck = _uzm.cookie.get('uzmGdownloadTip');
            if (!ck) {
                if (!gtip.get(0)) {
                    var sb = "";
                    sb += "<div class='g-download-tip clearfix'>";
                    sb += "    <div class='fl'>";
                    sb += "    <div class='box clearfix'>";
                    sb += "        <div class='fl b'><i class='close'>&times;</i><img alt='众信悠哉旅游APP' src='" + _uzm.domain.cdnRandom() + "/content/v1/images/common/logo-icon.png' class='logo'></div>";
                    sb += "        <div class='fl txt'>";
                    sb += "            <p class='p1 b'>6999抢欧洲游！</p>";
                    sb += "            <p class='p2'>下载众信悠哉旅游APP</p>";
                    sb += "        </div>";
                    sb += "    </div>";
                    sb += "</div>";
                    sb += "<div class='fr j_gAppDownload' ></div>";
                    sb += "</div>";
                    $('body').prepend(sb);
                    gtip = $('.g-download-tip');

                    //close global download tip
                    gtip.find('.close').on('click', function () {
                        gtip.remove();
                        //fix iscroll absolute position bug
                        $('#j_list').css({ 'top': ($('#j_fnHeader').is(':visible') ? $('#j_fnHeader').outerHeight() : 0) });
                        _uzm.cookie.set('uzmGdownloadTip', '1', 1);
                        return false;
                    });
                }
            }

            if (typeof _scale !== 'undefined' && _scale.rem) {
                gtip.addClass('g-download-tip-rem');
                $('.fn-header').addClass('fn-header-rem');
            }

            if (pagelink) {
                pagelink += ('?channel=' + _terminal + '?mw_ck=' + _terminal);
                if (window.mlPKG) {
                    var mlpkg = $.param(window.mlPKG);
                    if (mlpkg) {
                        pagelink += ('&' + mlpkg);
                    }
                } else {
                    //专辑页面默认不传参

                    if (ur.indexOf('m.uzai.com/subject') > -1) {

                        var pdTemp = window.pageData || {};//兼容微信分享页面配置代码
                        var cdis = $('meta[name="description"]').attr('content') || '';
                        var cpic = $('meta[name="weixin-pic"]').attr('content') || '';

                        var imgUrl = pdTemp.imgUrl || cpic || _uzm.domain.cdn + '/content/v1/images/common/logo-icon.png';
                        imgUrl = location.protocol.toLowerCase() + imgUrl.replace('https://', '').replace('http://', '');

                        var obj = {
                            isShare: 1,
                            topicName: pdTemp.title || document.title || '众信悠哉旅游',
                            shareContent: pdTemp.desc || cdis || '众信悠哉旅游',
                            activityUrl: pdTemp.link || location.href,
                            topicsImgUrl: imgUrl
                        };

                        pagelink += ('&' + $.param(obj));

                    }
                }
            }

            var dlist = $('.j_gAppDownload');

            if (dlist.get(0)) {
                if (_uzm.mobile.isWeiXin) {
                    dlist.html('<a  data-mlink="' + pagelink + '" href=' + _uzm.domain.m + '/download" >打开APP</a>');
                } else if (_uzm.mobile.isIphone) {
                    dlist.html('<a data-mlink="' + pagelink + '" href="' + _uzm.pkg.iphone + '"  onclick="ga(\'send\', \'event\' ,\'' + (gacode[pageidx]||"") + '\' , \'click\', \'iphone_download\');">打开APP</a>');
                } else if (_uzm.mobile.isIpad) {
                    dlist.html('<a data-mlink="' + pagelink + '" href="' + _uzm.pkg.ipad + '"  onclick="ga(\'send\', \'event\' ,\'' + (gacode[pageidx] || "") + '\' , \'click\', \'iphone_download\');">打开APP</a>');
                } else {
                    dlist.html('<a data-mlink="' + pagelink + '" href="' + _uzm.pkg.android + '" onclick="ga(\'send\', \'event\' ,\'' + (gacode[pageidx] || "") + '\' , \'click\', \'iphone_download\');">打开APP</a>');
                }
            }
        }

        var mlprot = location.protocol.toLowerCase() === 'https:' ? 's' : 'a';

        if (!$('a[data-mlink]').get(0)) {
            return;
        }

        var unitEvent = function () {
            var arr = [];
            $('a[data-mlink]').each(function (k, v) {
                var o = $(this);
                var oh = o.attr('data-mlink');
                if (oh) {
                    //判断chanel
                    var cnl = _util.url.get(oh, 'mw_ck') || _util.url.get(oh, 'channel');
                    if (!cnl) {
                        var spe = oh.indexOf('?') > -1 ? '&' : '?';
                        cnl = spe + 'mw_ck=' + _terminal + '&channel=' + _terminal;
                    } else {
                        cnl = '';
                    }
                    o.attr('href', 'javascript:void(0)');
                    var obj = {
                        mlink: oh + cnl, // 在魔窗后台配置好的短链URL
                        button: o.get(0),// 您页面中ID为"openApp"的A标签, ID随便定义,但必须是A标签
                        autoRedirect: false // 尝试自动打开您在魔窗后台配置的mlink中的App
                    };
                    arr.push(obj);
                }
            });
            if (arr.length) {
                new Mlink(arr);
            }
        };

        if (typeof Mlink === 'function') {
            unitEvent();
        } else {
            _util.file.load('//' + mlprot + '.mlinks.cc/scripts/dist/mlink.min.js', function () {
                unitEvent();
            });
        }


    },
    gNotice: function () {
        //预热时间
        var _gNoticePreScope = {
            start: '2016/01/15 18:00:00',
            end: '2016/01/16 06:00:00'
        };
        //真实时间
        var _gNoticeScope = {
            start: '2016/01/15 23:00:00',
            end: '2016/01/16 06:00:00'
        };

        var _gNoticeInGAP = function (timeScope) {
            var nd = Date.parse(new Date());
            var ndstart = Date.parse(timeScope.start);
            var ndend = Date.parse(timeScope.end);
            if (nd >= ndstart && nd <= ndend) {
                return true;
            }
            return false;
        };

        if (_gNoticeInGAP(_gNoticePreScope)) {

            var _gNoticePop = function () {

                var ckName = 'uzmNoticePop114';
                if (_uzm.cookie.get(ckName)) {
                    return;
                }

                var words = "<div class='tl'><div class='tc f18 pb5' style='line-height:20px;'>系统维护通知</div><span class='red'>1月15日23:00至1月16日6:00</span>期间进行系统维护，届时部分产品将无法购买（但可收藏）。给您带来不便，敬请谅解。</div>";
                _uzm.mask.show();

                _uzm.pop.confirm(words, function () {
                    $('#g_toptipPop').hide();
                    _uzm.mask.hide();
                    _uzm.cookie.set(ckName, "1", 7);
                });

            };
            _gNoticePop();//弹出通栏通告

            if (_gNoticeInGAP(_gNoticeScope)) {
                var zxFlag = $('#hidSupplierFlag').val();
                if (zxFlag == '008') {
                    var btnos = $('#ordersubmit');
                    btnos.hide();
                    btnos.after("<input class='btn-order-maintain lh3 fr btn g5' type='button' value='维护中...' />");
                }
            }
        }
    },
    gBackAction: function () {
        var refer = document.referrer;

        $('.fn-header .back').on('click', function () {
            var o = $(this);
            var odis = o.attr('data-disable');
            if (!odis) {
                var ourl = o.attr('data-url');
                if (ourl) {
                    location.href = ourl;//跳转url
                } else {
                    if (refer.indexOf('.uzai.com') <= -1) {
                        location.href = _uzm.domain.m;
                    } else if (refer.indexOf('m.uzai.com/product') > -1) {
                        //新版本详情页跳转
                        location.href = 'http://m.uzai.com/';
                    } else {
                        history.go(-1);
                    }
                }
            }
        });
    },
    gUesrLoginStatus: function () {
        var o = $('#login-status');
        if (_uzm.cookie.get('user')) {
            o.html("<a href='" + _uzm.domain.u + "/mobile/order'>" + _uzm.user.userName + "</a><a href='" + _uzm.domain.u + "/mobile/logout'>退出</a>");
        } else {
            o.html("<a href='" + _uzm.domain.u + "/mobile/login'>登录</a><a href='" + _uzm.domain.u + "/mobile/reg'>注册</a>");
        }
    },
    gTopDownloadTip: function () {
        var status = 'hide';

        //显示状态
        var b = _uzm.cookie.get('uzmTopDownTip');
        status = b ? "hide" : "show";

        //判断是否是UC
        if (_uzm.mobile.isUC) {
            status = 'hide';
        }

        if (_terminal !== 'wap') {
            status = 'hide';
        }

        var url = document.location.href.replace('#', '');

        if (url.indexOf('waptour') > -1) {
            status = 'hide';
        }

        if (url.indexOf('source=weixin') > -1 || url.indexOf('source=pctour') > -1) {
            status = b ? "hide" : "show";
        }

        if (_terminal !== 'wap') {
            status = 'hide';
        }

        if (status == 'hide')
            $('#smartBanner').hide();
        else
            $('#smartBanner').show();

        //关闭提示
        $('#smartBanner .sb-close').on('click', function () {
            _uzm.cookie.set('uzmTopDownTip', 'true', 7);
            $('#smartBanner').hide();
        });
    }

};


$(function () {
    FastClick && FastClick.attach(document.body);
    _uzm.web.init();//初始化
});

//特别注意：该事件必须在源事件触发后执行，节点隐藏后移除事件，禁止全局触发。
//点击文档，隐藏目标节点
//node 父节点
//targetNode 需要隐藏的目标节点
function blankFix(node, targetNode, callback) {
    var evt = function (e) {
        var nodeTag = $('#' + node).get(0) ? "#tag,#tag *" : ".tag,.tag *";
        nodeTag = _util.string.replaceAll(nodeTag, 'tag', node);
        if (!$(e.target).is(nodeTag)) {
            console.log(nodeTag);
            var tNode = $('#' + targetNode);
            if (!tNode.get(0)) {
                tNode = $('.' + targetNode);
            }
            tNode.hide();
            //待修复，性能问题
            $(document).unbind('click', evt);
            callback && callback();
        }
    };
    $(document).bind('click', evt);
}

//防止window.onload事件重载
function winLoadFix(fn) {
    if (fn) {
        if (window.addEventListener) {
            window.addEventListener('load', fn, false);
        } else {
            window.attachEvent('onload', fn);
        }
    }
}
