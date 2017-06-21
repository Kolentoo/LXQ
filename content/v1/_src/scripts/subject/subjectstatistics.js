//专题页检测代码
//国双科技 Gridsum tracking code
var _gsq = _gsq || [];

//晶赞营销代码
if ("undefined" == typeof __zp_tag_params) {
    var __zp_tag_params = {
        pagetype: "other"
    };
}

//ptengine基础代码
window._pt_lt = new Date().getTime();
window._pt_sp_2 = [];
_pt_sp_2.push('setAccount,49512ddd');
//新增用户对应Ptengine用户ID 高银辉 2016-11-21
if (_uzw.cookie.get("user")) {
    var user = _uzw.cookie.get("user");
    var user_PtengineUserId = user.substring(user.indexOf("PtengineUserId=") + 15, user.length);
    _pt_sp_2.push('setCustomVar,def01,svid,value,' + user_PtengineUserId + ',0');
}
var _protocol = (("https:" == document.location.protocol) ? " https://" : " http://");

//品友
var _py = _py || [];
_py.push(['a', '3Os..3Y-1Ql4EXqRmqOaJOvnG1X']);
_py.push(['domain', 'stats.ipinyou.com']);
_py.push(['e', '']);
-function (d) {
    var s = d.createElement('script'),
        e = d.body.getElementsByTagName('script')[0]; e.parentNode.insertBefore(s, e),
        f = 'https:' == location.protocol;
    s.src = (f ? 'https' : 'http') + '://' + (f ? 'fm.ipinyou.com' : 'fm.p0y.cn') + '/j/adv.js';
} (document);

//悠哉 baidu js
var _hmt = _hmt || [];

//360
var _mvq = _mvq || [];
_mvq.push(['$setAccount', 'm-196944-0']);
_mvq.push(['$logConversion']);

//易博
var _adwq = _adwq || [];
_adwq.push(['_setAccount', 'x4o4b']);
_adwq.push(['_setDomainName', '.uzai.com']);
_adwq.push(['_trackPageview']);

(function(){

    //国双科技 Gridsum tracking code
    var s1 = document.createElement('script');
    s1.type = 'text/javascript';
    s1.async = true;
    s1.src = (location.protocol == 'https:' ? 'https://ssl.' : 'http://static.') + 'gridsumdissector.com/js/Clients/GWD-002793-B024A5/gs.js';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(s1, firstScript);

    //ptengine基础代码
    var atag = document.createElement('script'); atag.type = 'text/javascript'; atag.async = true;
    atag.src = _protocol + 'js.ptengine.cn/js/pta.js';
    var stag = document.createElement('script'); stag.type = 'text/javascript'; stag.async = true;
    stag.src = _protocol + 'js.ptengine.cn/js/pts.js';
    var s2 = document.getElementsByTagName('script')[0];
    s2.parentNode.insertBefore(atag, s2);

    //悠哉 baidu js
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?40b326259e577b18a52f2e2ac55d9bfa";
    hm.async = true;
    var s3 = document.getElementsByTagName("script")[0];
    s3.parentNode.insertBefore(hm, s3);

    //360
    var mvl = document.createElement('script');
    mvl.type = 'text/javascript';
    mvl.async = true;
    mvl.src = ('https:' == document.location.protocol ? 'https://static-ssl.mediav.com/mvl.js' : 'http://static.mediav.com/mvl.js');
    var s4 = document.getElementsByTagName('script')[0];
    s4.parentNode.insertBefore(mvl, s4);

    //易博
    var adw = document.createElement('script');
    adw.type = 'text/javascript';
    adw.async = true;
    adw.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://s') + '.emarbox.com/js/adw.js';
    var s5 = document.getElementsByTagName('script')[0];
    s5.parentNode.insertBefore(adw, s5);
})();

//ga
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        },i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-27817301-1', 'uzai.com');
var full_url = window.location.pathname + window.location.search + window.location.hash;
ga('send', 'pageview', full_url);

//晶赞营销代码
(function (param) {
    var c = { query: [], args: param || {} };
    c.query.push(["_setAccount", "639"]); //固定参数
    (window.__zpSMConfig = window.__zpSMConfig || []).push(c);
    var zp = document.createElement("script"); zp.type = "text/javascript"; zp.async = true;
    zp.src = ("https:" == document.location.protocol ? "https:" : "http:") + "//cdn.zampda.net/s.js";
    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(zp, s);
})(window.__zp_tag_params);

//百度分享
window._bd_share_config={"common": {
    "bdSnsKey":{},
    "bdText":"",
    "bdMini":"2",
    "bdMiniList":false,
    "bdPic":"",
    "bdStyle":"0",
    "bdSize":"16"
},
    "slide":{
        "type":"slide",
        "bdImg":"2",
        "bdPos":"left",
        "bdTop":"100"
    }
};
/* jshint ignore:start */
with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
/* jshint ignore:end */