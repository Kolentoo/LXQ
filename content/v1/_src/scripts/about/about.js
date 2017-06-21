$(function () {
    _uzw.ui.tab('j_tabJob');
    _uzw.ui.tab('j_cooperate');
    _uzw.ui.tab('recruit-tab');
    sidebarSwitch();
    branchMap();
    memberPager();
    cooperate();
    uzLazy(['zx-dynamic', 'honor-con']);
    _uzw.ui.tab('j_honor', function(idx, obj) {
        var imgs = obj.find('.bd').find('.item').eq(idx).find('.certificate').find('img');
        imgs.each(function(){
            var img = $(this);
            img.attr('src', img.attr('data-original'));
        });
    });

});

function sidebarSwitch() {
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

    sidebar.find('.sub-group').on('click', '.sub-hd', function () {
        var oThis = $(this);
        var sl = oThis.siblings('.sub-list');
        var sg = oThis.parent('.sub-group');
        if (sg.hasClass('sub-group-pack')) {
            sg.removeClass('sub-group-pack');
            sl.show();
        } else {
            sg.addClass('sub-group-pack');
            sl.hide();
        }
    });
}

function branchMap() {
    var mw = $('#j_mapWrap');
    var bt = $('#j_branchTab');
    var _branchMarker = function (str) {
        var map = new BMap.Map("j_mapWrap");
        var point = new BMap.Point(str.split('|')[0], str.split('|')[1]);
        var content = str.split('|')[2];
        var myIcon = new BMap.Icon(_uzw.domain.cdn + "/content/v1/images/common/map-mark.png", new BMap.Size(22, 29), {
            offset: new BMap.Size(27, 27)
            //imageOffset: new BMap.Size(0 - index * 28, 0)
        });

        var marker = new BMap.Marker(point, { icon: myIcon });
        var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象

        map.centerAndZoom(point, 12);
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true);
        map.addOverlay(marker);
        marker.openInfoWindow(infoWindow);
    };
    var _cityBranch = function (index, obj) {
        var _initMarker = function (arr) {
            var al = arr.length;
            for (var i = 0; i < al; i++) {
                var point = new BMap.Point(arr[i].split('|')[0], arr[i].split('|')[1]);
                _addMarker(point, i, arr[i].split('|')[2]);
            }
        };
        // 创建标注
        var _addMarker = function (point, index, content) {
            var myIcon = new BMap.Icon(_uzw.domain.cdn + "/content/v1/images/common/map-mark.png", new BMap.Size(22, 29), {
                offset: new BMap.Size(27, 27)
                //imageOffset: new BMap.Size(0 - index * 28, 0)
            });

            var marker = new BMap.Marker(point, { icon: myIcon });
            var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象

            map.addOverlay(marker);

            marker.addEventListener("mouseover", function () {
                this.openInfoWindow(infoWindow);
                //图片加载完毕重绘infowindow
                // document.getElementById('imgDemo').onload = function () {
                //     infoWindow.redraw();
                // }
            });
        };

        var item = obj.find('.hd-list').children('li').eq(index);
        var cityid = item.attr('data-cityid');
        var iCP = window.centerPoint[index].split('|');
        var map = new BMap.Map('j_mapWrap' + cityid);
        map.centerAndZoom(new BMap.Point(iCP[0], iCP[1]), parseInt(iCP[2],10));
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true);
        _initMarker(window.ugData[index]);
    };

    if (mw.get(0)) {
        _branchMarker(window.ugData);
    }
    if (bt.get(0)) {
        _cityBranch(0, bt);
    }
    _uzw.ui.tab('j_branchTab', function (index, obj) {
        _cityBranch(index, obj);
    });
}

function memberPager() {
    var pagers = $('.fn-pager');

    pagers.each(function () {
        var pager = $(this);
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
    });
}

function cooperate(){
    var coo = $('#j_cooperate');
    var cooli = coo.find('.cooperate-type').children('li');
    cooli.on('click', function () {
        $(this).addClass('on').siblings().removeClass('on');
    });
}

