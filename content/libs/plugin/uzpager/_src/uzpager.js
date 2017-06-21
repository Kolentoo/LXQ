/*!
 * jsonchou 分页
 * v: 1.1
 * d: 2014-3-6
*/

;(function ($) {
    $.fn.uzPager = function (options) {
        var _tap = window._tap || 'click';

        var opt = $.extend({}, $.fn.uzPager.option, options);

        return this.each(function (k, v) {

            var o = $(this);
            var oclone = opt.clonePagerNode;
            var yeshu = 0;

            var init = function (page) {
                //指定项数方式分页，还是默认1000
                var childs = null;
                if (opt.targetNode) {
                    childs = opt.targetNode.find('li');
                    if (!childs.get(0)) {
                        childs = opt.targetNode.find('tr');
                    }
                }
                opt.pageItems = opt.targetNode ? childs.length : opt.pageItems;

                opt.currentPage = page ? page : opt.currentPage;
                yeshu = Math.ceil(opt.pageItems / opt.pageSize);//获得页数
                var next = parseInt(opt.currentPage, 10) + parseInt(1, 10);
                var prev = Math.abs(parseInt(opt.currentPage, 10) - parseInt(1, 10));
                var sb = [];

                sb.push("<span class='pager-info'>查询到" + opt.pageItems + "条 " + opt.currentPage + "/" + yeshu + " </span>");
                sb.push('<span class="pager-con"> ');

                sb.push("<a" + (prev > 0 ? " rel='" + prev + "' class='item prev'" : " class='item prev disabled'") + ">" + "<i class='i-prev'></i><em>上一页</em></a>");

                var startLoopfrom = parseInt(opt.currentPage, 10) - parseInt(opt.sides, 10);
                var endLoopfrom = parseInt(opt.currentPage, 10) + parseInt(opt.sides, 10);
                var startPage = (startLoopfrom > 0) ? startLoopfrom : 1;
                var endPage = (endLoopfrom < parseInt(yeshu, 10)) ? endLoopfrom : yeshu;
                if (startPage > 1 && startPage - 1 != '1') {
                    sb.push('<a class="item ' + (opt.currentPage == 1 ? 'disabled on' : "") + '" rel="' + 1 + '">' + 1 + '</a>');
                    sb.push('<a class="dot">...</a>');
                } else if (startPage - 1 == '1') {
                    sb.push('<a class="item ' + (opt.currentPage == 1 ? 'disabled on' : "") + '" rel="' + 1 + '">' + 1 + '</a>');

                }

                for (var n = startPage; n <= endPage; n++) {
                    sb.push('<a class="item ' + (opt.currentPage == n ? 'disabled on' : "") + '" rel="' + n + '">' + n + '</a>');
                }

                if (endPage < yeshu && yeshu - endPage != '1') {
                    sb.push('<a class="dot">...</a>');
                    sb.push('<a class="item ' + (opt.currentPage == yeshu ? 'disabled on' : "") + '" rel="' + yeshu + '">' + yeshu + '</a>');
                } else if (yeshu - endPage == '1') {
                    sb.push('<a class="item ' + (opt.currentPage == yeshu ? 'disabled on' : "") + '" rel="' + yeshu + '">' + yeshu + '</a>');
                }

                sb.push("<a " + (next <= yeshu ? '"  rel="' + next + '" class="item next"' : ' class="item next disabled"') + " ><em>下一页</em><i class='i-next'></i></a>");
                sb.push('</span>');

                sb.push("到<input class='ipt-num' type='text' />页 <input type='button'  class='ipt-btn'  value='确定'>");

                if (opt.pageItems <= 0) {
                    o.hide();
                    if (oclone) {
                        oclone.hide();
                    }
                } else {
                    o.html(sb.join(''));
                    o.show();

                    if (oclone) {
                        oclone.html(sb.join(''));
                        oclone.show();
                    }
                }

                pager();



            };

            var pager = function () {
                //分页
                if (opt.targetNode) {
                    var p = opt.currentPage;//当前页
                    var ele = opt.targetNode;//jquery 对象
                    var pageSize = opt.pageSize;
                    var childs = ele.find('li');
                    if (!childs.get(0)) {
                        childs = ele.find('tr');
                    }
                    childs.hide();

                    var indexFirst = ((p - 1) * pageSize);
                    var indexLast = p * pageSize - 1;

                    childs.each(function (k, v) {
                        var item = $(this);

                        if (k >= indexFirst && k <= indexLast) {
                            item.show();

                            var itemImg = item.find('img');
                            itemImg.each(function () {
                                var im = $(this);
                                var itemImgSrc = im.attr('data-src');
                                if (!itemImgSrc) {
                                    itemImgSrc = im.attr('data-original');
                                }

                                if (itemImgSrc) {
                                    im.attr('src', itemImgSrc);//延迟加载图片
                                }

                            });

                        }

                    });

                }
            };

            var trigger = function (obj) {
                obj.off(_tap, 'a:not(.disabled)').on(_tap, 'a:not(.disabled)', function () {
                    var p = $(this).attr('rel');
                    init(p);
                    //分页之后回调事件
                    opt.onCallback(opt.currentPage, yeshu);
                });

                obj.off(_tap, 'input:button').on(_tap, 'input:button', function () {
                    var ib = $(this);
                    var iv = ib.siblings('.ipt-num');
                    var iv2 = iv.val();
                    if (!iv2 || isNaN(parseInt(iv2, 10)) || parseInt(iv2, 10) > yeshu) {
                        iv.addClass('ipt-num-off');
                        iv.focus();
                        iv.val('');
                        return false;
                    } else {
                        iv.removeClass('ipt-num-off');
                        //触发点击num事件
                        init(parseInt(iv2, 10));
                        //分页之后回调事件
                        opt.onCallback(opt.currentPage, yeshu);
                    }
                });

                //回车事件
                obj.off('keydown', 'input:text').on('keydown', 'input:text', function (event) {
                    var it = $(this);
                    var its = it.siblings('.ipt-btn');
                    var kid = (event.keyCode ? event.keyCode : event.which);
                    if (kid == '13') {
                        its.trigger(_tap);
                    }
                });

            };

            trigger(o);

            if (oclone) {
                trigger(oclone);
            }


            init(opt.currentPage);

            opt.onInit(yeshu);//init 之后调用事件


        });

    };

    $.fn.uzPager.option = {
        pageSize: 10,
        pageItems: 100,
        currentPage: 1,
        clonePagerNode: '',//jquery 对象,双分页节点
        targetNode: '',//jquery 对象,要分布的列表li tr父对象
        edges: 2,
        sides: 2,
        onInit: function (allPage) {
            //console.log(allPage);
        },
        onCallback: function (currentPage, allPage) {
            //分页事件 ajax or dom handle
            //console.log(currentPage);
            //console.log(allPage);
        }
    };

})(jQuery);
