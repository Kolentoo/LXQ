"use strict";

var lottery = {};

lottery.fixInit = function (lotteryPool) {
    var myexports = {};

    //失败
    myexports.popLotterFail = function () {
        var boxFail = $('#j_popFailBox');
        _uzm.mask.show();
        var _unitClose = function () {
            _uzm.mask.hide();
            boxFail.css({ 'opacity': 0, 'z-index': -1 });
        };
        boxFail.css({ 'opacity': 1, 'z-index': 1000 }).find('.btn-anew').on('click', function () {
            _unitClose();
        });
        boxFail.find('.pop-close').on('click', function () {
            _unitClose();
        });
    };
    //成功
    myexports.popLotterSuccess = function (key, url, prizeName) {
        var boxSuccess = $('#j_popSuccessBox');
        boxSuccess.find('a').attr('href', url);
        boxSuccess.find('img').attr('src', key);

        boxSuccess.find('.yellow').text(prizeName);
        boxSuccess.find('.txt-wrap').find('.f15').text(prizeName);

        _uzm.mask.show();
        var _unitClose = function () {
            _uzm.mask.hide();
            boxSuccess.css({ 'opacity': 0, 'z-index': -1 });
        };
        boxSuccess.css({ 'opacity': 1, 'z-index': 1000 }).find('.btn-anew').on('click', function () {
            //location.href = url;
            _unitClose();
        });
        boxSuccess.find('.pop-close').on('click', function () {
            _unitClose();
        });
    };

    myexports.popLotterSuccessCoupon = function (key, url, prizeName) {
        var boxSuccess = $('#j_popSuccessBox');
        boxSuccess.find('a').attr('href', url);
        boxSuccess.find('img').attr('src', key);

        boxSuccess.find('.yellow').text(prizeName);
        boxSuccess.find('.txt-wrap').find('.f15').text(prizeName);

        _uzm.mask.show();
        var _unitClose = function () {
            _uzm.mask.hide();
            boxSuccess.css({ 'opacity': 0, 'z-index': -1 });
        };
        boxSuccess.css({ 'opacity': 1, 'z-index': 1000 }).find('.btn-confirm').on('click', function () {
            //location.href = url;
            //_unitClose();
        });
        boxSuccess.find('.pop-close').on('click', function () {
            _unitClose();
        });
    };

    //    myexports.popLotterSuccessCoupon = function (key, url) {
    //        var boxSuccess = $('#j_popSuccessBoxCoupon');
    //        //boxSuccess.find('a').attr('href', url);
    //        boxSuccess.find('img').attr('src', key);
    //        _uzm.mask.show();
    //        var _unitClose = function () {
    //            _uzm.mask.hide();
    //            boxSuccess.css({ 'opacity': 0, 'z-index': -1 });
    //        }
    //        boxSuccess.css({ 'opacity': 1, 'z-index': 1000 }).find('.btn-confirm').on('click', function () {
    //            _unitClose();
    //        });
    //        boxSuccess.find('.pop-close').on('click', function () {
    //            _unitClose();
    //        });
    //    }

    myexports.fixInit = function (lotteryPool) {

        $(".lotteryBtn").rotate({
            bind: {
                click: function () {
                    var oThis = $(this);
                    var phoneId = $("#hphoneId").val();
                    var source = $("#hsource").val();
                    var version = $("#hversion").val();
                    var userId = $("#huserId").val();

                    if (oThis.hasClass('btn-off')) {
                        return;
                    } else {
                        oThis.addClass('btn-off');
                    }

                    $.ajax({
                        url: '/Sign/SignLuckySubmit/',
                        type: 'Post',
                        dataType: 'json',
                        async: true,
                        data: { version: version, phoneid: phoneId, source: source, userId: userId, ran: Math.random() },
                        success: function (data) {
                            var ds = parseInt(data.Status, 10);
                            if (ds === 0) {
                                //跳到登陆页
                                location.href = data.Url;
                                return;
                            }
                            else if (ds === -2) {
                                //不是移动端跳到下载
                                location.href = data.Url;
                                return;
                            }
                            else if (ds === -1) {
                                //积分不足
                                _uzm.pop.toast("U点不足");
                                oThis.removeClass('btn-off');
                                return;
                            }
                            else {
                                var STA = $("#SignTotalAmount");
                                STA.text(parseInt(STA.text(), 10) - 20);
                                myexports.init(parseInt(data.Position, 10), lotteryPool, ds, data.Url, data.PrizePic, data.PrizeType, data.PrizeName);
                            }
                        }
                    });
                }
            }
        });
    };


    myexports.init = function (key, lotteryPool, status, url, pic, prizeType, prizeName) {
        var lotteryBtn = $('.lotteryBtn');
        var rotateNode = $('#j_lotterStar');
        var unitAngle = 45;

        $('#j_popFailBox').css({ 'opacity': 0, 'z-index': -1 });
        var timeOut = function () {  //超时函数
            rotateNode.rotate({
                angle: 0,
                duration: 10000,
                animateTo: 6 * 360, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
                callback: function () {
                    if (status === 2) {
                        if (prizeType === 2) {
                            //非通用券直接发放到个人中心，不跳转到发短信
                            myexports.popLotterSuccessCoupon(pic, url);
                        }
                        else {
                            //通用券跳转到发短信页面
                            myexports.popLotterSuccess(pic, url);
                        }
                    } else if (status === 3) {
                        myexports.popLotterFail();
                    }
                    lotteryBtn.removeClass('btn-off');
                }
            });
        };
        var rotateFunc = function (awards, angle, text, status, url, pic, prizeType, prizeName) {  //awards:奖项，angle:奖项对应的角度
            rotateNode.stopRotate();
            rotateNode.rotate({
                angle: 0,
                duration: 5000,
                animateTo: angle + (4 * 360), //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
                callback: function () {
                    if (status === 2) {
                        if (prizeType === 2) {
                            //非通用券直接发放到个人中心，不跳转到发短信
                            myexports.popLotterSuccessCoupon(pic, url, prizeName);
                        }
                        else {
                            //通用券跳转到发短信页面
                            myexports.popLotterSuccess(pic, url, prizeName);
                        }
                    } else if (status === 3) {
                        myexports.popLotterFail();
                    }
                    lotteryBtn.removeClass('btn-off');
                }
            });
        };
        if (parseInt(key, 10) === 0) {
            timeOut();
        } else {
            rotateFunc(key, key * unitAngle, lotteryPool[key], status, url, pic, prizeType, prizeName);
        }
    };


    myexports.fixInit(lotteryPool);
};

