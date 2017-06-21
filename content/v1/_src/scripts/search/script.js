/*
* 我是完美日志修改历史
* *********************************************
* 修改日期     |   作者  |   修改内容
* 2015-05-20       胡泊     出发城市中的'全部'标签调整
* 2015/10/13       JoJo     优化搜索界面改版，加入高级搜索
*/
var intReg = /^[0-9]|[1-9][0-9]*$/; //正整数
var floatReg = /^[0-9]+(.[0-9]{1,3})?$/;   //正浮点数


//判断后台页面
$(function () {
    var ur = location.href.toLowerCase();
    if (ur.indexOf('uztype=manager') > -1) {
        //头
        $("#j_indexTopAds").remove();
        $(".newHeader").remove();
        $("#j_uzaiTopNotice").remove();
        $(".newTop").remove();
        $("#j_globalNav").remove();
        $(".umenubot").remove();
        //右侧
        $("#frSide").remove();
        //底
        $(".global-footer,#j_globalSidebar,.foot-link-nav").remove();
        $('#j_globalSidebar').find('.back-top').remove();
        $("body").css("overflow-x", "hidden");
        $(".main-box").css("margin", "0");
        //二维码APP
        $("#J_appMask").remove();
        AddElement();
    }
});


$(function () {
    searchFold();
    uzLazy('j_mainRoute');
    searchCalendar();
    searchGuessLike();
});

/*******************************************************  begin 您已选择后的文字显示及关闭事件  ***************************************************/
//标签属性值
function GetSelAttrVal(t) {
    //跟团、自由行
    if (t == 1) return "sub"; //分类主题 data-option='sub'
    if (t == 2) return "city"; //出发城市 data-option='city'
    if (t == 3) return "tree"; //途径景点 data-option='tree'
    if (t == 4) return "person"; //适合人群 data-option='person'
    if (t == 8) return "day"; //行程天数 data-option='day'
    if (t == 9) return "price"; //自定义价格 data-option='price'
    if (t == 10) return "date"; //点选出发日期 data-option='date'
    if (t == 11) return "date"; //自定义出发日期 data-option='date'
    if (t == 24) return "grade"; //产品钻石等级 data-option='grade'
    //邮轮使用
    if (t == 12) return ""; //点击邮轮面板
    if (t == 13) return "city"; //出发城市 data-option='city'
    if (t == 14) return "destination"; //航线目的地 data-option='destination'
    if (t == 15) return "company"; //邮轮公司 data-option='company'
    if (t == 16) return "port"; //出发港口 data-option='port'
    if (t == 17) return "date"; //点选出发日期 data-option='date'
    if (t == 18) return "date"; //自定义出发日期 data-option='date'
    //签证使用
    if (t == 101) return "area"; //地区 data-option='area'
    if (t == 102) return "country"; //国家 data-option='country'
    if (t == 103) return "lingqu"; //所属领区 data-option='lingqu'
    if (t == 104) return "visatype"; //签证类型 data-option='visatype'

    if (t == 5) return ""; //排序默认
    if (t == 6) return ""; //分页
    if (t == 7) return ""; //分页
    if (t == 20) return ""; //悠中选悠
    if (t == 21) return ""; //优惠促销
    if (t == 22) return ""; //热门搜索
    if (t == 23) return ""; //半自助游
}
//标签属性值
function GetSelTitle(t) {
    //跟团、自由行
    if (t == 1) return "分类主题"; //分类主题 data-option='sub'
    if (t == 2) return "出发城市"; //出发城市 data-option='city'
    if (t == 3) return "途径景点"; //途径景点 data-option='tree'
    if (t == 4) return "适合人群"; //适合人群 data-option='person'
    if (t == 8) return "行程天数"; //行程天数 data-option='day'
    if (t == 9) return "价格"; //自定义价格 data-option='price'
    if (t == 10) return "出发日期"; //点选出发日期 data-option='date'
    if (t == 11) return "出发日期"; //自定义出发日期 data-option='date'
    if (t == 24) return "产品等级"; //产品钻石等级 data-option='grade'
    //邮轮使用
    if (t == 12) return "邮轮"; //点击邮轮面板
    if (t == 13) return "出发城市"; //出发城市 data-option='city'
    if (t == 14) return "航线目的地"; //航线目的地 data-option='destination'
    if (t == 15) return "邮轮公司"; //邮轮公司 data-option='company'
    if (t == 16) return "出发港口"; //出发港口 data-option='port'
    if (t == 17) return "出发日期"; //点选出发日期 data-option='date'
    if (t == 18) return "出发日期"; //自定义出发日期 data-option='date'
    //签证使用
    if (t == 101) return "地区"; //地区 data-option='area'
    if (t == 102) return "国家"; //国家 data-option='country'
    if (t == 103) return "所属领区"; //所属领区 data-option='lingqu'
    if (t == 104) return "签证类型"; //签证类型 data-option='visatype'

    if (t == 5) return ""; //排序默认
    if (t == 6) return ""; //分页
    if (t == 7) return ""; //分页
    if (t == 20) return ""; //悠中选悠
    if (t == 21) return ""; //优惠促销
    if (t == 22) return ""; //热门搜索
    if (t == 23) return ""; //半自助游
}

//您已选择 单项关闭
function GetEvent(t) {
    //跟团、自由行
    if (t == 1) return "setparam('0',1,$('#hrefsuball'));"; //分类主题 data-option='sub'
    if (t == 2) return "setparam('0',2,$('#hrefCity0'));"; //出发城市 data-option='city'
    if (t == 3) return "setparam('0',3,$('#hrefpast'));"; //途径景点 data-option='tree'
    if (t == 4) return "setparam('',4,$('#hrefsuitman'));"; //适合人群 data-option='person'
    if (t == 8) {
        //邮轮
        if ($('#tbCruisesWhere').css('display') == 'block') {
            return "querybyDay($('#tagCruises7'));"; //行程天数 data-option='day'
        } else {
            //跟团，自助，公司
            return "querybyDay($('#uldays a[tag=tag8]').first());"; //行程天数 data-option='day'
        }
    }
    if (t == 9) return "$('#txtprice1,#txtprice2').val('');setparam('',9,this);"; //自定义价格 data-option='price'
    if (t == 10) return "setparam('',10,$('#hrefdateall'));"; //点选出发日期 data-option='date'
    if (t == 11) return "setparam('',10,$('#hrefdateall'));"; //自定义出发日期 data-option='date'
    if (t == 24) return "setparam('0',24,$('#gradeall'));"; //产品钻石等级 data-option='grade'
    //邮轮使用
    if (t == 12) return "setparam('tra_4',12,$('#li2[tag=tag01]'));"; //点击邮轮面板
    if (t == 13) return "setparam('0',13,$('#hrefCityCruises0'));"; //出发城市 data-option='city'
    if (t == 14) return "setparam('0',14,$('#hrefCruisesRouteAll'));"; //航线目的地 data-option='destination'
    if (t == 15) return "setparam('',15,$('#hrefCruisesCompAll'));"; //邮轮公司 data-option='company'
    if (t == 16) return "setparam('',16,$('#hrefCruisesPortAll'));"; //出发港口 data-option='port'
    if (t == 17 || t == 18) {
        //邮轮
        if ($.trim($("#tbCruisesWhere").css("display")) != "none") {
            return "setparam('',17,$('#hrefCruisesDateAll'));"; //自定义出发日期 data-option='date'
        } else {
            //跟团，自助，公司
            return "setparam('',17,$('#hrefdateall'));"; //自定义出发日期 data-option='date'
        }
    }
    //签证使用
    if (t == 101) return "setParamVisa('',1,$('#hrefVisaAreaAll'));"; //地区 data-option='area'
    if (t == 102) return "setParamVisa('',2,$('#hrefVisaCountryAll'));"; //国家 data-option='country'
    if (t == 103) return "setParamVisa('',3,$('#hrefVisaReceiveZoneAll'));"; //所属领区 data-option='lingqu'
    if (t == 104) return "setParamVisa('',4,$('#hrefVisaTypeAll'));"; //签证类型 data-option='visatype'

    if (t == 5) return ""; //排序默认
    if (t == 6) return ""; //分页
    if (t == 7) return ""; //分页
    if (t == 20) return ""; //悠中选悠
    if (t == 21) return ""; //优惠促销
    if (t == 22) return ""; //热门搜索
    if (t == 23) return ""; //半自助游
}

//标签属性值
function GetSelVal(t) {
    var txt;
    if (t == 9) {
        var s = $.trim($("#txtprice1").val());
        var e = $.trim($("#txtprice2").val());
        if (!intReg.test(s) && !floatReg.test(s)) s = 0;
        if (!intReg.test(e) && !floatReg.test(e)) e = 0;
        s = parseInt(s, 10);
        e = parseInt(e, 10);
        if (s && !e) {
            //选择了开始日期，没选择结束日期
            txt = s + "元以上";
        }
        else if (!s && e) {
            //选择了结束日期，没选择开始日期
            txt = e + "元以下";
        }
        else if (s && e) {
            txt = s + "元 ~ " + e + "元";
        }
        return txt; //自定义价格
    }
    if (t == 11 || t == 18) {
        //跟团，自助，公司
        var ss = $.trim($("#txtdate1").val());
        var ee = $.trim($("#txtdate2").val());
        //邮轮
        if ($.trim($("#tbCruisesWhere").css("display")) != "none") {
            ss = $.trim($("#txtdateCruises1").val());
            ee = $.trim($("#txtdateCruises2").val());
        }
        if (!ss) {
            txt = "清除";
            return txt;
        } //表示没选择开始日期
        if (ss) {
            ss = ss.replace('/', '年').replace('/', '月') + '日';
        }
        if (ee) {
            ee = ee.replace('/', '年').replace('/', '月') + '日';
        }
        if (ss && !ee) {
            //选择了开始日期，没选择结束日期
            txt = ss + "以后";
        }
        else if (!ss && ee) {
            //选择了结束日期，没选择开始日期
            txt = ee + "之前";
        }
        else if (ss && ee) {
            txt = ss + " ~ " + ee;
        }
        return txt; //自定义出发日期
    }
    return null;
}

//面板选中后显示在已选择中
//param type=setparam(des, type, obj) 方法的type
//param th=setparam(des, type, obj) 方法的obj
function CheckedPanel(type, th) {
    //显示您已选择对象
    var oo = $("dl[data-option=main]");

    //面板切换
    if ($.trim($(th).attr("tag")) == "tag0" || $.trim($(th).attr("tag")) == "tag01" || $.trim($(th).attr("tag")) == "tag02") {
        oo.find("label.tag-item").remove();
        oo.css("display", "none");
    }

    /******************************** begin 跟团，自助，公司 ************************************/
    var j_choiceObj;
    //跟团，自助，公司
    if ($.trim($("#j_choiceItems").css("display")) != "none") j_choiceObj = $("#j_choiceItems");

    //邮轮
    else if ($.trim($("#tbCruisesWhere").css("display")) != "none") j_choiceObj = $("#tbCruisesWhere");

    //签证
    else if ($.trim($("#divParamVisa").css("display")) != "none") j_choiceObj = $("#divParamVisa");


    if (!j_choiceObj) return;

    j_choiceObj.find("dl:visible,dl.hide").each(function (i, event) {

        var obj = $(event);
        var chk = obj.find(".on");
        var currentObjEvent, tt, lbl;

        if (chk.length === 0 || $.trim(chk.text()) == "全部") {
            //表示当前没有选中的或者选择的全部
            currentObjEvent = chk.attr("onclick");
            tt = currentObjEvent.split(',')[1]; //14
            if (!tt || !intReg.test(tt)) {
                tt = $(chk).attr("tag").replace("tag", "");
            }
            if ($.trim(chk.attr("tag")).toLowerCase().indexOf("visa") >= 0) {
                tt = 10 + tt;
            }
            var attr01 = GetSelAttrVal(tt);
            lbl = oo.find("label[data-option='" + attr01 + "']");
            if (lbl.length >= 1) {
                if (attr01 == "date") {
                    if ($.trim($("#j_choiceItems").css("display")) != "none") {

                        if ($.trim($("#txtdate1").val()) || $.trim($("#txtdate2").val())) {
                            return true; //不往下操作，日期存在数据
                        }

                    }
                    else if ($.trim($("#tbCruisesWhere").css("display")) != "none") {

                        if ($.trim($("#txtdateCruises1").val()) || $.trim($("#txtdateCruises2").val())) {
                            return true; //不往下操作，日期存在数据
                        }
                    }
                }
                //说明存在您已选择项中，进行删除
                lbl.remove();
            }
            return true;
        }

        //**********************说明有选中的*****************************

        currentObjEvent = chk.attr("onclick"); //setparam('日韩邮轮航线', 14, this);
        var eventName = currentObjEvent.split('(')[0]; //setparam
        tt = currentObjEvent.split(',')[1]; //14
        if (!tt || !intReg.test(tt)) {
            tt = $(chk).attr("tag").replace("tag", "");
        }
        if ($.trim(chk.attr("tag")).toLowerCase().indexOf("visa") >= 0) {
            tt = 10 + tt;
        }
        var attrval = GetSelAttrVal(tt); if (!attrval || !attrval) return; //当前事件不做任何事情
        var title = GetSelTitle(tt);
        var events = GetEvent(tt);
        var txt = GetSelVal(tt); if (!txt || txt == " ~ ") txt = $.trim(chk.text());
        lbl = oo.find("label[data-option='" + attrval + "']");
        if (!lbl.length) {
            //不存在 追加html
            oo.find(".tag-items").append("<label data-option='" + attrval + "' class='tag-item'><span class='item-main pl5 vm'>" + title + "：<em class='red'>" + txt + "</em></span><span onclick=\"" + events + "\" class='tag-close pointer vm'><i class='close-icon'>×</i></span></label>");
        } else {
            lbl.find("em.red").text(txt);
        }
        //***********说明有选中的***************
    });
    if (oo.find("label.tag-item").length >= 1) {
        oo.css("display", "");
    } else {
        oo.css("display", "none");
    }

    //价格和日期自定义
    if (type == 9 || type == 11 || type == 18) {
        var currentObjEvent = $(th).attr("onclick"); //setparam('日韩邮轮航线', 14, this);
        var eventName = currentObjEvent.split('(')[0]; //setparam
        var tt = currentObjEvent.split(',')[1]; //14
        if (!tt || !intReg.test(tt)) {
            tt = type;
        }
        if ($.trim($(th).attr("tag")).toLowerCase().indexOf("visa") >= 0) {
            tt = 10 + tt;
        }
        var attrval = GetSelAttrVal(tt);
        var title = GetSelTitle(tt);
        var events = GetEvent(tt);
        var txt = GetSelVal(tt); if (!txt || txt == " ~ ") txt = $.trim($(th).text());
        var lbl = oo.find("label[data-option='" + attrval + "']");
        //消除显示段
        if (txt == "确定" || txt == "全部" || txt == "清除" || txt == "×") {
            lbl.remove();
            if (oo.find("label").length === 0) {
                oo.css("display", "none");
            }
            return;
        }
        if (lbl.length === 0) {
            //不存在 追加html
            oo.find(".tag-items").append("<label data-option='" + attrval + "' class='tag-item'><span class='item-main pl5 vm'>" + title + "：<em class='red'>" + txt + "</em></span><span onclick=\"" + events + "\" class='tag-close pointer vm'><i class='close-icon'>×</i></span></label>");
        } else {
            lbl.find("em.red").text(txt);
        }

    }


    return;
    /******************************** end 跟团，自助，公司 ************************************/

}
/*******************************************************  end 您已选择后的文字显示及关闭事件  ***************************************************/

//更多筛选条件（收起/展开）
function searchFold() {
    var box = $(".choice-items"); // $('#j_choiceItems');
    var icon = box.find('.switch');
    var oMS = box.find('.more-switch');

    icon.on('click', function () {
        var o = $(this);
        var oem = o.find('em');
        var ot = o.find('i');
        if (ot.hasClass('arrow-bottom')) {
            oem.text('收起');
            o.parent().next().find('.hide').css({
                'display': 'inline-block'
            });
            ot.attr('class', 'arrow-top');
        } else {
            oem.text('展开');
            o.parent().next().find('.hide').hide();
            ot.attr('class', 'arrow-bottom');
        }
    });

    oMS.on('click', function () {
        var o = $(this);
        var osc = o.find('.switch-cont');
        var oam = o.find('.arrow-mod');
        var obox = o.parents(".choice-items");
        if (oam.hasClass('on')) {
            osc.text('更多筛选条件');
            obox.children('dl.hide').hide();
            oam.removeClass('on');
        } else {
            osc.text('收起筛选条件');
            obox.children('dl.hide').show();
            oam.addClass('on');
        }
    });

    $('#j_sortBar').find('.price-bar').on('mouseenter', function () {
        var oThis = $(this);
        oThis.addClass('price-bar-on');
    }).on('mouseleave', function () {
        var oThis = $(this);
        oThis.removeClass('price-bar-on');
    });
}

var webStr = "http://search.uzai.com";

//字符替换
String.prototype.changeQuery = function (name, value) {
    var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
    var tmp = name + "=" + value;
    if (this.match(reg)) {
        return this.replace(eval(reg), tmp);
    }
    else {
        reg = new RegExp("[\\?]");
        if (this.match(reg))
            return this + "&" + tmp;
        else
            return this + "?" + tmp;
    }
};
//获取URL参数
function getQueryStringRegExp(name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    return "";
}
function SetUrlParm(parm, value) {
    var URL = location.href;
    if (URL.indexOf('?') < 0) {
        URL += '?' + parm + '=' + value;
    }
    else {
        var dataParm = getQueryStringRegExp(parm);
        if (!dataParm) {
            URL += '&' + parm + '=' + value;
        }
        else {
            URL = URL.changeQuery(parm, value);
        }
    }
    return URL;
}
function initPage() {
    if (parseInt($('#hdsub').val(), 10)) {
        $('#hrefsub').click();
    }

    if (parseInt($('#hdpastAddress').val(), 10)) {
        $('#hrefpastaddress').click();
    }

    $('#txtprice1,#txtprice2').click(function () {
        $('#priceRange').attr('class', 'widget_select_show');
        $('#pricetip').show();
        $('#btnsetprice').show();
    });
    $('#selDay').hover(function () {
        $(this).attr('class', 'widget_select type_right widget_over_right');
        $('#dvselday').css('border-left', '1px solid rgb(153, 153, 153)');
        $('#uldays').show();
    }, function () {
        $(this).attr('class', 'widget_select type_right');
        $('#dvselday').css('border-left', '1px solid #D3D3D3');
        $('#uldays').hide();
    });

}

function search() {
    var keyword = $.trim($('#txtsearch').val());
    if (!keyword.length) {
        $('#txtsearch').css({ 'border': 'solid 1px #FF0000' });
        $('#dvsearchtip').show();
        $('#txtsearch').focus();
        setTimeout(function() {
            $("#dvsearchtip").fadeOut();
        }, 3000);
        return;
    }
    if ($('#txtprice1').val()) {
        $('#hdprice1').val($('#txtprice1').val());
    }
    if ($('#txtprice2').val()) {
        $('#hdprice2').val($('#txtprice2').val());
    }
    $('#formsearch').submit();
}

$(document).click(function (evt) {
    evt = evt ? evt : (window.event ? window.event : null);
    var elem = evt.srcElement ? evt.srcElement : evt.target;
    var objId = $(elem).attr('id');
    if (objId == 'txtprice1' || objId == 'txtprice2' || objId == 'dvprice' || objId == 'pricetip' || objId == 'btnsetprice') {
    }
    else {
        $('#priceRange').attr('class', 'widget_select widget_style');
        $('#pricetip').hide();
        $('#btnsetprice').hide();
    }
});
function setrecomClick(kwd, productId) {
    $.ajax({
        type: 'GET',
        data: 'kwd=' + escape(kwd) + '&p=' + escape(productId) + '&m=' + $("#hddomain").val() + '&rad=' + Math.random(),
        url: '/searchStaticClick',
        success: function (data) { }
    });
}
function showorhidetree(obj, objhref, type, city) {
    var display = $('a[name=tree' + type + obj + city + ']').eq(0).css('display');
    if (display == 'none') {
        $('a[name=tree' + type + obj + city + ']').show();
        $(objhref).html('<img src="http://r.uzaicdn.com/Content/1/image/bg/show.gif" style="padding-left:3px;" />收起');
    }
    else {
        $('a[name=tree' + type + obj + city + ']').hide();
        $(objhref).html('<img src="http://r.uzaicdn.com/Content/1/image/bg/show.gif" style="padding-left:3px;"/>展开');
    }
}

function setparam(des, type, obj) {
    var litag = $(obj).attr("litag"); //$("#ultravelclass .curr").attr("litag");
    var subparm = {};
    if (!litag) {
        litag = $.trim($("#ultravelclass .on").attr("litag"));
    }
    //当地游，4酒店套餐，8门票，9私家团，10门票+酒店
    if (litag == "2" || litag == "4" || litag == "8" || litag == "9" || litag == "10") {
        $("#j_choiceItems").find("dl").eq(0).css("display", "none");
        $("#j_choiceItems").find("dl").eq(1).css("border-top-width", "0px");
    }
    else {
        $("#j_choiceItems").find("dl").eq(0).css("display", "");
        $("#j_choiceItems").find("dl").eq(1).css("border-top-width", "1px");
    }

    //当前页码
    $('#hdpgidx').val('1');
    //$("#dv_01").remove();

    //除签证之外的线路列表
    $("#ulgylist").hide();
    //签证产品列表
    $("#ulqlist").hide();

    //筛选无结果
    $(".res-nocontent").hide();
    //正在查询
    $('#dvwait').show();

    //请选择日期
    $("#spanDateError").hide();
    //显示页面及总页码
    $("#hjPagesThumb,#hjPages").hide();

    if (type == 1) {
        //******************** begin 点击产品类别(刨开邮轮，签证)和分类主题******************************

        //分类主题
        $('a[tag=tag1]').attr('class', 'item');

        if (des && des.indexOf('tra_') > -1) {

            var productTypeId = des.replace('tra_', '');

            //0跟团，01邮轮，02签证
            $("li[tag='tag0'],li[tag='tag01'],li[tag='tag02']").removeAttr("class");
            //当前menu给定选中样式
            $(obj).attr("class", "on");
            //产品二级类别
            $('#hdtravelclass').val(productTypeId);
            //主题类别
            $('#hdsub2').val('0');
            //主题类别选中全部
            $('#dvsubtype a[tag=tag3]').removeClass("on");
            $('#hrefsuball').attr('class', 'on');

            //邮轮搜索条件
            $("#tbCruisesWhere").hide();
            //跟团，自助，公司搜索条件
            $("#j_choiceItems").show();
            //签证搜索条件
            $("#divParamVisa").hide();

            //当地游，4酒店套餐，8门票，9私家团，10门票+酒店
            //if (litag == "2" || litag == "4" || litag == "8" || litag == "9" || litag == "10") {
            ////城市
            //$('#hdbeg2,#hdbeg').val("0");
            //}
        }
        else {
            $('#hdsub2').val(des);
            $(obj).attr("class", "on");
        }

        var urltype = '/researchtype';
        subparm.kwd = $('#hdkwd').val();
        subparm.sub = $('#hdsub2').val();
        subparm.tp = $('#hdtravelclass').val();
        subparm.city = $('#hdbeg2').val();

        $.post(urltype, subparm, function (result) {
            var content = result.split('####');

            var HtmlStartCity = content[0];
            var HtmlPast = content[1];
            var HtmlDays = content[2];
            var HtmlGodate = content[3];
            var HtmlSub = content[4];
            var HtmlGrade = content[5];

            //出发地
            $('#dvtypestartcity').html(HtmlStartCity);
            //途经地
            $('#dvpastaddress').html(HtmlPast);
            //出行天数
            $('#uldays').html(HtmlDays);
            //出发日期
            $('#dvgodate').html(HtmlGodate);

            if (des.indexOf('tra_') > -1) {
                //主题类别
                $('#dvsubtype').html(HtmlSub);
            }
            //途经景点——全部
            $('#dvpastaddress a[tag=tag3]').removeClass("on");
            $('#hrefpast').attr('class', 'on');
            //产品钻石等级
            $('#dvgrade').html(HtmlGrade);

            //适合人群——全部
            $('#j_choiceItems a[tag=tag4]').removeClass("on");
            $('#hrefsuitman').attr('class', 'on');

            var starbeg = $.trim($('#hdbeg2').val());
            if (starbeg != '0') {
                if ($("#hrefCity" + starbeg) && $("#hrefCity" + starbeg).length >= 1) {
                    //出发城市
                    $('#hrefCity' + starbeg).attr('class', 'on');

                    $('#hdbeg').val(starbeg);
                }
                else {
                    if ($('#hrefCity2') && $('#hrefCity2').length >= 1) {
                        $('#hrefCity2').attr('class', 'on');

                        $('#hdbeg').val('2');
                    } else {
                        var typeStartCity = $('#dvtypestartcity').find("a").eq(0);
                        typeStartCity.attr('class', 'on');

                        $('#hdbeg').val(typeStartCity.attr("id").replace("hrefCity", ""));
                    }
                }
            }
            else {
                var tagindex = des.replace('tra_', '');
                if (tagindex == '2' || tagindex == '4' || tagindex == '8' || tagindex == '9') {
                    //不限地出发
                }
                else {
                    $('#hrefCity0').attr('class', 'on');
                    $('#hdbeg').val('0');
                }
            }
            //途经地
            $('#hdpast').val('0');
            //适合人群
            $('#hdman').val('0');
            //出行天数
            $('#hdday').val('');
            $('#hddtm').val('');
            //产品钻石等级
            $('#hdgrade').val("-1");

            showRouteList(type, obj);
        });
        return;

        //******************** end 点击产品类别(刨开邮轮，签证)和分类主题******************************
    }
    if (type == 2) {
        //******************** begin 点击出发城市******************************
        $('#hdbeg').val(des);
        $('#hdbeg2').val(des);

        //删除出发城市所有样式
        $('a[tag=tag2]').removeAttr('class');
        //当前a城市对象
        $(obj).attr('class', 'on');

        subparm = {};
        //关键房屋中
        subparm.kwd = $('#hdkwd').val();
        //主题
        //subparm.sub = $('#hdsub2').val();
        //线路类别
        subparm.tp = $('#hdtravelclass').val();
        //城市
        subparm.city = $.trim($('#hdbeg').val());
        $.post("/researchtype", subparm, function (result) {

            var content = result.split('####');

            var HtmlStartCity = content[0];
            var HtmlPast = content[1];
            var HtmlDays = content[2];
            var HtmlGodate = content[3];
            var HtmlSub = content[4];
            var HtmlGrade = content[5];

            //出发城市
            $('#dvtypestartcity').html(HtmlStartCity);
            //途经景点
            $('#dvpastaddress').html(HtmlPast);
            //行程天数
            $('#uldays').html(HtmlDays);
            //出发日期
            $('#dvgodate').html(HtmlGodate);
            //主题类别
            $('#dvsubtype').html(HtmlSub);
            //产品钻石等级
            $('#dvgrade').html(HtmlGrade);

            //$('#spanday').text('天数');
            //$('#hrefstartcity').attr('class', 'on');

            //途经景点——全部
            $('#dvpastaddress a[tag=tag3]').removeClass("on");
            $('#hrefpast').attr('class', 'on');

            //适合人群——全部
            $('#j_choiceItems a[tag=tag4]').removeClass("on");
            $('#hrefsuitman').attr('class', 'on');

            var starbeg = $.trim($('#hdbeg2').val());
            if (starbeg != '0') {
                if ($("#hrefCity" + starbeg)) {
                    //城市选中状态
                    $('#hrefCity' + starbeg).attr('class', 'on');

                    $('#hdbeg').val(starbeg);
                }
                else {
                    $('#hrefCity0').attr('class', 'on');
                    $('#hdbeg').val('0');
                }
            }
            else {
                $('#hrefCity0').attr('class', 'on');

                $('#hdbeg').val('0');
            }
            //TreeName
            $('#hdpast').val('0');
            //适合人群
            $('#hdman').val('0');
            //出行天
            $('#hdday').val('');
            //时间区间
            $('#hddtm').val('');
            //分类主题
            $('#hdsub2').val("0");
            //产品钻石等级
            $('#hdgrade').val("-1");

            showRouteList(type, obj);
        });
        return;
        //******************** end 点击出发城市******************************
    }
    if (type == 3) {
        //******************** begin 点击途经景点******************************
        $('#hdpast').val(des);
        $('a[tag=tag3]').removeAttr('class');
        $(obj).attr('class', 'on');
        //******************** end 点击途经景点******************************
    }
    if (type == 4) {
        //******************** begin 点击适合人群******************************
        $('#hdman').val(des);
        $('a[tag=tag4]').removeAttr('class');
        $(obj).attr('class', 'on');
        //******************** end 点击适合人群******************************
    }
    if (type == 5) {
        //******************** begin 点击排序******************************

        //排序值
        var _field = $('#hdfield').val();
        //排序方式orderdire
        var _type = $('#hdtype').val();

        //给定样式
        $("#divsortlist").find("li").removeClass("on");
        //选中样式
        $(obj).parents("li").addClass('on');

        if ($(obj).attr('id') == 'spansatisfy') {
            //当前点击的是满意度排序样式
            if ($(obj).find(".sort-down").length >= 1) {
                $(obj).find(".icon-sort").removeClass('sort-down').addClass('sort-up');
            } else {
                $(obj).find(".icon-sort").removeClass('sort-up').addClass('sort-down');
            }
        }
        if ($(obj).hasClass('sort-item')) {
            //当前点击的是价格排序样式
            var pbIS = $(obj).parents('.price-bar').find('.icon-sort');
            if ($(obj).find('.sort-1').length >= 1) {
                pbIS.removeClass('sort-down').addClass('sort-up');
            } else if ($(obj).find('.sort-2').length >= 1) {
                pbIS.removeClass('sort-up').addClass('sort-down');
            }
        }

        if (_field == des && parseInt(des, 10)) {
            _type = _type == '0' ? '1' : '0';
        }
        else {
            _type = (des == '3' || des == '2') ? '0' : '1';
        }

        //按价格排序 2015/10/20
        if (des == 3) {
            _type = $.trim($(obj).attr("data-sort"));
        }

        //排序值
        $('#hdfield').val(des);
        //排序方式orderdire
        $('#hdtype').val(_type);
        //******************** end 点击排序******************************
    }
    if (type == 6) {
        //******************** begin 点击分页******************************
        //function page(pgIndex)中使用
        $('#hdpgidx').val(des);
        //******************** end 点击分页******************************
    }
    if (type == 7) {
        //******************** begin 前期分页下拉框每页显示几条change事件【现未找到使用点】******************************
        $('a[tag=tag7]').attr('class', '');
        $(obj).attr('class', 'nowlink');
        $('#hdpgsize').val(des);
        //******************** end 前期分页下拉框每页显示几条change事件【现未找到使用点】******************************
    }
    if (type == 8) {
        //******************** begin 点击行程天数******************************
        //function querybyDay(obj)中使用
        $('a[tag=tag8]').removeAttr('class');
        $(obj).attr('class', 'on');
        $('#hdday').val(des);
        //******************** end 点击行程天数******************************
    }
    if (type == 9) {
        //******************** begin 输入价格区间******************************
        //第1价格
        $('#hdp1').val($('#txtprice1').val());
        //第2价格
        $('#hdp2').val($('#txtprice2').val());

        //******************** begin 输入价格区间******************************
    }
    if (type == 10) {
        //******************** begin 点击出发日期******************************
        $('#txtdate1,#txtdate2').val('');

        $('a[tag=tag10]').removeAttr('class');
        $(obj).attr('class', 'on');
        $('#hddtm').val(des);
        //******************** end 点击出发日期******************************
    }
    if (type == 11) {
        //******************** begin 手动输入出发日期搜索******************************
        var dtm1 = $('#txtdate1').val();
        var dtm2 = $('#txtdate2').val();
        if (!dtm1 && !dtm2) {

            //正在查询
            $('#dvwait').hide();
            //除签证之外的线路列表
            $("#ulgylist").show();

            $('#spanDateError').text('请选择出发时间').show();
            setTimeout(function () {
                $("#spanDateError").hide();
            }, 3000);
            return;
        }
        else if (!dtm1 && dtm2) {
            //正在查询
            $('#dvwait').hide();
            //除签证之外的线路列表
            $("#ulgylist").show();

            $('#txtdate2').val('');
            $('#txtdate1').focus();

            $('#spanDateError').text('请选择出发起止日期').show();
            setTimeout(function () {
                $("#spanDateError").hide();
            }, 3000);
            return;
        }
        else {
            if (!isDate(dtm1)) {
                $('#txtdate1').focus();
                $('#spanDateError').text('请选择正确的出发起止日期(如：2011/10/10)').show();
                setTimeout(function() {
                    $("#spanDateError").hide();
                }, 3000);
                return;
            }
            if (dtm2 && !isDate(dtm2)) {
                $('#txtdate2').focus();
                $('#spanDateError').text('请选择正确的出发起止日期(如：2011/10/10)').show();
                setTimeout(function() {
                    $("#spanDateError").hide();
                }, 3000);
                return;
            }
            //指定样式
            $('a[tag=tag10]').removeAttr('class');
            $('#hrefdateall').attr('class', 'on');

            var vDate = $('#txtdate1').val();
            if (dtm2) {
                vDate += '^' + dtm2;
            }
            $('#hddtm').val(vDate);
        }
        //******************** end 手动输入出发日期搜索******************************
    }
    if (type == 20) {
        //******************** begin 悠中选悠搜索******************************
        $("#hdisspike").val($(obj).is(":checked") ? 1 : 0);
        //******************** end 悠中选悠搜索******************************
    }
    if (type == 21) {
        //******************** begin 优惠促销搜索******************************
        $("#hdischeap").val($(obj).is(":checked") ? 1 : 0);
        //******************** end 优惠促销搜索******************************
    }
    if (type == 22) {
        //******************** begin 热门搜索【ResultLess.aspx】******************************
        if (!$.trim(des)) {
            window.location.href = webStr + "/sh/SearchResult?keyword=" + encodeURI($.trim($("#hdkwd").val())) + "&travelClass=0";
        }
        else {
            window.location.href = webStr + "/sh/SearchResult?keyword=" + encodeURI($.trim(des)) + "&travelClass=0";
        }
        return;
        //******************** end 热门搜索【ResultLess.aspx】******************************
    }
    if (type == 24) {
        //******************** begin 产品等级******************************
        $('a[tag=tag24]').removeAttr('class');
        $(obj).attr('class', 'on');
        $("#hdgrade").val(des);
        //******************** end 产品等级******************************
    }
    if (type == 23) {
        //******************** begin 半自助游搜索******************************
        $("#hdbzz").val($(obj).is(":checked") ? 1 : 0);
        //******************** end 半自助游搜索******************************
    }
    else if (type > 11 && type < 19) {
        //设置邮轮参数
        if (!setParamCruises(des, type, obj)) {
            //正在查询
            $('#dvwait').hide();
            //除签证之外的线路列表
            $("#ulgylist").show();
            return;
        }
    }
    showRouteList(type, obj);
}
//进入列表展现
function showRouteList(type, obj) {
    //显示于您已选择 2015/10/16 JoJo
    CheckedPanel(type, obj);

    if (!$('#hdp1').val()) {
        $('#txtprice1').val('');
    }
    if (!$('#hdp2').val()) {
        $('#txtprice2').val('');
    }

    var url = '/research';
    var objParm = {};
    //关键词
    objParm.kwd = $('#hdkwd').val();
    //分类主题
    objParm.sub = $('#hdsub2').val();
    //城市
    objParm.beg = $('#hdbeg').val();
    //TreeName
    objParm.past = $('#hdpast').val();
    //适合人群
    objParm.man = $('#hdman').val();
    //排序值
    objParm.field = $('#hdfield').val();
    //排序方式orderdire
    objParm.type = $('#hdtype').val();
    //当前页码
    objParm.pgidx = $('#hdpgidx').val();
    //每页显示条数
    objParm.pgsize = $('#hdpgsize').val();
    //出行天
    objParm.day = $('#hdday').val();
    //价格区间1
    objParm.p1 = $('#hdp1').val();
    //价格区间2
    objParm.p2 = $('#hdp2').val();
    //线路类别
    objParm.trvclass = $('#hdtrvclass').val();
    //时间区间
    objParm.dtm = $('#hddtm').val();
    //线路类别
    objParm.tp = $('#hdtravelclass').val();
    //邮轮航线目的地
    objParm.cruisesRoute = $('#hdCruisesRoute').val();
    //邮轮公司
    objParm.cruisesComp = $('#hdCruisesComp').val();
    //邮轮登轮港口
    objParm.cruisesPort = $('#hdCruisesPort').val();
    //城市编号道号
    objParm.domain = $('#hddomain').val();
    //优中选优
    objParm.isspike = $("#hdisspike").val();
    //优惠信息
    objParm.ischeap = $("#hdischeap").val();
    //半自助
    objParm.bzz = $("#hdbzz").val();
    //产品钻石等级 2015/11/01 JoJo
    objParm.productGrade = $("#hdgrade").val();

    //清空列表
    $('#ulgylist,#ulqlist').empty();
    //清空分页导航
    $("#hjPagesThumb,#hjPages").empty();
    //您已选择处所显示的条数 2015/10/15 JoJo
    $("#select-total").text(0);

    $.post(url, objParm, function (result) {
        //正在查询
        $('#dvwait').hide();

        var content = result.split('####');

        var recordcount = "";
        if (content.length == 2) {
            recordcount = 0;
        }
        else {
            //content----0：产品内容，1：分页，2：产品总数
            recordcount = content[3];

            //除签证之外的线路列表
            $('#ulgylist').html(content[0]);
            //头部分页
            $("#hjPagesThumb").html(content[1]);
            //底部分页
            $("#hjPages").html(content[2]);
            //您已选择处所显示的条数 2015/10/15 JoJo
            $("#select-total").text($("#hjPages em[data-total='all']").text());
            //是否为后台iframe引入的
            if (getQueryStringRegExp("uztype") == "manager") {
                AddElement();
            }
        }
        if (type == 6) {
            //******************** begin 点击分页******************************
            var url = location.href;
            var idxHtml = url.indexOf('#dvtypelist');

            var curURL = '';
            if (idxHtml < 0) {
                curURL = url + '#dvtypelist';
            }
            else {
                curURL = url.replace('#dvtypelist', '') + '#dvtypelist';
            }
            location.href = curURL;
            //******************** end 点击分页******************************
        }
        //排序
        $("#divsortlist").show();
        if (recordcount == '0') {
            //隐藏列表
            $("#ulgylist,#ulqlist").hide();
            //显示无信息
            $(".res-nocontent").show();
        }
        else {
            //隐藏列表，无信息
            $("#ulgylist,#ulqlist,.res-nocontent").hide();

            //除签证之外的线路列表
            $('#ulgylist').show();
            //头部分页
            $("#hjPagesThumb").show();
            //底部分页
            $("#hjPages").show();
        }


        //处理图片延迟加载
        uzLazy('j_mainRoute');

    });
    AddElement();
}

function page(pgIndex) {
    if ($("#hdtravelclass").val() == "7") {
        setParamVisa(pgIndex, 6, this);
    }
    else {
        setparam(pgIndex, 6, this);
    }
    var litag = $("#ultravelclass .on").attr("litag");
    if (litag == '2' || litag == '4' || litag == '8') {
        $("#j_choiceItems").find("dl").eq(0).css("display", "none");
        $("#j_choiceItems").find("dl").eq(1).css("border-top-width", "0px");
    }

}

//判断日期类型
function isDate(v) {
    var r = v.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (!r)
        return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
}
function querybyDay(obj) {
    $('#spanday').text($(obj).find('a').html());
    setparam($(obj).attr('data-value'), 8, obj);
}
function begdate(startId, endId) {
    WdatePicker({ errDealMode: 1, el: startId, dateFmt: 'yyyy/MM/dd', minDate: '%y-%M-#{%d+1}', maxDate: '#F{$dp.$D(\'' + endId + '\')||\'' + $("#hdMaxDate").val() + '\'}' });
}
function enddate(startId, endId) {
    WdatePicker({ errDealMode: 1, el: endId, dateFmt: 'yyyy/MM/dd', minDate: '#F{$dp.$D(\'' + startId + '\')||\'%y-%M-#{%d+1}\'}', maxDate: $("#hdMaxDate").val() });
}
$('#txtsearch').onkeydown = function (event) {
    if (event.keyCode == 13) {
        var keyword = $.trim($('#txtsearch').val());
        if (keyword.length === 0) {
            $('#txtsearch').css({ 'border': 'solid 1px #FF0000' });
            $('#dvsearchtip').show();
            $('#txtsearch').focus();
            setTimeout(function() {
                $("#dvsearchtip").fadeOut();
            }, 3000);
            event.keyCode = 0;
            event.returnValue = false;
        }
    }
};


///设置邮轮参数
function setParamCruises(des, type, obj) {
    if (type == 12) {
        //点击邮轮大类别

        //邮轮
        $("#tbCruisesWhere").show();
        //签证
        $("#divParamVisa").hide();
        //跟团，自助，公司
        $("#j_choiceItems").hide();

        //给定样式
        $("li[tag='tag0'],li[tag='tag02']").removeAttr("class");
        $(obj).addClass("on");

        //当前产品类别
        $('#hdtravelclass').val("6");
        //重置出发城市
        $("a[tag=tagCruises2]").removeAttr("class");

        var starbeg = $.trim($('#hdbeg2').val());
        if (starbeg != '0') {

            if ($("#hrefCityCruises" + starbeg) && $("#hrefCityCruises" + starbeg).length >= 1) {
                $('#hrefCityCruises' + starbeg).attr('class', 'on');
                $('#hdbeg').val(starbeg);
            }
            else {
                $('#hrefCityCruises2').attr('class', 'on');
                $('#hdbeg').val('2');
            }
        }
        else {
            $('#hrefCityCruises0').attr('class', 'on');
            $('#hdbeg').val('0');
        }
        //航线目的地重置
        $('#hrefCruisesRouteAll').addClass("on").siblings().removeClass("on");
        $('#hdCruisesRoute').val('');
        //邮轮公司重置
        $('#hrefCruisesCompAll').addClass("on").siblings().removeClass("on");
        $('#hdCruisesComp').val('');
        //登轮港口重置
        $('#hrefCruisesPortAll').addClass("on").siblings().removeClass("on");
        $('#hdCruisesPort').val('');
        //出发日期重置
        $('#hrefCruisesDateAll').addClass("on").siblings().removeClass("on");
        $('#hddtm').val('');
        //行程天数
        $('#tagCruises7').addClass("on").siblings().removeClass("on");
        $('#hddtm').val('');
        $('#txtdateCruises1').val('');
        $('#txtdateCruises2').val('');
    }
    else if (type == 13) {
        //点击出发城市

        $('a[tag=tagCruises2]').removeAttr("class");
        $(obj).addClass('on');
        $('#hdbeg').val(des);
    }
    else if (type == 14) {
        //点击航线目的地

        $('a[tag=tagCruises3]').removeAttr("class");
        $(obj).addClass('on');
        $('#hdCruisesRoute').val(des);
    }
    else if (type == 15) {
        //点击邮轮公司

        $('a[tag=tagCruises4]').removeAttr("class");
        $(obj).addClass('on');
        $('#hdCruisesComp').val(des);
    }
    else if (type == 16) {
        //点击出发港口

        $('a[tag=tagCruises6]').removeAttr("class");
        $(obj).addClass('on');
        $('#hdCruisesPort').val(des);
    }
    else if (type == 17) {
        //点击出发日期

        $('a[tag=tagCruises5]').attr('class', 'item');
        $(obj).addClass('on');
        $('#txtdateCruises1').val('');
        $('#txtdateCruises2').val('');
        $('#hddtm').val(des);
    }
    else if (type == 18) {
        //选择出发日期
        var dtm1 = $('#txtdateCruises1').val();
        var dtm2 = $('#txtdateCruises2').val();
        if (!dtm && !dtm2) {
            $('#hfCruisesDt').text('请选择出发时间').show();
            setTimeout(function(){
                $("#hfCruisesDt").hide();
            }, 3000);
            return false;
        }
        else if (!dtm1 && dtm2) {
            $('#txtdateCruises2').val('');
            $('#txtdateCruises1').focus();
            $('#hfCruisesDt').text('请选择出发起止日期').show();
            setTimeout(function(){
                $("#hfCruisesDt").hide();
            }, 3000);
            return false;
        }
        else {
            if (!isDate(dtm1)) {
                $('#hfCruisesDt').text('请选择正确的出发起止日期(如：2011/10/10)').show();
                $('#txtdateCruises1').focus();
                setTimeout(function(){
                    $("#hfCruisesDt").hide();
                }, 3000);
                return false;
            }
            if (dtm2) {
                if (!isDate(dtm2)) {
                    $('#hfCruisesDt').text('请选择正确的出发起止日期(如：2011/10/10)').show();
                    $('#txtdateCruises2').focus();
                    setTimeout(function(){
                        $("#hfCruisesDt").hide();
                    }, 3000);
                    return false;
                }
            }
            var vDate = $('#txtdateCruises1').val();
            if (dtm2) {
                vDate += '^' + dtm2;
            }
            $('#hddtm').val(vDate);
        }
    }
    return true;
}


///签证筛选条件
function setParamVisa(des, type, obj) {

    //7为签证
    $("#hdtravelclass").val("7");
    //当前页面索引为1
    $('#hdpgidx').val('1');

    if (type == "0") {
        //点击签证类别在导航

        //隐藏跟团，自助，公司
        $("#j_choiceItems").hide();
        //隐藏邮轮
        $("#tbCruisesWhere").hide();
        //显示签证列表
        $("#divParamVisa").show();

        $('#hdVisaType').val(0);
        $('#hdpgsize').val(20);

        //0跟团，01邮轮，02签证
        $("li[tag='tag0'],li[tag='tag01'],li[tag='tag02']").removeAttr("class");
        //当前menu给定选中样式
        $(obj).attr("class", "on");

        $('#hdVisaArea').val($("#hdVisaAreaDefault").val());
        $('#hdVisaCountry').val($("#hdVisaCountryDefault").val());
    }
    else if (type == "1") {
        //点击地区

        //清除所有样式
        $('a[tag=tagVisa1]').removeAttr('class');
        //选中
        $(obj).addClass("on");

        //地区
        $('#hdVisaArea').val(des);
        $("a[tag=tagVisa2]").removeAttr('class');

        //国家
        $('#hdVisaCountry').val('');
        //默认选中全部
        $("#hrefVisaCountryAll").addClass("on");

        var url = '/GetVisaCountry';
        var objParm = {};
        //关键词
        objParm.kwd = $('#hdkwd').val();
        //地区
        objParm.area = des;

        $.post(url, objParm, function (result) {
            if (result && result) {

                var arrResult = result.split(',');

                var strCountryHtml = "<a class='on' href='javascript:void(0);' onclick='setParamVisa('',2,this);' tag='tagVisa2' id='hrefVisaCountryAll'>全部</a>";
                for (var i = 0; i < arrResult.length; i++) {
                    //国家
                    strCountryHtml += "<a href='javascript:void(0);' tag='tagVisa2' id='hrefVisaCountry" + (i + 1) + "' onclick='setParamVisa('" + arrResult[i] + "',2,this);'>" + arrResult[i] + "</a>";
                }
                $("#dvVisaCountry").html(strHtml);
                //国家为全部
                $('#hdVisaAreaDefault').val('');
            }
        });

    }
    else if (type == "2") {
        //点击国家

        //清除所有样式
        $('a[tag=tagVisa2]').removeAttr('class');
        //选中
        $(obj).addClass("on");
        //国家
        $('#hdVisaCountry').val(des);
    }
    else if (type == "3") {
        //点击所属领区

        //清除所有样式
        $('a[tag=tagVisa3]').removeAttr('class');
        //选中
        $(obj).addClass("on");
        //所属领区
        $('#hdVisaReceiveZone').val(des);
    }
    else if (type == "4") {
        //点击签证类型

        //清除所有样式
        $('a[tag=tagVisa4]').removeAttr('class');
        //选中
        $(obj).addClass("on");
        //签证类型
        $('#hdVisaType').val(des);
    }
    else if (type == "6") {
        //点击分页上下页
        $('#hdpgidx').val(des);
    }
    queryVisa(type, obj);
}
//查询签证
function queryVisa(type, obj) {

    //显示于您已选择 2015/10/16 JoJo
    CheckedPanel(type, obj);

    var objParm = {};
    //关键词
    objParm.kwd = $("#hdkwd").val();
    //签证地区
    objParm.visaArea = $("#hdVisaArea").val();
    //签证国家
    objParm.visaCountry = $("#hdVisaCountry").val();
    //所属领区
    objParm.visaReceiveZone = $("#hdVisaReceiveZone").val();
    //签证类型
    objParm.visaType = $("#hdVisaType").val();
    //当前所属页
    objParm.pageIndex = $("#hdpgidx").val();
    //每页显示条
    objParm.pageSize = $("#hdpgsize").val();
    //域
    objParm.domain = $('#hddomain').val();

    $.post("/SearchVisa", objParm, function (result) {

        if (!result) { result = ""; }

        //正在查询
        $('#dvwait').hide();

        var content = result.split('####');

        var recordcount = "";
        if (content.length == 2) {
            recordcount = "0";
        }
        else {
            //content----0：产品内容，1：分页，2：产品总数
            recordcount = content[3];

            //签证线路列表
            $('#ulqlist').html(content[0]);
            //头部分页
            $("#hjPagesThumb").html(content[1]);
            //底部分页
            $("#hjPages").html(content[2]);
        }

        $("#divsortlist").hide();
        if (recordcount == "0") {
            //隐藏列表
            $("#ulgylist,#ulqlist").hide();
            //筛选无结果
            $(".res-nocontent").show();
        }
        else {
            //隐藏列表
            $("#ulgylist,#ulqlist").hide();
            //筛选无结果
            $(".res-nocontent").hide();
            //显示签证列表
            $("#ulqlist").show();
        }
        if (type == 6) {
            var url = location.href;
            var curURL = url.replace('#dvtypelist', '') + '#dvtypelist';
            location.href = curURL;
        }

        //处理图片延迟加载
        uzLazy('j_mainRoute');

    });  //end $.post
}

$(function () {
    $(".J_itemtype").hover(function () {
        var that = $(this);
        var pid = that.attr("pid");
        $.ajax({
            type: "get",
            url: "/showfd/" + pid + "?rad=" + Math.random(),
            success: function (msg) {
                if (msg && msg) {
                    that.find(".J_divfd").find("p").eq(0).text(msg);
                    that.find(".J_divfd").show();
                }
            }
        });
    }, function () {
        var that = $(this);
        that.find(".J_divfd").hide();
    });
    //价格区间显示隐藏
    $(".J_pricetext").bind("click", function () {
        $(this).parents("dd").addClass("sort-hover");
    });
    $(".J_pricerange").bind("click", function () {
        $(this).parents("dd").removeClass("sort-hover");
    });
    $(document).click(function (e) {
        if (!$(e.target).is(".sort-pricerange *")) {
            $(".sort-pricerange").parent("dd").removeClass("sort-hover");
        }
    });
    //排序类型  价格有三种状态特殊处理
    $(".J_sort").bind("click", function () {
        var that = $(this);
        $(".sort-hover").removeClass("sort-hover");
        that.addClass("sort-hover");
        if (that.attr("data-item") == "price") {
            var dom = that.find(".J_price");
            if (dom.hasClass("desc")) {
                dom.removeClass("desc");
                that.attr("title", "按价格从高到低排序");
            }
            else {
                dom.addClass("desc");
                that.attr("title", "按价格从低到高排序");
            }
        }
        else {
            $(".J_price").removeClass("desc");
            $(".J_price").parents(".J_sort").attr("title", "");
        }
    });
    //更多筛选条件
    $(".J_morecoditionbtn").bind("click", function () {
        var that = $(this);
        if (that.hasClass("res-slow-btn")) {
            that.removeClass("res-slow-btn");
            that.html("更多筛选条件");
            $(".J_morecodition").hide();
        } else {
            that.addClass("res-slow-btn");
            that.html("收起筛选条件");
            $(".J_morecodition").show();
        }
    });
    //w97日历
    //    $(".J_time").bind("focus", function() {
    //        WdatePicker();
    //    });
});

function showMorePoint(obj) {
    var that = $(obj);
    if (that.hasClass("item-slow")) {
        that.removeClass("item-slow");
        that.html("更多");
        that.prev(".J_moreitem").hide();
    } else {
        that.addClass("item-slow");
        that.html("收起");
        that.prev(".J_moreitem").show();
    }
}


//添加注意事项
function AddElement() {

    if (getQueryStringRegExp("uztype") != "manager") {
        return; //无需添加，不为后面搜索
    }

    var SuserId = getQueryStringRegExp("userId");
    //var SadminId=getQueryStringRegExp("adminId");
    $("#ulgylist li").each(function () {
        var that = $(this);
        var cTtitle = that.find("a[data-tag='title']");
        var newP = $("<div class='zysx'><a href=\"javascript:;\" style='color:#36c;' class=\"J_addAjax\" data-id='" + $.trim(cTtitle.attr("data-id")) + "'>销售注意事项</a></div>");
        var href = cTtitle.attr("href");

        if (cTtitle.attr("data-type") == "product-gty" || cTtitle.attr("data-type") == "product-yl") {
            that.find(".sort-line-sidebar").append(newP);
            cTtitle.attr("href", "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineQueryProduct.aspx?productURL=" + encodeURIComponent(href) + "&uztype=manager&userId=" + SuserId);
        }
        else if (cTtitle.attr("data-type") == "product-zzy") {
            that.find(".sort-line-sidebar").append(newP);
            cTtitle.attr("href", "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineTripQueryProduct.aspx?productURL=" + encodeURIComponent(href) + "&uztype=manager&userId=" + SuserId);
        }
    });
    $(".J_itemtype").css("z-index", "2");
    $("body").append("<style>.c_ptext{border:1px solid #F9CC9F;position:absolute;top:28px;right:0;padding:10px;width:500px;background:#FFFCF8;display:none;line-height:1.4;text-align: left;} </style>");



    //追加给定事件
    $(".J_addAjax").on('mouseover', function (e) {

        var that = $(e.target);

        that.parent().css("z-index", "99");
        if (that.nextAll(".J_Ptext").length) {
            if (that.nextAll(".J_Ptext").find("p").length) {
                that.next().show();
            }
        } else {
            var pId = $.trim($(this).attr("data-id"));
            var $p = $("<div class='c_ptext J_Ptext'></div>");
            var dom = "";
            that.parent().append($p);
            $.ajax({
                type: "GET",
                url: "//aj.uzai.com/Product.ashx?ProductID=" + pId + "&rad=" + Math.random(),
                dataType: "jsonp",
                jsonp: "orderJsonData",
                success: function (msg) {
                    if (msg[0].ProductNotice && msg[0].ProductNotice) {
                        var arr = msg[0].ProductNotice.split("#$%");
                        for (var i = 0; i < arr.length; i++) {
                            dom += "<p style='padding:3px 0;'>" + arr[i] + "</p>";
                        }
                        that.next().html(dom).show();
                    }
                }
            });
        }
    });

    $(".J_addAjax").on('mouseout', function () {
        $(this).next().hide();
        $(".zysx").css("z-index", "1");
        $(".J_itemtype").css("z-index", "2");
    });
}

function searchCalendar() {
    var jmr = $('#j_mainRoute');

    jmr.on('click', '.btn-switch', function () {
        var o = $(this);
        var arw = o.children('.arrow-mod');
        var mcalp = o.parents('.list-item');

        var pid = mcalp.attr('data-pid');

        var opa = mcalp.children('.after-calendar');

        if (!opa.get(0)) {
            mcalp.append('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            opa = mcalp.children('.after-calendar');
        }

        if (arw.hasClass('on')) {
            o.removeClass('btn-switch-on');
            arw.removeClass('on');
            opa.hide();

        } else {
            o.addClass('btn-switch-on');
            arw.addClass('on');
            opa.show();

            var cal = opa.find('.j_jsonMultiCalendarWrap');
            if (cal.get(0)) {
                return;
            }

            //先判断是存在日历对象

            opa.jsonMultiCalendar({
                jsonpUrl: 'http://sh.uzai.com/ashx/ashx_Calendar.ashx?pid=' + pid + '&type=1',
                isSmart: true,
                latestDate: '',
                extCallBack: function (year, month) {
                    //选中
                    opa.find('.item').on('click', function () {
                        var oi = $(this);
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray');
                        if (!oiExp) {
                            var oiY = oi.attr('data-year');
                            var oiM = oi.attr('data-month');
                            var oiD = oi.attr('data-day');
                        }
                    });
                },
                preCallback: function (year, month) {//上月下月预回调

                }
            });
        }
    });
}

function searchGuessLike() {
    if (!window.guessLike) {
        _util.file.load(_uzw.domain.cdn + '/content/v1/scripts/com/guesslike.js', function () {
            //node, num, whOBJ
            guessLike('j_sideGuess', 10, { width: 166, height: 124 });
        });
    }
}