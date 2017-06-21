"use strict";

var sortRoute = {};

sortRoute.init = function (page) {
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/sortElements.js', function () {
        fnListTab('con-list-tab', page);
    });
};

//tab 切换 线路排序
function fnListTab(id, page) {

    $('.fn-more').show();

    var op = $('#' + id);
    op = (!op.get(0)) ? $('.' + id) : op;
    if (op.get(0) ) {
        op.find('div.hd').find('li').on('click', function () {
            var o = $(this);
            var os = o.siblings('li');
            var oindex = o.parent('ul').find('li').index(o);

            $('.fn-more').attr('data-page', 1);
            $('.fn-more').attr('data-action', 'sort');

            var flag = o.attr('flag');
            //price价格图标控制
            if (flag == 'price-low') {
                o.attr('flag', 'price-high');
                o.find('i').removeClass('price-low').addClass('price-high');
            } else if (flag == 'price-high') {
                o.attr('flag', 'price-low');
                o.find('i').removeClass('price-high').addClass('price-low');
            } else if (flag == 'price') {
                o.attr('flag', 'price-low');
                o.find('i').removeClass('price-high').addClass('price-low');
            }

            o.addClass('on');
            os.removeClass('on');

            flag = o.attr('flag');
            listSort(op.find('.item').find('li'), flag);//排序

            window.listFirstScreenLoad('con-list-tab', page);

        });
    }
}

function listSort(scope,flag) {

    if (flag == 'intro') {
        scope.sortElements(function (a, b) {
            return parseInt($(a).attr('data-sort-intro'), 10) > parseInt($(b).attr('data-sort-intro'), 10) ? 1 : -1;
        });
    }
        //高到低
    else if (flag == 'price-high') {
        scope.sortElements(function (a, b) {
            return parseInt($(a).attr('data-sort-price'), 10) < parseInt($(b).attr('data-sort-price'), 10) ? 1 : -1;
        });
    }
        //低到高
    else if (flag == 'price-low') {
        scope.sortElements(function (a, b) {
            return parseInt($(a).attr('data-sort-price'), 10) > parseInt($(b).attr('data-sort-price'), 10) ? 1 : -1;
        });
    }
        
    else if (flag == 'sati') {
        scope.sortElements(function (a, b) {
            return parseInt($(a).attr('data-sort-sati'), 10) < parseInt($(b).attr('data-sort-sati'), 10) ? 1 : -1;
        });
    }
    else {
        scope.sortElements(function (a, b) {
            return parseInt($(a).attr('data-sort-intro'), 10) > parseInt($(b).attr('data-sort-intro'), 10) ? 1 : -1;
        });
    }

    //console.log(list);
}

//取数组最小值
function _minNum(a) {
    return Math.min.apply(Math, a);
}

//取数组最大值
function _maxNum(a) {
    return Math.max.apply(Math, a);
}

//取数组大到小排序
function _minSortArray(a) {
    return a.sort(_ascSort);
}

//取数组小到大排序
function _maxSortArray(a) {
    return a.sort(_descSort);
}

function _ascSort(x, y) {
    if (x > y) {
        return 1;
    }
    else {
        return -1;
    }
}

function _descSort(x, y) {
    if (x > y) {
        return -1;
    }
    else {
        return 1;
    }
}

