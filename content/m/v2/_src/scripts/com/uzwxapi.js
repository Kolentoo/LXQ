"use strict";

/**
 * a: jsonchou
 * d: 2015-12-29
 * <script src='//res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>
 * seajs incompatible with weixin jssdk
 */

//actID  公众账号ID
//jsCallback weixin api js 载入回调

//cbOBJ = {
//    load: function () { },//weixin api js loaded
//    trigger: function () { },
//    success: function () { },
//    fail: function () { },
//    cancel: function () { },
//    complete: function () { }
//}

var zxWxCFG = {
    act: "zxlywd",
    appId: 'wx58659ee3a00d228e',
    debug: false
};

function uzWXApi(zxCFG, isGetOpenID, cbOBJ) {

    var uztest = _util.url.get(location.href, 'uztest');
    if (uztest) {
        zxCFG.debug = true;
        _uzm.pop.cup(location.href + '\r\n---分隔符---\r\n' + 'uztest' + uztest + '\r\n---分隔符---\r\n' + document.cookie);
    }

    var myCFG = (typeof zxCFG === 'string') ? { act: zxCFG } : zxCFG;

    // myCFG.debug && (_uzm.domain.weixinapi = '//paycbm.uzai.com/');

    if (!_uzm.mobile.isWeiXin) {
        return;
    }

    //alert(JSON.stringify(zxCFG));

    //获取OPENID
    if (isGetOpenID) {
        var ckName = '_uzmWeixinOpenID_' + (myCFG.act || zxWxCFG.act);

        var ck = _uzm.cookie.get(ckName);

        if (!ck) {
            var mid = "http://m.uzai.com/weixin/WxCallback.html?MyUrl=" + encodeURIComponent(decodeURIComponent(location.href).replace('#rd&', '&').replace('#rd', ''));//配置中转页面
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + (myCFG.appId || zxWxCFG.appId) + '&redirect_uri=' + encodeURIComponent(mid) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
        }
    }

    //自定义页面信息
    var _wxCustomizePageInfo = function () {
        if (typeof (wx) === 'function') {
            _unitEvent();
        } else {
            _util.file.load('//res.wx.qq.com/open/js/jweixin-1.0.0.js', function () {
                _unitEvent();
            }, true);
        }

        var _unitGetSubjectName = function () {
            var ur = location.pathname.toLowerCase();
            var tag = ur.replace('/subject/', '').replace('/', '');
            return tag || '';
        };

        // 配置数据
        var wxConfigData = {
            debug: myCFG.debug || false, //调试的时候最好设为true，它每一步都会alert数据出来，让你知道出了什么问题
            //appId: 'wxd7b23e332cbf3a77',//东瀛热appId
            //timestamp: Date.parse(new Date()), //随便填写一串数字
            //nonceStr: 'd1iCvw8rgdhGPkMG', //随便一字符串
            //signature: '', //**这个要到服务器获取**
            jsApiList: [ //用到的功能，自定义
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
            ]
        };

        var _unitShareData = function (tp) {
            var pd = window.pageData;

            var txtInfo = {
                hitType: 'event',
                eventCategory: 'activity-' + _unitGetSubjectName() + '-' + _uzm.terminal.source,
                eventAction: 'share'
            };

            var _unitRecord = function (shareType, status) {
                txtInfo.eventLabel = shareType + status;
                try {
                    ga('send', txtInfo);
                } catch (e) {

                }
            };

            var _unitPageData = function (shareType) {

                pd.trigger = function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    _unitRecord(shareType, 'trigger');
                    cbOBJ && cbOBJ.trigger && cbOBJ.trigger();
                };
                pd.success = function (res) {
                    _unitRecord(shareType, 'success');
                    cbOBJ && cbOBJ.success && cbOBJ.success();
                };
                pd.fail = function (res) {
                    _unitRecord(shareType, 'fail');
                    cbOBJ && cbOBJ.fail && cbOBJ.fail();
                };
                pd.cancel = function (res) {
                    _unitRecord(shareType, 'cancel');
                    cbOBJ && cbOBJ.cancel && cbOBJ.cancel();
                };
                pd.complete = function (res) {
                    _unitRecord(shareType, 'complete');
                    cbOBJ && cbOBJ.complete && cbOBJ.complete();
                };
            };

            if (tp == 'onMenuShareAppMessage') {
                _unitPageData('微信好友');

            } else if (tp == 'onMenuShareTimeline') {
                _unitPageData('分享到朋友圈');
            } else if (tp == 'onMenuShareQQ') {
                _unitPageData('QQ好友');
            } else if (tp == 'onMenuShareWeibo') {
                _unitPageData('新浪微博');
            }

            //alert(JSON.stringify(pd));
            return pd;
        };

        var _unitEvent = function () {
            // 微信分享基本数据
            var cdis = $('meta[name="description"]').attr('content') || '';
            var cpic = $('meta[name="weixin-pic"]').attr('content') || '';
            var ptc = location.protocol.toLowerCase();//浏览器协议
            var pdTemp = window.pageData || {};

            var imgUrl = pdTemp.imgUrl || cpic || _uzm.domain.cdn + '/content/v1/images/common/logo-icon.png';
            imgUrl = imgUrl.replace('https://', '').replace('http://', '');
            imgUrl = ptc + imgUrl;

            var pageData = {
                title: pdTemp.title || document.title || '众信悠哉旅游',
                desc: pdTemp.desc || cdis || '众信悠哉旅游',
                link: pdTemp.link || location.href ,
                imgUrl: imgUrl,
                type: pdTemp.type || '',
                dataUrl: pdTemp.dataUrl || ''
            };
            if (wxConfigData.debug) {
                alert(JSON.stringify(pageData));
            }
            //获取签名
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                cache: false,
                data: { 'gzh': myCFG.act || zxWxCFG.act, url: location.href.replace(location.hash, '') },
                url: _uzm.domain.weixinapi + '/ashx/wxAccessToken.ashx',
                success: function (res) {
                    if (res) {
                        // 获取签名成功，初始化分享
                        wxConfigData.signature = res.signature;
                        wxConfigData.nonceStr = res.noncestr;
                        wxConfigData.appId = res.appId;
                        wxConfigData.timestamp = res.timestamp;
                        wxConfigData.appSecret = res.appSecret;

                        //载入config
                        window.wx.config(wxConfigData);
                        //alert(JSON.stringify(res));

                        //alert(JSON.stringify({ 'gzh': myCFG.act || zxWxCFG.act, url: location.href.replace(location.hash, '') }));

                        window.wx.error(function (res) {
                            if (wxConfigData.debug) {
                                alert(JSON.stringify(res));
                            }
                        });
                        window.wx.ready(function () {

                            //微信好友
                            window.wx.onMenuShareAppMessage(_unitShareData('onMenuShareAppMessage'));
                            //分享到朋友圈
                            window.wx.onMenuShareTimeline(_unitShareData('onMenuShareTimeline'));
                            //QQ好友
                            window.wx.onMenuShareQQ(_unitShareData('onMenuShareQQ'));
                            //分享到微博
                            window.wx.onMenuShareWeibo(_unitShareData('onMenuShareWeibo'));

                        });

                        cbOBJ && cbOBJ.load && cbOBJ.load();

                    }
                }
            });
        };
    };
    _wxCustomizePageInfo();
}