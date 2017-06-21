//欧铁城市

//load 数据集中英文
var listRealTrainCity = [];

//共用autocomplete
function comTrainCity() {

    var ipt = $('input[data-cities-trigger]');
    if (!ipt.get(0)) {
        return;
    }

    var kn = "uzwTrainCities";//localStorage 存储名
   
    var dfr = function () {
        return $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiTrain/traincountrylist',
            cache: false,
            dataType: "jsonp"
        });
    };

    _util.localStorage.cache(kn, 1, dfr, function (data) {
        if (data && data.length) {
            listRealTrainCity = data;
        }
    });

    var _unitHide = function () {
        $('.cities-select-mod').hide();
        trainSelect.remove();
    };

    //即时输入智能filter
    var unitKeyEvent = function (o, event) {

        var ocityMod = o.siblings('.cities-select-mod');
        var ov = $.trim(o.val().toUpperCase());

        if (ov) {
            ocityMod.hide();
            trainSelect.show();
        } else {
            trainSelect.hide();
            ocityMod.show();
            return;
        }

        var kid = (event.keyCode ? event.keyCode : event.which);

        if (kid != '38' && kid != '40') {

            var sb = [];
            //遍历数据数组
            for (var i = 0; i < listRealTrainCity.length; i++) {
                var item = listRealTrainCity[i];
                var a = item.a.toUpperCase();
                var b = item.b.toUpperCase();
                var c = item.c.toUpperCase();

                if (b.indexOf(ov) === 0 || c.indexOf(ov) === 0 || a.indexOf(ov) === 0) {
                    if (c) {
                        sb.push('<li data-code="' + b + '"><span class="s1">' + c + '</span><span class="s2">' + a + '</span></li>');
                    } else {
                        sb.push('<li data-code="' + b + '"><span class="s1">' + a + '</span><span class="s2">' + b + '</span></li>');
                    }
                }
                if (sb.length >= 10) {
                    break;
                }
            }

            trainSelect.html(sb.join(''));
        }

        //mouseenter
        trainSelect.find('li').on('mouseenter', function () {
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

        if (trainSelect.find('li').not('.li-none').length <= 0) {
            trainSelect.empty();
            trainSelect.append("<li class='li-none'>找不到'" + ov + "'</li>");
            o.siblings('input:hidden').val('');//清空隐藏域值
        } else {
            trainSelect.find('.li-none').remove();
        }
    };

    //设置code3
    var setCode3 = function (o) {

        //输入时候添加三字码
        var lis = trainSelect.find('li').not('.li-none');
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
        var lis = trainSelect.find('li').not('.li-none');
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

        var lis = trainSelect.find('li');
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

    //set city name by code3
    var setCityByCode = function () {
        var url = location.href.toLowerCase();
        var ipts = $('input[data-cities-trigger]').next('input:hidden');
        ipts.each(function (k, v) {
            var item = $(this);
            var itemP = item.prev('input[data-cities-trigger]');//next input hidden;
            var iv = getCityByCode(item.val());
            itemP.val(iv);
        });
    };

    setCityByCode();

}

//get city name by code3
function getCityByCode(cd) {
    if (cd) {
        var cityname = '';
        for (var i = 0; i < listRealTrainCity.length; i++) {
            var item = listRealTrainCity[i];
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