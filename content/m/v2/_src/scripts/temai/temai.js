"use strict";

var temaiexports = {};

temaiexports.init = function () {

    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/unveil.js', function () {
        window.unveil.init('j_temaiList');
    });

    temaiexports.initTourList();
    temaiexports.initSubmit();

    temaiexports.tip();
    temaiexports.userModify();

    var sBox = $('#j_temaiFocus');
    var len = sBox.find('a.box').length;
    if (sBox.get(0) && len > 1) {

        _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
            window.slider.api("j_temaiFocus", "j_temaiFocusWrap", 5000, true);//详细页面banners
        });

    }

    var sTab = $('#j_userTab');
    if (sTab.get(0)) {
        _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
            window.tab.init('j_userTab');
        });
    }

    //显示日历
    temaiexports.calendar();

    //提交添加旅客表单
    temaiexports.addUser();

    //提交选中常用旅客信息
    temaiexports.saveChooseTourList();

    //订单页面提交表单
    temaiexports.submitOrder();

    temaiexports.math();

    temaiexports.saveRoute();

};

//初始化
temaiexports.initSubmit = function () {

    var u = location.href.toLowerCase().replace('#', '');

    var pid = _util.url.get('pid');
    var gdate = _util.url.get('gdate');

    var contactMan = window.unescape(_util.url.get('contactman'));
    var contactPhone = _util.url.get('contactphone');

    var fenshu = _util.url.get('fenshu');
    var renshu = _util.url.get('renshu');

    var ischina = _util.url.get('ischina');

    //ids
    var tourids = _util.url.get('tourids');

    var sb = [];
    if (pid) {
        $('#pid').val(pid);
    }
    if (gdate) {
        $('#gdate').val(gdate);
    }
    if (fenshu) {
        $('#j_fenshu').find('input').val(fenshu);
    }
    if (renshu) {
        $('#j_renshu').find('input').val(renshu);
    }
    if (ischina) {
        $('#ischina').val(ischina);
    }
    if (contactMan) {
        $('#j_orderContact').find('input').eq(0).val(contactMan);
    }
    if (contactPhone) {
        $('#j_orderContact').find('input').eq(1).val(contactPhone);
    }



};

temaiexports.initTourList = function () {
    var u = location.href.toLowerCase().replace('#', '');
    var tourids = _util.url.get('tourids');
    if (tourids) {
        var ids = tourids.split('-');
        var rds = $('#j_userTab').find('.users-list').find('li').find('.round');
        rds.each(function () {
            var oo = $(this);
            var oop = oo.parents('li');
            var ooa = oop.attr('data-id');
            var bIn = $.inArray(ooa, ids);
            if (bIn > -1) {
                oo.addClass('on');
            }

        });
    }
};

temaiexports.saveChooseTourList = function () {
    var u = location.href.toLowerCase().replace('#', '');
    var myCount = _util.url.get('renshu');

    $('#j_saveChooseList').on('click', function () {
        var ul = $('#j_userTab').find('.bd').find('.item').find('ul');
        var ss = ul.find('span.on');
        var sb = [];
        ss.each(function () {
            var oo = $(this);
            var oop = oo.parents('li');
            var oov = oop.attr('data-id');
            sb.push(oov);
        });

        if (sb.length == myCount) {
            u = u.replace('touristlist', 'temaisubmit');
            var newUrl = _util.url.set('tourids', sb.join('-'));

            if (newUrl.indexOf('renshu') > -1) {
                var tagr = "renshu=" + _util.url.get('renshu');
                if (tagr) {
                    newUrl = newUrl.replace(tagr, "renshu=" + sb.length);
                }
            }
            location.href = newUrl;
        } else {
            _uzm.pop.toast('请选择' + myCount + '位旅客');
        }
    });
};

temaiexports.addUser = function () {
    var pop = function (obj, v) {
        _uzm.pop.toast(v);
        //obj.focus();
    };

    $('#personType').on('change', function () {
        var oo = $(this);
        var oov = oo.val();
        if (oov == '0') {
            //成人
            $('#userPhone').parents('.clearfix').show();
        } else if (oov == '3') {
            $('#userPhone').parents('.clearfix').hide();
        }
    });

    $("#j_saveUser").click(function () {
        //验证

        var url = location.href.toLowerCase();
        var id = 0;
        if (url.indexOf('-') > -1) {
            id = url.split('-')[1].split('.')[0];
        }

        var sb = [];
        var push = function (obj, name) {
            if (obj.val()) {
                sb.push(name + '=' + obj.val());
            }
        };

        var b = true;

        var usertype = $('input[name=usertype]');

        var userName = $('input[name=userName]');
        var personType = $('select[name=personType]');
        var userSex = $('select[name=userSex]');
        var userNational = $('input[name=userNational]');
        var userPaper = $('select[name=userPaper]');
        var userPaperID = $('input[name=userPaperID]');
        var userPaperUseTime = $('input[name=userPaperUseTime]');
        var userBirthTime = $('input[name=userBirthTime]');
        var userPhone = $('input[name=userPhone]');

        if (id) {
            sb.push('tourid' + '=' + id);
        }

        sb.push('usertype' + '=' + usertype.val());

        if (!userName.val()) {
            pop(userName, '请输入姓名');
            return false;
        } else {
            push(userName, 'userName');
        }

        var ptv = personType.val();
        var isc = $('#usertype').val();

        if (personType.val()) {
            push(personType, 'personType');
        }

        if (userSex.val()) {
            push(userSex, 'userSex');
        }

        if (!userNational.val()) {
            if (ptv == '1') {
                //成人
                pop(userNational, '请输入国籍');
                return false;
            }
        } else {
            push(userNational, 'userNational');
        }

        if (userPaper.val()) {
            push(userPaper, 'userPaper');
        }

        if (!userPaperID.val()) {
            pop(userPaperID, '请输入证件号码');
            return false;
        } else {
            if (isc == '1') {
                //身份证
                if (userPaper.val() == '0') {
                    var r = _uzm.regex.idcard;
                    var isValid = new RegExp(r).test(userPaperID.val());
                    if (!isValid) {
                        pop(userPaperID, '请填写正确的身份证号码');
                        return false;
                    }
                }
            }
            push(userPaperID, 'userPaperID');
        }

        if (!userPaperUseTime.val()) {
            pop(userPaperUseTime, '请输入证件有效期');
            return false;
        } else {
            push(userPaperUseTime, 'userPaperUseTime');
        }

        if (!userBirthTime.val()) {
            pop(userBirthTime, '请输入出生日期');
            return false;
        } else {
            push(userBirthTime, 'userBirthTime');
        }
        if (!userPhone.val()) {
            if (ptv == '0') {
                //成人
                pop(userPhone, '请填写手机号');
                return false;

            } else if (ptv == '3') {
                //儿童
            }
        } else {
            if (!_uzm.regexForm.mobile(userPhone.val())) {
                pop(userPhone, '请填写正确的手机号');
                return false;
            } else {
                push(userPhone, 'userPhone');
            }
        }

        //提交表单
        var u = "/TouristSubmit";
        $.ajax({
            url: u,
            type: 'POST',
            data: sb.join('&'),
            success: function (data) {
                if (data == '1000') {
                    _uzm.pop.toast('保存成功');
                    location.href = document.referrer;//反回前页面

                } else {
                    _uzm.pop.toast('保存失败');
                }
            }
        });

    });
};

temaiexports.calendar = function () {

    //show calendar
    $('#j_txtTemaiDate').on('click', function () {
        var o = $(this);
        _uzm.mask.show();//展示mask
        $('#j_calendarTemai').css({ 'margin-bottom': '0' });

        //hide calendar
        $('.fn-mask').on('click', function () {
            _uzm.mask.hide();
            $('#j_calendarTemai').css({ 'margin-bottom': '-325px' });
        });

    });

    //选择日期
    $('#j_calendarTemai').on('click', 'div[id^=d]', function () {
        var o = $(this);
        var od = o.attr('datetime');
        $('#j_txtTemaiDate').val(od);

        var ourl = $('#temaisubmit').attr('href');
        var tag = _util.url.get(ourl, 'gdate');
        var nurl = ourl.replace('gdate=' + tag, 'gdate=' + od);
        $('#temaisubmit').attr('href', nurl);

        _uzm.mask.hide();
        $('#j_calendarTemai').css({ 'margin-bottom': '-325px' });

    });

};

temaiexports.math = function () {
    var box = $('#j_numControl');
    var fs = parseInt(box.find('b.fs').text(), 10);//per fenshu
    var cn = parseInt($('#cutNum').val(), 10);//cut number

    var txtFen = $('#j_fenshu').find('input');//份数
    var txtRen = $('#j_renshu').find('input');//人数

    var nFen = $('#j_fenshu');
    var nRen = $('#j_renshu');

    var conBox = $('#j_orderListUsers');

    //初始化处理旅客信息
    var _unitUserEvent = function () {
        var conRen = parseInt(txtRen.val(), 10);
        var conUl = conBox.find('ul');
        var sb = [];
        var u = location.href.toLowerCase().replace('#', '');
        u = u.replace('temaisubmit', 'touristList');
        var url = _util.url.set('ischina', $('#j_isChina').val() || '0');

        var len = conUl.find('li').length;
        if (len <= 0) {
            for (var i = 0; i < conRen; i++) {
                sb.push("<li class='clearfix'>");
                sb.push("<a class='block clearfix' href='#'>");
                sb.push("<span class='fl f999 g4 f14'>第<span>" + (i + 1) + "</span>位旅客</span>");
                sb.push("<div class='fl g6'>");
                sb.push("<p class='p1 f16'></p>");
                sb.push("<p class='p2 f12 f999'></p>");
                sb.push("</div>");
                sb.push("<span class='arrow'></span>");
                sb.push("</a>");
                sb.push("</li>");
            }
            conUl.html(sb.join(''));
        }
    };
    _unitUserEvent();

    //价格联动
    var _unitPriceEvent = function () {

        var pbox = $('.order-summary').find('.info').find('.block').find('.f18');
        var punit = parseInt(pbox.attr('data-unitprice'), 10);
        var fenshu = parseInt($('#buynum').val(), 10);

        pbox.text(punit * fenshu);
    };
    _unitPriceEvent();

    var _unitUserEventExt = function (renshu) {
        renshu = parseInt(renshu, 10) || 1;
        var conUl = conBox.find('ul');
        var len = conUl.find('li').length;
        var renShu = parseInt($('#j_renshu').find('input').val(), 10);//现人数
        if (renshu > len) {
            var cha = renshu - len;
            var sb = [];
            for (var i = 0; i < cha; i++) {
                sb.push("<li class='clearfix'>");
                sb.push("<a class='block clearfix' href='#'>");
                sb.push("<span class='fl f999 g4 f14'>第<span>" + (len + i + 1) + "</span>位旅客</span>");
                sb.push("<div class='fl g6'>");
                sb.push("<p class='p1 f16'></p>");
                sb.push("<p class='p2 f12 f999'></p>");
                sb.push("</div>");
                sb.push("<span class='arrow'></span>");
                sb.push("</a>");
                sb.push("</li>");
            }
            conUl.append(sb.join(''));
        } else if (renshu < len) {
            var lis = conUl.find("li");//逗b zepto 不支持节点gt remove 
            lis.each(function (k, v) {
                if (k >= renshu) {
                    var oo = $(this);
                    oo.remove();
                }
            });
        }
    };



    //绑定点击事件，添加长参数url
    conBox.on('click', 'li', function () {

        var u = location.href.toLowerCase().replace('#', '');

        var pid = _util.url.get('pid');
        var gdate = _util.url.get('gdate');

        var contactMan = $('#j_orderContact').find('input').eq(0).val();
        var contactPhone = $('#j_orderContact').find('input').eq(1).val();

        var fenshu = $('#j_fenshu').find('input').val();
        var renshu = $('#j_renshu').find('input').val();

        var ischina = $('#ischina').val();

        //ids
        var tourids = _util.url.get('tourids');

        var sb = [];
        if (pid) {
            sb.push("pid=" + pid);
        }
        if (gdate) {
            sb.push("gdate=" + gdate);
        }
        if (fenshu) {
            sb.push("fenshu=" + fenshu);
        }
        if (renshu) {
            sb.push("renshu=" + renshu);
        }
        if (ischina) {
            sb.push("ischina=" + ischina);
        }
        if (contactMan) {
            sb.push("contactman=" + window.escape(contactMan));
        }
        if (contactPhone) {
            sb.push("contactphone=" + contactPhone);
        }
        if (tourids) {
            sb.push("tourids=" + tourids);
        }

        location.href = "/touristList?" + sb.join('&');

    });

    //处理默认

    //份数操作
    nFen.find('span').on('click', function () {
        var o = $(this);
        var otxt = o.siblings('.s2');//输入框
        var otxtV = parseInt(otxt.val(), 10);


        if (o.hasClass('s3')) {
            //加操作
            if (otxtV < cn) {
                otxt.val(otxtV + 1);
                txtRen.val((otxtV + 1) * fs);
            } else {
                _uzm.pop.toast('最多可选择' + cn + '份');
            }
        } else if (o.hasClass('s1')) {
            if (otxtV <= 1) {
                return;
            }
            //减操作
            if (otxtV <= cn) {
                otxt.val(otxtV - 1);
                txtRen.val((otxtV - 1) * fs);
            }
        }
        _unitPriceEvent();
        _unitUserEventExt(txtRen.val());
    });

    //人数操作
    nRen.find('span').on('click', function () {
        var o = $(this);
        var otxt = o.siblings('.s2');//输入框
        var otxtV = parseInt(otxt.val(), 10);
        var otxtVN;
        var mo;
        if (o.hasClass('s3')) {
            //加操作
            if (otxtV < fs * cn) {
                otxt.val(otxtV + 1);
                //处理份数单位 
                otxtVN = parseInt(otxt.val(), 10);//新值
                mo = otxtVN % fs;  //模除
                if (mo > 0) {
                    txtFen.val(parseInt((otxtVN / fs).toString().split('.')[0], 10) + 1);
                } else if (mo === 0) {
                    txtFen.val(otxtVN / fs);
                }
            } else {
                _uzm.pop.toast('最多可出行人数为' + fs * cn);
            }

        } else if (o.hasClass('s1')) {
            //减操作
            if (otxtV > 1) {
                otxt.val(otxtV - 1);
                //处理份数单位 
                otxtVN = parseInt(otxt.val(), 10);//新值
                mo = otxtVN % fs;  //模除
                if (mo > 0) {
                    txtFen.val(parseInt((otxtVN / fs).toString().split('.')[0], 10) + 1);
                } else if (mo === 0) {
                    txtFen.val(otxtVN / fs);
                }
            }
        }
        _unitPriceEvent();
        _unitUserEventExt(txtRen.val());
    });



};

temaiexports.tip = function () {
    $('#j_temaiUserTip').on('click', function () {
        var sHtml = "<p>1.乘客姓名必须与登记所持证件姓名一致。</p><p>2.持护照登机，如使用中文姓名，请确保护照上有相应的中文姓名。</p><p>3.持护照登机的外宾，请以姓在前名在后的方式填写，<BR>例：Zhang（姓）/San（名），不区分大小写。</p><p>4.英文名字的长度不可超过26个字符，如名字过长请使用缩写，乘客的姓氏不能缩写，名可以缩写。</p><p>5.名字中文含生僻字可直接输入拼音代替，例：“王焉”可输入“王yan”或者“王-yan”。</p>";
        _uzm.pop.cup(sHtml, 5000);
    });
};

//长按，左右滑动删除
temaiexports.userModify = function () {
    $('#j_userTab').find('.users-list').find('li').on('longTap', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
    });

    //点击空白
    $(document).on('tap', function (e) {
        var o = "#j_userTab,#j_userTab *";
        if (!$(e.target).is(o)) {
            $('#j_userTab').find('.users-list').find('li').removeClass('on');
        }
    });

    //选中
    $('#j_userTab').find('.users-list').find('li').find('.round-box').on('click', function () {
        var o = $(this).find('.round');
        if (o.hasClass('on')) {
            o.removeClass('on');
        } else {
            o.addClass('on');
        }
    });

    //删除操作,点穿事件
    $('#j_userTab').find('.users-list').find('li').find('.icon-delete').on('click', function () {
        var o = $(this);
        var name = o.data('name');
        var ops = o.parents('li');
        var opsID = ops.attr('data-id');
        ops.remove();
        _uzm.pop.toast('联系人' + name + '已删除');

        $.ajax({
            url: '/touristsubmit?action=delete&tourid=' + opsID,
            type: 'GET',
            success: function () {

            }
        });

        return false;


    });
};

temaiexports.submitOrder = function () {
    $("#ordersubmit").on('click', function () {

        var cn = parseInt($('#cutNum').val(), 10);
        var fen = parseInt($('#j_fenshu').find('input').val(), 10);
        if (cn < fen) {
            _uzm.pop.toast('余位不够');
            return;
        }

        var name = $('#username').val();
        if (!name) {
            _uzm.pop.toast('请填写联系人');
            return;
        }

        var usermobile = $('#usermobile').val();
        if (!usermobile) {
            _uzm.pop.toast('请填写联系手机');
            return;
        } else {
            if (!_uzm.regexForm(usermobile)) {
                _uzm.pop.toast('请填写正确的手机号');
                return;
            }
        }

        var bLK = true;
        var lis = $('#j_orderListUsers').find('li');
        lis.each(function (k, v) {
            var o = $(this);
            var oname = $.trim(o.find('.g6').find('.p1').text());
            if (!oname) {
                bLK = false;
                return false;
            }
        });

        if (!bLK) {
            _uzm.pop.toast('请补充旅客信息');
            return;
        }



        $("#temaiorder").submit();
    });
};

//收藏线路
temaiexports.saveRoute = function () {
    var pid = $('#pid').val();
    $('.temai-focus').find('.star').on('click', function () {

        //check login
        if (!_uzm.user.userid) {
            location.href = _uzm.domain.u + "/mobile/login?reUrl=" + location.href;
        }

        var o = $(this);
        if (o.hasClass('star-on')) {
            $.ajax({
                type: 'GET',
                url: 'http://m.uzai.com/delproduct-' + pid + '.html',
                dataType: 'text',
                success: function (msg) {
                    o.removeClass('star-on');
                    _uzm.pop.toast('取消收藏成功');
                }, error: function () {

                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: 'http://m.uzai.com/addproduct-' + pid + '.html',
                dataType: 'text',
                success: function (msg) {
                    o.addClass('star-on');
                    _uzm.pop.toast('收藏成功');
                }, error: function () {

                }
            });
        }
    });


};

$(function () {
    temaiexports.init();
});
