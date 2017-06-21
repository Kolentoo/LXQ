try {
    document.domain = 'uzai.com';
} catch (e) {

}


$(function () {
    //判断是否为"我的订单"页面 不用的加载方法
    if($('#hidordertype').length > 0) {
        loadOrderTypeTab();
    } else {
        _uzw.ui.tab('j_memberTab');
    }
    gHoverEvent($('#j_messageList').find('.list-item'));
    gHoverEvent($('#j_usuallyAddressBox').find('.address-table').find('tr'));
    tipsInfo();
    contentSwitch();
    memberPop();
    checkPwdLevel();

    fixInputErr();

    avatorClip();

    memberPager();
    memberRouteReview();
    memberUbSwitch();
    memberCarousel();
    memberCoupon();
    memberCountdown();
    travellerInfo();
    delCollection();

    if (typeof PCAS == 'function') {
        $('select[name=area]').get(0) && new PCAS("province", "city", "area");
    }

    loadGuessLike();

    orderListbtnLoad();

    ShowActivityDraw();
    bgClose();
});

function imgLazyload(obj) {
    var img = obj.find('img[data-original]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-original');
            if (sSrc != oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}

function fixInputErr() {
    $(document).on('blur', '.input-err', function () {
        var oThis = $(this);
        oThis.removeClass('input-err');

        var tip = $('#j_lrfTips');
        tip.text('');
    });
}

function tipsInfo() {
    var sidebar = $('.sidebar');
    var oPF = $('.J_powerFloat');
    var oOT = $('.j_orderTrack');
    var ckName = 'uzwMergeUbNum';
    var _hoverTips = function() {
        var oHW = $('.hover-wrap');
        oHW
            .on('mouseover', function() {
                var oThis = $(this);
                oThis.addClass('hover-wrap-on');
            })
            .on('mouseout', function() {
                var oThis = $(this);
                oThis.removeClass('hover-wrap-on');
            });
    };
    _hoverTips();

    // U币与抵用券合并提示
    sidebar.find('.ub-merge-tips').find('.tips-close').on('click', function () {
        var oThis = $(this);
        oThis.parent().hide();
    });

    //提示poptip
    if (oPF.get(0)) {
        oPF.powerFloat({
            reverseSharp: true
        });
    }

    if (oOT.get(0)) {
        oOT.powerFloat({
            eventType: 'hover',
            zIndex: 100,
            showDelay: 300,
            position: '7-5',
            targetAttr: 'data-src',
            targetMode: 'ajax'
        });
    }
}

function contentSwitch() {
    var sidebar = $('.sidebar');

    sidebar.find('.grouping-item').on('click', 'dt', function () {
        var oThis = $(this);
        var dd = oThis.siblings('dd');
        var gi = oThis.parent('.grouping-item');
        if (gi.hasClass('grouping-pack')) {
            gi.removeClass('grouping-pack');
            dd.show();
        } else {
            gi.addClass('grouping-pack');
            dd.hide();
        }
    });

    $('#j_productsOrderTab').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oCont = oThis.find('em');
        var oSI = oThis.find('.switch-icon');
        var oSO = oThis.parents('.item-order-info').siblings('.sub-order');

        if (oSI.hasClass('on')) {
            oSI.removeClass('on');
            oCont.text('展开子订单');
            oSO.hide();
        } else {
            oSI.addClass('on');
            oCont.text('收起子订单');
            oSO.show();
        }
    });

    $('#j_personalInfoBox').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oCont = oThis.find('em');
        var oIL = oThis.parents('.switch-bar').siblings('.mod-bd').children('.info-listing');
        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            oCont.text('展开');
            oIL.hide();
        } else {
            oThis.addClass('on');
            oCont.text('收起');
            oIL.show();
        }
    });

    var od = $('#j_orderDetail');

    od.find('.order-overview-box').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oCont = oThis.find('.btn-txt');
        var oArr = oThis.find('.arrow');
        var oPDB = oThis.parent().siblings('.price-detail-box');
        if (oArr.hasClass('on')) {
            oArr.removeClass('on');
            oCont.text('查看价格明细');
            oPDB.hide();
        } else {
            oArr.addClass('on');
            oCont.text('收起价格明细');
            oPDB.show();
        }
    });

    od.find('.order-process-box').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oCont = oThis.find('.btn-txt');
        var oSI = oThis.find('.switch-icon');
        var oDD = oThis.parents('.btn-bar').siblings('.info-items').find('dd:gt(4)');
        if (oSI.hasClass('on')) {
            oSI.removeClass('on');
            oCont.text('显示全部');
            oDD.hide();
        } else {
            oSI.addClass('on');
            oCont.text('收起');
            oDD.show();
        }
    });
}

/*
* global function uiPop
* node（必需）: 弹框根节点
* paClass（可选）: 父类（需要关闭对象的类名）
* afterCb（可选）: 显示之后回调函数，参数为弹框根对象
* beforeCb（可选）: 显示之前回调函数，参数为弹框根对象
* closeCb（可选）: 弹框关闭回调函数，参数为弹框根对象
* yAxis（可选）: IE6下，距离浏览器视窗顶部距离（默认为浏览器视窗高度的一半）
*/
function uiPop(node, paClass, afterCb, beforeCb, closeCb, yAxis) {
    var obj = $('#' + node);
    yAxis = yAxis || $(window).height() / 2;
    paClass = paClass || '.ui-pop';
    obj = (!obj.get(0)) ? $('.' + node) : obj;

    beforeCb && beforeCb(obj);

    _uzw.ui.mask.show();
    obj.show();
    obj.on('click', '.j_popClose', function () {
        var oThis = $(this);
        oThis.parents(paClass).hide();
        _uzw.ui.mask.hide();
        closeCb && closeCb(obj);
    });

    afterCb && afterCb(obj);

    //IE6下的定位
    if (_util.check.isIE6) {
        obj.css('top', $(document).scrollTop() + yAxis);
        $(window).on('scroll', function () {
            obj.css('top', $(document).scrollTop() + yAxis);
        });
    }
}

function memberPop() {

    $('#j_personalInfoBox').on('click', '.member-icon', function () {
        uiPop('j_popIconUpload');
    });

    $('#j_btnSwitch').on('click', function () {
        uiPop('j_popUbSwitch');
    });

    $('#j_btnBind').on('click', function () {
        uiPop('j_popUbBinding');
    });

    $('#j_memberOrderTab').on('click', '.btn-cancel', function () {
        $("#regId").val($(this).attr("data-value"));
        var o = $(this);
        var cancelMsg = $('#cancelMsg');
        uiPop('j_popApplyCancel', false, function(obj) {
            obj.find('.btn-yes').on('click', function(){
                var oThis = $(this);
                oThis.parents('.step-1').hide().next('.step-2').show();
            });
        });
        if (cancelMsg.get(0)) {
            cancelMsg.attr('regId', o.attr('regId'));
        }
    });
}

var _unitTimeOut = function (obj, max, callback) {
    var st = setInterval(function () {
        if (max >= 0) {
            obj.text(max--);
        } else {
            if (callback) {
                clearInterval(st);
                callback();
            }
        }

    }, 1000);
};

function avatorClip() {

    var reviewPic = $('#j_thumbnailPic');

    var _showPreview = function (coords) {
        $('#av_x1').val(coords.x);
        $('#av_y1').val(coords.y);
        $('#av_x2').val(coords.x2);
        $('#av_y2').val(coords.y2);
        $('#av_w').val(coords.w);
        $('#av_h').val(coords.h);

        var rx = 65 / coords.w;
        var ry = 65 / coords.h;

        reviewPic.css({
            width: Math.round(rx * 485) + 'px',
            height: Math.round(ry * 380) + 'px',
            marginLeft: '-' + Math.round(rx * coords.x) + 'px',
            marginTop: '-' + Math.round(ry * coords.y) + 'px'
        }).show();

    };

    var _hidePreview = function () {
        reviewPic.stop().fadeOut('fast');
    };

    $(function () {
        var jap = $('#j_avatorPic');
        if (jap.get(0)) {
            $('#j_avatorPic').Jcrop({
                bgColor: '#eee',
                onSelect: _showPreview,
                onRelease: _hidePreview,
                aspectRatio: 1
            });
        }
    });

    $('#j_avatorSave').on('click', function () {
        var o = $(this);
        var x1 = $('#av_x1').val();
        var y1 = $('#av_y1').val();
        var x2 = $('#av_x2').val();
        var y2 = $('#av_y2').val();
        var w = $('#av_w').val();
        var h = $('#av_h').val();

        //坐标数据为：
        // alert("X轴开始坐标：" + x1 + "，X轴结束坐标：" + x2);
        // alert("Y轴开始坐标：" + y1 + "，Y轴结束坐标：" + y2);
        // alert("程序猿通过该坐标剪裁该图片成头像！");

    });

}

function memberPager() {
    var pagers = $('.fn-pager');

    pagers.each(function () {
        var pager = $(this);
        var isOrderlist = pager.attr('id') == 'isorderlist' ? true : false;   //判断是否为"我的订单"页面  翻页控件加载方式不同
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = isOrderlist ? (parseInt($('.hd .hd-list').find('li.on').attr('data-count')) || parseInt(pager.attr('data-counts'))) : parseInt(pager.attr('data-counts'));
        var targetNode = isOrderlist ? null : pager.siblings('.pager-target-node');

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,//列表条数
            targetNode: targetNode,
            onInit: function () {
                //console.log('pager 初始化完成');
            },
            onCallback: function (currentPage, allPage) {
                if(isOrderlist)
                	ajaxGetOrderControl(false, currentPage);
                //分页事件 ajax or dom handles
                //console.log(currentPage);
                //console.log(allPage);
            }
        });
    });
}

function memberRouteReview() {
    var jrb = $('#j_ratingBox');
    var starts = jrb.find('.rating-hd').find('.icon-star');
    var _getName = function (index) {
        var tag = '';

        switch (index) {
            case 0:
                tag = '不满意';
                break;
            case 1:
                tag = '较不满意';
                break;
            case 2:
                tag = '一般';
                break;
            case 3:
                tag = '较满意';
                break;
            case 4:
                tag = '非常满意';
                break;
        }

        return tag;
    };
    starts.on('click', function () {
        var o = $(this);
        starts.removeClass('on');
        var opa = o.prevAll('.icon-star');
        opa.addClass('on');
        o.addClass('on');
    }).on('mouseenter', function () {
        var o = $(this);
        var op = o.parents('.stars-bar');
        var on = op.find('.on');
        var os = o.siblings();
        var opa = o.prevAll('.icon-star');
        var explain = op.siblings('.item-explain');
        if (!on.get(0)) {
            os.removeClass('hover');
            opa.addClass('hover');
            o.addClass('hover');
            explain.show().text(_getName(o.index()));
        }
    }).on('mouseleave', function () {
        var o = $(this);
        var op = o.parents('.stars-bar');
        var on = op.find('.on');
        var os = o.siblings();
        var explain = op.siblings('.item-explain');
        if (!on.get(0)) {
            explain.text(explain.attr('data-val'));
        }
        os.removeClass('hover');
        o.removeClass('hover');
    });

    var linestarts = jrb.find('.rating-list').find('li');
    linestarts.find('.rating-bar').find('.item-icon').on('click', function () {
        var o = $(this);
        var oli = o.parents('li');
        var opa = o.prevAll('.item-icon');
        oli.find('.item-icon').removeClass('on');
        opa.addClass('on');
        o.addClass('on');
    }).on('mouseenter', function () {
        var o = $(this);
        var op = o.parents('.rating-bar');
        var on = op.find('.on');
        var os = o.siblings();
        var opa = o.prevAll('.item-icon');
        var explain = op.siblings('.item-explain');
        if (!on.get(0)) {
            os.removeClass('hover');
            opa.addClass('hover');
            o.addClass('hover');
            explain.show().text(_getName(o.index()));
        }
    }).on('mouseleave', function () {
        var o = $(this);
        var op = o.parents('.rating-bar');
        var on = op.find('.on');
        var os = o.siblings();
        var explain = op.siblings('.item-explain');
        if (!on.get(0)) {
            explain.text(explain.attr('data-val'));
        }
        os.removeClass('hover');
        o.removeClass('hover');
    });

    /*  点评 --新版点评备份勿删
    var jrb = $('#j_ratingBox');
    var stars = jrb.find('.rating-list').find('.icon-star');
    var _getName = function (index) {
        var tag = '';
        switch (index) {
            case 0:
                tag = '非常差';
                break;
            case 1:
                tag = '不满';
                break;
            case 2:
                tag = '一般';
                break;
            case 3:
                tag = '满意';
                break;
            case 4:
                tag = '非常满意';
                break;
            default:
                tag = '';
                break;
        }
    };
    stars.on('click', function () {
        var o = $(this);
        var os = o.siblings();
        var op = o.prevAll('.icon-star');
        var explain = o.parents('.stars-bar').siblings('.item-explain');
        os.removeClass('on');
        op.addClass('on');
        o.addClass('on');
        explain.show().text(_getName(o.index()));
    }).on('mouseenter', function () {
        var o = $(this);
        var on = o.parents('.stars-bar').find('.on');
        if (!on.get(0)) {
            var os = o.siblings();
            var op = o.prevAll('.icon-star');
            var explain = o.parents('.stars-bar').siblings('.item-explain');
            os.removeClass('hover');
            op.addClass('hover');
            o.addClass('hover');
            explain.show().text(_getName(o.index()));
        }
    }).on('mouseleave', function () {
        var o = $(this);
        var on = o.parents('.stars-bar').find('.on');
        var os = o.siblings();
        if (!on.get(0)) {
            var explain = o.parents('.stars-bar').siblings('.item-explain');
            explain.hide();
        }
        os.removeClass('hover');
        o.removeClass('hover');
    });*/
}

//U币转换
function memberUbSwitch() {
    var oPUS = $('#j_popUbSwitch'),
        ub1 = oPUS.find('#j_ub1'),
        iUb1 = parseInt(ub1.text(), 10),
        ub2 = oPUS.find('#j_ub2'),
        ub3 = oPUS.find('#j_ub3'),
        ubList = oPUS.find('.ub-list'),
        items = ubList.find('li'),
        numControl = ubList.find('.num-control');

    var _itemHide = function (index) {
        items.eq(index).hide();
    };
    var _btnEnabled = function (index) {
        items.eq(index).find('.btn-plus').removeClass('bg-gray').addClass('bg-red');
    };
    var _btnDisable = function (index) {
        items.eq(index).find('.btn-plus').removeClass('bg-red').addClass('bg-gray');
    };

    switch (iUb1) {
        case iUb1 < 50:
            _itemHide(4);
            _itemHide(3);
            _itemHide(2);
            _itemHide(1);
            _itemHide(0);
            break;
        case iUb1 < 100:
            _itemHide(4);
            _itemHide(3);
            _itemHide(2);
            _itemHide(1);
            break;
        case iUb1 < 200:
            _itemHide(4);
            _itemHide(3);
            _itemHide(2);
            break;
        case iUb1 < 300:
            _itemHide(4);
            _itemHide(3);
            break;
        case iUb1 < 500:
            _itemHide(4);
            break;
    }

    numControl.find('.num-box').each(function() {
        var oThis = $(this);
        oThis.val(0);
    });

    numControl.find('.btn-minus').on('click', function() {
        var oThis = $(this),
            sUbq = oThis.parents('.item-bd').siblings('.item-hd').find('em').text(),
            btnPlus = oThis.siblings('.btn-plus'),
            numBox = oThis.siblings('.num-box'),
            iVal = numBox.val();

        var iUbq = parseInt(sUbq, 10);
        var iUb3 = parseInt(ub3.text(), 10);
        if (iVal > 0) {
            numBox.val(--iVal);
            ub3.text(iUb3 + iUbq);
            ub2.text(parseInt(ub2.text(), 10) - iUbq);
            if (iVal === 0 && oThis.hasClass('bg-red')) {
                oThis.removeClass('bg-red').addClass('bg-gray');
            }
            iUb3 = parseInt(ub3.text(), 10);
            if(iUb3 >= 500){
                _btnEnabled(4);
                _btnEnabled(3);
                _btnEnabled(2);
                _btnEnabled(1);
                _btnEnabled(0);
            }else if(iUb3 >= 300){
                _btnEnabled(3);
                _btnEnabled(2);
                _btnEnabled(1);
                _btnEnabled(0);
            }else if(iUb3 >= 200){
                _btnEnabled(2);
                _btnEnabled(1);
                _btnEnabled(0);
            }else if(iUb3 >= 100){
                _btnEnabled(1);
                _btnEnabled(0);
            }else if(iUb3 >= 50){
                _btnEnabled(0);
            }
        }
    });

    numControl.find('.btn-plus').on('click', function() {
        var oThis = $(this),
            sUbq = oThis.parents('.item-bd').siblings('.item-hd').find('em').text(),
            btnMinus = oThis.siblings('.btn-minus'),
            numBox = oThis.siblings('.num-box'),
            iVal = numBox.val();

        var iUbq = parseInt(sUbq, 10);
        var iUb3 = parseInt(ub3.text(), 10);
        if (iUb3 >= iUbq) {
            numBox.val(++iVal);
            ub3.text(iUb3 - iUbq);
            ub2.text(parseInt(ub2.text(), 10) + iUbq);
            iUb3 = parseInt(ub3.text(), 10);

            if (iUb3 < 50) {
                _btnDisable(4);
                _btnDisable(3);
                _btnDisable(2);
                _btnDisable(1);
                _btnDisable(0);
            }
            else if (iUb3 < 100) {
                _btnDisable(4);
                _btnDisable(3);
                _btnDisable(2);
                _btnDisable(1);
            }
            else if (iUb3 < 200) {
                _btnDisable(4);
                _btnDisable(3);
                _btnDisable(2);
            }
            else if (iUb3 < 300) {
                _btnDisable(4);
                _btnDisable(3);
            }
            else if (iUb3 < 500) {
                _btnDisable(4);
            }
            if (btnMinus.hasClass('bg-gray')) {
                btnMinus.removeClass('bg-gray').addClass('bg-red');
            }
        }
    });


   oPUS.find('.btn-reset').on('click', function() {
        ubList.find('.num-box').val(0);
        items.find('.btn-minus').removeClass('bg-red').addClass('bg-gray');
        items.find('.btn-plus').removeClass('bg-gray').addClass('bg-red');
        ub2.text('0');
        ub3.text(ub1.text());
    });

    oPUS.find('.btn-switch').on('click', function () {
        var oPL = $('#j_popLoader'),
            iUb3 = parseInt(ub3.text(), 10);
        var _loadingHide = function () {
            oPL.hide();
            _uzw.ui.mask.hide();
        };
        if (iUb3 === 0) {
            uiPop('j_popLoader');
            var ucoin = "300";
            var ucode = "";
            $("input[id^=unum]").each(function () {
                var id = $(this).attr("id");
                var uno = "";
                if (id == "unum1") {
                    uno = "50";
                } else if (id == "unum2") {
                    uno = "100";
                } else if (id == "unum3") {
                    uno = "200";
                } else if (id == "unum4") {
                    uno = "300";
                } else if (id == "unum5") {
                    uno = "500";
                }
                var num = $(this).val();
                if (parseInt(num, 10) > 0) {
                    ucode += "" + uno + "," + num + "|";
                }
            });

            var userid = $('#userid').val();
            var utourid = $('#utourid').val();

            //提交表单
            var u = "/manage/UCodeConvert";
            $.ajax({
                url: u,
                type: 'POST',
                data: "ucode=" + ucode + "&userid=" + userid + "&utourid=" + utourid,
                success: function(data) {
                    if (data == "U币转化成功") {
                        _loadingHide();
                        alert("U币转化成功");
                        location.replace(location.href);
                    } else {
                        _loadingHide();
                        alert("U币转化失败");
                        location.replace(location.href);
                    }
                }
            });
            //setTimeout(_loadingHide, 2000);
        } else {
            alert('您有' + iUb3 + 'U币尚未转换，请一并转换');
        }
    });
}

function memberCarousel() {
    var oCPC = $('#j_commentPicCarousel');

    if (oCPC.get(0)) {
        oCPC.tinycarousel({
            axis: 'x',
            infinite: false
        });
    }
}

//检查密码强度
function checkPwdLevel() {
    var tpwd = $('#txtPwd');
    tpwd.on('keyup', function () {
        var o = $(this);
        var ov = $.trim(o.val());
        var os = $('#j_pwdLevel');
        var level = checkStrong(ov); //检查密码强度等级
        switch (level) {
            case 0:
                os.find('.level-item').removeClass('on');
                break;
            case 1:
                os.find('.level-item').removeClass('on');
                os.find('.s1').addClass('on');
                break;
            case 2:
                os.find('.level-item').removeClass('on');
                os.find('.s2').addClass('on');
                break;
            default:
                os.find('.level-item').removeClass('on');
                os.find('.s3').addClass('on');
        }
    });
}

//返回强度级别
function checkStrong(sPW) {
    //判断输入密码的类型
    var _charMode = function (iN) {
        if (iN >= 48 && iN <= 57) //数字
            return 1;
        if (iN >= 65 && iN <= 90) //大写
            return 2;
        if (iN >= 97 && iN <= 122) //小写
            return 4;
        else
            return 8;
    };
    //bitTotal函数,计算密码模式
    var _bitTotal = function (num) {
        modes = 0;
        for (i = 0; i < 4; i++) {
            if (num & 1) {
                modes++;
            }
            num >>>= 1;
        }
        return modes;
    };

    if (sPW.length <= 5){
        return 0; //密码太短
    }
    Modes = 0;
    for (i = 0; i < sPW.length; i++) {
        //密码模式
        Modes |= _charMode(sPW.charCodeAt(i));
    }
    return _bitTotal(Modes);
}

function travellerInfo() {
    var tb = $('#j_travellerBox');

    gHoverEvent(tb.find('.list-item'));
    _uzw.ui.tab('j_travellerTab', function (index, obj) {
        var oMB = obj.parents('.main-box');
        //解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
        if (_util.check.isIE678) {
            oMB.hasClass('visibility-fix') ? oMB.removeClass('visibility-fix') : oMB.addClass('visibility-fix');
        }
    });

    tb.on('click', '.btn-add, .btn-edit', function () {
        var oThis = $(this);
        var atb = tb.siblings('.add-traveller-box');

        tb.hide();
        atb.show();
        $('#j_travellerTab').find('.ft').on('click', '.btn-item', function () {
            tb.show();
            atb.hide();
        });
    });
}

function memberCoupon() {
    var csb = $('#j_couponSortBar');
    var bs = csb.find('.bar-side');
    var cm = csb.find('.combobox-mod');
    var sl = $('#j_sortList');
    var cs = $('#j_couponStatus');
    var csCT = cs.find('.item-cont').find('.cont-txt');
    var ct = $('#j_couponType');
    var ctCT = ct.find('.item-cont').find('.cont-txt');
    var ctNull = $('#j_sortList_null');
    var _initSorter = function (tag, atag, akey) {
        if (sl.get(0)) {
            if (_util.check.isIE6) {
                return;
            }
            sl.uzSorter({
                sortBy: tag || '',
                sortAscTag: atag || '',
                sortAscKey: akey || 'asc',
                targetNull: '<div class="fruitless-box tc"><i class="icon-uz vm icons-member png"></i><span class="f666 f24">暂无数据</span></div>',
                onInit: function () {
                },
                onCallback: function () {
                    var pager = $('#j_clFnPager');
                    var pageSize = parseInt(pager.attr('data-pagesize'), 10);
                    var pageItems = parseInt(pager.attr('data-counts'), 10);

                    pager.uzPager({
                        pageSize: pageSize,
                        pageItems: pageItems,//列表条数
                        targetNode: pager.siblings('.pager-target-node'),
                        onInit: function () {
                            //console.log('pager 初始化完成');
                        },
                        onCallback: function (currentPage, allPage) {
                            //分页事件 ajax or dom handle
                            //console.log(currentPage);
                            //console.log(allPage);
                        }
                    });
                }
            });
        }
    };
    var _getFilteredParams = function () {
        var rels = [];

        csb.find('.bar-main').find('.item-cont').each(function () {
            var oThis = $(this);
            oThis.hasClass('on') && oThis.attr('rel') && rels.push(oThis.attr('rel'));
        });

        return rels.join(',');
    };
    var _unitFilter = function () {
        var params = _getFilteredParams();
        var itemon = csb.find('.bar-side').children('.on');
        var tag = itemon.attr('rel');
        var oi = itemon.children('.icon-sort');

        _initSorter(params, tag, oi.hasClass('sort-up') ? 'asc' : 'desc');
    };

    if (_util.check.isIE678) {
        cm.each(function () {
            var oThis = $(this);
            var ow = oThis.width();
            var dl = oThis.find('.droplist');
            var dw = dl.width();

            dw > ow && (ow = dw);
            dl.width(ow);
        });
    }
    if (_util.check.isIE6) {
        sl.find('.coupon-mod').each(function () {
            var oThis = $(this);
            var oh = oThis.outerHeight();
            oThis.find('.icon-part').height(oh);
        });
    }

    _unitFilter(); // 初始化

    cm.on('mouseenter', function () {
        var oThis = $(this);
        oThis.addClass('combobox-on');
    }).on('mouseleave', function () {
        var oThis = $(this);
        oThis.removeClass('combobox-on');
    }).find('.droplist').on('click', 'li', function () {
        var oThis = $(this);
        var ot = oThis.text();
        var ds = 'data-status';
        var dt = 'data-type';
        var ods = oThis.attr(ds);
        var odt = oThis.attr('data-type');
        var op = oThis.parents('.combobox-mod');
        var ic = op.find('.item-cont');
        var ct = ic.find('.cont-txt');
        var si = bs.find('.side-item');

        !ic.hasClass('on') && ic.addClass('on');

        if (ct.text() != ot) {
            ct.text(ot);
            if (ods) {
                ic.attr('rel', ds + '=' + ods);
            } else if (odt) {
                ic.attr('rel', dt + '=' + odt);
            }

            if (csCT.text().indexOf('已使用') >= 0 || csCT.text().indexOf('已过期') >= 0) {
                bs.hide();
            } else {
                bs.show();
            }
            if (ctCT.text() == '全部') {
                si.eq(2).hide();
            } else {
                si.eq(2).show();
            }
            if (ot == '全部') {
                ic.attr('rel', '');
                _unitFilter();
            } else {
                _unitFilter();
            }
        }

        op.removeClass('combobox-on');
    });

    csb.find('.bar-side').find('.side-item').on('click', function () {
        var oThis = $(this);
        var oIS = oThis.find('.icon-sort');
        if (oThis.hasClass('on')) {
            if (oIS.hasClass('sort-down')) {
                oIS.removeClass('sort-down').addClass('sort-up');
            } else {
                oIS.removeClass('sort-up').addClass('sort-down');
            }
        } else {
            oThis.addClass('on').siblings('li').removeClass('on');
        }
        _unitFilter();
    });
}

function memberCountdown() {
    var timer = $('.j_timerAs'); // 售后客服计时
    var df = _util.apis.getServerDate(); // 获取服务器日期
    var nowTime = 0;
    var _unitCountdown = function (obj, time, now) {
        var oShi = obj.find('.num-hour');
        var oFen = obj.find('.num-minute');
        var oMiao = obj.find('.num-second');
        var btnPay = obj.siblings('.btn-pay');
        var iValue = time - now;
        //单元处理
        var _unitCD = function (cha) {
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);

            oShi.text(hours % 24);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };

        now += 1000;

        if (iValue > 0) {
            _unitCD(iValue);
        } else {
            clearTimeout(timeout);
            if (btnPay.get(0)) {
                btnPay.hide();
                obj.hide();
            }
        }

        var timeout = setTimeout(function () {
            _unitCountdown(obj, time, now);
        }, 1000);
    };

    df.done(function (tm) {
        tm = tm.replace(/-/g, '/');
        nowTime = parseInt(Date.parse(tm), 10);
        timer.each(function() {
            var oThis = $(this);
            var dt = parseInt(Date.parse(oThis.attr('data-time')), 10);
            var hour = parseInt(oThis.attr('data-hour'), 10);

            dt += hour * 3600000; // 倒计时长 3600000 = 1小时
            _unitCountdown(oThis, dt, nowTime);
        });
    });
}

function memberImgPreview(obj, srcAttr) {
    var $container = $('<div/>').attr('id', 'imgPreviewContainer').append('<img/>').hide().css('position', 'absolute').appendTo('body'),
        $img = $('img', $container),
        $imgs = obj.find('img[' + srcAttr + ']');

    $imgs.on('mousemove', function (e) {
        var iX = $(window).width() - $container.width() - 50;
        var iY = $(window).height() - $container.height() - 10;
        var xAxis = e.pageX > iX ? iX : e.pageX + 10;
        var yAxis = e.pageY - $container.height() - 10;
        $container.css({
            top: yAxis,
            left: xAxis,
            zIndex: 1099
        });
    }).hover(function () {
        var oThis = $(this);
        $container.show();
        $img.load(function () {
            $img.show().animate({
                opacity: 1
            }, 300);
        }).attr('src', oThis.attr(srcAttr));
    }, function () {
        $container.hide();
        $img.unbind('load').attr('src', '').hide().stop().css({
            opacity: 0
        });
    });
}

function delCollection(){
    var mt = $('.j_memberTab');
    var cd = mt.find('.collect-delete');
    cd.on('click', function () {
        var o = $(this);
        o.parent().parent().parent('li').hide();
    });
}

function loadGuessLike() {
    if (!window.guessLike) {
        _util.file.load((_env === 'dev' ? '' : _uzw.domain.cdnRandom()) + '/content/v1/scripts/com/guesslike.js', function () {
            guessLike('j_guessLikeContainer');
        });
    }
}

//订单类型TAB绑定事件
function loadOrderTypeTab() {
	//页面后退时选择正确的Tab
	if($("#hidordertype").val() != '1') {
		$(".hd .hd-list").find('li').each(function (index) {
			if(parseInt($("#hidordertype").val()) == index + 1) {
				$(this).siblings().removeClass('on');
				$(this).addClass('on');
				return false;
			}
		});
	}

	$(".hd .hd-list").find('li').on('click', function () {
		var e = $(this);
		e.siblings().removeClass('on');
		e.addClass('on');
		//加载数据
		$("#hidordertype").val(e.index() + 1);
		ajaxGetOrderControl();
		//重新加载翻页控件
		memberPager();
	});

	$('#typeSelect').change(function () {
		//加载数据
        ajaxGetOrderControl(true);
		//重新加载翻页控件
		memberPager();
    });
}

function orderListbtnLoad() {
    //取消订单
    $(".btn-cancel").unbind();
    $(".btn-cancel").click(function () {

        //判断是不是会员活动的取消按钮
        if($(this).parents('#j_memberOrderTab').length > 0 ){
            return;
        }

        _uzw.iframe.pop('/manage/UserOrderCancel-' + $(this).attr("val") + '.html', 410, 280);
    });
    //查看点评
    $(".J-readRecord").unbind();
    $(".J-readRecord").click(function () {
        _uzw.iframe.pop("/manage/UserTourCommentLook-" + $(this).attr("val") + ".html", 540, 547);
    });
    //修改订单
    $(".btn-modify").unbind();
    $(".btn-modify").click(function () {
        _uzw.iframe.pop('/manage/UserOrderChange?orderCode=' + $(this).attr("val"), 409, 398);
    });
}

//加载订单类型数据
function ajaxGetOrderControl(getCounts, pageIndex, pageSize) {
    if(getCounts === undefined) getCounts = false;
    if(pageIndex === undefined) pageIndex = 1;
    if(pageSize === undefined) pageSize = 10;

	var orderType = $("#hidordertype").val() || 1; //订单状态类型
	var actionType = $("#typeSelect").val() || 1;  //订单业务类型
	var orderTimeType = 0;  //查询订单时间段, 当前只查所有时间

	$.ajax({
	    url: '/manage/ajaxGetOrder',
	    type: 'POST',
	    data: 'orderType=' + orderType + '&actionType=' + actionType + '&orderTimeType=' + orderTimeType + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
	    async: !getCounts,
	    success: function(data) {
	    	var e = $('.bd .item .order-info-table.pager-target-node');
	    	e.html(data);
	    	if(getCounts) {
	    		var counts = e.find("#hidCounts").val() || '0|0|0|0';
	    		var countarr = counts.split('|');
	    		$('.hd .hd-list').find('li').each(function (index) {
	    			var count = parseInt(countarr[index]) || 0;
	    			$(this).attr('data-count', count);
	    			$(this).find('i').html(count);
	    		});
	    	}
            //重新加载列表按钮
            orderListbtnLoad();
            //重新加载订单跟踪等
            tipsInfo();
	    }
	});
}


//显示活动抽奖
function ShowActivityDraw()
{
     var user=$.cookie('user');
     var reg = new RegExp('(^|&)userid=([^&]*)', 'g');

     try{


        var r = user.match(reg);
        var userid = r !== null && r.length > 0 ? unescape(r[r.length - 1]).replace(/(&|userid=)/g, '') : null;
   
        $.ajax({
                type: "get",
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: "successCallbackc",
                url: 'https://mhd.uzai.com/Data/GetLotteryCountNew',
                data: {
                    'rotateactivityid': 5,
                    'userid': userid
                },
                success: function(data) {
                    var c = eval("(" + data + ")");
                    var num = parseInt(c.JsonResult);
                    if(num>0)
                    {
                        $('.hd-list').append('<li><a href="http://www.uzai.com/subject/bjwuyuewdr/bj" target="_blank"><img src="http://r01.uzaicdn.com/content/subject/pc-wangdingri170111/images/ling_03.jpg"/></a></li>');
                    }
                },
                error: function() {
                }
            });
      }catch(e){
        console.log(e.message);
      }
}



// 宝钢项目
function bgClose(){
    var bgClose = $('.pop-bg-box').find('.close');
    bgClose.on('click',function(){
        $('.pop-bg').addClass('hide');
        _uzw.ui.mask.hide();
    });
}


