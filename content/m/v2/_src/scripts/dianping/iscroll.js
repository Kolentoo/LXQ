"use strict";


var myScroll;
var _y = 0;

//ajax加载数据
var loadData = function (page) {

    var box = $('#j_dianping');
    $.ajax({
        type: "GET",
        url: "/ashx/GetDaRenList.ashx?startcity=2&PageIndex=" + page,
        dataType: 'json',
        success: function (msg) {

            if (msg) {
                var data = msg.DaRenList;

                if (data && data.length) {

                    var ul = box.find('.dp-list');
                    var st = [];
                    data.forEach(function (item,idx,arr) {
                        // _util.unicode.un
                        var did = item.DaRenID;
                        var pid = item.ProductID;
                        var pUrl = item.ProductUrl;
                        var pcomment = _util.unicode.un(item.UsrComment);
                        var puname = _util.unicode.un(item.UserName);

                        var pimgs = item.ListImg;
                        var pdate = item.GoDate;

                        var prate = item.UsrSatisfactionRate;

                        var phit = item.DingNum;
                        var pavator = item.UserImg;
                        var pdesti = _util.unicode.un(item.TreeName);
                        var pcomImg = item.CommentImages;
                        var ptype = _util.unicode.un(item.ProductTypeDesc);
                        var proName = _util.unicode.un(item.ProductName);

                        var cImgs = [];
                        for (var j = 0; j < pcomImg.length; j++) {
                            var iimg = pcomImg[j];
                            cImgs.push("<img src='" + iimg + "' />");
                        }

                        st.push("<li data-id='" + did + "'>");
                        st.push("<div class='hd clearfix mb5'><img src='" + pavator + "' width='35' class='vm mr5' /><span class='f18 f33'>" + puname + "</span> <span class='f10 f999'>" + pdate + "</span> <span class='green fr f16 fn-bs'>" + pdesti + "</span></div>");
                        st.push("<div class='bd mb10 f13'>" + pcomment + "</div>");
                        st.push("<div class='pic '>");
                        st.push("<div class='item'>");
                        st.push(cImgs.join(''));//点评图片列表节点
                        st.push("</div>");
                        st.push("</div>");
                        st.push("<div class='ft clearfix'>");
                        st.push("<span class='fl zan fn-bs'><i class='fn-bs'></i><span class='ding' id='ding" + did + "'>赞" + phit + "</span></span>");
                        st.push("<span class='fl view '><i class='fn-bs'></i><a href='" + pUrl + "'>查看线路</a></span>");
                        st.push("</div>");
                        st.push("</li>");
                    });
                    
                    ul.append(st.join(''));

                    //添加当前页码标识
                    ul.attr('data-page', page);

                }

            } else {
                $('#pullUp1').remove();
                if ($('#j_listNone').get(0)) {
                    return;
                }
                box.find('.dp-list').after("<div id='j_listNone' class='lh2 tc f20'>没有了...</div>");
            }
        },
        complete: function () {
            setTimeout(function () {
                //刷新列表
                myScroll.refresh();
            }, 1000);
        },
        error: function () {
            //console.log('error');
        }
    });

};

function pullUpAction(listID) {
    var page = $('#' + listID).find('.dp-list').attr('data-page');
    page = page || 1;
    loadData(parseInt(page, 10) + 1);
}

function loaded(wraperID, listID, pullUpID) {
    var pullUpEl = document.getElementById(pullUpID);
    var pullUpOffset = pullUpEl.offsetHeight;

    myScroll = new window.iScroll(wraperID, {
        useTransition: true,
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = 'init';//载入中
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉显示更多...';
            }
        },
        onScrollStart: function (eve) {
            var touch = eve.touches[0];
            _y = touch.pageY;
        },
        onScrollMove: function (eve) {
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
                //scrollBar('up', pointY - _y);
                //$('.tit').text('向上滑' + (pointY - _y));
            } else {
                //scrollBar('down', _y - pointY);
                //$('.tit').text('向下滑' + (_y - pointY));
            }

            //测试

        },
        onScrollEnd: function (eve) {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载更多...';
                pullUpAction(listID);	// Execute custom function (ajax call?)
            }
        }
    });

    setTimeout(function () { document.getElementById(wraperID).style.left = '0'; }, 800);
}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(loaded('wrapper1', 'thelist1', 'pullUp1'), 200);
}, false);

function scrollBar(flag, distance) {
    if (flag === 'up') {
        $('#j_ft').css({ 'bottom': '0' });
        if (distance >= 47) {
            $('#j_list .hd').css({ 'top': '0' });
            $('#wrapper1').css({ 'top': '47px' });
        }
    } else if (flag === 'down') {
        $('#j_ft').css({ 'bottom': '-48px' });
        $('#j_list .hd').css({ 'top': '-47px' });
        $('#wrapper1').css({ 'top': '0' });
    }
}