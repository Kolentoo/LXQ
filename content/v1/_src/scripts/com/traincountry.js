//欧铁国家

//load 数据集中英文
var listRealTrainCountry = [];

//共用autocomplete
function comTrainCountry() {

    var ipt = $('input[data-countries-trigger]');
    if (!ipt.get(0)) {
        return;
    }

    var kn = "uzwTrainCountries";//localStorage 存储名

    var dfr = function () {
        return $.ajax({
            url: _uzw.domain.wapi + '/api/uzaipassticket/countrylist',
            cache: false,
            dataType: "jsonp"
        });
    };

    _util.localStorage.cache(kn, 1, dfr, function (data) {
        if (data && data.length) {
            listRealTrainCountry = data;
        }
    });

    var _unitHide = function () {
        $('.countries-select-mod').hide();
        trainCountrySelect.remove();
    };

    //即时输入智能filter
    var unitKeyEvent = function (o, event) {

        var ocityMod = o.siblings('.countries-select-mod');
        var ov = $.trim(o.val().toUpperCase());

        if (ov) {
            ocityMod.hide();
            trainCountrySelect.show();
        } else {
            trainCountrySelect.hide();
            ocityMod.show();
            return;
        }

        var kid = (event.keyCode ? event.keyCode : event.which);

        if (kid != '38' && kid != '40') {
            var sb = [];
            //遍历数据数组
            for (var i = 0; i < listRealTrainCountry.length; i++) {
                var item = listRealTrainCountry[i];
                var a = item.a.toUpperCase();
                var b = item.b.toUpperCase();
                var c = item.c.toUpperCase();

                if (a.indexOf(ov) === 0 || c.indexOf(ov) === 0 || b.indexOf(ov) === 0) {

                    if (c) {
                        sb.push('<li data-code="' + a + '"><span class="s1">' + c + '</span><span class="s2">' + a + '</span></li>');
                    } else {
                        sb.push('<li data-code="' + a + '"><span class="s1">' + a + '</span><span class="s2">' + b + '</span></li>');
                    }

                }
                if (sb.length >= 10) {
                    break;
                }
            }
            trainCountrySelect.html(sb.join(''));
        }

        //mouseenter
        trainCountrySelect.find('li').on('mouseenter', function () {
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

        if (trainCountrySelect.find('li').not('.li-none').length <= 0) {
            trainCountrySelect.empty();
            trainCountrySelect.append("<li class='li-none'>找不到'" + ov + "'</li>");
            o.siblings('input:hidden').val('');//清空隐藏域值
        } else {
            trainCountrySelect.find('.li-none').remove();
        }
    };

    //设置code3
    var setCode3 = function (o) {

        //输入时候添加三字码
        var lis = trainCountrySelect.find('li').not('.li-none');
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
    ipt.on('blur', function (e) {
        var o = $(this);
        if (!$.trim(o.val())) {
            return;
        }
        var on = o.next('input');
        var lis = trainCountrySelect.find('li').not('.li-none');
        if (lis.length == 1 || lis.eq(0).find('.s1').text() == o.val()) {
            o.val(lis.eq(0).find('.s1').text());
            //and set code
            on.val(lis.eq(0).attr('data-code'));
            _unitHide();
        }
    });

    //autocomplete筛选
    ipt.on('keyup', function (e) {
        var o = $(this);
        var on = o.next('input');
        on.val('');
        unitKeyEvent(o, e);
    });

    var unitKeyChoose = function (o, dir) {

        var lis = trainCountrySelect.find('li');
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
        for (var i = 0; i < listRealTrainCountry.length; i++) {
            var item = listRealTrainCountry[i];
            var itemA = item.a;
            var itemB = item.b;
            var itemC = item.c;

            if (itemB.toLowerCase() == cd.toLowerCase()) {
                cityname = itemC || itemA;
                break;
            }
        }
        return cityname;
    }
    return '';
}
