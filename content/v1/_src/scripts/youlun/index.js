_ylData = "";
$(function () {
    loadYLData();
    winResize();//初始化浏览器窗口

    ylMonthOff();
    ylHoverEvent($('.line-list .list-item'));
    ylSlide();


    ylFilter();

    initPager();

    ylClearSelect();
    ylMultiFilter();
    selsFilter();//select 筛选

    ylSideNav();

    specialTab();

    ylCalendar();
    SelShipchange();
});

winLoadFix(function () {
    ylShipSlide();
});


//徘徊事件，主要解决IE6问题
function ylHoverEvent(o) {
    o.on('mouseover', function () {
        var oo = $(this);
        oo.addClass("on");
    }).on('mouseout', function () {
        var oo = $(this);
        oo.removeClass("on");
    });
}
function SelShipchange(){
 $("#j_filterSelShip").change(function () {
             var comval = $("#j_filterSelShip").val();
            var comname=comval.split('=')[1];
             $.post("CruisesNew/GetCruiseshipList", { name: comname }, function (data) {
            
                 $("#j_filterSelShipName option:gt(0)").remove();
                 if (data !== "") {
                     for (var i = 0; i < data.length; i++) {
                         var option = "<option value='data-cruisesname=" + data[i].usertreeName + "'>" + data[i].usertreeName + "</option>";
                         $("#j_filterSelShipName").append(option);
                     }
                 }

             });
            
         });

}

function ylSlide() {

    var _initW = function () {
        var w = $(window).width();
        $('#j_ylBanner').width(w);
        $('#j_ylBanner').find('.item').width(w);
    };

    $(window).resize(function () {
        _initW();
    });

    _initW();//宽度初始化

    //首页
    //主体
    $('#j_ylBanner').slides({
        preload: true,
        preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
        currentClass: 'on',
        fadeSpeed: 300,
        effect: 'fade',
        crossfade: true,
        hoverPause: false,
        pause: 1000,
        play: 6000,
        generatePagination: false
    });

        //点击转换mouseenter
    $('.slides_container').each(function () {
        var o = $(this);
        var opa = o.next('.pagination');
        if (!opa.get(0)) {
            opa = o.next('.pagination-wrap').find('.pagination');
        }

        if (opa.get(0)) {
            opa.find('li').on('mouseenter', function () {
                var oo = $(this);
                oo.find('a').click();
            });
        }

    });

    //邮轮描述滚动
    easySlide('j_introShipDesc', 'intro-arrow-left', 'intro-arrow-right', 1, 9);

    //精选邮轮滚动
    easySlide('carousel-bar-item', 'prev', 'next', 1, 4);

}


function winResize() {
    var unitResize = function () {
        var ow = screen.width;
        if (ow <= 1024) {
            var w = '690px';
            $('.main-banner .slides_container a img').css({ 'width': w });
            $('.sale-bd ul li').css({ 'width': '249px' });
            $('.main-box').css({ 'width': w });
            $('.intro-bd .intro-items .tit, .intro-bd .intro-items .box').css({ 'width': '106px' });
        }
    };
    unitResize();
}

function ylShipSlide() {
    $('#j_shipSlide').animate({ 'margin-left': '0' }, 800, 'swing', function () {
        var o = $('.youlun-hd');
        o.on('click', function () {
            skipFilterPosition();
        });
    });
}

function loadYLData() {
    var tp = $.trim($('#YLjson').val()).replace('\/g', '');
    _ylData = eval('(' + tp + ')');
    //console.table(_ylData);
    loadStartPortData();

}

//数组去重
var _unique = function (arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};

//载入出发港口
function loadStartPortData() {
    var sb = [];
    if (_ylData) {
        for (var i = 0; i < _ylData.length; i++) {
            var oo = _ylData[i];
            var ostartPort = oo.StartPort;
            sb.push(ostartPort);
        }

        sb = _unique(sb.sort());

        if (sb.length) {
            var s = [];
            for (var j = 0; j < sb.length; j++) {
                s.push('<li>' + sb[j] + '</li>');
            }
            $('#j_voyageFilter').find('.voyage-uls').html(s.join(''));
        }

    }

}

function ylFilter() {

    var owrap = $('#j_voyageFilter');

    //定制
    $('#j_customYL').on('click', function () {
        var o = $(this);
        o.parent('.side-nav-box').hide();
        owrap.fadeIn('slow');
    });

    //关闭
    owrap.find('.close').on('click', function () {
        var o = $(this);
        owrap.prev('.side-nav-box').fadeIn('slow');
        owrap.hide();
    });

    owrap.find('.voyage-hd').find('li').on('click', function () {

        owrap.find('.voyage-go').hide();
        owrap.find('.voyage-ulwraper').find('ul').show();
        owrap.find('.voyage-hd').find('.endport').find('a').text('终点港');

        var o = $(this);
        var ot = $.trim(o.find('a').text());
        var os = o.siblings('li');//兄弟元素
        var on = o.nextAll('li');//preview所有

        o.addClass('on');
        os.removeClass('on');

        var oliv = owrap.find('.voyage-hd').find('li:visible');
        var index = oliv.index(o);

        on.hide();

        on.each(function (k, v) {
            var oo = $(this);
            if (oo.hasClass('method')) {
                oo.find('a').text('途经地');
            } else if (oo.hasClass('endport')) {
                oo.find('a').text('终点港');
            }
        });

        owrap.find('.voyage-bd').find('ul').empty();

        unitData(index);

        //检测终点港
        if (o.hasClass('endport')) {
            checkLastNode();
        }
    });

    owrap.find('.voyage-bd').on('click', 'ul li', function () {

        var o = $(this);
        var op = o.parent('ul');
        var ot = $.trim(o.text());//选中项文本

        op.empty(); //清空节点

        var index = owrap.find('.voyage-hd').find('.on').index();

        appendLeftNode(index, ot);

        var onew = owrap.find('.voyage-hd').find('li').eq(index + 1);

        onew.siblings('li').removeClass('on');
        onew.addClass('on').show();

        unitData(index+1);

        //检测终点港
        checkLastNode();

        var oend = owrap.find('.voyage-hd').find('.endport');

        if (oend.find('a').text() != '终点港') {
            openYL();//开启邮轮
        }

    });

    var unitData = function (index) {

        var startText = owrap.find('.voyage-hd').find('li').eq(0).find('a').text();

        if (_ylData) {
            var sbStart = [];
            var sbStep1 = [];
            var sbStep2 = [];
            var sbStep3 = [];
            var sbEnd = [];

            for (var i = 0; i < _ylData.length; i++) {
                var oo = _ylData[i];

                var ostartPort = oo.StartPort;
                var omethods = oo.Methods;
                var oendPort = oo.EndPort;
                omethodArr = omethods.split(',');

                var step1, step2, step3;

                if (index === 0) {
                    sbStart.push(ostartPort);
                }
                else if (index === 1) {
                    if (startText == ostartPort) {
                        if (omethodArr[0]) {
                            sbStep1.push(omethodArr[0]);
                        }
                    }
                }
                else if (index === 2) {
                    step1 = owrap.find('.voyage-hd').find('li').eq(1).find('a').text();
                    if (startText === ostartPort && omethodArr[0] == step1) {
                        if (omethodArr[1]) {
                            sbStep2.push(omethodArr[1]);
                        }
                    }
                }
                else if (index === 3) {
                    step1 = owrap.find('.voyage-hd').find('li').eq(1).find('a').text();
                    step2 = owrap.find('.voyage-hd').find('li').eq(2).find('a').text();
                    if (startText === ostartPort && omethodArr[0] == step1 && omethodArr[1] == step2) {
                        if (omethodArr[2]) {
                            sbStep3.push(omethodArr[2]);
                        }
                    }
                }
                else if (index === 4) {
                    step1 = owrap.find('.voyage-hd').find('li').eq(1).find('a').text();
                    step2 = owrap.find('.voyage-hd').find('li').eq(2).find('a').text();
                    step3 = owrap.find('.voyage-hd').find('li').eq(3).find('a').text();
                    if (startText === ostartPort && omethodArr[0] == step1 && omethodArr[1] == step2 && omethodArr[2] == step3) {
                        sbEnd.push(oendPort);
                    }
                }

            }

            sbStart = _unique(sbStart.sort());
            sbStep1 = _unique(sbStep1.sort());
            sbStep2 = _unique(sbStep2.sort());
            sbStep3 = _unique(sbStep3.sort());
            sbEnd = _unique(sbEnd.sort());

            if (index === 0) {
                loadNode(sbStart, index);
            } else if (index == 1) {
                loadNode(sbStep1, index);
            } else if (index === 2) {
                loadNode(sbStep2, index);
            } else if (index === 3) {
                loadNode(sbStep3, index);
            } else if (index === 4) {
                loadNode(sbEnd, index);
            }
            //debugger;

        }
    };

    //载入ul>li*n节点
    var loadNode = function (sb, index) {

        if (sb.length) {
            var sbTemp = [];
            for (var i = 0; i < sb.length; i++) {
                sbTemp.push("<li>" + sb[i] + "</li>");
            }
            if (sbTemp.length) {
                appendNode(sbTemp, index);
            }
        }
    };

    //添加后续节点
    var appendNode = function (sb, index) {
        var oul = owrap.find('.voyage-bd').find('.voyage-uls');
        oul.html(sb.join(''));
    };

    var appendLeftNode = function (index, ot) {
        var li = owrap.find('.voyage-hd').find('li').eq(index);
        li.show().find('a').text(ot);
        li.nextAll().hide();
    };

    //检测最后一项
    var checkLastNode = function () {
        var o1 = owrap.find('.voyage-hd').find('.startport').find('a').text();
        var o2 = [];
        var o3 = [];

        var oend = owrap.find('.voyage-hd').find('.endport');
        var tend = owrap.find('.voyage-bd').find('.voyage-uls');

        owrap.find('.voyage-hd').find('.method').find('a').each(function (m, n) {
            var ot = $(this).text();
            if (ot != '途经地') {
                o2.push(ot);
            }
        });

        /****************判断获取最后一项终点港*******************/
        for (var i = 0; i < _ylData.length; i++) {
            var oo = _ylData[i];

            var p1 = oo.StartPort;//起点
            var p2 = oo.Methods;//所有途经地
            var p3 = oo.EndPort;//终点

            if (o2.length) {
                if (p1 === o1 && p2.indexOf(o2.join(',')) === 0) {
                    o3.push(p3);
                }
            }
        }


        if (o3.length == 1) {

            //owrap.find('.voyage-bd').find('.voyage-uls').append("<li>" + o3 + "</li>");

            var oprevs = oend.prevAll('li');
            oprevs.each(function (k, v) {
                var oo = $(this);
                if (oo.find('a').text() == '途经地') {
                    oo.hide();
                }
            });
            oprevs.removeClass('on');
            oend.addClass('on').show();
            tend.show().html('<li>' + o3 + '</li>');
        }
        //debugger;

    };

    //开启邮轮
    var openYL = function () {
        if (owrap.find('.voyage-hd').find('.endport').hasClass('on')) {

            var ogo = owrap.find('.voyage-go');

            ogo.next('.voyage-ulwraper').find('ul').fadeOut('slow', function () {
                ogo.fadeIn('slow');
            });

            owrap.find('.voyage-go').off('click').on('click', function () {
                var start = owrap.find('.startport').find('.txt').text();
                var end = owrap.find('.endport').find('.txt').text();
                var methods = [];
                var nodeMethods = owrap.find('.method');
                nodeMethods.each(function (k, v) {
                    var m = $(this);
                    if (m.find('.txt').text() != '途经地') {
                        methods.push(m.find('.txt').text());
                    }
                });

                $('#j_ylMultiFilter').find('.side-line-bd').find('.on').removeClass('on'); //清除当前.on样式
                var txt = start + '-' + methods.join('-') + '-' + end;

                //debugger;
                $('#j_ylMultiFilter').find('.side-line-bd').find('a').each(function (k, v) {
                    var oa = $(this);
                    if (oa.text() == txt) {

                        $('#j_ylMultiFilter').find('.side-line-bd').show();//展示所有左侧
                        ylClearSelect();//清空选中项
                        oa.click();
                        return true;
                    }
                });
                skipFilterPosition();
            });

        }

    };

}

function specialTab() {

    $('#j_specialBox').find('.box-hd').find('li').on('click', function () {
        var o = $(this);
        var op = o.parent('ul');
        var index = op.find('li').index(o);

        op.find('li').removeClass('on');
        o.addClass('on');

        var oitems = o.parents('.box-hd').next('.sale-bd').find('.item');
        oitems.hide();
        oitems.eq(index).show();

        //延迟加载图片
        var imgs = oitems.find('img');
        imgs.each(function (k, v) {
            var oo = $(this);
            var ooSrc = oo.attr('data-src');
            oo.attr('src', ooSrc);
        });

        return false;

    });

    $('#j_specialBox').find('.box-hd').find('li').eq(0).click();

}

//初始清除
function ylClearSelect() {
    $('#j_filterSels').find('select').each(function (k,v) {
        var o = $(this);
        o.get(0).selectedIndex = 0;
    });

    $('#j_ylMultiFilter').find('.side-line-bd').show();

}



//多重操作
function ylMultiFilter() {
    $('#j_ylMultiFilter').find('.side-line').find('li').on('click', function () {

        var o = $(this);
        var op = o.parents('.side-line');
        var os = op.find('li').not(o);

        if (o.hasClass('on')) {
            o.removeClass('on');
        } else {
            o.addClass('on');
        }

        os.removeClass('on');

        unitFilter();

        skipFilterPosition();

        return false;

    });
}

function selsFilter() {
    $('#j_filterSels').on('change', 'select', function () {
        var o = $(this);

        if (o.attr('id') == 'j_filterSelRoute') {
            var v = o.val().replace('data-route*=', '');
            if (v) {
                var oul = $('#j_ylMultiFilter').find('.side-line').find('ul');
                oul.each(function (m, n) {
                    var oo = $(this);
                    var ooTag = oo.attr('data-tag');
                    if (v.indexOf(ooTag) > -1) {
                        oo.show();
                    } else {
                        oo.hide();
                    }
                });
            } else {
                $('#j_ylMultiFilter').find('.side-line').find('ul').show();
            }
        }

        $('#j_ylMultiFilter').find('.side-line').find('li').removeClass('on');

        unitFilter();

    });
}

function unitFilter() {
    var orouteAttr = $('#j_filterSelRoute').val();
    var omonAttr = $('#j_filterSelMonth').val();
    var oportAttr = $('#j_filterSelPort').val();
    var oshipAttr = $('#j_filterSelShip').val();
    var oshipnameAttr = $('#j_filterSelShipName').val();
    var oLeftAttr = $('#j_ylMultiFilter').find('.side-line-bd').find('.on').find('a').attr('rel');

    var rels = [];
    if (oLeftAttr) {
        rels.push(oLeftAttr);
    }
    if (orouteAttr) {
        rels.push(orouteAttr);
    }
    if (omonAttr) {
        rels.push(omonAttr);
    }
    if (oportAttr) {
        rels.push(oportAttr);
    }
    if (oshipAttr) {
        rels.push(oshipAttr);
    }
    if (oshipnameAttr) {
        rels.push(oshipnameAttr);
    }


    initSorter(rels.join(','));
}

function initPager() {

    //pager
    $('#ylPager').uzPager({
        pageSize: 10,
        targetNode: $('#j_RouteList'),
        onInit: function () {
            //console.log('pager 初始化完成');
        },
        onCallback: function (p) {
            skipFilterPosition();
        }
    });
}

function initSorter(tag) {
    //sorter
    $('#j_RouteList').uzSorter({
        sortBy: tag,
        sortAscTag: 'data-top',//高低排序data-price
        sortAscKey: 'asc',//低到高 asc/desc
        onInit: function () {
            //console.log('sorter 初始化完成');

        },
        onCallback: function () {
            //pager
            initPager();
        }
    });
}

//导航
function ylSideNav() {

    $('#j_ylSideNav').find('dt').each(function (k, v) {
        var o = $(this);
        var oindex = o.parent('dl').find('dt').index(o);
        o.next('dd').find('a').on('click', function () {

            ylClearSelect();

            var oo = $(this);
            var oot = $.trim(oo.text());
            var oorel = oo.attr('rel');
            var oorelFix = oorel.split('=')[1];

            //tab切换
            var alist = $('#j_filterSels').find('select option[value*=' + oorelFix + ']');
            if (alist.get(0)) {
                alist.prop('selected', true);
                alist.change();
            }
            skipFilterPosition();
            return false;
        });
    });
	//暂时修改，由于萨德问题 by 王超 2017/3/16
	setTimeout(function(){
   $('#j_ylSideNav').find('a').each(function(){
      if($(this).html()==='日韩')
      {
        $(this).html('日本');
      }
    });
    },1000);

}

function skipFilterPosition() {
    var o = $('#j_MonthFilter');
    var otop = o.offset().top;
    $('body,html').animate({ scrollTop: otop }, 500);
}

//没有数据的月份添加off样式
function ylMonthOff() {

    var mArr = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    var liMonthArr = [];

    var t = $('#j_RouteList');
    t.find('li').each(function (m, n) {
        var item = $(this);
        var itemMonth = item.attr('data-month');
        var itemMonthArr = itemMonth.split(',');
        if (itemMonthArr.length) {
            for (var i = 0; i < itemMonthArr.length; i++) {
                liMonthArr.push(itemMonthArr[i]);
            }
        } else {
            liMonthArr.push(itemMonth);
        }
    });

    liMonthArr=_unique(liMonthArr);


    //去除月
    liMonthArr = $.map(liMonthArr, function (n, k) {
        return n.replace('月', '');
    });

    //排序
    liMonthArr = liMonthArr.sort(_asc);

    //添加月
    liMonthArr = $.map(liMonthArr, function (v, k) {
        return v + '月';
    });

    var monthUI = $('#j_filterSelMonth');
    var sb = [];

    $.each(liMonthArr, function (k,v) {
        sb.push("<option value='data-month=" + v + "'>" + v + "</option>");
    });

    if (sb.length) {
        monthUI.append(sb.join(''));
    }
}

var _asc = function (str1, str2) {
    return str1 - str2;
};




//弹出框
function popMod(o, num) {

    var pop = o.parent();

    pop.find('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-colse').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).bind("scroll", function () {
        fixIe6(o, num);
    });

}

//IE6下的定位
function fixIe6(o, num) {
    if (!window.XMLHttpRequest) { o.css("top", $(document).scrollTop() + num); }
}

function ylCalendar() {
    var box = $('#j_ylCalendar');
    var cfg = {
        jsonpUrl: '/ashx/GetCalendarPrice.ashx?type=1',
        isSmart: true,
        extCallBack: function (year, month) { //扩展方法
            //trigger
            var items = box.find('.item');
            var ablock = box.find('a.block');
            if (ablock.length) {
                items.each(function (k, v) {
                    var o = $(this);
                    var oa = o.find('a.block');
                    var date = o.attr('data-year') + '-' + o.attr('data-month') + '-' + o.attr('data-day');
                    if (date) {
                        //console.log(id);
                        oa.on('mouseenter', function () {
                            box.find('.ajaxData').hide();
                            if (oa.find('.ajaxData').get(0)) {
                                oa.find('.ajaxData').show();
                            } else {

                                var df = $.ajax({
                                    url: '/ashx/GetCalendarPrice.ashx?type=2&date=' + date,
                                    type: 'GET',
                                    contentType: "application/json; charset=utf-8"
                                });

                                df.done(function (data) {
                                    oa.append(data);
                                    box.find('.ajaxData').hide();
                                    oa.find('.ajaxData').show();
                                });
                            }

                        }).on('mouseleave', function () {
                            box.find('.ajaxData').hide();
                        });
                    }

                });
            } else {
                //box.find('.calendarBar').find('.next').click();
            }
        },
        preCallback: function (year, month) { //回调方法

        }
    };
    if (box.get(0)) {
        box.jsonCalendar(cfg);
    }
}