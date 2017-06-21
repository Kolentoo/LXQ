/*
 * @Author: lxq
 * @Date:   2017-01-23 10:55:57
 * @Last Modified by:   lxq
 * @Last Modified time: 2017-05-22 17:04:55
 */

'use strict';

$(function () {
    bookTips();
    bookQitcklogin();
    bookNav();
    travelerInfo();
    bookInfo();
    bookDiscount();
    bookCheck();
    bookCountdown();
    bookNumControl();

    orderStore();
    unitGanged();
    initBookForm();

    _uzw.ui.tab('book-tab');
    _uzw.ui.tab('dis-tab');
    _uzw.ui.tab('j_paymentTab');
    _uzw.ui.tab('j_paymentSubTab');
    _uzw.ui.tab('j_explainTab');
});

var bookLoading = {
    show: function (sText) {
        sText = sText || '正在处理，请稍候...';
        var storageNode = '<div class="storage"><img src="//r03.uzaicdn.com/content/yudingv2/images/wait.gif" alt="loading"><em>' + sText + '</em></div>';
        var storage = $('.storage');

        if (storage.get(0)) {
            storage.find('em').text(sText);
        } else {
            $('body').append(storageNode);
            storage = $('.storage');
        }
        _uzw.ui.mask.show();
        storage.show();
    },
    hide: function () {
        var storage = $('.storage');
        _uzw.ui.mask.hide();
        storage.hide();
    }
};

var AppBase = (function () {
    var _app = function () { };
    //触发事件
    _app.prototype.trigger = function (event, arg) {
        var e = this[event] || [];
        if (e instanceof Array) {
            $.each(e, function () {
                try {
                    this(arg);
                } catch (e) { }
            });
        }
    };
    //绑定事件
    _app.prototype.bind = function (event, callback) {
        var ee = this[event] || [];
        ee.push(callback);
        this[event] = ee;
    };
    return _app;
})();

//登录模块
var AppLogin = (function () {
    var _app = function () {

    };
    //继承
    _app.prototype = new AppBase();
    //发送短信
    _app.prototype.sendmobilefunc = function () {
        var _this = this;
        $.ajax({
            url: _uzw.domain.u + '/reg/SendMobileCode?ts=' + Math.random(),
            type: 'GET',
            cache: false,
            dataType: "jsonp",
            data: { "type": "proc_one", islogin: ((_uzw.user && _uzw.user.islogin == "1")), "txtPhone": $("input[name='phonenumber']").val().trim(), "grapCode": true, "codeType": "checkCode", "validatorType": "form", "clientid": "txtValidator", "txtValidator": $("input[name='piccode']").val().trim() },
            success: function (data) {
                _this.trigger("sendmobilecodecallback", data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //出错了,给提示?
                //_this.sendmobilecodecallback(errorThrown);
                _this.trigger("sendmobilecodecallback", errorThrown);
            }
        });
    };
    //登录
    _app.prototype.loginfunc = function () {
        var _this = this;
        $(document.activeElement).trigger("blur");
        $.ajax({
            url: _uzw.domain.u + '/reg/QuickBook?ts=' + Math.random(),
            type: 'GET',
            cache: false,
            dataType: "jsonp",
            data: {
                txtPhone: $("input[name='phonenumber']").val().trim(),
                pwd: $("input[name='dxcode']").val().trim(),
                //codeHide: ($("input[name='piccode']").closest("li").hasClass("hide")),
                codeHide: true,
                txtPassCode: $("input[name='piccode']").val(),
                aj: "1"
            },
            success: function (data) {
                _this.trigger("logincallback", data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //出错了,给提示?
                _this.trigger("logincallback", errorThrown);
            }
        });
    };
    //快速登录
    _app.prototype.fastloginfunc = function () {
        var _this = this;
        var funcname = "quicklogincallback" + new Date().getTime().toString();
        window[funcname] = _this.quicklogincallback;
        _uzw.iframe.pop("//u.uzai.com/QuickLogin?action=" + funcname + "&name=" + $("#phonenumber").val(), 640, 315);
    };

    //绑定事件
    //绑定发送短信回调
    _app.prototype.bindsendmobilecodecallback = function (callback) {
        this.bind("sendmobilecodecallback", callback);
    };
    //登录回调
    _app.prototype.bindlogincallback = function (callback) {
        if (callback instanceof Function) {
            this.bind("logincallback", callback);
        }

    };
    //快速登录回调
    _app.prototype.bindfastlogincallback = function (callback) {
        this.bind("fastlogincallback", callback);
    };

    return new _app();
})();

//视图模块
var AppView = (function () {
    var _app = function () { };

    //重载出游人视图
    _app.prototype.reloadtraveler = function (callback) {
        $(".traveler-container").load("/outbound/proc_one_traveler" + $("#hidtr" + "aveler").val(), callback);
    };

    //重载优惠视图
    _app.prototype.reloadpreferential = function (callback) {
        // $(".preferential-container").load("/outbound/Activity" + $("#hidPref" + "erential").val(), function () {
        //     try {
        //         window.PreferentialProject.jsonData = JSON.parse(document.getElementById('hidActivityData').value);

        //     } catch (e) { }
        //     callback();
        // });

        $.ajax({
            url: '/outbound/Activity',
            type: "post",
            data: { value: $("#hidPreferential").val() },
            success: function (data) {
                $(".preferential-container").html(data);
                try {
                    window.PreferentialProject.jsonData = JSON.parse(document.getElementById('hidActivityData').value);
                } catch (e) { }
            },
            complete: function () {
                callback && callback();
            }
        });
    };
    return new _app();
})();

/*
* wrap（必需）            : 点击区域对象
* options（可选）         : 选择项配置对象。如果需要回调，需要删除默认绑定类名（check-list），不然会造成重复绑定、执行多次问题
*   clickAfter（可选）    : 点击之后回调函数，返回参数为点击区域对象
*   clickBefore（可选）   : 点击之前回调函数，返回参数为点击区域对象
*/
function unitCheckbox(wrap, options) {
    var checkbox = wrap.find('.check-item');
    var afterCb, beforeCb;

    if (options) {
        afterCb = options.clickAfter;
        beforeCb = options.clickBefore;
    }

    if (wrap.hasClass('check-disable')) {
        return false;
    }

    beforeCb && beforeCb instanceof Function && beforeCb(wrap);

    if (wrap.hasClass('check-on')) {
        wrap.removeClass('check-on');
        checkbox.removeProp('checked');
    } else {
        wrap.addClass('check-on');
        checkbox.prop('checked', 'checked');
    }

    afterCb && afterCb instanceof Function && afterCb(wrap);
}

/*
* wrap（必需）            : 点击区域对象
* options（可选）         : 选择项配置对象。如果需要回调，需要删除默认绑定类名（radio-list和radio-wrap），不然会造成重复绑定、执行多次问题
*   clickAfter（可选）    : 点击之后回调函数，返回参数为点击区域对象
*   clickBefore（可选）   : 点击之前回调函数，返回参数为点击区域对象
*/
function unitRadio(wrap, options) {
    var radio = wrap.find('.radio-item');
    var radioName = radio.attr('name');
    var radios = $('input:radio[name=' + radioName + ']');
    var afterCb, beforeCb;

    if (wrap.hasClass('radio-on')) { // 如果已选中，不执行后面代码
        return false;
    }

    if (options) {
        afterCb = options.clickAfter;
        beforeCb = options.clickBefore;
    }

    beforeCb && beforeCb instanceof Function && beforeCb(wrap);

    if (beforeCb && beforeCb(wrap) === false) { // 返回值为假，不执行后面代码
        return beforeCb(wrap);
    }

    radios.removeProp('checked').parents('.radio-on').removeClass('radio-on');
    wrap.addClass('radio-on');
    radio.prop('checked', 'checked');

    afterCb && afterCb instanceof Function && afterCb(wrap);
}

/*
* node（可选）              : 弹框根节点
* options（可选）           : 选择项配置对象
*   parentSelector（可选）  : 父节点选择器（需要关闭的节点选择器）
*   closeSelector（可选）   : 关闭节点选择器（需要绑定关闭事件的节点选择器）
*   popupAfter（可选）      : 显示之后回调函数，返回参数为弹框根对象
*   popupBefore（可选）     : 显示之前回调函数，返回参数为弹框根对象
*   popupClose（可选）      : 弹框关闭回调函数，返回参数为弹框根对象
*   yAxis（可选）           : IE6下，距离浏览器视窗顶部距离（默认为浏览器视窗高度的一半）
*/
function popupTips(node, options) {
    var obj = $('#' + node);
    var popNode = '';
    var sParent, sClose, afterCb, beforeCb, closeCb, iYAxis;

    $("#j_popupTips").remove();

    obj = obj.get(0) ? obj : $('#j_popupTips');

    popNode +=
        '<div id="j_popupTips" class="ui-popup popup-tips hide">' +
        '<p class="tips-icon"><span class="icon-wrap"><i class="icon-item icon-common-main png"></i></span></p>' +
        '<h3 class="popup-hd tc"><em class="hd-cont f666 f16 b"></em></h3>' +
        '<div class="popup-bd"></div>' +
        '<div class="popup-ft"></div>' +
        '<span class="popup-close pointer j_popupClose"><i class="close-icon">&times;</i></span>' +
        '</div>';

    $('body').append(popNode);
    obj = $('#j_popupTips');


    if (options) {
        iYAxis = options.yAxis;
        sParent = options.parentSelector;
        sClose = options.closeSelector;
        afterCb = options.popupAfter;
        beforeCb = options.popupBefore;
        closeCb = options.popupClose;
    }

    iYAxis = iYAxis || $(window).height() / 2;
    sParent = sParent || '.ui-popup';
    sClose = sClose || '.j_popupClose';

    beforeCb && beforeCb instanceof Function && beforeCb(obj);

    _uzw.ui.mask.show();
    obj.show().on('click', sClose, function () {
        var oThis = $(this);
        oThis.parents(sParent).hide();
        _uzw.ui.mask.hide();
        $(".storage").remove();
        closeCb && closeCb instanceof Function && closeCb(obj);
    });

    afterCb && afterCb instanceof Function && afterCb(obj);

    //IE6下的定位
    if (_util.check.isIE6) {
        obj.css('top', $(document).scrollTop() + iYAxis);
        $(window).on('scroll', function () {
            obj.css('top', $(document).scrollTop() + iYAxis);
        });
    }
}

function splitName(fullname) {
    var hyphenated = ['欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫',
        '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '城池', '司徒', '鲜于', '司空', '汝嫣', '闾丘', '子车', '亓官',
        '司寇', '巫马', '公西', '颛孙', '壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐', '段干', '百里', '呼延', '东郭', '南门',
        '羊舌', '微生', '公户', '公玉', '公仪', '梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖', '第五', '公乘', '贯丘', '公皙',
        '南荣', '东里', '东宫', '仲长', '子书', '子桑', '即墨', '达奚', '褚师'
    ];
    var vLength = fullname.length;
    var lastname = '',
        firstname = ''; //前为姓,后为名
    if (vLength > 2) {
        var preTwoWords = fullname.substr(0, 2); //取命名的前两个字,看是否在复姓库中
        if ($.inArray(preTwoWords, hyphenated) > -1) {
            lastname = preTwoWords;
            firstname = fullname.substr(2);
        } else {
            lastname = fullname.substr(0, 1);
            firstname = fullname.substr(1);
        }
    } else if (vLength == 2) { //全名只有两个字时,以前一个为姓,后一下为名
        lastname = fullname.substr(0, 1);
        firstname = fullname.substr(1);
    } else {
        lastname = fullname;
    }
    return [lastname, firstname];
}

function bookNumControl() {
    var bookNum = $('.j_bookNum');

    if (bookNum.get(0)) {
        bookNum.find('.num-box').each(function (a, b) {
            var o = $(this);
            if ($.trim(o.val()) === '0') {
                o.siblings('.btn-down').addClass('btn-off');
            }
        });

        bookNum.find('.num-btn').on('click', function () {
            var o = $(this);
            var os = o.siblings('.num-btn');
            var op = o.parents('.j_bookNum');
            //最大
            var maxnum = op.attr('data-maxnum') || 99;
            //最小
            var minnum = op.attr('data-minnum') || 0;
            //数值范围 (如果有)
            var numvals = op.attr("data-num-vals") || null;
            if (numvals !== null) {
                numvals = numvals.split(",");

                maxnum = numvals[numvals.length - 1];
                minnum = numvals[0];
            }
            if (o.hasClass("btn-off")) {
                return;
            }
            //输入框
            var t = o.siblings('.num-box');
            //当前数值
            var v = parseInt(t.val(), 10);
            var x, vv;

            if (o.hasClass('btn-up')) {
                //加操作
                if (numvals !== null) {
                    for (x = 0; x < numvals.length; x++) {
                        if (numvals[x] == v) {
                            try {
                                vv = numvals[(x + 1)];
                                if (vv !== null) {
                                    t.val(vv);
                                    os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用减按钮

                                    if (vv == maxnum) {// 禁用加按钮
                                        o.addClass('btn-off');
                                    }

                                }


                            } catch (e) { }
                        }
                    }
                } else {
                    if (v < maxnum) {
                        t.val(++v);
                        os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用减按钮

                        if (v == maxnum) { // 禁用加按钮
                            o.addClass('btn-off');
                        }
                    }
                }



            } else if (o.hasClass('btn-down')) {
                //减操作
                if (numvals !== null) {
                    for (x = 0; x < numvals.length; x++) {
                        if (numvals[x] == v) {
                            try {
                                vv = numvals[(x - 1)];
                                if (vv !== null) {
                                    t.val(vv);
                                    os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用减按钮
                                    if (vv == minnum) {// 禁用加按钮
                                        o.addClass('btn-off');
                                    }
                                }
                            } catch (e) { }
                        }
                    }
                } else {
                    if (v > minnum) {
                        t.val(--v);
                        os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用加按钮

                        if (v == minnum) {
                            o.addClass('btn-off'); // 禁用减按钮
                        }
                    }
                }
            }

            return false;
        });
    }
}

function initBookForm() {
    var body = $('body');

    body.on('click', '.check-list', function () {
        var o = $(this);
        unitCheckbox(o);
    }).on('click', '.radio-list, .radio-wrap', function () {
        var o = $(this);
        unitRadio(o);
    });
}

// 提示
function bookTips() {

    $('.book-tips').on('mouseenter', function () {
        var o = $(this);
        o.find('.book-tips-box').removeClass('hide');
    }).on('mouseleave', function () {
        var o = $(this);
        o.find('.book-tips-box').addClass('hide');
    });

    // 图形验证码
    $('.change-txt').on('click', function () {
        $('.code-pic').click();
    });
}

// 快速登录
function bookQitcklogin() {
    $(document.body).on('click', ".login-link", function () {
        if (!_uzw.user.userid) {
            try {
                ga('send', 'event', 'pc_bookgroud_' + window.location.href, 'login');
            } catch (e) { }
            AppLogin.fastloginfunc();
        }
    });
}

// 导航
function bookNav() {
    var w = $(window);
    var wh = w.height();
    var bh = $('body').height();
    var bookSum = $('.book-sum');
    var sideNav = $('.book-nav');
    var navH = sideNav.outerHeight(true);
    var simpleFoot = $('.j_simpleFooter');
    var footer = $('.simple-footer');
    var navTopDist = wh - wh * 17 / 100 - navH;
    var bsTop, bsH, ftTop, bsEnd, navEnd;

    if (bookSum.get(0)) {
        bsTop = bookSum.offset().top;
    }

    $(window).scroll(function () {
        var st = w.scrollTop();
        if ($(".finally").get(0)) {
            return;
        }

        if (bookSum.get(0)) {
            bsH = bookSum.outerHeight(true);
        }
        if (footer.get(0)) {
            ftTop = footer.offset().top;
            bsEnd = ftTop - bsH - 40;
            navEnd = ftTop - 40 - navH;
        }

        if (st >= bsTop && bsH < wh) {
            if (bsEnd && st >= bsEnd) {
                bookSum.css({
                    'position': 'absolute',
                    'top': bsEnd
                });
            } else if (_util.check.isIE6) {
                bookSum.css({
                    'position': 'absolute',
                    'top': st
                });
            } else {
                bookSum.css({
                    'position': 'fixed',
                    'top': 0
                });
            }
        } else {
            bookSum.css({
                'position': 'static',
                'top': 'auto'
            });
        }

        if (navEnd && st + navTopDist >= navEnd) {
            sideNav.css({
                'position': 'absolute',
                'top': navEnd,
                'bottom': 'auto'
            });
        } else if (_util.check.isIE6) {
            sideNav.css({
                'position': 'absolute',
                'top': st + navTopDist,
                'bottom': 'auto'
            });
        } else {
            sideNav.css({
                'position': 'fixed',
                'bottom': '17%',
                'top': 'auto'
            });
        }
    }).trigger('scroll');

    $('.book-kf').on('mouseenter', function () {
        $('.kf-tips').removeClass('hide');
    }).on('mouseleave', function () {
        $('.kf-tips').addClass('hide');
    });

    $('.book-back').on('click', function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
    });

    if (bh < wh) {
        simpleFoot.addClass('simple-footer-fixed');
    } else {
        simpleFoot.removeClass('simple-footer-fixed');
    }
}

function travelerInfo() {
    $('.travel-btn').on('click', function () {
        var o = $(this);
        o.toggleClass('travel-btn-on');
        $('.detail-con').toggle();
        if (o.hasClass("travel-btn-on")) {
            $("#iscyr").val(1);
        } else {
            $("#iscyr").val(0);
        }
    });
}

// 出行人信息
function bookInfo() {

    $('.dis-topic').children('.s2').on('click', function () {
        var o = $(this);
        if (o.hasClass('item-disable')) {
            return false;
        }
        o.toggleClass('dis-topic-on');
        o.parents('.dis-topic').siblings('.dis-tab, .dis-con').toggle();
    });
}

// 优惠板块
function bookDiscount() {

    $('.discount-list').on('click', function () {
        var o = $(this);
        unitCheckbox(o, {
            clickBefore: function (obj) {
                obj.hasClass('discount-out') && obj.addClass('.check-disable'); // 设为不能点击
            }
        });
    });

    $('.agree').on('click', function () {
        var o = $(this);
        var dBtn = $('.d-btn');
        var agreeCheck = $('.agree-check');
        if (o.hasClass('check-on')) {
            dBtn.addClass('btn-out');
        } else {
            dBtn.removeClass('btn-out');
        }
    });
}

// 表单验证
function bookCheck() {
    var regName = /^[\u4e00-\u9fa5A-Za-z]*$/;
    var regLetter = /^[A-Za-z]+$/;
    var regNumber = /^\d*$/;
    var regNumLetter = /^[A-Za-z\d]+$/;
    var regDate = /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
    var rootNode = $('body, html');

    // 表单验证
    var sName = '.j_checkName'; // 中英文姓名
    var sEnName = '.j_checkEnName'; // 英文姓名
    var sMobile = '.j_checkMobile'; // 手机号
    var sPicCode = '.j_checkPicCode'; // 图形验证码
    var sMsgCode = '.j_checkMsgCode'; // 短信验证码
    var sEmail = '.j_checkEmail'; // 电子邮箱
    var sIdCard = '.j_checkIdCard'; // 身份证
    var sDate = '.j_checkDate'; // 年月日

    var _unitCheck = function (input, status, options) {
        var paSelector,
            tips,
            infoNull,
            infoError,
            tipsTxt,
            successCB,
            errorCB,
            nullCB,
            oPa,
            aPas,
            i;

        if (options) {
            paSelector = options.parentSelector; // string or array
            successCB = options.successCall; // function
            errorCB = options.errorCall; // function
            nullCB = options.nullCall; // function
        }

        paSelector = paSelector || '.in-list';
        aPas = (typeof paSelector === 'string') ? [paSelector] : paSelector;

        for (i in aPas) {
            if (input.parents(aPas[i]).get(0)) { // 找到父节点
                oPa = input.parents(aPas[i]);
                break;
            }
        }

        if (!oPa || !oPa.get(0) || input.is(':hidden')) { // 父节点不存在或输入框隐藏
            return false;
        }

        tips = oPa.find('.label-tips');
        infoNull = tips.attr('data-infoNull');
        infoError = tips.attr('data-infoError');
        tipsTxt = tips.find('.p1');

        if (input.val()) {
            if (status) {
                tips.addClass('hide');
                input.removeClass('input-err');
                successCB && successCB instanceof Function && successCB();
            } else if (infoError) {
                tips.removeClass('hide');
                tipsTxt.text(infoError);
                input.addClass('input-err');
                errorCB && errorCB instanceof Function && errorCB();
            }
        } else {
            if (infoNull) {
                tips.removeClass('hide');
                tipsTxt.text(infoNull);
                input.addClass('input-err');
                nullCB && nullCB instanceof Function && nullCB();
            } else {
                tips.addClass('hide');
                input.removeClass('input-err');
            }
        }
    };
    var _submitCheck = function (inputs, paSelector) {
        var flag = true;
        inputs.each(function () {
            var o = $(this);
            var op = o.parents(paSelector);
            var status = op.find('.label-tips.hide').get(0);
            var _unitErrorSkip = function () {
                if (flag) {
                    var itop = op.offset().top;
                    rootNode.animate({
                        scrollTop: itop - 10
                    }, 800);
                    flag = false;
                }
            };

            _unitCheck(o, status, {
                parentSelector: '.in-list',
                errorCall: _unitErrorSkip,
                nullCall: _unitErrorSkip
            });
        });

        $('.card1').each(function (a, b) {
            var o = $(this);
            var op = o.parents(paSelector);
            var cardtxt = o.find('option:selected').text();
            var labelTips = o.parents('.info-list').find('.label-tips');
            var infoSelect = labelTips.attr('data-infoSelect');
            var _unitErrorSkip = function () {
                if (flag) {
                    var itop = op.offset().top;
                    rootNode.animate({
                        scrollTop: itop - 10
                    }, 800);
                    flag = false;
                }
            };
            if (cardtxt === "请选择证件类型") {
                if (infoSelect) {
                    labelTips.removeClass('hide');
                    labelTips.find('.p1').text(infoSelect);
                    _unitErrorSkip();
                }
            }
        });
        return flag;
    };

    rootNode.on('blur', sName, function () {
        var o = $(this);
        var status = regName.test(o.val());

        _unitCheck(o, status, {
            parentSelector: '.in-list',
            successCall: function () {
                var op = o.parents('.travel-details');
                var _nameProcess = function () {
                    var aName, enNames, val1, val2;
                    aName = splitName(o.val());
                    enNames = o.parents('.info-listing').find('.j_checkEnName');
                    val1 = window.pinyin.getFullChars(aName[0]);
                    val2 = window.pinyin.getFullChars(aName[1]);
                    enNames.eq(0).val(val1.toUpperCase());
                    enNames.eq(1).val(val2.toUpperCase());
                    enNames.removeClass('input-err').parents('.info-list').find('.label-tips').addClass('hide');
                };

                if (op.get(0)) {
                    if (!window.pinyin) {
                        _util.file.load(_uzw.domain.cdnRandom() + '/content/libs/plugin/chinesetopinyin/chinesetopinyin.min.js', function () {
                            _nameProcess();
                        });
                    } else {
                        _nameProcess();
                    }
                }
            }
        });
    });


    rootNode.on('blur', sEnName, function () {
        var o = $(this);
        var status = regLetter.test(o.val());
        _unitCheck(o, status);
    });

    rootNode.on('blur', sMobile, function () {
        var o = $(this);
        var ov = o.val();
        var status = _uzw.regexForm.mobile(ov);
        var umv = $("#umv").val();
        var travelo = o.is(".travel-phone");
        if (_uzw.user.userid && umv === "Y" && !travelo) {
            return;
        }

        if ($("#hidPlatform").val() === "Offline" && !travelo) {
            return;
        }

        _unitCheck(o, status, {
            parentSelector: '.in-list',
            successCall: function () {
                if (o.parents('.contacts-con').get(0)) {
                    $.ajax({
                        url: _uzw.domain.u + '/reg/mobileexists',
                        dataType: 'jsonp',
                        cache: false,
                        data: { 'mobile': ov },
                        success: function (data) {
                            //判断当前登录状态
                            if (_uzw.user && _uzw.user.islogin == "1") {
                                if (data === 1) {
                                    o.siblings('.s2').html('');
                                    $(".information .list4").addClass("hide");
                                    $(".information .list3").addClass("hide");
                                } else {
                                    o.siblings('.s2').html('当前手机号尚未绑定当前登录账号，提交订单后系统将自动为您绑定');
                                    $(".information .list4").removeClass("hide");
                                    $(".information .list3").removeClass("hide");

                                }
                            } else {
                                if (data === 1) {
                                    o.siblings('.s2').html('当前手机号已注册，输入短信验证码后将自动登录');
                                    $(".information .list4").removeClass("hide");
                                } else {
                                    o.siblings('.s2').html('您尚未注册会员，请点击<a href="' + _uzw.domain.u + '/register?referurl=' + window.location.toString() + '" class="link-item">注册</a>按钮完成注册');
                                    $(".information .list4").addClass("hide");
                                }
                            }
                        }
                    });
                }
            }
        });
    });

    rootNode.on('blur', sPicCode, function () {
        var o = $(this);
        var ov = o.val();
        var status = regNumber.test(ov);
        var oItem = o.parents('.in-list');
        var tips = oItem.find('.label-tips');
        if ($("#hidPlatform").val() === "Offline") {
            return;
        }

        _unitCheck(o, status, {
            parentSelector: '.in-list',
            successCall: function () {
                $.ajax({
                    url: _uzw.domain.u + '/ashx/ashxValidatorCode.ashx',
                    dataType: 'jsonp',
                    cache: false,
                    data: { "codeType": "checkCode", "validatorType": "form", "clientid": "txtValidator", "txtValidator": ov },
                    success: function (data) {
                        if (data.status == '1') {
                            tips.addClass('hide');
                            o.removeClass('input-err');
                        } else {
                            tips.removeClass('hide').find('.p1').text('请输入正确的图形验证码');
                            o.addClass('input-err');
                        }
                    }
                });
            }
        });
    });

    AppLogin.bindlogincallback(function (data) { // 登录回调
        var o = $(sMsgCode);
        var ov = o.val();
        var op = o.parents('.info-listing');
        var oItem = o.parents('.in-list');
        var status = regNumber.test(ov) && ov.length === 4;
        var oMobile = op.find('.j_checkMobile');
        var oName = op.find('.j_checkName');
        var oEmail = op.find('.j_checkEmail');
        var tips = oItem.find('.label-tips');

        // 成功
        if (data["status"] === 1) {
            $(o).closest("ul").find(".list3").addClass("hide");
            $(o).closest("ul").find(".list3 .label-tips").addClass("hide");

            $(o).closest("ul").find(".list4").addClass("hide");
            $(o).closest("ul").find(".list4 .label-tips").addClass("hide");

            $(".book-detail").find(".uzlogin").addClass("hide");
            $(".book-detail").find(".uzlogin").css({ "display": "none" });

            tips.addClass('hide');
            o.removeClass('input-err');
            _uzw.user.refresh();
            if (oName.val().trim() === "") {
                oName.val(_uzw.user.realname);
            }
            try {
                if (oEmail.val().trim() === "" && data["uve"] === "Y") {
                    oEmail.val(_uzw.user.Email);
                    oEmail.trigger("blur");
                }
            } catch (e) {

            }
            $("#umv").val(data["uvm"]);
            $("#phonenumber").closest("li").find("span.s2").text("");
        }
        // 显示验证码
        else if (data["status"] === 99) {
            oItem.siblings('.list3.hide').removeClass('hide');
        }
        // 失败
        else {
            tips.removeClass('hide').find('.p1').text('登录失败，请稍后再试');
            o.addClass('input-err');
        }
        window.setTimeout(function () {
            bookLoading.hide();
        }, 50);

    });

    rootNode.on('blur', sMsgCode, function () {
        var o = $(this);
        var ov = o.val();
        var op = o.parents('.info-listing');
        var oItem = o.parents('.in-list');
        var status = regNumber.test(ov) && ov.length === 4;
        var oMobile = op.find('.j_checkMobile');
        var oName = op.find('.j_checkName');
        var oEmail = op.find('.j_checkEmail');
        var tips = oItem.find('.label-tips');

        if (_uzw.user && _uzw.user.islogin == "1") {

        } else {
            _unitCheck(o, status, {
                parentSelector: '.in-list',
                successCall: function () {
                    $.ajax({
                        url: _uzw.domain.u + '/ashx/ashxValidatorCode.ashx',
                        dataType: 'jsonp',
                        cache: false,
                        data: { "codeType": "mobileCode", "mobile": oMobile.val(), "validatorCode": ov, "userType": 'D' }, // userType, A: 注册 C: 找回密码 D: 动态密码
                        beforeSend: function () {
                            bookLoading.show("正在登录中,请稍候...");
                        },
                        success: function (data) {
                            if (data.status == '1') {
                                if (_uzw.user && _uzw.user.islogin == "1") {

                                } else {
                                    AppLogin.loginfunc();
                                }
                            } else {
                                if (!tips.closest("li").hasClass("hide")) {
                                    tips.removeClass('hide').find('.p1').text('请输入正确的短信验证码');
                                    o.addClass('input-err');
                                }

                                bookLoading.hide();
                            }

                        },
                        error: function () {
                            bookLoading.hide();
                        }
                    });
                }
            });
        }



    });

    rootNode.on('blur', sEmail, function () {
        var o = $(this);
        var status = _uzw.regexForm.email(o.val());
        _unitCheck(o, status);
    });

    if ($(sDate).mask instanceof Function) {
        $(sDate).mask('9999-99-99');
    }

    rootNode.on('blur', sDate, function () {
        var o = $(this);
        var status = regDate.test(o.val());
        _unitCheck(o, status);
    });

    rootNode.on('blur', sIdCard, function () {
        var o = $(this);
        var op = o.parents('.info-list');
        var card = op.find('.card');
        var cardtxt = card.find('option:selected').text();
        var status = _uzw.regexForm.idcard(o.val());
        var labelTips = op.find('.label-tips');
        var infoSelect = labelTips.attr('data-infoSelect');

        if (cardtxt === '身份证') {
            _unitCheck(o, status);
        } else {
            _unitCheck(o, true);
        }

        if (cardtxt === '请选择证件类型') {
            if (infoSelect) {
                labelTips.removeClass('hide').find('.p1').text(infoSelect);
                o.addClass('input-err');
            }
        }
    });

    $('.card1').on('change', function () {
        var o = $(this);
        var op = o.parents('.info-list');
        var labelTips = op.find('.label-tips');
        var checkIdCard = op.find('.j_checkIdCard');
        checkIdCard.val('').removeClass('input-err');
        labelTips.addClass('hide');
    });

    AppLogin.bindsendmobilecodecallback(function (data) { // 发送短信回调
        var o = $('.message').children('.mp1');
        var op = o.parents('.info-listing');
        var oItem = o.parents('.in-list');
        var message = o.parents('.message');
        var mp1 = message.find('.mp1');
        var mp2 = message.find('.mp2');
        var mobile = op.find('.j_checkMobile');
        var status = _uzw.regexForm.mobile(mobile.val());
        var tips = oItem.find('.label-tips');

        // 成功
        if (data["status"] === 1) {
            message.addClass('message-ing');
            mp1.addClass('hide');
            mp2.removeClass('hide');

            var i = 59;
            var time1 = setInterval(function () {
                if (i <= 0) {
                    clearInterval(time1);
                    message.removeClass('message-ing');
                    mp1.removeClass('hide');
                    mp2.addClass('hide');
                    mp2.children('i').text(59);
                } else {
                    mp2.children('i').text(--i);
                }
            }, 1000);

            tips.addClass('hide');
            o.removeClass('input-err');
        }
        // 显示验证码
        else if (data["status"] === 99) {
            oItem.siblings('.list3.hide').removeClass('hide');
        } else if (data["status"] == 2) {
            tips.removeClass('hide').find('.p1').text('图形验证码错误');
            o.addClass('input-err');
            // } else if (data["status"] == -2) {
            // $(sMsgCode).blur();
            // tips.removeClass('hide').find('.p1').html("您尚未注册众信悠哉账号，请点击<em class='login-link red pointer' onclick='window.location =\"https://u.uzai.com/reguser\" '>注册</em>按钮完成注册");
            // o.addClass('input-err');
            // $(sMsgCode).blur();
        }
        // 失败
        else {
            tips.removeClass('hide').find('.p1').text('发送短信失败，请稍后再试');
            o.addClass('input-err');
        }
        o.removeClass('btn-off');
    });

    // 发送短信验证码
    $('.message').children('.mp1').on('click', function () {
        var o = $(this);
        var op = o.parents('.info-listing');
        var oItem = o.parents('.in-list');
        var message = o.parents('.message');
        var mp1 = message.find('.mp1');
        var mp2 = message.find('.mp2');
        var mobile = op.find('.j_checkMobile');
        var status = _uzw.regexForm.mobile(mobile.val());
        var tips = oItem.find('.label-tips');

        try {
            ga('send', 'event', 'pc_bookgroud_' + window.location.href, 'lvcode', mobile);
        } catch (e) { }

        _unitCheck(mobile, status, {
            parentSelector: '.in-list',
            successCall: function () {
                if (!o.hasClass('btn-off')) {
                    o.addClass('btn-off');
                    AppLogin.sendmobilefunc(); // 发送短信
                }
            }
        });
    });

    // 优惠券和积分
    $('.code-btn').children('.em1').on('click', function () {
        var o = $(this);
        var ov = o.parent('.code-btn').siblings('.code-input').val();
        var status = regNumber.test(ov);
        var bc = o.parents('.book-code');
        var ci = bc.find('.code-input');

        if (o.parents('.dis-tab').get(0)) {
            status = status || regLetter.test(ov) || regNumLetter.test(ov);
        }

        _unitCheck(ci, status, {
            parentSelector: '.book-code',
            successCall: function () {
                bc.addClass('book-code-off');
                ci.attr('readOnly', '');
            }
        });
    });

    $('.code-btn').children('.em2').on('click', function () {
        var o = $(this);
        var bc = o.parents('.book-code');
        var ci = bc.find('.code-input');
        bc.removeClass('book-code-off');
        ci.removeAttr('readOnly');
    });

    // 预订按钮
    $('#btnSubmit').on('mousedown', function () {
        var o = $(this);
        var inforList = $('.infor-list');
        var inputs = inforList.find('.infor-text');
        var active = $(document.activeElement);
        var flag = true;

        if (o.hasClass('btn-out')) {
            return false;
        }

        if (active.is("input")) {
            active.trigger("blur");
        }

        flag = _submitCheck(inputs, '.infor-list');

        if (flag) {
            o.removeClass('btn-off');
        } else {
            o.addClass('btn-off');
        }
    });

    // 后台offline下单预订按钮
    $('#btnManagerSubmit').on('mousedown', function () {
        var o = $(this);
        var inforList = $('.infor-list');
        var inputs = inforList.find('.infor-text');
        var active = $(document.activeElement);
        var flag = true;

        if (o.hasClass('btn-out')) {
            return false;
        }

        if (active.is("input")) {
            active.trigger("blur");
        }

        //判断该页面是否包含此元素
        if ($(".finally").get(0)) {
            var link_name = $.trim($("#txt_name").val());
            var link_mobile = $.trim($("#txt_mobile").val());
            var link_email = $.trim($("#txt_email").val());
            var strat_phone = $.trim($("#txt_start_phone").val());
            var end_phone = $.trim($("#txt_end_phone").val());
            var phone = (strat_phone !== "") ? strat_phone + "-" + end_phone : end_phone;
            $("#txtHiddenLinker").val(link_name + "^" + link_mobile + "^" + link_email + "^" + phone); //放在隐藏域中
            //订单来源
            var source = $("#selectOrderSource");
            if (!source.val() || source.val() == "-1") {
                alert("请选择订单来源");
                source.focus();
                return;
            }
            //客户渠道
            if ($("#selChannel").val() == "0") {
                alert("请选择客户渠道");
                return;
            }
            //将选中来源与备注信息添加到隐藏域里面
            $("#HiddenOrderSource").val($("#selectOrderSource").val());
            $("#HiddenPlatform").val($("#selectPlatform").val());
            //订单来源
            // var source = $("#selectOrderSource");
            $("#hidOrderSource").val($("#selectOrderSource").val());


            //获取备注信息
            var remark = $("#txtCommentsType").val();
            if ($('input[name="radioCommentsType"]:checked').val() === 0) {
                $("#HiddenRemark").val("KF=" + remark);
                $("#hiddenKFRemark").val(remark);
            } else {
                $("#HiddenRemark").val("JD=" + remark);
                $("#hiddenJDRemark").val(remark);
            }
            $("#HiddenIsSend").val($('input:radio[name="radioSend"]:checked').val());
        }

        flag = _submitCheck(inputs, '.infor-list');

        if (flag) {
            o.removeClass('btn-off');
        } else {
            o.addClass('btn-off');
        }
    });

    // 保存，补充游客信息
    $('.suppl-traveller-info').find('.btn-bar').find('.btn-item').on('mousedown', function () {
        var o = $(this);
        var inputs = o.parents('.detail-con').find('.person-info').find('.text');
        var active = $(document.activeElement);
        var flag = true;

        if (active.is("input")) {
            active.trigger("blur");
        }

        flag = _submitCheck(inputs, '.info-list');

        if (flag) {
            o.removeClass('btn-off');
        } else {
            o.addClass('btn-off');
        }
    });
}

function bookCountdown() {
    var timer = $('.j_timerOrder'); // 售后客服计时
    var df = _util.apis.getServerDate(); // 获取服务器日期
    var nowTime = 0;
    var _unitCountdown = function (obj, time, now) {
        var oShi = obj.find('.num-hour');
        var oFen = obj.find('.num-minute');
        var oMiao = obj.find('.num-second');
        var iValue = time - now;
        //单元处理
        var _unitCD = function (cha) {
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);

            oShi.text(hours);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };

        now += 1000;

        if (iValue > 0) {
            _unitCD(iValue);
        } else {
            clearTimeout(timeout);
        }

        var timeout = setTimeout(function () {
            _unitCountdown(obj, time, now);
        }, 1000);
    };

    df.done(function (tm) {
        tm = tm.replace(/-/g, '/');
        nowTime = parseInt(Date.parse(tm), 10);
        timer.each(function () {
            var oThis = $(this);
            var dt = parseInt(Date.parse(oThis.attr('data-endtime')), 10);

            _unitCountdown(oThis, dt, nowTime);
        });
    });
}

function orderStore() {
    var storeDetail = $('.store-detail');
    var storeItems = $('#storeItems');
    var popStore = $('#j_popStoreInfo');
    var selectingStore = $('#j_selectingStore');
    var selectedStore = $('#selectedStore');
    var selectCont = storeDetail.find('.name-con').find('.s1');
    var address = storeDetail.find('.store-address');
    var storeCode = null;

    storeDetail.find('.store-change').on('click', function () {
        _uzw.ui.pop('j_popStoreInfo', '.pop-store-info');
    });

    popStore.on('click', '.store-item', function () {
        var oThis = $(this);
        var shTxt = oThis.find('.store-hd').text();

        oThis.addClass('on').siblings('.store-item').removeClass('on');
        selectingStore.val(shTxt);
        storeCode = oThis.find('input[name=cbStore]').val();
    }).on('click', '.btn-confirm', function () {
        var oThis = $(this);
        var ssVal = $.trim(selectingStore.val());
        var storeId = $('#storeId').val();
        var storeName = $('#storeName').val();
        var storeAddress = $('#storeAddress').val();
        var storeTel = $('#storeTel').val();
        var storeDefault = $('#defaultstore').val();
        var storeLast = $('#lasttimestore').val();

        if (storeAddress) {
            address.find('.s1').find('em').text(storeAddress);
        } else {
            address.find('.s1').hide().find('em').text(storeAddress);
        }

        if (storeTel) {
            address.find('.s2').find('em').text(storeTel);
        } else {
            address.find('.s2').hide().find('em').text(storeTel);
        }

        if (storeDefault && storeDefault === storeId) {
            selectCont.siblings('.defaultstore').show();
        } else {
            selectCont.siblings('.defaultstore').hide();
        }

        if (storeLast && storeLast === storeId) {
            selectCont.siblings('.lasttimestore').show();
        } else {
            selectCont.siblings('.lasttimestore').hide();
        }

        ssVal && selectCont.text(ssVal);
        // storeId && $('#storeId').val(storeId);
        storeCode && selectedStore.val(storeCode);
    });

    StoreCityChange(); //其他门店绑定
    //门店搜索
    $("#storeSearch").click(function () {
        var selCity = $("#selectStoreCity").find("option:selected").val();
        var selArea = $("#selectStoreArea").find("option:selected").val();
        var txt = $("#storeSearchText").val();
        if (!txt) {
            StoreAreaChange();
        } else {
            storeItems.find("label").hide();
            storeItems.find("label[data-city='" + selCity + "']:contains('" + txt + "')").show();
        }
    });

    //选择门店dialog当前门店城市选中
    var storeId = $('#storeId').val();
    if (storeId > 0) {
        var obj = $($('#j_popStoreInfo').find('input[name="cbStore"][value="' + storeId + '"]').parent()[0]);
        var cityId = obj.attr('data-city');
        var areaName = obj.attr('data-area');
        if (cityId > 0) {
            $('#selectStoreCity').val(cityId);
            setTimeout(function () {
                $('#selectStoreArea').val(areaName);
                document.getElementById('selectStoreArea').onchange();
                obj.click();
            }, 500);
            StoreCityChange();
        }
    }

    if (window.BMap) {
        /* 门店地图绑定开始 */
        var storeMap = new window.BMap.Map("storeMapContainer"); // 创建地图实例
        storeMap.centerAndZoom(new window.BMap.Point(116.158061, 40.055466), 11);
        storeMap.addControl(new window.BMap.NavigationControl()); //地图平移缩放控件
        storeMap.addControl(new window.BMap.ScaleControl()); //比例尺
        storeMap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        var mapIcon = new window.BMap.Icon("//r01.uzaicdn.com/content/v1/images/common/map-mark.gif", new window.BMap.Size(25, 29), { offset: new window.BMap.Size(27, 27) });
        //将所有门店位置标注在地图上
        storeItems.children().each(function (i, n) {
            var obj = $(n);
            var longitude = obj.attr("data-longitude");
            var latitude = obj.attr("data-latitude");
            var point = new window.BMap.Point(longitude, latitude);  // 创建点坐标
            var marker = new window.BMap.Marker(point, { icon: mapIcon });        // 创建标注
            storeMap.addOverlay(marker);                     // 将标注添加到地图中
            var infoWindow = new window.BMap.InfoWindow(obj.find(".store-hd").html() + "<br/><div style='max-width:300px;'>" + obj.find(".store-detail span").html() + "</div>");  // 创建信息窗口对象
            marker.addEventListener("mouseover", function (e) {
                //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
                this.openInfoWindow(infoWindow);
            });
            marker.addEventListener("click", function (e) {
                //alert("当前位置：" + this.getPosition().lng + ", " + this.getPosition().lat);
                var selectStoreCity = $('#selectStoreCity');
                var selectStoreArea = $('#selectStoreArea');
                var lng = this.getPosition().lng;
                var lat = this.getPosition().lat;
                //var selCity = $("#selectStoreCity").find("option:selected").val();
                //var selArea = $("#selectStoreArea").find("option:selected").val();
                storeItems.children().each(function (i, m) {
                    var item = $(m);
                    if (item.attr("data-longitude") == lng && item.attr("data-latitude") == lat) {
                        var cid = item.attr("data-city");
                        var aid = item.attr("data-area");
                        selectStoreCity.find('option').each(function () {
                            this.removeAttribute('selected');
                        });
                        selectStoreCity.find("option[value='" + cid + "']").attr('selected', true);
                        selectStoreArea.html("");
                        selectStoreArea.html($("#storeAreaOption option[data-city='" + cid + "']").clone());
                        selectStoreArea.find("option[value='" + aid + "']").attr('selected', true);
                        item.show();
                        $(m).click();
                    }
                    else {
                        item.hide();
                    }
                });
            });
        });
        storeItems.children().click(function () {
            var obj = $(this);
            // --------------------获取从弹出面板中选择的门店信息，并存储至隐藏域 2016-07-25 added by choon ---------------------------
            var storeId = obj.find(">input[type='radio']").val();
            var storeName = obj.find(">span").html();
            var storeAddress = obj.find(">div").find(">span").html();
            var storeTel = "";
            var storeTelText = obj.find(">div").text();
            if (storeTelText) {
                var textArr = storeTelText.split("：");
                if (textArr) {
                    storeTel = textArr[textArr.length - 1];
                }
            }
            $('#storeId').val(storeId);
            $('#storeName').val(storeName);
            $('#storeAddress').val(storeAddress);
            $('#storeTel').val(storeTel);
            // --------------------获取从弹出面板中选择的门店信息，并存储至隐藏域 2016-07-25 added by choon ---------------------------
            var longitude = obj.attr("data-longitude");
            var latitude = obj.attr("data-latitude");
            var point = new window.BMap.Point(longitude, latitude);  // 创建点坐标
            storeMap.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
        });

        $('.pop-close').click(function () {
            $('#j_popStoreInfo, .dialog-full').hide();
        });
        $('.store-others').click(function () {
            $('#j_popStoreInfo, .dialog-full').show();
            return false;
        });

        /* 门店地图绑定结束 */
    }
}

// 门店选择城市
function StoreCityChange() {
    var selCity = $("#selectStoreCity").find("option:selected").val();
    $("#selectStoreArea").html("");
    $("#selectStoreArea").html($("#storeAreaOption option[data-city='" + selCity + "']").clone());
    StoreAreaChange();
}

// 门店选择区域
function StoreAreaChange() {
    var selCity = $("#selectStoreCity").find("option:selected").val();
    var selArea = $("#selectStoreArea").find("option:selected").val();
    $("#storeItems").children().each(function (i, n) {
        var obj = $(n);
        if (obj.attr("data-city") == selCity && obj.attr("data-area") == selArea) {
            obj.show();
        }
        else {
            obj.hide();
        }
    });
}

function unitGanged() {
    var ail = $('#j_addrInfoListing');
    if (ail.get(0)) {
        var sltCity = ail.find('select[name=sltCity]')
            , sltArea = sltCity.siblings('select[name=sltArea]')
            , sltShop = sltCity.siblings('select[name=sltShop]');

        $.ajax({
            type: 'GET',
            cache: 'false',
            url: '/mall/GetAddressList',
            dataType: 'json',
            success: function (d) {
                var data = d.listCity,
                    dcLen = data.length,
                    addr = sltCity.siblings('address'),
                    addrName = addr.find('.addr-name'),
                    dArea = [],
                    dShop = [],
                    pHtml = '',
                    idx = 0;
                var _setChild = function (childObj, childArr) { // 设置子选项
                    var daLen = childArr.length;
                    var cHtml = '';

                    childObj[0].length = 0; // 清空子选项
                    for (var i = 0; i < daLen; i++) {
                        cHtml += '<option value="' + childArr[i] + '">' + childArr[i] + '</option>';
                    }
                    return cHtml;
                };
                var _setArea = function (list, index) { // 设置地区
                    var areas = list[index].listArea;
                    var dArr = [];
                    for (var i in areas) {
                        dArr[i] = areas[i].AreaName;
                    }
                    var sHtml = _setChild(sltArea, dArr);

                    sltArea.append(sHtml);
                    _setShop(areas, 0); // 默认选中第一个地区
                };
                var _setShop = function (list, index) { // 设置门店
                    var shops = list[index].listStore;
                    var dArr = [];
                    for (var i in shops) {
                        dArr[i] = shops[i].StoreName;
                    }
                    var sHtml = _setChild(sltShop, dArr);

                    sltShop.append(sHtml);
                    _setShopAddr(shops, 0); // 默认选中第一个门店
                };
                var _setShopAddr = function (list, index) { // 设置门店地址
                    addrName.val(list[index].StoreAddress);
                };

                if (data) {
                    for (var j = 0; j < dcLen; j++) { // 生成城市选项
                        if (d.IPAddress.indexOf(data[j].cityName) >= 0) {
                            idx = j;
                        }
                        pHtml += '<option value="' + data[j].cityName + '">' + data[j].cityName + '</option>';
                    }

                    sltCity.append(pHtml).on('change', function () { // 更改城市
                        var index = this.selectedIndex;
                        dArea = data[index].listArea;
                        _setArea(data, index);
                    });

                    sltArea.on('change', function () { // 更改区
                        var index = this.selectedIndex;
                        !dArea.length && (dArea = data[idx].listArea);
                        dShop = dArea[index].listStore;
                        _setShop(dArea, index);
                    });

                    sltShop.on('change', function () { // 更改店
                        var index = this.selectedIndex;
                        !dArea.length && (dArea = data[idx].listArea);
                        !dShop.length && (dShop = dArea[0].listStore);
                        _setShopAddr(dShop, index);
                    });

                    // 默认选中城市
                    _setArea(data, idx);
                    sltCity.find('option').eq(idx).prop('selected', 'selected');
                }
            },
            error: function (res) {
            }
        });
    }
}