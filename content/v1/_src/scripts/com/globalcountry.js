//国籍

//load 数据集中英文
var listRealGlobalCountry = [];

//共用autocomplete
function comGlobalCountry() {
    var body = $('body');
    var ipt = $('input[data-countries-trigger]');
    if (!ipt.get(0)) {
        return;
    }

    var kn = "uzwGlobalCountries";//localStorage 存储名

    var dfr = function () {
        return $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiFlight/countrylist',
            cache: false,
            dataType: "jsonp"
        });
    };

    _util.localStorage.cache(kn, 1, dfr, function (data) {
        if (data && data.length) {
            listRealGlobalCountry = data;
        }
    });

    var _unitHide = function () {
        $('.countries-select-mod').hide();
        globalCountrySelect.remove();
    };

    //即时输入智能filter
    var unitKeyEvent = function (o, event) {

        var ocityMod = o.siblings('.countries-select-mod');
        var ov = $.trim(o.val().toUpperCase());

        if (ov) {
            ocityMod.hide();
            globalCountrySelect.show();
        } else {
            globalCountrySelect.hide();
            ocityMod.show();
            return;
        }

        var kid = (event.keyCode ? event.keyCode : event.which);

        if (kid != '38' && kid != '40') {
            var sb = [];
            var lrgcLen = listRealGlobalCountry.length;
            var i, item, a, b, c;
            //遍历数据数组
            for (i = 0; i < lrgcLen; i++) {
                item = listRealGlobalCountry[i];
                a = item.a.toUpperCase();
                b = item.b.toUpperCase();
                c = item.c.toUpperCase();

                if (b.indexOf(ov) === 0 || c.indexOf(ov) === 0) { // 只从第一个位置开始匹配
                    sb.push('<li data-code="' + a + '"><span class="s1">' + b + '</span><span class="s2">' + c + '</span></li>');
                }
                if (sb.length >= 10) {
                    break;
                }
            }

            // 遍历数据数组
            for (i = 0; i < lrgcLen; i++) {
                item = listRealGlobalCountry[i];
                a = item.a.toUpperCase();
                b = item.b.toUpperCase();
                c = item.c.toUpperCase();

                if (sb.length >= 10) {
                    break;
                } else if (b.indexOf(ov) > 0 || c.indexOf(ov) > 0) { // 第一个位置后面的匹配
                    sb.push('<li data-code="' + a + '"><span class="s1">' + b + '</span><span class="s2">' + c + '</span></li>');
                }
            }

            globalCountrySelect.html(sb.join(''));
        }

        //mouseenter
        globalCountrySelect.find('li').on('mouseenter', function () {
            var oli = $(this);
            var olis = oli.siblings('li');
            olis.removeClass('on');
            oli.addClass('on');
        }).on('click', function () {
            //绑定click事件
            var oli = $(this);
            var ncn = oli.find('.s1').text();
            var ncode = oli.attr('data-code');

            o.val(ncn); //设置值
            o.next('input').val(ncode);
            _unitHide();
        });

        if (globalCountrySelect.find('li').not('.li-none').length <= 0) {
            globalCountrySelect.empty();
            globalCountrySelect.append("<li class='li-none'>找不到'" + ov + "'</li>");
            o.siblings('input:hidden').val('');//清空隐藏域值
        } else {
            globalCountrySelect.find('.li-none').remove();
        }
    };

    //设置code3
    var setCode3 = function (o) {
        var ov = o.val().toUpperCase();

        //输入时候添加三字码
        var lis = globalCountrySelect.find('li').not('.li-none');
        var on = o.next('input');
        //real 指定点击
        var oli = lis.filter('.on');
        if (!oli.get(0)) {
            oli = lis.eq(0);
        }
        var s1 = oli.find('.s1');
        o.val(s1.text());
        on.val(oli.attr('data-code'));
        _unitHide();
    };

    //input blur
    body.on('blur', 'input[data-countries-trigger]', function (e) {
        var o = $(this);
        if (!$.trim(o.val())) {
            return;
        }
        var on = o.next('input');
        var lis = globalCountrySelect.find('li').not('.li-none');
        if (lis.length == 1 || lis.eq(0).find('.s1').text() == o.val()) {
            o.val(lis.eq(0).find('.s1').text());
            //and set code
            on.val(lis.eq(0).attr('data-code'));
            _unitHide();
        }
    });

    //autocomplete筛选
    body.on('keyup', 'input[data-countries-trigger]', function (e) {
        var o = $(this);
        var on = o.next('input');
        on.val('');
        unitKeyEvent(o, e);
    });

    var unitKeyChoose = function (o, dir) {

        var lis = globalCountrySelect.find('li');
        if (dir === 'down') {
            if (lis.filter('.on').length) {
                var liNext = lis.filter('.on').next('li');
                lis.removeClass('on');
                if (liNext.get(0)) {
                    liNext.addClass('on');
                } else {
                    lis.eq(0).addClass('on');
                }
            } else {
                lis.removeClass('on');
                lis.eq(0).addClass('on');
            }
        } else if (dir === 'up') {
            if (lis.filter('.on').length) {
                var liPrev = lis.filter('.on').prev('li');
                lis.removeClass('on');
                if (liPrev.get(0)) {
                    liPrev.addClass('on');
                } else {
                    lis.last('li').addClass('on');
                }
            } else {
                lis.removeClass('on');
                lis.last('li').addClass('on');
            }
        } else if (dir === 'enter') {
            setCode3(o);
            _unitHide();
            o.blur();
            return false;
        }
    };

    ipt.on('keydown', function (event) {
        var o = $(this);
        var kid = (event.keyCode ? event.keyCode : event.which);

        //tab   9
        //enter 13
        //shift 16
        //ctrl  17
        //alt   18

        if (kid == '9' || kid == '16' || kid == '17' || kid == '18') {
            $('.hot-city').hide();
            return;
        }
        if (kid == '38') {
            unitKeyChoose(o, 'up');
        } else if (kid == '40') {
            unitKeyChoose(o, 'down');
        } else if (kid == '13') {
            unitKeyChoose(o, 'enter');
            return false; //防回车提交
        }
    });

    //set country name by code3
    var setCountryByCode = function () {
        var url = location.href.toLowerCase();
        var ipts = $('input[data-countries-trigger]').next('input:hidden');
        ipts.each(function (k, v) {
            var item = $(this);
            var itemP = item.prev('input[data-countries-trigger]');//next input hidden;
            var iv = getCountryByCode(item.val());
            itemP.val(iv);
        });
    };

    setCountryByCode();

}

//get country name by code3
function getCountryByCode(cd) {
    if (cd) {
        var cityname = '';
        for (var i = 0; i < listRealGlobalCountry.length; i++) {
            var item = listRealGlobalCountry[i];
            var itemA = item.a;
            var itemB = item.b;
            var itemC = item.c;
            if (itemA.toLowerCase() == cd.toLowerCase()) {
                cityname = (itemB || itemC);
                break;
            }
        }
        return cityname;
    }
    return '';
}
