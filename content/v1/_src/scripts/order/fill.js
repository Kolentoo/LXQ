$(function() {
    $('#j_globalSidebar').remove();
    //日历
    var date = new Date();
    var year = date.getFullYear();
    var mon = date.getMonth() + 1;

    calendar(year + '-' + mon, '.calendar');
    calendar(year + '-' + parseInt(mon + 1), '.calendar');
    var data = [{
        'TourDateText': '2017-4-1',
        'AdultPrice': 100
    }, {
        'TourDateText': '2017-4-2',
        'AdultPrice': 9999
    }, {
        'TourDateText': '2017-4-23',
        'AdultPrice': 9999
    }, {
        'TourDateText': '2017-4-24',
        'AdultPrice': 9999
    }, {
        'TourDateText': '2017-4-9',
        'AdultPrice': 9999
    }];

    for (var i = 0; i < data.length; i++) {
        var dateprice = '[data-time=' + data[i].TourDateText + ']';
        //价格
        var price = '¥' + data[i].AdultPrice;
        $(dateprice).find('.price').text(price);
    }

    $('.calendar-box li').click(function() {
        if ($(this).attr('data-time')) {
            if ($(this).find('.price').html()) {
                $('.calendar-box li').removeClass('hover');
                $(this).addClass('hover');
                $('#user_calendar').val($(this).attr('data-time').replace(/-/g, '/'));
                $('#user_calendar').blur();
            }
        }
    });

    //弹层
    $('.layer .return, .layer .close').click(function() {
        $('.layer, .bg000').addClass('hide');
    });
    //弹层
    $('.layer1 .close').click(function() {
        $('.layer1, .bg000').addClass('hide');
    });
    $('.main7 .quanping').click(function() {
        $('.layer1, .bg000').removeClass('hide');
    });

    //  数量加减操作
    $('.num-btn').on('click', function() {
        var o = $(this);
        var os = o.siblings('.num-btn');
        var op = o.parents('.j_bookNum');
        var maxnum = op.attr('data-maxnum') || 99;
        var minnum = op.attr('data-minnum') || 0;
        var t = o.siblings('.num-box');
        var v = parseInt(t.val(), 10);
        if (o.hasClass('btn-up')) {
            //加操作
            if (v < maxnum) {
                t.val(++v);
                os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用减按钮

                if (v == maxnum) { // 禁用加按钮
                    o.addClass('btn-off');
                }
            }
        } else if (o.hasClass('btn-down')) {
            //减操作
            if (v > minnum) {
                t.val(--v);
                os.hasClass('btn-off') && os.removeClass('btn-off'); // 启用加按钮

                if (v == minnum) {
                    o.addClass('btn-off'); // 禁用减按钮
                }
            }
        }

        return false;
    });
    //导航操作
    bookNav();
    _uzw.ui.tab('notice-tab');

    //性别
    $('.radio-list').click(function() {
        $(this).find('.radio-item').removeProp('checked').parents('.radio-on').removeClass('radio-on');
        $(this).addClass('radio-on').siblings().removeClass('radio-on');
        $(this).find('.radio-item').prop('checked', 'checked');
    });
    //出行人
    var travel = 3;
    $('.J_travel_people .check-list').click(function() {
        if ($(this).hasClass('check-on')) {
            travel++;
            $(this).removeClass('check-on');
            $(this).find('.check-item').removeProp('checked');
        } else {
            if (travel <= 0) {
                var label = $(this).find('.lable');
                label.removeClass('hide');
                setTimeout(function() {
                    label.addClass('hide');
                }, 2000);
                return false;
            }
            travel--;
            $(this).addClass('check-on');
            $(this).find('.check-item').prop('checked', 'checked');
        }
    });
    $('.conserve').click(function() {
        if ($(this).hasClass('check-on')) {
            $(this).removeClass('check-on');
            $(this).find('.check-item').removeProp('checked');
        } else {
            $(this).addClass('check-on');
            $(this).find('.check-item').prop('checked', 'checked');
        }
    });

    //同意
    $('.agree').on('click', function() {
        var o = $(this);
        var dBtn = $('.d-btn');
        var agreeCheck = $('.agree-check');
        if (o.hasClass('check-on')) {
            //dBtn.addClass('btn-out');
            o.removeClass('check-on');
        } else {
            //dBtn.removeClass('btn-out');
            o.addClass('check-on');
        }
    });

    //取件地址
    $('.main8_right_mqu li').click(function() {
        $(this).addClass('radio-on').siblings().removeClass('radio-on');
    });
    $('.main8_right_tqu li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });

    //提示实例
    $('.book-tips').on('mouseenter', function() {
        var o = $(this);
        o.find('.book-tips-box').removeClass('hide');
    }).on('mouseleave', function() {
        var o = $(this);
        o.find('.book-tips-box').addClass('hide');
    });

    //select下拉框
    $('.select').click(function() {
        $('.select').removeClass('select_h');
        $(this).addClass('select_h');
        return false;
    });
    $('.select li').click(function() {
        var v = $(this).html();
        $(this).parents('.select').find('span').html(v).css('color', '#666666').css('fontSize', '14px');
        $('.select').removeClass('select_h');
        return false;
    });
    $(document).click(function() {
        $('.select').removeClass('select_h');
    });
});

function bookNav() {
    var w = $(window);
    var wh = w.height();
    var bh = $('body').height();
    var bookSum = $('.book-sum');
    var bsH = bookSum.outerHeight(true);
    var sideNav = $('.book-nav');
    var navH = sideNav.outerHeight(true);
    var simpleFoot = $('.j_simpleFooter');
    var footer = $('.simple-footer');
    var navTopDist = wh - wh * 17 / 100 - navH;
    var bsTop, ftTop, bsEnd, navEnd;

    if (bookSum.get(0)) {
        bsTop = bookSum.offset().top;
    }

    $(window).scroll(function() {
        var st = w.scrollTop();

        if (footer.get(0)) {
            ftTop = footer.offset().top;
            bsEnd = ftTop - bsH - 40;
            navEnd = ftTop - 40 - navH;
        }

        if (st >= bsTop) {
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
                'bottom': '20%',
                'top': 'auto'
            });
        }
    }).trigger('scroll');

    $('.book-kf').on('mouseenter', function() {
        $('.kf-tips').removeClass('hide');
    }).on('mouseleave', function() {
        $('.kf-tips').addClass('hide');
    });

    $('.book-back').on('click', function() {
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
$(function() {
    // 预订按钮
    $('#btnSubmit').on('mousedown', function() {
        var o = $(this);
        var inforList = $('.infor-list');
        var inputs = inforList.find('.infor-text');
        var flag = true;
        var active = $(document.activeElement);

        if (o.hasClass('btn-out')) {
            return false;
        }
        if (active.is("input")) {
            active.trigger("blur");
        }

        flag = _submitCheck(inputs);

        console.log(flag);
        if (!$('.agree').hasClass('check-on') && flag) {
            rootNode.animate({
                scrollTop: $('.agree').offset().top - 10
            }, 800);
            $('.agree').addClass('check-on');
            $('.back-tips .tips-read .lable').show();
            setTimeout(function() {
                $('.agree').removeClass('check-on');
                $('.back-tips .tips-read .lable').hide();
            }, 500);
            setTimeout(function() {
                $('.agree').addClass('check-on');
                $('.back-tips .tips-read .lable').show();
            }, 750);
            setTimeout(function() {
                $('.agree').removeClass('check-on');
                $('.back-tips .tips-read .lable').hide();
            }, 1000);
            setTimeout(function() {
                $('.agree').addClass('check-on');
                $('.back-tips .tips-read .lable').show();
            }, 1250);
            setTimeout(function() {
                $('.agree').removeClass('check-on');
                $('.back-tips .tips-read .lable').hide();
            }, 1500);
            return false;
        }

    });

    var regName = /^[\u4e00-\u9fa5A-Za-z]*$/;
    var regLetter = /^[A-Za-z]+$/;
    var regNumber = /^1[34578]\d{9}$/;
    var regNumLetter = /^[A-Za-z\d]+$/;
    var regDate = /(?!0000)[0-9]{4}\/(([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|1[0-9]|2[0-8])|([13-9]|0[13-9]|1[0-2])\/(29|30)|([13578]|0[13578]|1[02])\/31)/;
    var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var isIDCard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    var flight = /^[A-Za-z0-9]+$/;
    var wechat = /^[a-zA-Z\d_-]{5,}$/;
    var zip = /[1-9]\d{5}(?!\d)/; //邮编正则
    var rootNode = $('body');

    // 表单验证
    var sName = '.j_checkName'; // 中英文姓名
    var sEnName = '.j_checkEnName'; // 英文姓名
    var sMobile = '.j_checkMobile'; // 手机号
    var sPicCode = '.j_checkPicCode'; // 图形验证码
    var sMsgCode = '.j_checkMsgCode'; // 短信验证码
    var sEmail = '.j_checkEmail'; // 电子邮箱
    var sIdCard = '.j_checkIdCard'; // 身份证
    var sDate = '.j_checkDate'; // 年月日
    var swechat = 'j_wechat'; // 微信


    var _submitCheck = function(inputs) {
        var flag = true;
        inputs.each(function() {
            var o = $(this);
            var op = o.parents('.infor-list');
            var status = op.find('.label-tips.hide').get(0);
            flag = _unitCheck(o);
            if (!flag) {
                var itop = op.offset().top;
                rootNode.animate({
                    scrollTop: itop - 10
                }, 800);
            }

            return flag;
        });
        return flag;
    };

    function _unitCheck(o) {
        var status = true;
        var op = o.parents('.infor-list');

        if (o.hasClass('j_checkName')) {
            if (o.val() !== "" && regName.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_checkDate')) {
            if (o.val() !== "" && regDate.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_checkMobile')) {
            if (o.val() !== "" && regNumber.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_checkEmail')) {
            if (o.val() !== "" && regEmail.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_checkEnName')) {
            if (o.val() !== "" && regLetter.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_checkIdCard')) {
            if (o.val() !== "" && isIDCard.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('J_flight')) {
            if (o.val() !== "" && flight.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_wechat')) {
            if (o.val() !== "" && wechat.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        } else if (o.hasClass('j_zip')) {
            if (o.val() !== "" && zip.test(o.val())) {
                status = true;
            } else {
                status = false;
            }
        }


        var tips = op.find('.label-tips');
        if (status) {
            tips.addClass('hide');
            o.removeClass('input-err');
        } else {
            tips.removeClass('hide').find('.p1').text(tips.attr('data-infoerror'));
            o.addClass('input-err');
        }
        return status;
    }

    rootNode.on('blur', 'input', function() {
        _unitCheck($(this));
    });
});
