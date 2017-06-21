/**
 * Created by xuxinmin on 16/6/24.
 */
$(document).ready(function(){
    if(!api.isApp()){
        popShow();
    }
});

var _terminal = 'wap';
var _isWeixin=navigator.userAgent.toLowerCase().match(/micromessenger/i) == 'micromessenger';

if (_isWeixin) {
    _terminal = 'weixin';
}else if( api.isApp()){
    _terminal = 'app';

}

/* 匹配url */
function checkUrl(){
    var url=window.location.href.replace('http://','').toLowerCase();
    var pageCode = [{
        "host":['m.uzai.com/sale','m.uzai.com/sale/','m.uzai.com/sale/index','m.uzai.com/sale/index/'],
        'code':'AA2u'
    },{
        "host":['mdingzhi.uzai.com','mdingzhi.uzai.com/','mdingzhi.uzai.com/home','mdingzhi.uzai.com/home/','mdingzhi.uzai.com/home/index.html','mdingzhi.uzai.com/hybrid/Home',
            'mdingzhi.uzai.com/hybrid/home/', 'mdingzhi.uzai.com/hybrid/home/index.html'],
        'code':'AA2v'
    }];
    for(var i=0;i<pageCode.length;i++){
        for(var j=0;j<pageCode[i].host.length;j++){
            if(url===pageCode[i].host[j]){
                code=pageCode[i].code;
                return code;
            }
        }
    }
}

/* 弹层展示 */
function popShow() {
    var code=checkUrl();

    if(code===undefined){//默认首页
        code='AADe';
    }
    var mlinks='http://a.mlinks.cc/'+code+'?channel=' + _terminal;

    var html='<div class="uzai-down-pop">' +
        '<div class="con">' +
        '<a class="down-btn" href="'+mlinks+'">下载/打开APP</a>' +
        '<a class="phone-btn" href="tel:4000008888">拨打客服电话</a>' +
        '<a class="next-btn close">继续访问</a> <a class="top-btn close"></a>' +
        '</div> ' +
        '</div>';

    var agin = api.getCookie('uzaipop');
    if (agin === null || agin === undefined) {
        $('body').append(html);
        $('.uzai-down-pop a').click(function () {
            $('.uzai-down-pop').remove();
            api.setCookie('uzaipop', 'agin',2592000);
        });
    }
}


/* 跳转
function OpenApp(e) {
    if(e===undefined){
        e='AADe';
    }
    var mlinks='http://a.mlinks.cc/';
    location.href = mlinks+e+'?channel=' + _terminal;
}
*/
