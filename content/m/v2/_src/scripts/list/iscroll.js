"use strict";

var myScroll;
var _y = 0;

//装载url 参数
var paramUrl = function (page) {
    var box = $('#j_list');
    var url = document.location.href.replace('#', '');
    var day = _util.url.get('day');
    var price = _util.url.get('price');
    var date = _util.url.get('date');
    var order = _util.url.get('order');
    var ext = _util.url.get('ext');

    var typeNode = box.find('.hd').find('.on');
    var type = typeNode.attr('data-type');

    var city = $('body').attr('data-city');
    var tid = $('body').attr('data-id');
    var name = $.trim($('body').attr('data-name'));

    var sb = [];
    sb.push('page=' + page);
    if (type) {
        sb.push('queryType=' + type);
    }
    sb.push('city=' + city);
    sb.push('TravelClassID=' + tid);
    if (name) {
        sb.push('searchName=' + name);
    }

    if (url.indexOf('word') > -1) {
        var word = _util.url.get('word');
        if (word) {
            sb.push('word=' + word);
        }
    } else if (url.indexOf('wd') > -1) {
        var wd = _util.url.get('wd');
        if (wd) {
            sb.push('wd=' + wd);
        }
    } else if (url.indexOf('keyword') > -1) {
        var keyword = _util.url.get('keyword');
        if (keyword) {
            sb.push('keyword=' + keyword);
        }
    } else {
        if (day) {
            sb.push('day=' + day);
        }

        if (price) {
            sb.push('price=' + price);
        }

        if (date) {
            sb.push('date=' + date);
        }

        if (ext) {
            sb.push('ext=' + ext);
        }

        if (order) {
            sb.push('order=' + order);
        }
    }

    var params = _util.array.unique(sb).join('&');

    return params;
};

//ajax加载数据
var loadData = function (page) {
    var box = $('#j_list');
    var params = paramUrl(page);

    //10.1.13.203:9060
    $.ajax({
        type: 'GET',
        url: _uzm.domain.m + "/ashx/GetAppChannel.ashx?" + params,
        dataType: 'jsonp',
        success: function (data) {
            if (data) {

                var ul = box.find('.bd');
                var st = [];

                data['ProductList'].forEach(function (item, idx, arr) {
                    var pprice = item.CheapPrice;

                    var psrc = item.ImageURL;
                    var pid = item.ProductId;
                    var pname = item.ProductName;
                    if (pname) {
                        pname = pname.length > 20 ? pname.substring(0, 20) + '...' : pname;
                    }
                    var ptid = item.UzaiTravelClassID;
                    var pDate = item.GoDate;
                    var pTravelNum = item.GoTravelNum;

                    var pBaceCash = item.BackCash;
                    var pSavePrice = item.SavePrice;
                    // 修正m站搜索列表第二页取不到产品链接的问题
                    var pUrl = item.ProductURL;

                    var iconType = "";
                    if (ptid == '自由行') {
                        iconType = "<i class='icon zyx'>自由行</i>";
                    } else if (ptid == '跟团游') {
                        iconType = "<i class='icon gty'>跟团游</i>";
                    }

                    st.push("<li><a href='" + pUrl + "'>");
                    st.push("<div class='fl pic'><img width='92' src='" + psrc + "'>" + iconType + "</div>");
                    st.push("<div class='txt'>");
                    st.push("<p class='p1 f14'>" + pname + "</p>");
                    st.push("<p class='p2 clearfix'>");
                    st.push("<span class='fl'>");
                    if (pBaceCash) {
                        st.push("<i>" + pBaceCash + "</i> ");
                    }
                    if (pSavePrice) {
                        st.push("<i>" + pSavePrice + "</i>");
                    }
                    st.push("</span>");
                    st.push("<span class='fr f60 f13'>￥<b class='f17'>" + pprice + "</b>元起</span>");
                    st.push("</p>");
                    st.push("<p class='p3 clearfix f10 f666'>");
                    st.push("<span class='fl'>班期：" + pDate + "...</span>");
                    st.push("<span class='fr f10'>已有" + pTravelNum + "人出行</span>");
                    st.push("</p>");
                    st.push("</div>");
                    st.push("</a></li>");
                });


                ul.append(st.join(''));

                //添加当前页码标识
                box.find('.bd').attr('data-page', page);

            } else {
                $('#pullUp1').remove();
                if ($('#j_listNone').get(0)) {
                    return;
                }
                box.find('.bd').after("<div id='j_listNone' class='lh2 tc f20'>没有了...</div>");
            }
        },
        error: function (res) {

        },
        complete: function (res) {

            setTimeout(function () {
                //刷新列表
                myScroll.refresh();
            }, 500);
        }
    });
};

function pullUpAction(listID) {
    var page = $('#' + listID).find('.bd').attr('data-page');
    page = page || 1;
    loadData(parseInt(page, 10) + 1);
}

function loaded(wraperID, listID, pullUpID) {

    var pullUpEl = document.getElementById(pullUpID);

    myScroll = new window.iScroll(wraperID, {
        useTransition: true,
        onRefresh: function () {
            //console.log('onRefresh');

            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = 'init';//载入中
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉显示更多...';
            }
        },
        onScrollStart: function (eve) {
            //console.log('onScrollStart');
            var touch = eve.touches[0];
            _y = touch.pageY;
        },
        onScrollMove: function (eve) {

            var pullUpOffset = null;
            if (!pullUpEl) {
                pullUpOffset = document.body.scrollHeight;
            } else {
                pullUpOffset = pullUpEl.offsetHeight;
            }

            //console.log(pullUpOffset);

            //console.log('onScrollMove');
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';//载入释放前完成提示
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = 'init';//初始&载入完成后提示
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉显示更多...';
                this.maxScrollY = pullUpOffset;
            }
            var touch = eve.touches[0];
            var pointY = touch.pageY;

            if (pointY > _y) {
                scrollBar('up', pointY - _y);
                //$('.tit').text('向上滑' + (pointY - _y));
            } else {
                scrollBar('down', _y - pointY);
                //$('.tit').text('向下滑' + (_y - pointY));
            }

        },
        onScrollEnd: function (eve) {
            //console.log('onScrollEnd');
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载更多...';
                pullUpAction(listID);	// Execute custom function (ajax call?)
            }
        }
    });

    setTimeout(function () {
        document.getElementById(wraperID).style.left = '0';
    }, 800);
}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () {
    loaded('wrapper1', 'thelist1', 'pullUp1');
}, false);

function scrollBar(flag, distance) {
    var box = $('#j_list');
    var ohd = box.children('.hd');
    if (flag === 'up') {
        $('#j_ft').css({ 'bottom': '0' });
        if (distance >= 47) {
            ohd.css({ 'top': '0' });
            if (!ohd.get(0)) {
                $('#wrapper1').css({ 'top': '0' });
            } else {
                $('#wrapper1').css({ 'top': '47px' });
            }
        }
    } else if (flag === 'down') {
        $('#j_ft').css({ 'bottom': '-48px' });
        ohd.css({ 'top': '-47px' });
        $('#wrapper1').css({ 'top': '0' });
    }
}