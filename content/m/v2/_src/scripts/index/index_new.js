"use strict";

$(document).ready(function () {
    var _img;

    function imgLoad(_img){
        for(var i=0;i<_img.length;i++){
            if(_img.eq(i).offset().top - $(document).scrollTop() < $(window).height()){
                _img.eq(i).attr('src',_img.eq(i).attr('data-src'));
            }
        }
    }

    function ImagesLoad() {
        if ($('.recommend-ls .ls').eq(0).is(':visible')) {
            _img = $('.recommend-ls .ls').eq(0).find('.img-lazy');
            imgLoad(_img);
        } else if ($('.recommend-ls .ls').eq(1).is(':visible')) {
            _img = $('.recommend-ls .ls').eq(1).find('.img-lazy');
            imgLoad(_img);
        }
    }

    ImagesLoad();


    var mySwiper = new window.Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay: 3000,
        speed: 500,
        loop: true,
        observer: true,
        observeParents: true,
        autoplayDisableOnInteraction: false,
        onInit: function(swiper){
            $('.swiper-pagination-bullets').show();
        }
    });

    $('.recommend-ls .btn-ls .son-box').click(function () {
        if ($('.recommend-ls .btn-ls .son-box').length > 1) {
            $('.recommend-ls').find('a').removeClass('on');
            $('.recommend-ls .ls').hide();
            $(this).find('a').addClass('on');
            $('.recommend-ls .ls').eq($(this).index()).show();
            if ($('.recommend-ls').hasClass('on')) {
                var height = $('.scroll-height').height() + $('.banner').height();
                $(window).scrollTop(height);
            }
            ImagesLoad();
        }
    });

    $(window).scroll(function () {
        var sheight = $('.scroll-height').height() + $('.top').height();
        var tollheight = $(this).scrollTop();
        if (tollheight >= sheight) {
            $('.recommend-ls').addClass('on');
        }
        if (tollheight < sheight) {
            $('.recommend-ls').removeClass('on');
        }
        ImagesLoad();
    });

    $('.search-btn').click(function () {
        $('.pop-search-mod').show();
        $('.pop-search-mod .bar-main input').focus();
        var uzaiChooseSpot = decodeURI(api.getCookie("uzmChooseSpot"), "decodeURIComponent");
        if (uzaiChooseSpot === null || uzaiChooseSpot === 'null' || uzaiChooseSpot === "" || uzaiChooseSpot === undefined) {
            $(".keywords-list").html("");
        }
        else {
            var uzaiChooseSpots = uzaiChooseSpot.split("|").reverse();
            var html = "";
            for (var i = 0; i < uzaiChooseSpots.length; i++) {
                if (i < 2) {
                    html += '<li class="list-item border-top"><a href="/wd/?word=' + uzaiChooseSpots[i] + '"><i class="icon-item"></i><em class="item-cont">' + uzaiChooseSpots[i] + '</em></a><i class="item-close"></i> </li>';
                } else {
                    break;
                }
            }

            $(".keywords-list").html(html);
            $(".keywords-list").find(".item-close").on('click', function () {
                var itemClose = $(this),
                    keyList = itemClose.parent(".list-item"),
                    itemCont = keyList.find(".item-cont").text();
                for (var i = 0; i < uzaiChooseSpots.length; i++) {
                    if (uzaiChooseSpots[i] === itemCont) {
                        uzaiChooseSpots.splice(i, 1);
                        api.setCookie("uzmChooseSpot", encodeURIComponent(uzaiChooseSpots.join("|")));

                        keyList.remove();
                        $(".keywords-list").find(".list-item").length || keyList.css({display: "none"});
                    }
                }
            });
        }
    });

    $('.pop-search-mod .btn-cancel').click(function () {
        $('.pop-search-mod').hide();
    });


    $('.pop-search-mod .hot-items').click(function () {
        $('.pop-search-mod').hide();
    });
    $('.pop-search-mod .keywords-list').click(function () {
        $('.pop-search-mod').hide();
    });

    /*document.onreadystatechange = completeLoading;
     function completeLoading() {
     if (document.readyState === "complete") {
     api.endloading();
     }
     }
     */

    //app下载
    $('.com-footer-nav .block:last-child').click(function(){
        var mlinks,code='AADe';

        var _terminal = 'wap';
        var _isWeixin = navigator.userAgent.toLowerCase().match(/micromessenger/i) == 'micromessenger';

        if (_isWeixin) {
            _terminal = 'weixin';
        }
        if (api.isApp()) {
            _terminal = 'app';
        }
        window.location.href = 'https://a.mlinks.cc/' + code + '?channel=' + _terminal + '&&mw_ck=' + _terminal;
    });

    getPoint();
});


function GoToDetail(detailUrl) {
    window.location.href = detailUrl;
}

var starting_list = [{
    "class": "B",
    "id": "1",
    "city": "bj",
    "txt": "北京"
}, {
    "class": "C",
    "id": "165",
    "city": "cd",
    "txt": "成都"
}, {
    "class": "C",
    "id": "257",
    "city": "cc",
    "txt": "长春"
}, {
    "class": "C",
    "id": "68",
    "city": "cz",
    "txt": "常州"
}, {
    "class": "C",
    "id": "4",
    "city": "cq",
    "txt": "重庆"
}, {
    "class": "D",
    "id": "31",
    "city": "dl",
    "txt": "大连"
}, {
    "class": "G",
    "id": "144",
    "city": "gz",
    "txt": "广州"
}, {
    "class": "H",
    "id": "19",
    "city": "hz",
    "txt": "杭州"
}, {
    "class": "H",
    "id": "238",
    "city": "hf",
    "txt": "合肥"
}, {
    "class": "J",
    "id": "115",
    "city": "jn",
    "txt": "济南"
}, {
    "class": "N",
    "id": "57",
    "city": "nj",
    "txt": "南京"
}, {
    "class": "N",
    "id": "22",
    "city": "nb",
    "txt": "宁波"
}, {
    "class": "N",
    "id": "83",
    "city": "nc",
    "txt": "南昌"
}, {
    "class": "S",
    "id": "2",
    "city": "sh",
    "txt": "上海"
}, {
    "class": "S",
    "id": "29",
    "city": "sy",
    "txt": "沈阳"
}, {
    "class": "S",
    "id": "8",
    "city": "sjz",
    "txt": "石家庄 "
}, {
    "class": "T",
    "id": "3",
    "city": "tj",
    "txt": "天津"
}, {
    "class": "T",
    "id": "94",
    "city": "ty",
    "txt": "太原"
}, {
    "class": "W",
    "id": "43",
    "city": "wh",
    "txt": "武汉"
}, {
    "class": "W",
    "id": "58",
    "city": "wx",
    "txt": "无锡"
}, {
    "class": "X",
    "id": "135",
    "city": "xm",
    "txt": "厦门"
}, {
    "class": "Z",
    "id": "204",
    "city": "zz",
    "txt": "郑州"
}];
////---------------定位成功
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var point = new window.BMap.Point(longitude, latitude);
    // 创建点坐标
    var gc = new window.BMap.Geocoder();
    gc.getLocation(point, function (rs) {
        var locationCity = rs.addressComponents.province;
        var cityname = locationCity;
        if (cityname.indexOf("省") > 0) {
            cityname = cityname.replace(/省/g, "");
        }
        else if (cityname.indexOf("市") > 0) {
            cityname = cityname.replace(/市/, "");
        }
        else {
            cityname = cityname;
        }
        var oldCityname = decodeURI(api.getLocalStorage('departureCityName'));
        var uzmCity=api.getCookie('uzmCity','decodeURIComponent');
        var newCityname = '';
        if(uzmCity!==''&&typeof(uzmCity)!=='undefined')
        {
            newCityname=uzmCity.split('-')[0];
        }
        var cancelCity = api.getCookie('cancleCity');
        var cityId=  selectCity(cityname).id;
        var cityPinYin=selectCity(cityname).city;
        var textname=$('.search .map-point').text();
        //alert("oldCityname"+oldCityname+"newCityname"+newCityname+"cancelCity"+cancelCity);
        if (oldCityname !== newCityname && (cancelCity === null || cancelCity === undefined) && oldCityname !== null && oldCityname !== '' && textname !== cityname) {
            if (window.confirm('您当前城市为' + cityname + ',是否切换到当前城市?')) {
                $('.search .map-point').text(cityname);
                api.setCookie('uzmCity', encodeURIComponent(cityname) + '-' + cityId + '-' + cityPinYin, 86400);
                window.location.href = "http://m.uzai.com/" + cityPinYin;
            }
        }
        api.setCookie('cancleCity', true, 0);
        api.setLocalStorage('departureCityName', encodeURI(cityname));
    });

}

function selectCity(e){
    var city={
        id:1,
        city:'bj',
        txt:'北京'
    };
    for(var i=0;i<=starting_list.length;i++){
        if(starting_list[i].txt===e) {
            city=starting_list[i];
            return city;
        }
    }
}

//---------------定位失败
function handleLocationError(error) {
    var uzmCity = api.getCookie('uzmCity');
    if (uzmCity !== '' && typeof (uzmCity) !== 'undefined') {
        $('.search .map-point').text(decodeURI(uzmCity.split('-')[0]));
    } else {
        $('.search .map-point').text("上海");
    }
}

function getPoint(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAccuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 1000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 0
        });
    }else{
        alert("浏览器不支持html5来获取地理位置信息");
    }
}

/**
 * @author Created by HuangZhao on 2017/02/23.
 * @客服电
 */

var $doc = document,
    $telIco = $doc.getElementsByClassName('user')[0],// 电话图标icon
    $fixed = $doc.getElementsByClassName('j-uzai-fixed')[0],//    遮罩层
    $meiqia = $doc.getElementsByClassName('j-all-meiqia')[0],//    弹层
    $meiCancle = $meiqia.getElementsByClassName('cancle')[0];
$telIco.onclick = function(){
    $fixed.classList.remove('zHide');
    $meiqia.classList.add('j-uzai-active');
};
$fixed.onclick = function(){
    $fixed.classList.add('zHide');
    $meiqia.classList.remove('j-uzai-active');
};
$meiCancle.onclick = function(){
    $fixed.classList.add('zHide');
    $meiqia.classList.remove('j-uzai-active');
};
$fixed.addEventListener('touchmove',function(e){
    e.preventDefault();
});
$meiqia.addEventListener('touchmove',function(e){
    e.preventDefault();
});
