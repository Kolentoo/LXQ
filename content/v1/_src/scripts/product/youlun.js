$(function () {
    //roomTab(); //选择房间
    //numControl(); //数量控制
    //productRouteDayScroll(); //行程天数滚动
});

function roomTab() {
    var box = $('#j_cabinTab');
    box.find('.cabin-tab-hd').find('li').on('click', function () {
        var o = $(this);
        var index = o.index();
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');

        var op = o.parent('.cabin-tab-hd').next('.cabin-tab-bd');
        var items = op.children('.item');
        items.hide();
        items.eq(index).show();

    });

    //下拉,查看舱房简介
    box.find('.item-a').find('a').on('click', function () {
        var o = $(this);
        var oi = o.find('i');
        var op = o.parents('tr').next('.cabin-detail');
        if (oi.hasClass('arrow-on')) {
            oi.removeClass('arrow-on');
            op.hide();
        } else {
            oi.addClass('arrow-on');
            op.show();
        }
    });
}

function numControl() {

    var initNumControl = function () {
        //初始化数量
        //重置数量
        //var box = $('#j_cabinTab');
        //box.find('.num-box').val('0');

        _countAll();
        _appendNode();
        _getSumPrice();
    };

    var mainBox = $('#j_products');

    var sum = $('#j_statisticBar');
    var box = $('#j_cabinTab');
    var list = $('#j_orderList');
    //价格控制
    //减
    var _min = function (obj) {
        obj.find('tbody').on('click', '.btn-down', function () {
            var o = $(this);
            var inp = o.siblings('.num-box');
            var v = parseInt(inp.val(), 10);

            var ops = o.parents('.item-row');
            var max = ops.data('max'); //房间最大人数

            var adultBox = ops.find('.item-people-num').find('.adult').find('.num-box');
            var childBox = ops.find('.item-people-num').find('.child').find('.num-box');
            if (!childBox.get(0)) {
                childBox = ops.find('.item-child-num').find('.child').find('.num-box');
            }
            var roomBox = ops.find('.item-room-num').find('.room').find('.num-box');

            var abv = parseInt(adultBox.val(), 10); //未-1之前的值
            var cbv = parseInt(childBox.val(), 10); //未-1之前的值
            var rbv = parseInt(roomBox.val(), 10); //未-1之前的值

            abv = abv || 0;
            cbv = cbv || 0;
            rbv = rbv || 0;

            var tagSpan = o.parent('span');
            var tag = "";
            if (tagSpan.hasClass('adult')) {
                tag = 'adult';
            } else if (tagSpan.hasClass('child')) {
                tag = 'child';
            } else if (tagSpan.hasClass('room')) {
                tag = 'room';
            }

            //控制儿童点击-1，成人点击-1 房间数自动-1
            var _roomAutoChange = function () {
                var nvAdult = adultBox.val();
                var nvChild = childBox.val();
                var nv = parseInt(nvAdult, 10) + parseInt(nvChild, 10);

                if (nv === 0) {
                    return;
                }

                if (nv < max) {
                    roomBox.val(1);
                } else if (nv % max === 0) {
                    roomBox.val(nv / max);
                } else if (nv % max > 0) {
                    roomBox.val(parseInt((nv / max).toString().split('.')[0], 10) + 1);
                }
            };

            if (tag == 'adult') {
                if (v >= 1) {
                    if (v === 1) {
                        childBox.val('0');
                        roomBox.val('0');
                    }

                    //成人数<=房间数
                    inp.val(v - 1);
                }
                //新值
                _roomAutoChange();
            } else if (tag === 'child') {
                if (v >= 1) {
                    inp.val(v - 1);
                }
                //新值
                _roomAutoChange();
            } else if (tag === 'room') {
                if (v >= 1) {
                    var nvAdult = adultBox.val();
                    var nvChild = childBox.val();
                    var nv = parseInt(nvAdult, 10) + parseInt(nvChild, 10);
                    var maxV = 0;
                    if (nv % max === 0) {
                        maxV = nv / max;
                    } else {
                        maxV = parseInt((nv / max).toString().split('.')[0], 10) + 1;
                    }
                    if (v > maxV) {
                        inp.val(v - 1);
                    }
                }
            }
            if (obj.attr('id') === 'j_cabinTab') {
                _countAll();
                _appendNode();
                _getSumPrice();
            } else if (obj.attr('id') === 'j_orderList') {

            }

        });
    };

    //成人数必须>=房间数

    //加
    var _plus = function (obj) {
        obj.find('tbody').on('click', '.btn-up', function () {
            var o = $(this);
            var inp = o.siblings('.num-box');
            var v = parseInt(inp.val(), 10);

            var ops = o.parents('.item-row');
            var max = ops.data('max'); //房间最大人数

            var adultBox = ops.find('.item-people-num').find('.adult').find('.num-box');
            var childBox = ops.find('.item-people-num').find('.child').find('.num-box');
            if (!childBox.get(0)) {
                childBox = ops.find('.item-child-num').find('.child').find('.num-box');
            }
            var roomBox = ops.find('.item-room-num').find('.num-box');

            var abv = parseInt(adultBox.val(), 10); //未+1之前的值
            var cbv = parseInt(childBox.val(), 10); //未+1之前的值
            var rbv = parseInt(roomBox.val(), 10); //未+1之前的值

            abv = abv || 0;
            cbv = cbv || 0;
            rbv = rbv || 0;


            var tagSpan = o.parent('span');
            var tag = "";
            if (tagSpan.hasClass('adult')) {
                tag = 'adult';
            } else if (tagSpan.hasClass('child')) {
                tag = 'child';
            } else if (tagSpan.hasClass('room')) {
                tag = 'room';
            }

            var nvAdult = adultBox.val();
            var nvChild = childBox.val();

            //控制儿童点击+1，成人点击+1 房间数自动+1
            var _roomAutoChange = function () {
                var nad = adultBox.val();
                var ncd = childBox.val();
                var nv = parseInt(nad, 10) + parseInt(ncd, 10);

                if (nv === 0) {
                    return;
                }

                if (nv < max) {
                    roomBox.val(1);
                } else if (nv % max === 0) {
                    roomBox.val(nv / max);
                } else if (nv % max > 0) {
                    roomBox.val(parseInt((nv / max).toString().split('.')[0], 10) + 1);
                }
            };
            var nv;

            if (tag == 'adult') {
                if (v <= 99) {
                    inp.val(v + 1);
                }
                //新值
                _roomAutoChange();
            } else if (tag === 'child') {
                if (abv === 0) {
                    return;
                } else if (abv > 0) {
                    //有大人，小孩儿才能OK
                    var limitMax = parseInt(roomBox.val(), 10) * max; //房间数量*每间最多人数

                    nv = parseInt(nvAdult, 10) + parseInt(nvChild, 10);

                    if (nv < limitMax) {
                        inp.val(v + 1);
                        //新值
                        _roomAutoChange();
                    }

                }
            } else if (tag == 'room') {
                if (abv === 0) {
                    return;
                } else {
                    nv = parseInt(nvAdult, 10) + parseInt(nvChild, 10);

                    if (rbv < nvAdult) {
                        inp.val(v + 1);
                    }

                }
            }

            if (obj.attr('id') === 'j_cabinTab') {
                _countAll();
                _appendNode();
                _getSumPrice();
            } else if (obj.attr('id') === 'j_orderList') {

            }

        });
    };

    //添加预订清单节点
    var _appendNode = function () {

        var sb = [];
        box.find('.item-people-num').each(function () {
            var o = $(this);
            var oa = o.find('.adult');
            var oav = parseInt(o.find('.adult').find('.num-box').val(), 10); //成人数
            var ocv = parseInt(o.find('.child').find('.num-box').val(), 10); //儿童数
            var orv = parseInt($.trim(o.siblings('.item-room-num').find('.num-box').val()), 10); //房间数量

            var key = o.parent('.item-row').data('key');
            var max = o.parent('.item-row').data('max');

            if (oav) {

                var itemP = parseInt($.trim(o.siblings('.item-people').text()).replace('人', ''), 10); //最多人数
                var itemA = parseInt($.trim(o.siblings('.item-adult').text()).replace('￥', ''), 10); //第1、2人价
                var itemAe = parseInt($.trim(o.siblings('.item-adult-ext').text()).replace('￥', '').replace('--', ''), 10); //第3、4人价
                var itemPn = parseInt($.trim(o.siblings('.item-child').text()).replace('￥', '').replace('--', ''), 10); //第3、4人儿童价
                var itemRn = parseInt($.trim(o.siblings('.item-room-num').find('.num-box').val()), 10); //房间数量

                itemP = itemP || 0;
                itemA = itemA || 0;
                itemAe = itemAe || 0;
                itemPn = itemPn || 0;
                itemRn = itemRn || 0;

                if (!itemAe) {
                    //itemAe = itemA;
                }

                if (!itemPn) {
                    //itemPn = itemAe;
                }

                var tit = o.siblings('.item-a').text();

                var renShu = oav + ocv; //总人数
                var maxRoomShu = itemRn * orv; //最多可住人数
                var renFirstShu = orv * 2; //头两人人数

                //处理单元价格
                var fixPrice = 0;

                if (renFirstShu >= renShu) {
                   if(itemP===1)//单人间只需支付一个人的价格
					{
						fixPrice = itemA * orv;
					}
					else
					{
					   fixPrice = (itemA * 2) * orv;
					}
                } else if (renFirstShu < renShu) {
                    if (oav > renFirstShu) {
                        //成人总数大于等于头两人总人数
                        fixPrice = ((itemA * 2) * orv) + ((oav - renFirstShu) * itemAe) + (ocv * itemPn);
                    } else {
                        //成人总数小于头两人总人数
                        fixPrice = ((itemA * 2) * orv) + ((ocv - (renFirstShu - oav)) * itemPn);
                    }
                }

                if (itemA === itemAe && itemA === itemPn) {
                    //均价情况
                    fixPrice = itemA * itemP * itemRn;
                }

                //console.log(fixPrice);

                sb.push("<tr class='item-row item-row-off' data-max='" + max + "' data-key='" + key + "' >");
                sb.push("<td>" + tit + "</td>");
                sb.push("<td class='item-people-num'><span class='num-bar vm adult'><a class='btn-down' href='javascript:void(0);'>-</a><input type='text' readonly='readonly' maxlength='2' class='num-box tc' value='" + oav + "'><a class='btn-up' href='javascript:void(0);'>+</a></span></td>");
                sb.push("<td class='item-child-num'><span class='num-bar vm child'><a class='btn-down' href='javascript:void(0);'>-</a><input type='text' readonly='readonly'  maxlength='2' class='num-box tc' value='" + ocv + "'><a class='btn-up' href='javascript:void(0);'>+</a></span></td>");
                sb.push("<td class='item-room-num'><span class='num-bar vm room'><a class='btn-down' href='javascript:void(0);'>-</a><input type='text' readonly='readonly'  maxlength='2' class='num-box tc' value='" + orv + "'><a class='btn-up' href='javascript:void(0);'>+</a></span></td>");
                sb.push("<td class='verdana item-adult'>￥" + itemA + "</td>");
                sb.push("<td class='verdana item-adult-ext'>￥" + itemAe + "</td>");
                sb.push("<td class='verdana item-child'>￥" + itemPn + "</td>");
                sb.push("<td class='orange verdana unit-price'>￥" + fixPrice + "</td>");
                sb.push("<td><p class='operate-a'><a href='javascript:;' class='amend green vm'>修改</a><a href='javascript:void(0);' class='delete green vm'>删除</a></p></td>");
                sb.push("</tr>");
            }

        });
        list.find('tbody').html(sb.join(''));

    };

    //清单总价相加
    var _getSumPrice = function () {
        var nodePrice = list.find('tbody').find('.unit-price');
        var sump = 0; //价格
        nodePrice.each(function () {
            var o = $(this);
            sump += parseInt(o.text().replace('￥', ''), 10);
        });
        sum.find('.total').text(sump);
    };

    //修改，确认预订清单
    var _modifyList = function () {
        var tbd = list.find('tbody');
        tbd.on('click', '.amend', function () {
            var o = $(this);
            var op = o.parents('.item-row');
            var key = op.data('key');
            if (o.text() == '修改') {
                op.removeClass('item-row-off');
                op.addClass('item-row-on');

                o.text('确定');
                o.next('.delete').text('取消');
            } else {

                //确定修改
                op.removeClass('item-row-on');
                op.addClass('item-row-off');

                o.text('修改');
                o.next('.delete').text('删除');

                //清0
                var p1 = op.find('.adult').find('.num-box').val();
                var p2 = op.find('.child').find('.num-box').val();
                var p3 = op.find('.room').find('.num-box').val();
                var max = op.data('max');

                //同步舱房列表值
                var pitem = box.find(".item-row[data-key='" + key + "']");
                pitem.find('.adult').find('.num-box').val(p1);
                pitem.find('.child').find('.num-box').val(p2);
                pitem.find('.room').find('.num-box').val(p3);

                //二次同步清单当前行值
                //***************************************************************************************

                _countAll();
                _appendNode();
                _getSumPrice();

            }

        });
    };

    //删除，取消预订清单
    var _deleteList = function () {
        var tbd = list.find('tbody');
        tbd.on('click', '.delete', function () {
            var o = $(this);
            var op = o.parents('.item-row');
            var key = op.data('key');

            if (o.text() == '删除') {
                //删除操作
                op.remove();
                box.find(".item-row[data-key='" + key + "']").find('.num-box').val('0');
                _countAll();
                _getSumPrice();
            } else {
                //取消操作
                op.removeClass('item-row-on');
                op.addClass('item-row-off');

                o.prev('.amend').text('修改');
                o.text('删除');
            }

        });
    };

    //计算人数,房间数，价格总额
    var _countAll = function () {

        //nummber summary
        var _unitType = function (tag) {
            var num = 0;
            box.find('.' + tag).find('.num-box').each(function (k, v) {
                var o = $(this);
                num += (parseInt(o.val(), 10));
            });
            return num;
        };

        var ad = 0;
        var ch = 0;
        var rm = 0;

        ad = _unitType('adult');
        ch = _unitType('child');
        rm = _unitType('room');

        sum.find('.adult').find('b').text(ad);
        sum.find('.child').find('b').text(ch);
        sum.find('.room').find('b').text(rm);

        var maxP = parseInt($('#hidStartOrderPersonNum').val(), 10) || 1;
        if (ad >= maxP) {
            $('#j_youlunSubmit').addClass('submit-order-on');
        } else {
            $('#j_youlunSubmit').removeClass('submit-order-on');
        }

    };

    //减
    _min(box);
    _min(list);

    //加
    _plus(box);
    _plus(list);

    _modifyList();
    _deleteList();

    initNumControl();


}

function pOrderNumCheck() {

    var box = $('#j_cabinTab');
    var _checkTip = function (id) {
        var erow = box.find(".item-row[data-key='" + id + "']");
        var ebox = erow.find('.item-room-num');
        var eLeft = ebox.offset().left;
        var eTop = ebox.offset().top;

        var sb = [];
        sb.push("<div class='tip-box' id='j_youlunOrderNumTip'>");
        sb.push("<div class='tip-arrow'><em class='e1'>◆</em><em class='e2'>◆</em></div>");
        sb.push("<div class='tip-con'>成人数必须大于或等于所选房型房间数</div>");
        sb.push("</div>");

        if (!$('#j_youlunOrderNumTip').get(0)) {
            $('body').append(sb.join(''));
        }

        $('#j_youlunOrderNumTip').css({
            'top': eTop + 53,
            'left': eLeft - 65,
            'display': 'block'
        });
    };

    var _checkOK = function () {
        var b = true;
        box.find('.item-row').each(function () {
            var o = $(this);
            var oid = o.attr('data-key');
            var rv = o.find('.room').find('.num-box').val();
            var av = o.find('.adult').find('.num-box').val();
            if (parseInt(rv, 10) >= 1) {
                if (parseInt(rv, 10) > parseInt(av, 10)) {
                    b = false;
                    _checkTip(oid); //弹出tip
                    return true;
                }
            }
        });
        return b;
    };

    return _checkOK();

}

function productRouteDayScroll() {

    var obj = $('#j_routeListWrap');
    var objUl = obj.find('.route-list');
    var objLiL = objUl.find('dl').length;
    var showNum = 6; //可显示的数量

    var _scroll = function (direction) {
        objUl.stop();
        if (objLiL > showNum) {
            var scrollNum = objLiL - showNum; //可以滚动的数量次数
            var height = objUl.find('dl').eq(0).outerHeight(); //单行高度
            var scrollHeight = scrollNum * height; //可以滚动的高度
            var Hotnews = function () {
                var mt = objUl.css('margin-top').replace('px', '');

                if (direction == 'next') {
                    if (parseInt(mt, 10) <= '-' + scrollHeight) {
                        return false;
                    }
                }

                if (direction == 'prev') {
                    if (parseInt(mt, 10) >= 0) {
                        return false;
                    }
                }


                objUl.stop().animate({
                    marginTop: (direction == 'next' ? '-=' : '+=') + height + 'px'
                }, 250, function () {
                    //var onode = objUl.find("dl:"+(direction=='next'?'first':'last'));
                    //objUl.css({ 'margin-top': '0' });
                    //objUl.append(onode);//如果一个被选中的元素被插入到另外一个地方，这是移动而不是复制：
                });
            };
            Hotnews();
        }
    };

    obj.parent().find('.next').on('click', function() {
        _scroll('next');
    });

    obj.parent().find('.prev').on('click', function() {
        _scroll('prev');
    });


}