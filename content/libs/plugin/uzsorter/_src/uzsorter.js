/*!
 * jsonchou 筛选
 * v: 1.1
 * d: 2014-3-6
*/

;(function ($) {
    $.fn.uzSorter = function (options) {

        var opt = $.extend({}, $.fn.uzSorter.option, options);

        //数组去重
        var _unique = function (arr) {
            var res = [];
            var json = {};
            for (var i = 0; i < arr.length; i++) {
                if (!json[arr[i]]) {
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        };

        //获取交集
        var _crosArr = function (a, b) {
            var ai = 0, bi = 0;
            var result = [];
            while (ai < a.length && bi < b.length) {
                if (a[ai] < b[bi]) { ai++; }
                else if (a[ai] > b[bi]) { bi++; }
                else
                {
                    result.push(a[ai]);
                    ai++;
                    bi++;
                }
            }
            return result;
        };

        // 数字排序
        var _sortNumber = function (a, b) {
            return a - b;
        };

        return this.each(function (k, v) {

            var o = $(this);

            //初始化前，节点拷贝一份;
            var ocopyID = o.attr('id') + '_copy';
            var onullID = o.attr('id') + '_null';
            var oloaderID = o.attr('id') + '_loader';

            var ocopy = $('#' + ocopyID);
            var onull = $('#' + onullID);
            var oloader = $('#' + oloaderID);

            onull.remove();//空节点移除
            oloader.remove();//loader节点移除

            if (!ocopy.get(0)) {
                var sb = "<div style='display:none' id='" + ocopyID + "' ></div>";
                o.after(sb);
                $('#' + ocopyID).html(o.html());
                ocopy = $('#' + ocopyID);
            }

            var init = function () {
                var params = '';
                if (!opt.sortBy) {
                    params = [];
                } else {
                    params = opt.sortBy.split(',');
                }
                var sortBys = [];
                ocopy.find('li').attr('data-eq', '');
                //ocopy.find('li').hide();//默认全部隐藏
                var visibleLis = "";
                var visibleIndexs = [];//筛选索引

                //sortBy: '',//通过','号分隔 data-param1*=json,data-param2*=chou
                //sortBy: '',//高级筛选通过'|'和','号分隔 data-param1=json|data-param1=json2|data-param1=json3,data-param2=chou|data-param2=chou2|data-param2=chou3
                //params:
                //"data-zturn=0"
                //"data-startflighttime=上午|data-startflighttime=下午"
                //"data-taxprice=1"

                var filterArrs = [];
                var filterIndexArrs = [];

                if (params.length > 0) {
                    for (var i = 0; i < params.length; i++) {
                        var paramItem = params[i];

                        if (paramItem.indexOf('|') > -1) {
                            var paramItemSpecArr = paramItem.split('|');
                            var tagName = paramItem.replace('*', '').split('=')[0];
                            var sb = [];
                            var tagValue = '';

                            for (var j = 0; j < paramItemSpecArr.length; j++) {
                                var item = paramItemSpecArr[j].replace('*', '');
                                sb.push(item.replace(tagName + '=', ''));
                            }

                            tagValue = sb.join('|');//凌晨|上午
                            if (paramItem.indexOf('*') > -1) {
                                filterArrs.push(tagName + '*:' + tagValue);
                            } else {
                                filterArrs.push(tagName + ':' + tagValue);
                            }

                        } else {
                            filterArrs.push(paramItem.replace('=', ':'));//"data-company*:国泰航空"   单个参数，存在*:模糊匹配情况
                        }
                    }
                } else {
                    visibleLis = ocopy.find("li");
                }

                if (filterArrs.length > 0) {
                    for (var m = 0; m < filterArrs.length; m++) {
                        var itag = filterArrs[m].split(':')[0];
                        var itagVA = filterArrs[m].split(':')[1].split('|');
                        var mySubIndex = [];

                        for (var n = 0; n < itagVA.length; n++) {
                            var paramSpecItem = itag + '=' + itagVA[n];
                            var tp = ocopy.find("li[" + paramSpecItem + "]");//多数
                            // console.log("li[" + paramSpecItem + "]");
                            if (tp.length > 0) {
                                for (var tl = 0; tl < tp.length; tl++) {
                                    var otp = tp[tl];
                                    var tpIndex = ocopy.find('li').index(otp);
                                    mySubIndex.push(tpIndex);
                                }
                            }
                        }
                        filterIndexArrs.push(_unique(mySubIndex));

                    }
                }

                //二维数组居然不能用普通for循环
                for (var fia in filterIndexArrs) {
                    var item3 = filterIndexArrs[fia];
                    if (parseInt(fia, 10) === 0) {
                        visibleIndexs = item3;
                    } else {
                        visibleIndexs = _crosArr(visibleIndexs.sort(_sortNumber), item3.sort(_sortNumber));
                    }
                }

                if (visibleIndexs.length > 0) {
                    $.each(visibleIndexs, function (k, v) {
                        ocopy.find('li').eq(v).attr('data-eq', 'push');
                    });
                    visibleLis = ocopy.find("li[data-eq=push]");
                }

                var _sort = function (a, b) {
                    if ($(a).attr(opt.sortAscTag) && $(b).attr(opt.sortAscTag)) {
                        var aa = isNaN($(a).attr(opt.sortAscTag)) ? 0 : $(a).attr(opt.sortAscTag);
                        var bb = isNaN($(b).attr(opt.sortAscTag)) ? 0 : $(b).attr(opt.sortAscTag);

                        if (opt.sortAscTag) {
                            if (opt.sortAscKey === 'asc') {
                                return parseInt(aa, 10) < parseInt(bb, 10) ? -1 : 1;
                            } else {
                                return parseInt(aa, 10) < parseInt(bb, 10) ? 1 : -1;
                            }
                        }
                        else {
                        }
                    } else {
                        return -1;
                    }
                };

                var opul = o.find('ul');
                if (visibleLis.length > 0) {
                    var domClone = visibleLis.clone();
                    opul.empty();
                    if (opt.targetAjaxload) {
                        o.after("<div id='" + oloaderID + "' >" + opt.tragetAjaxText + "</div>");
                        setTimeout(function () {
                            $('#' + oloaderID).remove();
                            opul.html(domClone.sort(_sort));
                        }, 600);
                    } else {
                        opul.html(domClone.sort(_sort));
                    }
                }
                else {
                    opul.empty();
                    $('#' + onullID).remove();
                    $('#' + oloaderID).remove();

                    if (opt.targetAjaxload) {
                        o.after("<div id='" + oloaderID + "' >" + opt.tragetAjaxText + "</div>");
                        setTimeout(function () {
                            opul.empty();
                            $('#' + onullID).remove();
                            $('#' + oloaderID).remove();

                            o.after("<div id='" + onullID + "' >" + opt.targetNull + "</div>");
                        }, 500);
                    } else {
                        $('#' + onullID).remove();
                        $('#' + oloaderID).remove();

                        o.after("<div id='" + onullID + "' >" + opt.targetNull + "</div>");
                    }
                }

                if (opt.targetAjaxload) {
                    setTimeout(function () {
                        opt.onCallback();//延迟阻塞后续事件
                    }, 600);
                } else {
                    opt.onCallback();
                }

            };

            init();

            opt.onInit();//init 之后调用事件

        });

    };

    $.fn.uzSorter.option = {
        sortBy: '',//通过','号分隔 data-param1*=json,data-param2*=chou
        //sortBy: '',//高级筛选通过'|'和','号分隔 data-param1=json|json2|json3,data-param2=chou|chou2|chou3
        sortAscTag: '',//高低排序data-price
        sortAscKey: 'asc',//低到高 asc/desc
        targetNull: '没有找到相关产品，换个筛选条件再试试吧~',
        targetAjaxload: true,
        tragetAjaxText: '数据载入中...',
        targetLazyload: true,
        onInit: function () {

        },
        onCallback: function () {

        }
    };

})(jQuery);