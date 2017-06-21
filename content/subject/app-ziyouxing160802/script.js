/*
 * @Author: lxq
 * @Date:   2016-08-02 14:07:19
 * @Last Modified by:   lxq
 * @Last Modified time: 2016-09-18 18:16:12
 */

$(function(){
    myexports.init();
});

var subject, navigation, nav, conBox, navTop;
var myexports={};

myexports.init = function() { 
    subject = $('#j_subject');
    navigation = $('#j_nav');
    nav = navigation.find('.nav-list');
    conBox = subject.find('.cont-box');
    navTop = navigation.offset().top;

    myexports.navigation();
    myexports.sectime();
    myexports.tourActive();
    myexports.route();
    myexports.ranking();
    myexports.dream();
};

myexports.navigation = function() {
    nav.on('click', function() {
        var t = $(this);
        var ts = t.siblings('li');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').scrollTop(stop - 70);
    });
    $('.back').on('click', function() {
        $('body,html').scrollTop(0);
    });
    $(window).scroll(function() {
        var w = $(window).scrollTop();
        if (w >= navTop) {
            navigation.addClass('nav-on');
        } else {
            navigation.removeClass('nav-on');
        }
        $('.cont-box').each(function(a, b) {
            var ctop = $(this).offset().top;
            if (w > ctop - 100) {
                navigation.find('.nav-list').removeClass('on');
                navigation.find('.nav-list').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");
};

// 热抢和下期预告
myexports.sectime = function() {
    var box = subject.find('.cont4-box');
    var tbar = subject.find('.timer');
    var nowTime = 0;
    var cdtime = function(t, sj) {
        var or = t.parents('.r-list');
        var tTian = t.find('.tian');
        var tShi = t.find('.shi');
        var tFen = t.find('.fen');
        var tMiao = t.find('.miao');
        var tst = t.attr('data-starttime');
        var tet = t.attr('data-endtime');
        var start = parseInt(Date.parse(tst), 10);
        var end = parseInt(Date.parse(tet), 10);
        var iValue3 = start - sj;
        var iValue4 = end - sj;
        var ohref = or.find('a').attr("href");
        var dop = or.attr("data-product");

        var tout;

        var cx = function(cx1) {
            var tseconds = cx1 / 1000;
            var tminutes = Math.floor(tseconds / 60);
            var thours = Math.floor(tminutes / 60);
            var tdays = Math.floor(thours / 24);
            tTian.text(tdays);
            tShi.text(thours % 24);
            tFen.text(tminutes % 60);
            tMiao.text(Math.floor(tseconds % 60));
        };

        sj += 1000;

        if (iValue4 > 0) {
            cx(iValue4);
            if ( dop === "0" ) {
                or.addClass('route-over');
                or.find('a').removeAttr('href');
                clearTimeout(timeout);
            } else {
                or.find('a').attr("href",ohref);
            }
        }else if(iValue4 <= 0){
            or.addClass('route-over');
            or.find('a').removeAttr('href');
        }

        tout = setTimeout(function() {
            cdtime(t, sj);
        }, 1000);
        


    }
    var _unitCountdown = function(obj, time) {
        var op = obj.parents('.route-list');
        var on = obj.parents('.next-list');
        var oTian = obj.find('.tian');
        var oShi = obj.find('.shi');
        var oFen = obj.find('.fen');
        var oMiao = obj.find('.miao');
        var dst = obj.attr('data-starttime');
        var det = obj.attr('data-endtime');
        var startTime = parseInt(Date.parse(dst), 10);
        var endTime = parseInt(Date.parse(det), 10);
        var iValue1 = startTime - time;
        var iValue2 = endTime - time;
        var phref = op.find('a').attr("href");
        var nhref = on.find('a').attr("href");

        var dp = op.attr("data-product");

        var timeout;
        var _unitCD = function(cha) {
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            oTian.text(days);
            oShi.text(hours % 24);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };
        time += 1000;
       

        // 正在热抢
        if (iValue2 > 0 ) {
            _unitCD(iValue2);
            if ( dp === "0" ) {
                op.addClass('route-over');
                op.find('a').removeAttr('href');
                clearTimeout(timeout);
            } else {
                op.find('a').attr("href",phref);
            }
        } else if (iValue2 <= 0 ){
            op.addClass('route-over');
            op.find('a').removeAttr('href');
            clearTimeout(timeout);
        }

        // 下期预告
        if (iValue1 > 0) {
            _unitCD(iValue1);
            on.addClass('next');
            // on.find('a').removeAttr('href');
        }else if(iValue1 === 0){
            _unitCD(iValue1);
            _unitCD(iValue2);
            on.remove();
            // history.go(0)
            var lastli = $('.route-box').find('ul'); 
            var ona = on.find('a').attr("href");
            var onimg = on.find('img').attr("src");
            var onname = on.find('.name').text();
            var onprice = on.find('.price').find('i').text();
            var ondel = on.find('.price').attr("data-price");
            var onzhekou = on.find('.name').attr("data-discount");
            var onet = on.find('.timer').attr("data-endtime");
            lastli.append(
                '<li class="route-list fl r-list" data-product="5">'+
                    '<a class="block" href="'+ona+'">'+
                        '<div class="chart">'+
                            '<img class="vm g10" src="'+onimg+'" alt="">'+
                            '<p class="label tc">'+onzhekou+'折</p>'+
                        '</div>'+
                        '<p class="name">'+onname+'</p>'+
                        '<div class="book clearfix">'+
                            '<div class="price-box fl">'+
                                '<del>￥'+ondel+'</del>'+
                                '<p class="price">￥<i>'+onprice+'</i>起</p>'+
                            '</div>'+
                            '<div class="book-btn fr">'+
                                '<p class="p1">立即预订</p>'+
                                '<p class="p2 hide">已售罄</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="clock clearfix">'+
                            '<div class="timer" data-endtime="'+onet+'">'+
                                '<span class="time">'+
                                    '仅剩'+
                                '</span>'+
                                '<span class="tian">0</span>'+
                                '<i>天</i>'+
                                '<span class="shi">0</span>'+
                                '<i>时</i>'+
                                '<span class="fen">0</span>'+
                                '<i class="">分</i>'+
                                '<span class="miao">0</span>'+
                                '<i class="">秒</i>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</li>'
            );
            cdtime(box.find('.r-list').find('.timer'), nowTime);
            // on.addClass('hide');
            var nlist = $('.next-list');
            if(nlist.length==0){
                $('.next-route').hide();
            }
        }else if(iValue1 < 0){
            _unitCD(iValue1);
            on.find('.clock').hide();
            on.find('a').attr("href",nhref);
            on.removeClass('next');
            on.remove();
            var nlist = $('.next-list');
            if(nlist.length==0){
                $('.next-route').hide();
            }

            // var nlist = $('.next-list');
            // nlist.each(function(){
            //     var t = $(this);
            //     if (t.hasClass('next')) {
            //         console.log(5);
            //         $('.next-route').hide();
            //     }else{
            //         console.log(6);
            //     }
            // });

        }





        // $('.next-route').find('.next');


        // tout = setTimeout(function() {
        //     cdtime(t, sj);
        // }, 1000);

        // if (iValue1 > 0) {
        //     _unitCD(iValue1);
        //     on.addClass('next');

        // }else if(iValue1 <= 0){
        //     _unitCD(iValue1);
        //     on.removeClass('next');
        //     on.find('.clock').hide();
        // }

        timeout = setTimeout(function() {
            _unitCountdown(obj, time);
        }, 1000);
    };

    $('.next-list').on(_tap,function(){
        var t =$(this);
        if(t.hasClass('next')){
            return false;
        }
    });

    // 获取服务器日期
    $.ajax({
        url: _uzm.domain.wapi + '/api/UzaiIPHelp/GetDate/',
        type: 'GET',
        dataType: "jsonp",
        cache: false,
        success: function(tm) {
            var nowDate;
            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);
            nowDate = tm.split(' ')[0];
            subject.find('.timer').each(function() {
                console.log()
                var oThis = $(this);
                _unitCountdown(oThis, nowTime);
            });
        }
    });
};

// 统计
myexports.tourActive = function() {
    var pi1 = subject.find('.bd-group').find('.pop-item');
    var pi2 = subject.find('.price-group').find('.pop-item');
    var pg = subject.find('.pic-group');
    pi1.on('click', function() {
        var t = $(this);
        var tindex = t.index();
        var pg1 = pg.find('li').eq(tindex);
        var pgs = pg1.siblings();
        pg1.show();
        pgs.hide();
        t.siblings().removeClass('pi-on');
        t.addClass('pi-on');
        t.children('input').prop('checked', true);
    });
    pi2.on('click', function() {
        var o = $(this);
        o.addClass('pi-on');
        o.siblings().removeClass('pi-on');
        o.children('input').prop('checked', true);
    });
};

//许愿
myexports.dream = function(){
    $('.dream').on(_tap,function(){
        var trip = subject.find('input[name=trip]:checked').val();
        var tripPrice = subject.find('input[name=trip-price]:checked').val();

        // var sb = [];
        // var _push = function (obj, name) {
        //     if (obj) {
        //         sb.push(name + '=' + obj);
        //     }
        // }

        // if (trip) {
        //     _push(trip, 'trip');
        // }

        // if (tripPrice) {
        //     _push(tripPrice, 'tripPrice');
        // }

        $.ajax({
            type: 'POST',
            url: '/ashx/ashx_Activity.ashx',
            data: {
                'destination':trip,
                'price':tripPrice,
                'type':'zyx2016XuYuan'
            },
            dataType: 'json',
            success: function(msg) {
                var su = msg.success;
                var data = msg.data;
                var dataLength = data.length;
                    if (su==="yes") {
                      for (var i = 0; i < dataLength; i++) {
                          $('.pop-item').each(function(){
                              var o = $(this);
                              var pbar = o.find('.pbar');
                              var ptxt = o.find('.ptxt');
                              var oi = o.find('input').attr('disabled',true);
                              var ov = oi.val();
                              if (ov===data[i].name) {
                                  o.find('.ptxt').text(data[i].perc+'%');
                                  o.find('.pbar').css('width',data[i].perc);
                                  return false;
                              }
                          });
                      }

                    subject.find('.dream').off('click');
                    $('.pop-item').find('.ptxt').show();
                    $('.pop-item').off('click');

                    }
                if (su==="no") {
                    _uzm.pop.toast('操作失败');
                }
            },
            error: function() {
            }
        });

    });

}

// top5线路
myexports.route = function() {
    var rTop = subject.find('.r2').offset().top;
    $(window).on('scroll', function() {
        var st2 = $(this).scrollTop();
        if (st2 >= rTop) {
            $('.list1').addClass('rr');
            $('.list2').addClass('rl');
            $('.top').addClass('top-on');
        }
    }).trigger("scroll");
};


// 排行榜
myexports.ranking = function(){
    var items = subject.find('.r1').find('li');
    var iLen = items.length;
    var i = 0;

    setInterval(function() {
        i = parseInt(Math.random() * iLen, 10);
        items.removeClass('rank-on').eq(i).addClass('rank-on');
    }, 2000);
};

