var globalCitySelect = null;
var hotelLoader = {
    show : function (s) {
        var pl = $('#j_popLoader');

        if (!pl.get(0)) {
            $('body').append('<div id="j_popLoader" class="pop-loader tc"><img src="//r.uzaicdn.com/content/v1/images/common/loader.gif" alt="" class="mr10"><span class="pop-info f14">载入中请稍后...</span></div>');
            pl = $('#j_popLoader');
        }
        s && pl.find('.pop-info').text(s);
        pl.show();
        fixIe6('j_popLoader', $(window).height() / 2);
    },
    hide : function () {
        $('#j_popLoader').hide();
    }
};

var _hotelLoadList = function () {
    hotelSlides();
    sideSizer();
    hotelLazy();
    uzLazy(['j_hotHotelTab', 'j_hotelList']);
};

if (window.addEventListener) {
    window.addEventListener('load', function () {
        _hotelLoadList();
    }, false);
} else {
    window.attachEvent('onload', function () {
        _hotelLoadList();
    });
}

$(function () {
    pshFilter();
    nodeFilter();
    hotelCarousel();
    hotelTab();
    multiCalendar();
    listFilter();
    hotelFixNav();
    hotelTips();
    hotelPop();
    sideFixMap();
    contentSwitch();
    cityControl();
    if (typeof (comGlobalCity) != 'undefined') {
        comGlobalCity();
    }

});

function hotelTab() {
    var hht = $('#j_hotHotelTab');
    _uzw.ui.tab('j_hotHotelTab', function (index) {
        var items = hht.find('.bd').find('.item'),
            imgs = items.eq(index).find('img[data-original]'),
            img = imgs.eq(0);

        if (img.attr('data-original') != img.attr('src')) {
            imgs.each(function () {
                var oImg = $(this),
                    sSrc = oImg.attr('data-original');
                oImg.attr('src', sSrc);
            });
        }
    });
    hht.find('.more-cont').on('click', function () {
        var oThis = $(this);
        var op = oThis.parent('.hd-more');

        if (op.hasClass('hd-more-on')) {
            op.removeClass('hd-more-on');
        } else {
            op.addClass('hd-more-on');
        }
    });
    hht.find('.hd-more').on('click', '.more-item', function () {
        var oThis = $(this);
        var op = oThis.parents('.hd-more');
        var liLast = op.siblings('.hd-list').find('li:last');

        liLast.click().find('em').text(oThis.text());
        op.removeClass('hd-more-on');
    });
}

function hotelSlides() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: true
        });
        oBS.find('.slides_control').css({ 'width': '100%' });
    }
    var oFS = $('#j_focusSlides');
    if (oFS.get(0)) {
        oFS.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 3000,
            generatePagination: true,
            slidesLoaded: function () {
                oFS.find('.slides_container').find('a').width(oFS.width());
            }
        });
    }
}

function sideSizer() {
    var oSW = $('#j_sizerWrap');
    if (oSW.get(0)) {
        var sizer = oSW.find('.sizer-box');

        sizer.width($('.side-box').width());

        $(window).scroll(function () {
            unitScroll();
        });

        var unitScroll = function () {
            var ot = oSW.offset().top,
                w = $(window),
                st = w.scrollTop(),
                iSH = sizer.height(),
                iEnd = $('.global-footer').offset().top - iSH - 50;

            if (st >= ot && st < iEnd) {
                if (_util.check.isIE6) {
                    sizer.css({
                        'top': st,
                        'position': 'absolute'
                    });
                } else {
                    sizer.css({
                        'top': 0,
                        'position': 'fixed'
                    });
                }
            } else if (st >= iEnd) {
                sizer.css({
                    'position': 'absolute',
                    'top': iEnd
                });
            } else {
                sizer.css({
                    'top': 0,
                    'position': 'static'
                });
            }
        };
        unitScroll();
    }
}

function hotelLazy() {
    var o = $('#j_RouteList');
    var imgs = o.find('img[data-src]');
    imgs.each(function () {
        var oThis = $(this);
        oThis.attr('src', oThis.attr('data-src'));
    });
}



//price sales hot
function pshFilter() {
    $('#j_sortBar').find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');

        os.removeClass('on');
        o.addClass('on');
        var oArrow = o.find('.border-arrow');
        var ot = $.trim(o.text());
        if (ot == '销量') {
            oArrow.removeClass('arrow-on');
            o.attr({ "title": "销量从高到低" });
        } else if (ot == '价格') {
            oArrow.addClass('arrow-on');
            o.attr({ "title": "价格从低到高" });
        }
        $HotelPackages.staticClass.search();
    });
}

//node filter
function nodeFilter() {
    var sizeBox = $('#j_sizerBox');
    sizeBox.find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
        $HotelPackages.staticClass.search();
    });
}

function hotelCarousel() {
    var hdb = $('#j_hotelDetailBox');
    var wrap = hdb.find('.carousel-bar');

    if (wrap.get(0)) {
        var size = wrap.find('li').length;
        var ow = screen.width;

        if (ow <= 1152) {
            wrap.find('.overview').find('li').css({'width': 94, 'margin-right': 9});
        }
        if (size > 4) {
            //slide
            wrap.tinycarousel({
                axis: 'x',
                infinite: false
            });
        } else {
            wrap.find('.buttons').hide();
        }

        //change
        wrap.find('.overview').find('li').on('click', function () {
            var o = $(this);
            var opic = o.find('img').attr('data-src');
            var os = o.siblings('li');
            var oFP = wrap.prev('.focus-pic');
            os.removeClass('on');
            o.addClass('on');

            if (oFP.get(0)) {
                oFP.find('img').attr('src', opic);
            }
            return false;
        });

        hdb.find('.btn-order').on('click', function () {
            var hnwT = $('#j_hiNavWrap').offset().top;
            $('body, html').animate({ scrollTop: hnwT }, 800);
        });
    }
}

function multiCalendar() {
    $('input[data-multi-calendar]').on('focus', function () {
        var o = $(this);

        $('.after-calendar').hide();

        var op = o.parent();
        var ac = op.find('.after-calendar');

        if (!ac.get(0)) {
            o.after('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            ac = op.find('.after-calendar');
            var cfg = {
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                extCallBack: function (year, month) {
                    //选中
                    ac.find('.item').on('click', function () {
                        var oi = $(this);
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray');
                        if (!oiExp) {
                            var oiY = oi.attr('data-year');
                            var oiM = oi.attr('data-month');
                            var oiD = oi.attr('data-day');
                            o.val(oiY + '-' + oiM + '-' + oiD);
                            ac.hide();
                            var checkInDate = $("#checkInDate");
                            var checkOutDate = $("#checkOutDate");
                            if (Date.parse($.trim(checkInDate.val()).replace(/-/g, "/")) >= Date.parse($.trim(checkOutDate.val()).replace(/-/g, "/"))) {
                                var currentId = o.attr("id");
                                if (currentId === 'checkInDate') {
                                    $("#checkOutDate").val("");
                                    $("#checkOutDate").focus();
                                }
                                if (currentId === 'checkOutDate') {
                                    $("#checkOutDate").val("");
                                    $("#checkInDate").focus();
                                }
                                return false;
                            }
                            $("#checkInDate").removeClass("input-err");
                            $("#checkOutDate").removeClass("input-err");
                            if ($("#nightCount").length) {
                                $("#nightCount").html(dateDiff($("#checkInDate").val(), $("#checkOutDate").val()));
                            }
                        }
                    });
                },
                preCallback: function (year, month) {//上月下月预回调
                    //console.log(year, month);
                }
            };
            ac.jsonMultiCalendar(cfg);
        }

        ac.show();

        blankFix('j_afterCalendarWrap', 'after-calendar'); //点击其它部分隐藏

    });
}

function listFilter() {
    var pr = $('#j_priceRange');
    //价格搜索
    pr.find('.textbox').on('focus', function () {
        var o = $(this);
        o.siblings('input:button').show();
    });
    pr.find('.btn-search').on('click', function () {
        var o = $(this);
        o.hide();
    });
    //checkbox
    var hsm = $('#j_hotelSizerMod');
    hsm.find('.choice-item').on('click', function () {
        var o = $(this);
        var ot = o.children('.control-checkbox');
        var oc = ot.hasClass('control-checkbox-on');
        var op = o.parents('dd');

        // op.find('input:checkbox').prop('checked', false);
        // op.find('.control-checkbox').removeClass('control-checkbox-on');

        if (oc) {
            ot.removeClass('control-checkbox-on');
            ot.children('input').prop('checked', false);
        } else {
            ot.addClass('control-checkbox-on');
            ot.children('input').prop('checked', true);
        }
    });

    hsm.find('.unlimited').on('click', function () {
        var o = $(this);
        var op = o.parents('dd');

        op.find('input:checkbox').prop('checked', false);
        op.find('.control-checkbox').removeClass('control-checkbox-on');
    });
}

function hotelFixNav() {
    var hnw = $('#j_hiNavWrap');
    if (!hnw.get(0)) {
        return;
    }
    var nv = hnw.find('.hotel-infos-nav');
    var nvLis = nv.find('li');
    var nvH = nv.outerHeight();
    var hi = $('#j_hotelInfos');
    var hiMods = hi.find('.hotel-info-mod');

    var nvW = nv.width();

    hnw.height(nvH);

    $(window).on('scroll', function () {
        unitScroll();
    });

    var unitScroll = function () {
        var ow = $(window);
        var st = ow.scrollTop();
        var nvT = hnw.offset().top;
        nv.width(nvW);
        if (st >= nvT) {
            if (_util.check.isIE6) {
                nv.css({ 'position': 'absolute', 'top': st });
            }
            nv.addClass('hi-nav-wrap-fix');
        } else {
            nv.removeClass('hi-nav-wrap-fix');
        }

        hiMods.each(function (k, v) {
            var oo = $(this);
            var oot = oo.offset().top;
            if (st >= oot - nvH - 1) {
                nvLis.removeClass('on');
                nvLis.eq(k).addClass('on');
                return true;
            }
        });
    };

    unitScroll();

    nv.find('li').on('click', function () {
        var o = $(this);
        var index = o.index();
        var os = o.siblings('li');

        os.removeClass('on');
        o.addClass('on');

        var mtop = hiMods.eq(index).offset().top;

        $('html,body').animate({ 'scrollTop': mtop - nvH }, 800);

    });
}

function sideFixMap() {
    var sm = $('#j_sideMap');

    if (sm.get(0)) {
        var smH = sm.outerHeight();
        var unitScroll = function () {
            var ow = $(window);
            var st = ow.scrollTop();
            var sT = sm.parent('.side').offset().top;
            var iEnd = $('.global-footer').offset().top - smH - 50;

            if (st >= sT && st < iEnd) {
                if (_util.check.isIE6) {
                    sm.css({ 'position': 'absolute', 'top': st });
                } else {
                    sm.css({ 'position': 'fixed', 'top': 0 });
                }
            } else if (st >= iEnd) {
                sm.css({
                    'position': 'absolute',
                    'top': iEnd
                });
            } else {
                sm.css({ 'position': 'static' });
            }
        };

        sm.width(sm.parent().width());

        unitScroll();

        $(window).on('scroll', function () {
            unitScroll();
        });
    }
}

function hotelTips() {
    var hl = $('#j_hotelList');
    var hi = $('#j_hotelInfos');
    var _hoverTips = function (obj, parentClass, className) {
        parentClass = parentClass || '.hover-wrap';
        className = className || '.hover-tips';
        obj.on('mouseenter', parentClass, function () {
            var oThis = $(this);
            var oRIB = oThis.find(className);
            oThis.css({ 'z-index': 10 });
            oRIB.show();
        }).on('mouseleave', parentClass, function () {
            var oThis = $(this);
            var oRIB = oThis.find(className);
            oThis.css({ 'z-index': 'auto' });
            oRIB.hide();
        });
    };

    _hoverTips(hi, '.room-intro-wrap', '.room-intro-box');
    _hoverTips(hi);
    _hoverTips(hl);
    _hoverTips($('#j_formsListing'));
    _hoverTips($('#j_selectPeopleNum').parents('.hotel-search-bar'));
}

//展开收起内容
function contentSwitch() {
    var hl = $('#j_hotelList');
    hl.on('click', '.room-type', function () {
        var oThis = $(this);
        var oRIB = oThis.parents('.row-item-inner').siblings('.room-intro-box');

        if (oThis.hasClass('on')) {
            oRIB.hide();
            oThis.removeClass('on');
        } else {
            oRIB.show();
            oThis.addClass('on');
        }
    });
    hl.on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oHide = oThis.parent('.more-bar').siblings('.hide');

        if (oThis.hasClass('on')) {
            oHide.hide();
            oThis.text('更多房型').removeClass('on');
        } else {
            oHide.show();
            oThis.text('收起').addClass('on');
        }
    });

    var hsm = $('#j_hotelSizerMod');
    if (hsm.find('.choice-row').length > 2) {
        var mc = hsm.find('.more-choice');
        mc.show().on('click', function () {
            var oThis = $(this);
            var oMC = oThis.find('.mc-cont');
            var oAW = oThis.find('.arrow-wrap');

            if (oAW.hasClass('on')) {
                hsm.find('.choice-row:gt(1)').hide();
                oAW.removeClass('on');
                oMC.text('更多');
            } else {
                hsm.find('.choice-row:gt(1)').show();
                oAW.addClass('on');
                oMC.text('收起');
            }
        });
    }
    hsm.on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oML = oThis.parent('.main-top').siblings('.main-list');

        if (oThis.hasClass('on')) {
            oML.hide();
            oThis.removeClass('on');
        } else {
            oML.show();
            oThis.addClass('on');
        }
    });

    var hi = $('#j_hotelInfos');
    hi.find('.order-room-type').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oHide = oThis.parent('.more-bar').siblings('.room-table').find('tr.hide');

        if (oThis.hasClass('on')) {
            oHide.hide();
            oThis.text('更多房型').removeClass('on');
        } else {
            oHide.show();
            oThis.text('收起').addClass('on');
        }
    });
}

function cityControl() {

    var ocityNode = $('#j_jpCityListNode');

    $('input[data-cities-trigger]').on('focus', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.cities-select-mod').hide();
        $('#j_jpAllCityFilter').remove();

        var op = o.parent('.cities-select-wrap');
        var ocity = o.siblings('.cities-select-mod');

        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCityFilter"></ul>');
        globalCitySelect = $('#j_jpAllCityFilter');

        var ocityInnerNode = ocity.find('.cities-select-tab');

        if (!ocityInnerNode.get(0)) {
            ocity.html(ocityNode.html());
            _uzw.ui.tab('cities-select-tab');
            ocity.find('.select-item').on('click', function () {
                var oo = $(this);
                var oot = oo.text();
                var ooc = oo.attr('data-code');
                o.val(oot);
                on.val(ooc);
                ocity.hide();
                op.css({ 'z-index': 'auto' });
            });
        }

        ocity.show();
        op.css({ 'z-index': 10 });

        blankFix('cities-select-wrap', 'cities-select-mod', function () {
            op.css({ 'z-index': 'auto' });
            //将城市列表第一个选项填充进input
            globalCitySelect.find('li').not('.li-none').eq(0).click();
            globalCitySelect.remove();
        });
        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    });
}

function hotelPop() {
    var spn = $('#j_selectPeopleNum');
    if (spn.get(0)) {
        var plb = $('#j_popLodgerBox');
        var pnbBd = plb.find('.pnb-bd');
        var san = plb.find('.j_selectAdultNum');
        var scn = plb.find('.j_selectChildNum');
        var spnVal = spn.val();
        var _childOperate = function (iVal) {
            if (iVal > 0) {
                pnbBd.find('.pnb-side').show();
            } else {
                pnbBd.find('.pnb-side').hide();
            }
            pnbBd.find('.main-item').hide();
            pnbBd.find('.main-item:lt(' + iVal + ')').show();
        };
        _childOperate(scn.val());

        spn.on('change', function () {
            var oThis = $(this);
            if (oThis.val() === '选择更多') {

                fixIe6('j_popLodgerBox', 200);
                plb.show();
                _uzw.ui.mask.show();

                plb.find('.j_popClose').on('click', function () {
                    plb.hide();
                    _uzw.ui.mask.hide();
                    spn.val(spnVal);
                });
            } else {
                spnVal = oThis.val();
            }
        });
        scn.on('change', function () {
            _childOperate(scn.val());
        });
        plb.find('.btn-affirm').on('click', function () {
            var oo = $('#otherOption');
            var spnTxt = san.val() + '成人，' + scn.val() + '儿童';
            var selPN = document.getElementById('j_selectPeopleNum');
            var selLen = selPN.options.length;
            var bValue = true;

            plb.hide();
            _uzw.ui.mask.hide();
            for (var i = 0; i < selLen; i++) {
                var opt = selPN.options[i];
                if (opt.value == spnTxt) {
                    opt.selected = true;
                    spnVal = spn.val();
                    bValue = false;
                }
            }
            if (bValue) {
                if (!oo.get(0)) {
                    spn.find('option:last').before('<option value="' + san.val() + ',' + scn.val() + '" id="otherOption"></option>');
                    oo = $('#otherOption');
                }
                oo.text(san.val() + '成人，' + scn.val() + '儿童');
                oo.val(san.val() + ',' + scn.val());
                selPN.options[2].selected = true;
                spnVal = spn.val();
            }
        });
    }
}

//计算天数差 sDate1和sDate2的格式为  yyyy-MM-dd
function dateDiff(sDate1, sDate2) {
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24, 10);//把相差的毫秒数转换为天数
    return iDays;
}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (_util.check.isIE6) {
        o.css('top', $(document).scrollTop() + xAxis);
        $(window).on('scroll', function () {
            o.css('top', $(document).scrollTop() + xAxis);
        });
    }
}
