/*!
 * 猜你喜欢
 * v: 0.0.1
 * d: 2016-4-29
*/

_util.file.load((_env === 'dev' ? '' : _uzw.domain.cdnRandom()) + '/content/v1/styles/com/guesslike.css');

function guessLike(node, num, whOBJ, dateNum) {
    var sg, snode, _getGuessData, hdMain;
    var fixDate = function (str) { //处理日期
        var arr = str.split(',');
        var arrn = [];

        dateNum = dateNum || 2;

        if (arr && arr.length) {
            for (var i in arr) {
                arrn.length < dateNum && arrn.push(arr[i].substr(5));//2015/02/25 取02/25
            }
        }
        return arrn.join(',');
    };
    var _checkItemLens = function () {
        var itemsLen = sg.find('.gl-item').length;
        if (itemsLen > 3) {
            sg.find('.no-more').remove();
        } else {
            var nomore = sg.find('.no-more');
            if (!nomore.get(0)) {
                sg.find('.guess-like-items').after('<p class="no-more tc f16 yahei lh2 pb10">今天为您推荐的旅行线路已看完，请明天再来看看吧</p>');
            }
        }
        if (itemsLen <= 4) {
            sg.find('.btn-change').addClass('btn-off');
        } else {
            sg.find('.btn-change').removeClass('btn-off');
        }
    };

    if (typeof whOBJ === 'undefined') {
        whOBJ = {
            width: 310,
            height: 230
        };
    }
    sg = $('#' + node);
    if (!sg.get(0)) {
        sg = $('.' + node);
    }
    if (sg.get(0)) {

        snode = "";
        snode += ("<div id='j_guessLikeBox' class='guess-like-box slice-mod mt10 box-fix'>");
        snode += ("<h2 class='mod-hd clearfix'><span class='hd-main fl'><i class='hd-icon vm'></i><em class='hd-cont red f16 vm'>猜你喜欢</em></span><span class='btn-change pointer blue f16 fr'><i class='icon-refresh mr5 vm icon-common-main png'></i><em class='vm'>换一批</em></span></h2>");
        snode += ("<div class='mod-bd'><div class='guess-like-items clearfix'></div></div>");
        snode += ("</div>");
        sg.html(snode);

        hdMain = sg.find('.mod-hd').find('.hd-main');
        if (!_uzw.user.userid) {
            if (!hdMain.find('.login-tips').get(0)) {
                hdMain.append('<span class="login-tips f999 f14 ml10 vm">为了更精准的给您推荐线路，建议您先<a href="https:' + _uzw.domain.u + '/reguser" class="btn-login blue">登录</a>。</span>');
            }
        } else {
            if (hdMain.find('.login-tips').get(0)) {
                hdMain.find('.login-tips').detach();
            }
        }

        _getGuessData = function () {
            $.ajax({
                type: 'GET',
                url: _uzw.domain.wapi + '/api/UzaiInterest/GetUserInterest',
                data: { 'userId': _uzw.user.userid || 0, 'city': _ug.cityID, 'number': num || 30, 'w': whOBJ.width, 'h': whOBJ.height },
                dataType: 'jsonp',
                beforeSend: function () {
                    sg.find('.no-more').remove();
                    sg.find('.guess-like-items').empty().addClass('guess-like-items-ing');
                },
                success: function (data) {
                    var ckName = 'uzwGuessLikeOfDislike';
                    var ck = _uzw.cookie.get(ckName);
                    var pidArr = [];
                    var pidLen = 0;

                    if (ck) {
                        pidArr = ck.split('|');
                        pidLen = pidArr.length;
                    }

                    if (data && data.length) {
                        setTimeout(function () {
                            var sb = "";
                            var showNum = 4;

                            $.each(data, function (i, item) {
                                var url = item.ProductURL + '?retype=ItemHistory';
                                var pid = item.ProductId;
                                var j, flag;

                                for (j = 0, flag = true; j < pidLen; j++) {
                                    if (pidArr[j] == pid) { // 被标记不喜欢
                                        flag = false;
                                        showNum++;
                                    }
                                }

                                if (flag) {
                                    sb += "<a href='" + url + "' class='gl-item " + (i >= showNum ? "hide" : "") + " ' data-pid='" + pid + "' target='_blank'>";
                                    sb += "<p class='item-pic'>";
                                    sb += "<span class='dislike' data-fromType='" + item.FromType + "'><i class='icon-dislike mr5 vm icon-common-main png'></i>不喜欢</span>";
                                    sb += "<img  src='" + item.PicUrl.replace("http://", "//") + "' alt='' class='g10 block'>";
                                    sb += "</p>";
                                    sb += "<dl class='item-cont'>";
                                    sb += "<dt class='item-hd f14' title='" + item.ProductName + "'>" + item.ProductName + "</dt>";
                                    sb += "<dd class='item-ft clearfix'>";
                                    sb += "<span class='item-date f666 fl mt5'>班期：" + fixDate(item.GoDate) + "</span>";
                                    sb += "<span class='item-price f14 fr'><i class='red f16'>￥<em>" + item.MaxPrice + "</em></i>起</span>";
                                    sb += "</dd>";
                                    sb += "</dl>";
                                    sb += "</a>";
                                }
                            });

                            if (sb) {
                                sg.find('.guess-like-items').html(sb);

                                //remove item & get item
                                sg.find('.dislike').on('click', function () {
                                    var oo = $(this);
                                    var oop = oo.parents('.gl-item');
                                    var pid = oop.attr('data-pid');
                                    var nextHide = oop.nextAll('.gl-item:hidden').eq(0);
                                    var paras;
                                    var _delItem = function() {
                                        oop.css({ 'width': '0', 'height': '0', 'margin-left': '0', 'margin-right': '0', 'opacity': '0' });
                                        setTimeout(function () {
                                            oop.remove();
                                            //补全一个
                                            if (sg.find('.gl-item:visible').get(0)) {
                                                nextHide.show();
                                            } else {
                                                sg.find('.gl-item:hidden').each(function(index) {
                                                    var oThis = $(this);
                                                    if (index < 4) {
                                                        oThis.show();
                                                    }
                                                });
                                            }
                                            _checkItemLens();
                                        }, 500);
                                    };

                                    if (oo.hasClass('btn-off')) {
                                        return;
                                    }

                                    if (_uzw.user.userid) {
                                        paras = {
                                            "userId": _uzw.user.userid,//用户ID
                                            "city": 0,//发起请求的城市站点，为0时取产品的出发城市
                                            "channel": 1,//信息渠道：1 PC、2 IPhone、3 Ipad、4 Android、5 M站
                                            "type": 7, //来源类型：1浏览历史、2我的收藏、3我的咨询、4意向订单、5支付订单、6关键词搜索、7自主点击不喜欢
                                            "productIds": pid,//productIds：相关产品ID，多个产品ID可以用","分隔
                                            "fromtype": oo.attr('data-fromType')
                                        };
                                        $.ajax({
                                            type: 'post',
                                            url: _uzw.domain.wapi + "/api/UzaiInterest/InsertUserInterest",
                                            data: paras,
                                            dataType: 'jsonp',
                                            success: function (msg) {
                                                if (msg > 0) {
                                                    _delItem();
                                                } else {
                                                    alert('操作失败！');
                                                }
                                            },
                                            error: function () { }
                                        });
                                    } else {
                                        _delItem();
                                        pidArr.push(pid);
                                        _uzw.cookie.set(ckName, pidArr.join('|'), 1); // 标记不喜欢的pid
                                    }

                                    return false;
                                });

                            }

                            _checkItemLens();
                        }, 800);
                    } else {
                        _checkItemLens();
                    }

                },
                complete: function () {
                    sg.find('.guess-like-items').removeClass('guess-like-items-ing');
                }
            });
        };

        _getGuessData();

        //refresh
        sg.find('.btn-change').on('click', function () {
            var o = $(this);
            var items = sg.find('.gl-item');
            var itemLens = items.length;
            var pagers = itemLens % 4 === 0 ? Math.floor(itemLens / 4) : Math.floor(itemLens / 4) + 1; //页数

            var idx = parseInt(o.attr('data-index')) || 1;//当前页码
            var cidx = (idx >= pagers) ? 1 : (idx + 1);  //下一页码

            var start = (cidx - 1) * 4;
            var end = cidx * 4;

            items.hide();
            sg.find('.gl-item').filter(function (i) {
                return i >= start && i < end;
            }).show();

            o.attr('data-index', cidx + '');

        });
    }
}



