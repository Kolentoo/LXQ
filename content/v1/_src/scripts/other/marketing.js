/*
* @Author: lxq
* @Date:   2016-12-13 14:34:10
* @Last Modified by:   lxq
* @Last Modified time: 2016-12-27 14:59:46
*/

'use strict';

$(function(){
	marketing();
});


function marketing(){
	var u = document.location.href.toLowerCase();

    
    var ckUrl = 'uzwMarketingUrl'; //首次出现广告记录url
    var ckClose = 'uzwMarketingClose'; //关闭广告
    var ckPd = 'uzwProductDetail';  //首次记录的广告信息
    var ckRecord = _uzw.cookie.get(ckClose);
    var ckUrlkey = _uzw.cookie.get(ckUrl);  
    var bottomBanner;  
    

    function _appendAd(){
        var obody = $('body');
        obody.append(
            '<div class="bottom-banner hide">'+
                '<a href="" class="block bottom-bj">'+
                    '<div class="bottom-con">'+
                        '<div class="bottom-txt">'+
                            '<dl class="txt-con">'+
                                '<dd class="f24 b">年底限时大促</dd>'+
                                '<dd class="f18"><em>现在购买</em><b class="f22"><i></i>产品</b></dd>'+
                                '<dd class="f18">立享百元优惠</dd>'+
                            '</dl>'+
                        '</div>'+
                        '<div class="bottom-btn">'+
                            '<p class="p1 b f18">快来看看吧！！</p>'+
                        '</div>'+
                        '<div class="bottom-decorate">'+
                            '<img class="png bottom-pic" src="">'+
                        '</div>'+
                    '</div>'+
                '</a>'+
                '<div class="bottom-close pointer">'+
                    '<div class="close-icon png"></div>'+
                '</div>'+
            '</div>'
        );    
        bottomBanner = $('.bottom-banner');
        bottomBanner.find('.bottom-close').on('click',function(){
            bottomBanner.addClass('hide');
           _uzw.cookie.set(ckClose,'hide',60);
        });            
    }  


    var number = parseInt(Math.random() * 21, 10);
    var bottomArr = [
        {
            "name": "德国",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-dg.png",
            "link":"http://sh.uzai.com/outbound/europe-search-z18855.html?shiyan=ad12"
        },
        {
            "name": "东南亚",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-dny.png",
            "link":"http://sh.uzai.com/outbound/dongnanya/?shiyan=ad2"

        },
        {
            "name": "法国",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-fg.png",
            "link":"http://sh.uzai.com/outbound/europe-search-z18850.html?shiyan=ad11"
        },
        {
            "name": "菲律宾",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-flb.png",
            "link":"http://sh.uzai.com/outbound/philippines-c-10992.html?shiyan=ad8"
        },
        {
            "name": "韩国",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-hg.png",
            "link":"http://sh.uzai.com/outbound/southkorea-c-11042.html?shiyan=ad5"
        },
        {
            "name": "韩国济州岛",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-jzd.png",
            "link":"http://sh.uzai.com/outbound/southkorea-c-11042-search-z18804.html?shiyan=ad18"
        },
        {
            "name": "韩国首尔",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-sr.png",
            "link":"http://sh.uzai.com/outbound/rihan-search-z18838.html?shiyan=ad19"
        },
        {
            "name": "马来西亚",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-mlxy.png",
            "link":"http://sh.uzai.com/outbound/malaysia-c-11188.html?shiyan=ad9"
        },
        {
            "name": "欧洲",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-oz.png",
            "link":"http://sh.uzai.com/outbound/europe/?shiyan=ad3"
        },
        {
            "name": "日本",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-rb.png",
            "link":"http://www.uzai.com/rihan/japan-11414?shiyan=ad4"
        },
        {
            "name": "日本北海道",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-bhd.png",
            "link":"http://sh.uzai.com/outbound/japan-c-11414-search-z18882.html?shiyan=ad16"
        },
        {
            "name": "日本冲绳",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-cs.png",
            "link":"http://sh.uzai.com/outbound/japan-c-11414-search-z18713.html?shiyan=ad17"
        },
        {
            "name": "日韩",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-rh.png",
            "link":"http://sh.uzai.com/outbound/rihan?shiyan=ad1"
        },
        {
            "name": "瑞士",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-rs.png",
            "link":"http://sh.uzai.com/outbound/switzerland-c-9735-search-z18847.html?shiyan=ad13"
        },
        {
            "name": "泰国",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-tg.png",
            "link":"http://sh.uzai.com/outbound/thailand-c-11652-search-t2.html?shiyan=ad6"
        },
        {
            "name": "泰国普吉岛",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-pjd.png",
            "link":"http://sh.uzai.com/outbound/thailand-c-11652-search-z18831.html?shiyan=ad21"
        },
        {
            "name": "泰国清迈",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-qm.png",
            "link":"http://sh.uzai.com/outbound/thailand-c-11652-search-z18453.html?shiyan=ad20"
        },
        {
            "name": "希腊",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-xl.png",
            "link":"http://sh.uzai.com/outbound/europe-search-z12257.html?shiyan=ad14"
        },
        {
            "name": "印度尼西亚",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-bld.png",
            "link":"http://www.uzai.com/dongnanya/indonesia-11970?shiyan=ad7"
        },
        {
            "name": "意大利",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-ydl.png",
            "link":"http://sh.uzai.com/outbound/europe-search-z18851.html?shiyan=ad10"
        },
        {
            "name": "英国",
            "url": _uzw.domain.cdnRandom()+"/content/v1/images/common/bottom-yg.png",
            "link":"http://sh.uzai.com/outbound/europe-search-z12071.html?shiyan=ad15"
        }
    ];

    if (u.indexOf('sh.uzai.com/outbound/') > -1) { 
        _appendAd();
        if (ckRecord) {
            bottomBanner.addClass('hide');
        } else{
            if (ckUrlkey) {
                if (ckUrlkey===u) {
                    bottomBanner.removeClass('hide');
                    var amount = _uzw.cookie.get(ckPd);
                    var nameTxt1 = bottomArr[amount].name;
                    var urlCon1 = bottomArr[amount].url;
                    var linkCon1 = bottomArr[amount].link;
                    bottomBanner.find('.txt-con').find('b').find('i').text(nameTxt1);
                    bottomBanner.find('.bottom-decorate').find('.bottom-pic').attr('src',urlCon1);
                    bottomBanner.find('.bottom-bj').attr('href',linkCon1);
                }else{
                    bottomBanner.addClass('hide');
                }
            }else{
                bottomBanner.removeClass('hide');
                _uzw.cookie.set(ckUrl,u,60);
                _uzw.cookie.set(ckPd,number,60);
                
                
                var nameTxt2 = bottomArr[number].name;
                var urlCon2 = bottomArr[number].url;
                var linkCon2 = bottomArr[number].link;

                bottomBanner.find('.txt-con').find('b').find('i').text(nameTxt2);
                bottomBanner.find('.bottom-decorate').find('.bottom-pic').attr('src',urlCon2); 
                bottomBanner.find('.bottom-bj').attr('href',linkCon2);


                var hrefTail = linkCon2.split('?');
                var tail = hrefTail[1];
                var titleText = $('title').text();

                window._pt_sp_2.push("setPVTag," + u + "?utm_campaign=红包广告" + tail + "&utm_source=" + titleText + "&utm_medium=红包广告,replace"); 


            }
        }
    }  



}