
var box = $('#j_ylCabin');

//减
var _min = function (obj) {
    obj.find('.fn-math').on('click', '.btn-minus', function () {
        var o = $(this);
        var inp = o.siblings('.num-box');
        var v = parseInt(inp.val(), 10);

        var max = parseInt($('#j_peopleMax').text(), 10); //房间最大人数

        var adultBox = box.find('.item-adult-num');
        var childBox = box.find('.item-child-num');
        var roomBox = box.find('.item-room-num');

        var abv = parseInt(adultBox.val(), 10); //未-1之前的值
        var cbv = parseInt(childBox.val(), 10); //未-1之前的值
        var rbv = parseInt(roomBox.val(), 10); //未-1之前的值

        abv = abv || 0;
        cbv = cbv || 0;
        rbv = rbv || 0;

        var tagSpan = o.siblings('.num-box');
        var tag = "";
        if (tagSpan.hasClass('item-adult-num')) {
            tag = 'adult';
        } else if (tagSpan.hasClass('item-child-num')) {
            tag = 'child';
        } else if (tagSpan.hasClass('item-room-num')) {
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
                if (v == 1) {
                    childBox.val('0');
                    roomBox.val('0');
                }

                //成人数<=房间数
                inp.val(v - 1);
            }
            //新值
            _roomAutoChange();
        } else if (tag == 'child') {
            if (v >= 1) {
                inp.val(v - 1);
            }
            //新值
            _roomAutoChange();
        } else if (tag == 'room') {
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


    });
};

//加
var _plus = function (obj) {
    obj.find('.fn-math').on('click', '.btn-plus', function () {
        var o = $(this);
        var inp = o.siblings('.num-box');
        var v = parseInt(inp.val(), 10);

        var max = parseInt($('#j_peopleMax').text(), 10); //房间最大人数

        var adultBox = box.find('.item-adult-num');
        var childBox = box.find('.item-child-num');
        var roomBox = box.find('.item-room-num');

        var abv = parseInt(adultBox.val(), 10); //未-1之前的值
        var cbv = parseInt(childBox.val(), 10); //未-1之前的值
        var rbv = parseInt(roomBox.val(), 10); //未-1之前的值

        abv = abv || 0;
        cbv = cbv || 0;
        rbv = rbv || 0;

        var tagSpan = o.siblings('.num-box');
        var tag = "";
        if (tagSpan.hasClass('item-adult-num')) {
            tag = 'adult';
        } else if (tagSpan.hasClass('item-child-num')) {
            tag = 'child';
        } else if (tagSpan.hasClass('item-room-num')) {
            tag = 'room';
        }

        var nv = 0;

        //控制儿童点击+1，成人点击+1 房间数自动+1
        var _roomAutoChange = function () {
            nv = parseInt(adultBox.val(), 10) + parseInt(childBox.val(), 10);

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
            if (v <= 99) {
                inp.val(v + 1);
            }
            //新值
            _roomAutoChange();
        } else if (tag == 'child') {

            if (abv === 0) {
                return;
            } else if (abv > 0) {
                //有大人，小孩儿才能OK
                var limitMax = parseInt(roomBox.val(), 10) * max; //房间数量*每间最多人数

                nv = parseInt(adultBox.val(), 10) + parseInt(childBox.val(), 10);

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
                nv = parseInt(adultBox.val(), 10) + parseInt(childBox.val(), 10);

                if (rbv < parseInt(adultBox.val(), 10)) {
                    inp.val(v + 1);
                }

            }
        }



    });
};

//减
_min(box);

//加
_plus(box);