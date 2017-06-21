"use strict";

$(document).ready(function () {
    var mySwiper = new window.Swiper ('.swiper-container',{
        pagination : '.swiper-pagination',
        autoplay: 3000,
        speed: 500,
        loop: true,
        observer:true,
        observeParents:true,
        autoplayDisableOnInteraction : false
    });

    function ImagesLoad() {
        var _img = null;
        if ($('.sale-ls .ls').eq(0).is(':visible')) {
            _img = $('.sale-ls .ls').eq(0).find('.img-lazy');
        } else if ($('.sale-ls .ls').eq(1).is(':visible')) {
            _img = $('.sale-ls .ls').eq(1).find('.img-lazy');
        }
        _img && window.imgLoad && window.imgLoad(_img);
    }

    ImagesLoad();

    var bannerheight=Math.abs($('.banner').height());

    $('.sale-ls .btn-ls .son-box').click(function () {
        if($(window).scrollTop()>=bannerheight){
            $(window).scrollTop(bannerheight);
            $('.sale-ls').addClass('on');
        }else if($('.sale-ls').hasClass('on')){
            $(window).scrollTop(bannerheight);
        }
        if($('.sale-ls .btn-ls .son-box').length>1){
            $('.sale-ls .btn-ls .son-box').removeClass('on');
            $('.sale-ls .ls').hide();
            $(this).addClass('on');
            $('.sale-ls .ls').eq($(this).index()).show();
            ImagesLoad();
        }
    });

    window.onbeforeunload=function () {
        $(window).scrollTop(0, 0);
    };

    $(window).scroll(function (e) {
        var _header = $('.white-topbar');
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop>bannerheight){
            $('.sale-ls').addClass('on');
        }
        if(scrollTop<bannerheight){
            $('.sale-ls').removeClass('on');
        }
        if (scrollTop + windowHeight == scrollHeight) {
                load();
                api.loading();
        }
        ImagesLoad();
    });

    var startIndexF=2,startIndexS=2;
    function load() {
        var ptype,dataLength,origLength=$('.sale-ls .ls:visible .part').length;
        var index=$('.sale-ls .ls:visible').index();
        $.ajax({
            type: 'post',
            url: 'http://m.uzai.com/sale/GetSaleProdcutList',
            dataType: 'json',
            data:{
                type:index==1?4:2,//4特卖经典,2尾单甩卖
                startIndex:index==1?startIndexF:startIndexS
            },
            size: 10,
            success: function (data) {
                dataLength=origLength+data.TmhProductList.length;
                if(dataLength>origLength){
                    var list=data.TmhProductList.map(function(e){
                        var classId;
                        return ['<div class="part" onclick="location.href=',(function(){
                            classId=e.UzaiTravelClass === "自助游" ? 15 : 1;
                            if (classId == 1 || classId == 2 || classId == 3){
                                return ['\'http://m.uzai.com/waptour-',e.UzaiProductId,'.html\''].join('');
                            }else{
                                return ['\'http://m.uzai.com/trip/wap/',e.UzaiProductId,'.html\''].join('');
                            }
                            })(),'">'
                            , '<span class="follow"><i></i>',e.Votes,'人关注</span>'
                            , '<img src="',e.MainImageUrl,'">'
                            , '<p class="name">',e.ProductName,'</p>'
                            , '<p class="info"><span class="red">￥<b>',e.SourcePrice,'</b></span><span class="gray">￥',e.Price,'</span><span class="red-bg">',parseFloat(e.SourcePrice/e.Price*10).toFixed(1),'折</span></p>'
                            ,(function () {
                                if (index==2){
                                    return ['<div class="bot border-top"><p>'
                                    ,'<span class="gray">',formatDate(e.Schedule,"MM/dd"),'出游<em></em>',formatDate(e.DeadLine, "MM/dd"),'截止报名</span>'
                                    ,'<span class="red">仅剩',e.Stock,'位</span>'
                                        ,'</p></div>'].join('');
                                }
                              })()
                            , '</div>' ].join('');
                    }).join('');
                    $('.sale-ls .ls:visible').append(list);
                    index==1?startIndexF++:startIndexS++;
                }else{
                    api.toast('没有更多了');
                }
                api.endloading();
            },
            error: function (e) {
                api.endloading();
                if(e.status===200){
                    api.toast('没有更多了');
                }else {
                    api.toast('加载失败');
                }
                console.log(e);
            }
        });

    }

    function formatDate(date, format) {
        if (!date) return;
        if (!format) format = "yyyy-MM-dd";
        switch (typeof date) {
            case "string":
                date = new Date(date.replace(/-/, "/"));
                break;
            case "number":
                date = new Date(date);
                break;
        }
        if (!(date instanceof Date)) return;
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
            return dict[arguments[0]];
        });
    }

});