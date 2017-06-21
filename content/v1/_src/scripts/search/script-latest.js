/*
* @Author: jonas hsiao
* @Date:   2016-10-11 11:13:18
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2017-03-27 19:30:13
*/

'use strict';

try {
    document.domain = 'uzai.com';
} catch (e) {

}

$(function () {
    var call = function () {
        $("#hdDataReq").attr("data-PageIndex", 1);
        //搜索
        app.search("panel", function (err, result) {
            //渲染视图
            if (err === null) {
                app.renderview(result);
                //重新设置搜索控件
                searchPager(function () {
                    app.search("pager", function (err, result) {
                        //渲染视图
                        if (err === null) {
                            app.renderview(result);
                        }
                    });
                });
            }
        });
    };

    uzLazy(['j_searchSide', 'j_sortLine', 'j_sortVisa', 'comm-line-mod', 'main-pop-list']);
    _uzw.ui.tab('j_productTypeTab', function (index, obj) {
        var item = obj.find('.bd').children('.item').eq(index);
        initChoiceItems(item);

        //触发搜索
        $("#hdDataReq").attr("data-PageIndex", 1);
        $("#hdDataReq").attr("data-producttype", item.attr("data-producttypetag"));
        //console.clear();
        //搜索panel对象
        var panel = app.getchoosepanel();
        //已经加载过就不用加载了
        if (panel.is("[data-isload]") === false) {
            app.searchpanel(function (err, result) {
                if (err === null) {
                    //console.log(result);
                    app.renderpanelview(result);
                    initChoiceItems(item);
                    contentSwitch();
                    _uzw.ui.tab('choice-tab');
                    multiCalendar($(panel.find(".start-date")), call);
                }
            });
        } else {
            app.initpanelviewselect();
        }
        call();
        //推荐加载
        app.recommend.renderview();
    });
    var app = new App();
    _uzw.ui.tab('choice-tab');
    contentSwitch();
    searchPager(function () {
        app.search("pager", function (err, result) {
            //渲染视图
            if (err === null) {
                app.renderview(result);
            }
        });
    });
    searchGuessLike();
    saleCountdown();
    multiCalendar($('#j_productTypeTab').find('.choice-items').find('.start-date'), call);

    initChoiceItems($("[data-isload]"));
});

function reloadpage(keyword) {
    var webStr = "http://search.uzai.com";
    if (!$.trim(keyword)) {
        keyword = $.trim($("#hdDataReq").attr("data-keyword"));
    }
    var hostCity = $.trim($("#hdDataReq").attr("data-hostcity"));
    if (!hostCity) {
        hostCity = "sh";
    }
    window.location.href = webStr + "/" + hostCity + "/SearchResult?keyword=" + encodeURI($.trim(keyword));
}

function initChoiceItems(item) {
    var choiceItems = item.find('.choice-items');

    choiceItems.each(function () {
        var oThis = $(this);
        if (oThis.height() > 40 && !oThis.hasClass('items-cut') && !oThis.hasClass('items-cut-close')) {
            oThis.addClass('items-cut');
            oThis.before('<span class="btn-switch pointer blue fr">更多</span>');
        }
    });
}

function contentSwitch() {
    var prodTypeTab = $('#j_productTypeTab');
    var prodTypeItems = prodTypeTab.find('.bd').children('.item');

    initChoiceItems(prodTypeItems.eq(0));
    prodTypeTab.find('.choice-section').off('click', '.btn-switch');
    prodTypeTab.find('.choice-section').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var choiceItems = oThis.siblings('.choice-items');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on').text('更多');
            choiceItems.addClass('items-cut');
        } else {
            oThis.addClass('on').text('收起');
            choiceItems.removeClass('items-cut');
            choiceItems.addClass('items-cut-close');

        }
    });
    prodTypeTab.off("click", ".btn-bar .btn-switch");
    prodTypeTab.on('click', '.btn-bar .btn-switch', function () {
        var oThis = $(this);
        var app = new App();
        var oCont = oThis.find('.switch-cont');
        var choiceSection = oThis.parents('.btn-bar').siblings('.choice-section').eq(3).nextAll('.choice-section');

        var oItem = oThis.parents('.item');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            oCont.text('更多筛选条件');
            choiceSection.addClass('hide');
        } else {
            oThis.addClass('on');
            oCont.text('收起筛选条件');
            choiceSection.removeClass('hide');
            initChoiceItems(oItem);
        }
        app.filterbjarea();

    });

    //判断当前选择列表是否大于4行

}

function saleCountdown() {
    var timers = $('#j_searchSide').find('.side-pick-list').find('.timer');
    var df = _util.apis.getServerDate(); // 获取服务器日期
    var nowTime = 0;
    var _unitCountdown = function (obj, time) {
        var endTime = parseInt(Date.parse(obj.attr('data-endtime').replace(/-/g, '/')), 10);
        var oTian = obj.find('.num-day');
        var oShi = obj.find('.num-hour');
        var oFen = obj.find('.num-minute');
        var oMiao = obj.find('.num-second');
        var iValue = endTime - time;
        var timeout;
        var _unitCD = function (cha) { // 单元处理
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);

            oTian.text(days);
            oShi.text(hours % 24);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };

        time += 1000;

        if (iValue > 0) {
            _unitCD(iValue);
        } else {
            obj.parents('.list-item').remove();
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
            _unitCountdown(obj, time);
        }, 1000);
    };

    timers.each(function () {
        var oThis = $(this);

        df.done(function (tm) {
            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);
            _unitCountdown(oThis, nowTime);
        });
    });
}

function multiCalendar(objs, callback) {
    // $('#j_productTypeTab').find('.choice-items').find('.start-date').on('focus', function () {
    $(objs).on('focus', function () {
        var o = $(this);

        $('.after-calendar').hide();

        var op = o.parent();
        var ac = op.find('.after-calendar');
        var date = '';
        var daterel = '';
        if (!ac.get(0)) {
            o.after('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            ac = op.find('.after-calendar');
            var cfg = {
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                extCallBack: function (year, month) {
                    var selDate = o.attr('data-selDate') || ''; // 2016-10-27|2016-11-29
                    var items = ac.find('.item');
                    var itemsLen = items.length;
                    var dateItems = '';
                    var diLen = '';
                    var dateItem = '';
                    var selYear = '';
                    var selMonth = '';
                    var selDay = '';

                    if (selDate) { // 选择相关日期处理
                        dateItems = selDate.split('|');
                        diLen = dateItems.length;
                        for (var i = 0; i < itemsLen; i++) {
                            var item = items.eq(i);
                            var iYear = parseInt(item.attr('data-year'), 10);
                            var iMonth = parseInt(item.attr('data-month'), 10);
                            var iDay = parseInt(item.attr('data-day'), 10);

                            for (var j = 0; j < diLen; j++) {
                                dateItem = dateItems[j].split('-');
                                selYear = parseInt(dateItem[0], 10);
                                selMonth = parseInt(dateItem[1], 10);
                                selDay = parseInt(dateItem[2], 10);

                                if (iYear < selYear) {
                                    item.addClass('item-disabled');
                                } else if (iYear === selYear) {
                                    if (iMonth < selMonth) {
                                        item.addClass('item-disabled');
                                    } else if (iMonth === selMonth) {
                                        if (iDay < selDay) {
                                            item.addClass('item-disabled');
                                        } else if (iDay === selDay) {
                                            item.addClass('item-sel');
                                        }
                                    }
                                }
                            }
                        }
                    }
                    items.on('click', function () {
                        var oi = $(this);
                        var oiY = oi.attr('data-year');
                        var oiM = oi.attr('data-month');
                        var oiD = oi.attr('data-day');
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray') || oi.hasClass('item-disabled');
                        var selLen = ac.find('.item-sel').length;

                        if (!oiExp && selLen < 2) {

                            if (selLen > 0) {
                                date += '-';
                                selDate += '|';
                            }

                            oi.addClass('item-sel').prevAll('.item').addClass('item-disabled');
                            oi.parent('tr').prevAll('tr').find('.item').addClass('item-disabled');
                            oi.parents('.calendar-mod').prev('.calendar-mod').find('.item').addClass('item-disabled');
                            date += oiM + '月' + oiD + '日';
                            selDate += oiY + '-' + oiM + '-' + oiD;
                            daterel = selDate;
                            o.attr('data-selDate', selDate);
                        }
                    });

                    ac.on('click', '.btn-reset', function () {
                        items.removeClass('item-sel').removeClass('item-disabled');
                        date = '';
                        selDate = '';
                        o.val('').removeClass('choice-on').attr('data-selDate', '');
                    }).on('click', '.btn-confirm', function () {
                        o.val(date).addClass('choice-on').parent().siblings('.choice-item').removeClass('choice-on');
                        ac.hide();
                        op.css({ 'z-index': 'auto' });
                        //选择日期
                        o.closest("dl").find(".choice-on[data-val]").removeClass("choice-on");
                        if (date === "") {
                            o.removeClass('choice-on');
                            o.closest("dl").find("[data-val]:eq(0)").addClass("choice-on");
                        } else {
                            o.addClass("choice-on");
                        }
                        daterel = daterel;
                        if (callback !== null) {
                            callback();
                        }
                    });
                },
                preCallback: function (year, month) {//上月下月预回调
                    //console.log(year, month);
                }
            };
            ac.jsonMultiCalendar(cfg).append('<p class="calendar-btn-bar tc"><input type="button" value="清除" class="btn-reset yahei" /><input type="button" value="确认" class="btn-confirm yahei" /></p>');
        }

        ac.show();
        op.css({ 'z-index': 10 });

        blankFix('j_afterCalendarWrap', 'after-calendar', function () { // 点击其它部分隐藏
            op.css({ 'z-index': 'auto' });
        });
    });
}

function searchPager(callback) {
    var pager = $('#j_fnPager');
    var pageSize = parseInt(pager.attr('data-pagesize'), 10);
    var pageItems = parseInt(pager.attr('data-counts'), 10);
    if (pager.get(0)) {
        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,//列表条数
            onInit: function () {
            },
            onCallback: function (currentPage, allPage) {
                //分页事件 ajax or dom handle
                $("#hdDataReq").attr("data-PageIndex", currentPage);
                setTimeout(function () {
                    $('html,body').animate({ scrollTop: $("#j_sortLine").offset().top }, 500);
                }, 1000);
                if (callback !== null) {
                    callback(currentPage, allPage);
                }

            }
        });
    }
}


function searchGuessLike() {
    if (!window.guessLike) { // load guess like
        _util.file.load((_env === 'dev' ? '' : _uzw.domain.cdnRandom()) + '/content/v1/scripts/com/guesslike.js', function () {
            window.guessLike('j_guessLikeContainer');
        });
    }

    $('#j_sortLine').on('click', '.list-item', function () {
        var oThis = $(this);
        productInterest(oThis.attr('data-pid'));
    });
}

//猜你喜欢收集
function productInterest(pid) {
    if (_uzw.user.userid) {
        var paras = {
            "userId": _uzw.user.userid,//用户ID
            "city": 0,//发起请求的城市站点，为0时取产品的出发城市
            "channel": 1,//信息渠道：1 PC、2 IPhone、3 Ipad、4 Android、5 M站
            "type": 6, //来源类型：1浏览历史、2我的收藏、3我的咨询、4意向订单、5支付订单、6关键词搜索、7自主点击不喜欢
            "productIds": pid//productIds：相关产品ID，多个产品ID可以用","分隔
        };
        $.ajax({
            type: 'post',
            url: _uzw.domain.wapi + "/api/UzaiInterest/InsertUserInterest",
            data: paras,
            dataType: 'jsonp',
            success: function (msg) { },
            error: function () { }
        });
    }
}

var App = (function (w) {
    var prodTypeTab = $('#j_productTypeTab');
    //单例
    var __app = null;
    var _app = function () {
        if (__app === null) {
            this._bindevent();
            var lis = $("#j_productTypeTab > ul > li[data-producttypetag][data-producttypetag!='0']");
            var producttypes = $.map(lis, function (n) {
                return $(n).attr("data-producttypetag");
            });
            this.recommend = new recommend($("#j_recommend"), producttypes, this);
            this.recommend.renderview();

            this.history = new history($("#historycontainer"));
            this.history.renderhistory();
            __app = this;
        } else {
            return __app;
        }

    };
    _app.prototype.com = {};
    //判读是否是北京地区
    _app.prototype.isbjarea = function (s) {
        if ($.map(["北京", "天津", "石家庄", "唐山", "青岛", "太原", "沈阳", "大连", "长春", "哈尔滨", "郑州", "长沙", "武汉", "厦门", "西安", "济南"], function (n) {
            return n === s ? 1 : null;
        }).length > 0) {
            return true;
        } else {
            return false;
        }
    };

    //获得选择的panel
    _app.prototype.getchoosepanel = function () {
        var tab = this.getchoosetab();
        var index = tab.attr("data-tab");
        var panel = $("#j_productTypeTab > div:eq(0) > div:eq(" + index + ")");
        return panel;
    };
    //获得选中的tab
    _app.prototype.getchoosetab = function () {
        var tab = $("#j_productTypeTab > ul:eq(0) > li.on");
        return tab;
    };
    //获得详情页panel
    _app.prototype.getdetailpanel = function () {
        var panel = $("#j_sortLine > ul");
        return panel;
    };
    //判断当前的tab是什么类型
    _app.prototype.getchoosetype = function () {
        var tab = this.getchoosetab();
        return tab.attr("data-producttypetag");
    };
    //当前选择的是Tour
    _app.prototype.ischooseTour = function () {
        var choosetype = this.getchoosetype();
        if (choosetype === "0") {
            return true;
        }
        if (choosetype === "1") {
            return true;
        }
        if (choosetype === "2") {
            return true;
        }
        if (choosetype === "3") {
            return true;
        }
        if (choosetype === "4") {
            return true;
        }
        if (choosetype === "5") {
            return true;
        }
        if (choosetype === "8") {
            return true;
        }
        if (choosetype === "9") {
            return true;
        }
        if (choosetype === "10") {
            return true;
        }
        if (choosetype === "11") {
            return true;
        }

        return false;
    };
    //当前选择的是邮轮
    _app.prototype.ischooseYL = function () {
        var choosetype = this.getchoosetype();
        if (choosetype === "6") {
            return true;
        }
        return false;
    };
    //当前选择的是签证
    _app.prototype.ischooseVisa = function () {
        var choosetype = this.getchoosetype();
        if (choosetype === "7") {
            return true;
        }
        return false;
    };
    //当前是境外参团自由伴
    _app.prototype.ischooseZYB = function () {
        var choosetype = this.getchoosetype();
        if (choosetype === "12") {
            return true;
        }
    };
    //生成搜索对象
    _app.prototype.gensearchparam = function (type) {
        var tmpobj, tmpStr;
        var param = {};
        var panel = this.getchoosepanel();
        var objectReq = $("#hdDataReq");
        param.domain = $.trim(objectReq.attr("data-hostcity")); //城市编号
        param.keyword = $.trim(objectReq.attr("data-keyword")); //关键词
        param.productType = $.trim(objectReq.attr("data-productType")); //产品二级类别标识代号
        param.CurrentPageIndex = $.trim(objectReq.attr("data-PageIndex")); //当前索引页
        param.sortby = $.trim(objectReq.attr("data-sortby")); //排序类型
        param.minPrice = $.trim($("#txtMinPrice").val()); //起价
        param.maxPrice = $.trim($("#txtMaxPrice").val()); //最高承受价
        param.Promotion = $(objectReq).attr("data-ischeap"); //优惠信息


        if (parseInt(param.minPrice, 10) === 0 && parseInt(param.maxPrice, 10) === 0) {
            $("#txtMaxPrice,#txtMinPrice").val(""); //最高承受价不能为0
        }
        else if (parseInt(param.minPrice, 10) === 0 || parseInt(param.maxPrice, 10) === 0) {
            if (parseInt(param.minPrice, 10) === 0) {
                $("#txtMinPrice").val("0"); //多个0时做处理
            }
            if (parseInt(param.maxPrice, 10) === 0) {
                $("#txtMaxPrice").val(""); //最高承受价不能为0
            }
        }
        if (!this.ischooseVisa()) {
            if (_util.url.get("time")) {
                var timearr = _util.url.get("time").split(',');
                if (timearr.length == 2) {
                    param.beginDate = timearr[0];
                    param.endDate = timearr[1];
                }
                if (timearr.length == 1) {
                    param.beginDate = timearr[0];
                }
            }
        }

        if (this.ischooseTour() || this.ischooseZYB()) {
            //当前选中的为跟团，自由行，私家
            param.city = $.trim($(panel).find("[data-startcity] span.choice-on").attr("data-val")); //出发城市
            //出发日期特殊判断
            tmpobj = $(panel).find("[data-godate] .choice-on");
            if (!tmpobj.is(".start-date")) {
                param.date = $.trim($(panel).find("[data-godate] .choice-on").attr("data-val")); //出发日期
            } else {
                tmpStr = tmpobj.attr("data-seldate").split('|');
                if (tmpStr.length == 1) {
                    param.beginDate = tmpStr[0] || param.beginDate; //为手选日期
                }
                if (tmpStr.length == 2) {
                    param.beginDate = tmpStr[0] || param.beginDate; //为手选日期
                    param.endDate = tmpStr[1] || param.endDate; //为手选日期
                }
            }

            param.journeyDay = $.trim($(panel).find("[data-journeyday] span.choice-on").attr("data-val")); //行程天数
            param.subType = $.trim($(panel).find("[data-subtype] span.choice-on").attr("data-val")); //分类主题
            param.pastAddress = $.trim($(panel).find("[data-pastaddress] span.choice-on").attr("data-val")); //途经景点
            param.suitman = $.trim($(panel).find("[data-suitman] span.choice-on").attr("data-val")); //适合人群
            param.jpbox = $.trim($(panel).find("[data-rbltype] span.choice-on").attr("data-val")); //自由伴国际机票
            param.zybcity = $.trim($(panel).find("[data-startcityzyb] span.choice-on").attr("data-val")); //自由伴城市
        } else if (this.ischooseYL()) {
            //当前选中的为邮轮
            param.city = $.trim($(panel).find("[data-startcity] span.choice-on").attr("data-val")); //出发城市
            param.cruiseRoute = $.trim($(panel).find("[data-route] span.choice-on").attr("data-val")); //航线目的地
            param.cruiseCompany = $.trim($(panel).find("[data-company] span.choice-on").attr("data-val")); //邮轮公司
            //出发日期特殊判断
            tmpobj = $(panel).find("[data-godate] .choice-on");
            if (!tmpobj.is(".start-date")) {
                param.date = $.trim($(panel).find("[data-godate] .choice-on").attr("data-val")); //出发日期
            } else {
                tmpStr = tmpobj.attr("data-seldate").split('|');
                if (tmpStr.length == 1) {
                    param.beginDate = tmpStr[0] || param.beginDate; //为手选日期
                }
                if (tmpStr.length == 2) {
                    param.beginDate = tmpStr[0] || param.beginDate; //为手选日期
                    param.endDate = tmpStr[1] || param.endDate; //为手选日期
                }
            }
            param.cruisePort = $.trim($(panel).find("[data-port] span.choice-on").attr("data-val")); //出发港口
            param.journeyDay = $.trim($(panel).find("[data-journeyday] span.choice-on").attr("data-val")); //行程天数
        } else if (this.ischooseVisa()) {
            //当前选中的为签证
            param.visaArea = $.trim($(panel).find("[data-startcity] span.choice-on").attr("data-val")); //地区
            param.visaCountry = $.trim($(panel).find("[data-visacountry] span.choice-on").attr("data-val")); //国家
            param.visaReceiveZone = $.trim($(panel).find("[data-visareceivezone] span.choice-on").attr("data-val")); //所属领区
            param.visaType = $.trim($(panel).find("[data-visatype] span.choice-on").attr("data-id")); //签证类型
            //param.city = $(objectReq).attr("data-checkedCity"); //出发城市
        }
        //console.log(param);
        // if (type === "panel") {
        //     param.city = $(objectReq).attr("data-checkedCity");
        // }


        return param;
    };
    //生成搜索panel对象
    _app.prototype.gensearchpanelparam = function () {
        var objectReq = $("#hdDataReq");
        var param = {};
        param.keyword = $.trim(objectReq.attr("data-keyword")); //关键词
        param.productType = $.trim(objectReq.attr("data-productType")); //产品二级类别标识代号
        param.subType = $.trim(objectReq.attr("data-subType")); //分类主题
        //如果是境外参团的取这个值
        //因为data-checkedCity 有可能为0

        /*
        if (param.productType == "12") {
            param.city = $.trim(objectReq.attr("data-hostcitycode")); //当前首次搜索默认进来的城市
        } else {
            param.city = $.trim(objectReq.attr("data-checkedCity")); //当前首次搜索默认进来的城市
        }*/
        param.city = $.trim(objectReq.attr("data-hostcitycode")); //当前首次搜索默认进来的城市

        return param;
    };
    //搜索
    _app.prototype.search = function (type, callback) {
        this.filterbjarea();
        //生成查询对象
        var param = this.gensearchparam(type);
        $.ajax({
            url: '/SearchRoute',
            type: 'POST',
            data: param,
            cache: false,
            async: false,
            dataType: 'json',
            success: function (data) {
                callback(null, data);
            },
            error: function () {

            }
        });
    };
    //搜索panel对象
    _app.prototype.searchpanel = function (callback) {
        //生成查询对象
        var param = this.gensearchpanelparam();
        $.ajax({
            url: '/SearchMenuTab',
            type: 'POST',
            data: param,
            cache: false,
            async: false,
            dataType: 'json',
            success: function (data) {
                callback(null, data);
            },
            error: function () {

            }
        });
    };
    //推荐搜索
    _app.prototype.searchrecommend = function (producttype, callback) {
        var param = {};
        var panel = this.getchoosepanel();
        var objectReq = $("#hdDataReq");
        param.domain = $.trim(objectReq.attr("data-hostcity")); //城市编号
        param.keyword = $.trim(objectReq.attr("data-keyword")); //关键词
        param.productType = producttype; //产品二级类别标识代号
        param.CurrentPageIndex = 1; //当前索引页
        param.sortby = 0; //排序类型
        param.istj = 1;//是否产品推荐
        param.city = $("#hdDataReq").attr("data-hostcitycode"); //分站
        $.ajax({
            url: '/SearchRoute',
            type: 'POST',
            data: param,
            cache: false,
            //async: false,
            dataType: 'json',
            success: function (data) {
                callback(null, data);
            },
            error: function () {

            }
        });

    };

    //绑定事件
    _app.prototype._bindevent = function () {
        var _this = this;
        //绑定选中事件
        $(document).on("click", "span[data-val]", function (ee) {

            //触发的控件
            var tar = $(ee.target || ee);
            //控件的值
            var value = tar.attr("data-val");
            //父dom
            var dl = tar.closest("dl");
            if (dl.find(".choice-on").is(".start-date")) {
                dl.find(".choice-on").siblings('.after-calendar').find('.btn-reset').click();
            }
            dl.find(".choice-on").val('');
            //找到之前选中的按钮
            dl.find(".choice-on").removeClass("choice-on");
            //dl.find(".choice-items > .choice-on").removeClass("choice-on");
            //绑定样式
            tar.addClass("choice-on");
            //给父标签赋值
            //dl.attr("data-val",value);
            //触发搜索
            $("#hdDataReq").attr("data-PageIndex", 1);
            _this.search("head", function (err, result) {
                if (err === null) {
                    //渲染视图
                    _this.renderview(result);
                    searchPager(function () {
                        _this.search("pager", function (err, result) {
                            //渲染视图
                            if (err === null) {
                                //console.log(result);
                                _this.renderview(result);
                            }
                        });
                    });
                }
            });
        });
        //自由伴事件
        $(document).on("click", "span[data-zybval]", function (ee) {

            // alert(1);
            // return;
            //触发的控件
            var tar = $(ee.target || ee);
            //控件的值
            var value = tar.attr("data-zybval");
            //父dom
            var dl = tar.closest("dl");
            //找到之前选中的按钮
            dl.find(".choice-items > .choice-on").removeClass("choice-on");

            //判断之前是否有这个按钮
            var items = dl.find(".choice-items > span[data-val='" + value + "']");

            if (items.length === 0) {

                var oldnewbutton = dl.find(".newButton");
                if (oldnewbutton.length === 0) {
                    //如果没有增加一个
                    var newButton = $("<span>", { "class": "choice-item newButton choice-on", "data-val": value, "text": value });
                    dl.find(".choice-tab").before(newButton);
                    newButton.trigger("click");
                } else {
                    oldnewbutton.attr("data-val", value);
                    oldnewbutton.text(value);
                    oldnewbutton.addClass("choice-on");
                    oldnewbutton.trigger("click");
                }
            } else {
                items.addClass("choice-on");
                items.trigger("click");
            }
            tar.closest(".bd .choice-on").removeClass("choice-on");
            tar.addClass("choice-on");
        });

        //排序事件
        $(document).on("click", "li[data-sort]", function (ee) {
            //触发的控件
            var tar = $(ee.currentTarget || ee);

            //父对象
            var ul = tar.closest("ul");
            //找到之前的排序按钮
            var tar1 = ul.find(".on");
            //控件的值
            var value = tar.attr("data-sort");
            //debugger
            if (tar.is(tar1) && tar.is("[data-order='price']")) {
                if (value === "2") {
                    value = "3";
                    tar.removeClass("sort-on");
                } else {
                    value = "2";
                    tar.addClass("sort-on");
                }
                tar.attr("data-sort", value);
            }
            //删除样式
            ul.find(".on").removeClass("on");

            //增加样式
            tar.addClass("on");



            $("#hdDataReq").attr("data-sortby", value);
            //触发搜索
            $("#hdDataReq").attr("data-PageIndex", 1);
            _this.search("head", function (err, result) {
                if (err === null) {
                    //渲染视图
                    _this.renderview(result);
                    searchPager(function () {
                        _this.search("pager", function (err, result) {
                            //渲染视图
                            if (err === null) {
                                //console.log(result);
                                _this.renderview(result);
                            }
                        });
                    });
                }
            });
        });
        //优惠促销按钮
        $(document).on("click", "input[data-cx]", function (ee) {
            //触发的控件
            var tar = $(ee.currentTarget || ee);
            //是否优惠
            var isOn = tar.hasClass("on");
            //如果已经选中
            if (isOn) {
                $("#hdDataReq").attr("data-ischeap", "0");
                tar.removeClass("on");

            } else {
                $("#hdDataReq").attr("data-ischeap", "1");
                tar.addClass("on");
            }
            console.log($("#hdDataReq").attr("data-ischeap"));
            //触发搜索
            $("#hdDataReq").attr("data-PageIndex", 1);
            _this.search("head", function (err, result) {
                if (err === null) {
                    //渲染视图
                    _this.renderview(result);
                    searchPager(function () {
                        _this.search("pager", function (err, result) {
                            //渲染视图
                            if (err === null) {
                                _this.renderview(result);
                            }
                        });
                    });
                }
            });

        });
    };

    //渲染详情页面
    _app.prototype.renderview = function (data) {
        var _this = this;
        //获得当前选择的tab
        var tab = this.getchoosetab();
        var panel = this.getdetailpanel();
        panel.html('');
        //普通产品和 邮轮产品 用这个
        if (this.ischooseTour() || this.ischooseYL()) {
            $.each((data["RouteObject"] || []), function (i, n) {
                var row = _this.$createdetailtourrow(n);
                panel.append(row);
            });
        }
        if (this.ischooseVisa()) {
            $.each((data["RouteObject"] || []), function (i, n) {
                var row = _this.$createdetailvisarow(n);
                panel.append(row);
            });
        }
        if (this.ischooseZYB()) {
            $.each((data["RouteObject"] || []), function (i, n) {
                var row = _this.$createdetailzybrow(n);
                panel.append(row);
            });
        }
        if ((data["RouteObject"] || []).length > 0) {
            $(".hideview").addClass("hide");
            $("#j_fnPager").removeClass("hide");
        } else {

            $(".hideview").removeClass("hide");
            $("#j_fnPager").addClass("hide");
        }
        var pageObject = data["PageObject"];
        //设置分页
        $("#j_fnPager").attr({ "data-counts": pageObject["TotalCount"] });

        uzLazy(['j_sortLine']);

    };
    //把panel选择项重置
    _app.prototype.initpanelviewselect = function () {
        //获得当前选择的panel
        var panel = this.getchoosepanel();

        var rows = panel.find("dl.choice-section");
        var startcity;
        $.each(rows, function (i, n) {
            var row = $(n);
            var all = row.find("span.choice-all");
            var items = row.find(".choice-item");
            var iscityrow = row.is("[data-startcity]");
            var islqrow = row.is("[data-visareceivezone]");
            all.removeClass("choice-on");
            items.removeClass("choice-on");
            if (iscityrow) {
                startcity = $("#hdDataReq").attr("data-checkedCity");

                if (row.find(".choice-item[data-val='" + startcity + "']").length > 0) {
                    row.find(".choice-item[data-val='" + startcity + "']").addClass("choice-on");
                } else {
                    all.addClass("choice-on");
                }
            }
            else if (islqrow) {
                startcity = $("#hdDataReq").attr("data-hostcityname");
                // if (row.find(".choice-item[data-val*='" + startcity + "']").length > 0 ) {
                //     row.find(".choice-item[data-val*='" + startcity + "']:eq(0)").addClass("choice-on");
                // }
                // //找上海或者北京领区
                // else {
                //     all.addClass("choice-on");
                // }
                all.addClass("choice-on");
            }
            else {
                all.addClass("choice-on");
                row.find(".choice-item.choice-on").removeClass("choice-on");
            }
        });
    };
    //渲染panel页面
    _app.prototype.renderpanelview = function (data) {
        var div, ul, li, div1, div2, timecontrol, row;
        //获得当前选择的panel
        var tab = this.getchoosetab();
        //获得当前选择的panel
        var panel = this.getchoosepanel();
        var tmpStr1, tmpStr2, arr, tmpBit, tmpInt = 0;
        var cityid = $("#hdDataReq").attr("data-checkedCity");
        if (this.ischooseTour()) {
            if (data["SubTypeObject"] !== null && data["SubTypeObject"] instanceof Array && data["SubTypeObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-subtype",
                    title: "游玩主题"
                });
                $.each(data["SubTypeObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Id"],
                        "text": n["Name"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["StartCityObject"] !== null && data["StartCityObject"] instanceof Array && data["StartCityObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-startcity",
                    title: "出发城市",
                    dataval: "0"
                });

                tmpBit = 0;

                row.find(".choice-items").append($("<div>", {
                    "class": ("choice-box"),
                }));

                $.each(data["StartCityObject"], function (i, n) {
                    tmpStr1 = "";
                    if (n["CityId"].toString() === cityid) {
                        tmpBit = 1;
                        tmpStr1 = "choice-on";
                    }

                    row.find(".choice-box").append($("<span>", {
                        "class": ("choice-item " + tmpStr1),
                        "data-val": n["CityId"],
                        "text": n["CityName"]
                    }));

                });
                if (tmpBit !== 0) {
                    row.find(".choice-all").removeClass("choice-on");
                }
                panel.append(row);
                tmpInt++;
            }
            if (data["JourneyDayObject"] !== null && data["JourneyDayObject"] instanceof Array && data["JourneyDayObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-journeyday",
                    title: "行程天数"
                });

                $.each(data["JourneyDayObject"], function (i, n) {
                    var str;
                    var str1;
                    if (n["StartDay"] && n["EndDay"]) {
                        str = n["StartDay"] + "-" + n["EndDay"] + "天";
                        str1 = n["StartDay"] + "-" + n["EndDay"];
                    }
                    else if (n["StartDay"] && !n["EndDay"]) {
                        str = n["StartDay"] + "天及以上";
                        str1 = n["StartDay"];
                    }
                    else if (n["EndDay"]) {
                        str = n["EndDay"] + "天及以上";
                        str1 = "-" + n["EndDay"];
                    }
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": str1,
                        "text": str
                    }));
                });

                panel.append(row);
                tmpInt++;
            }


            if (data["GoDateObject"] !== null && data["GoDateObject"] instanceof Array && data["GoDateObject"].length > 0) {
                //出发日期
                row = this.$createheadrow({
                    prop: "data-godate",
                    title: "出发日期"
                });

                $.each(data["GoDateObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["MonthVal"],
                        "text": n["MonthTxt"]
                    }));
                });

                timecontrol = this.$createtimecontrol();
                row.find(".choice-items").append(timecontrol);
                panel.append(row);
                tmpInt++;
            }

            if (data["PastAddressObject"] !== null && data["PastAddressObject"] instanceof Array && data["PastAddressObject"].length > 0) {
                //途经景观
                row = this.$createheadrow({
                    prop: "data-pastaddress",
                    title: "途经景观",
                    hide: true
                });

                $.each(data["PastAddressObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }


            if (data["SuitManObject"] !== null && data["SuitManObject"] instanceof Array && data["SuitManObject"].length > 0) {
                //适宜人群
                // row = this.$createheadrow({
                //     prop: "data-suitman",
                //     title: "适宜人群",
                //     hide: true
                // });

                // $.each(data["SuitManObject"], function (i, n) {
                //     row.find(".choice-items").append($("<span>", {
                //         "class": "choice-item",
                //         "data-val": n,
                //         "text": n
                //     }));
                // });
                // panel.append(row);
                // tmpInt++;
            }

        }
        if (this.ischooseVisa()) {
            if (data["VisaAreaObject"] !== null && data["VisaAreaObject"] instanceof Array && data["VisaAreaObject"].length > 0) {
                //地区
                row = this.$createheadrow({
                    prop: "data-visaarea",
                    title: "地区"
                });

                $.each(data["VisaAreaObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }


            if (data["VisaCountryObject"] !== null && data["VisaCountryObject"] instanceof Array && data["VisaCountryObject"].length > 0) {
                //国家
                row = this.$createheadrow({
                    prop: "data-visacountry",
                    title: "国家"
                });

                $.each(data["VisaCountryObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["CountryName"],
                        "text": n["CountryName"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["VisaReceiveZoneObject"] !== null && data["VisaReceiveZoneObject"] instanceof Array && data["VisaReceiveZoneObject"].length > 0) {
                //所属领区
                row = this.$createheadrow({
                    prop: "data-visareceivezone",
                    title: "所属领区"
                });


                var startcity = $("#hdDataReq").attr("data-hostcityname");
                $.each(data["VisaReceiveZoneObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": ("choice-item " + tmpStr2),
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                row.find(".choice-item").removeClass("choice-on");
                //找上海或者北京领区
                // if (row.find(".choice-item[data-val*='" + startcity + "']").length > 0) {
                //     row.find(".choice-item[data-val*='" + startcity + "']:eq(0)").addClass("choice-on");
                //     row.find(".choice-all").removeClass("choice-on");
                // }else{

                // }
                panel.append(row);
                tmpInt++;
            }

            if (data["VisaTypeObject"] !== null && data["VisaTypeObject"] instanceof Array && data["VisaTypeObject"].length > 0) {
                //签证类型
                row = this.$createheadrow({
                    prop: "data-visatype",
                    title: "签证类型"
                });

                $.each(data["VisaTypeObject"], function (i, n) {
                    var iId;
                    switch (n["Des"]) {
                        case '旅游签证':
                            iId = 1;
                            break;
                        case '商业签证':
                            iId = 2;
                            break;
                        case '探亲访友':
                            iId = 3;
                            break;
                        default: // '其他'
                            iId = 4;
                    }

                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-id": iId,
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

        }
        if (this.ischooseYL()) {
            if (data["CruisesRouteObject"] !== null && data["CruisesRouteObject"] instanceof Array && data["CruisesRouteObject"].length > 0) {
                //航线目的地
                row = this.$createheadrow({
                    prop: "data-route",
                    title: "航线目的地"
                });

                $.each(data["CruisesRouteObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["StartCityObject"] !== null && data["StartCityObject"] instanceof Array && data["StartCityObject"].length > 0) {
                //出发城市
                row = this.$createheadrow({
                    prop: "data-startcity",
                    title: "出发城市",
                    dataval: "0"
                });

                tmpBit = 0;
                $.each(data["StartCityObject"], function (i, n) {
                    tmpStr1 = "";
                    if (n["CityId"].toString() === cityid) {
                        tmpBit = 1;
                        tmpStr1 = "choice-on";
                    }

                    row.find(".choice-items").append($("<span>", {
                        "class": ("choice-item " + tmpStr1),
                        "data-val": n["CityId"],
                        "text": n["CityName"]
                    }));

                });
                if (tmpBit !== 0) {
                    row.find(".choice-all").removeClass("choice-on");
                }
                panel.append(row);
                tmpInt++;
            }

            if (data["CruisesCompanyObject"] !== null && data["CruisesCompanyObject"] instanceof Array && data["CruisesCompanyObject"].length > 0) {
                //邮轮公司
                row = this.$createheadrow({
                    prop: "data-company",
                    title: "邮轮公司"
                });

                $.each(data["CruisesCompanyObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });

                panel.append(row);
                tmpInt++;
            }

            if (data["GoDateObject"] !== null && data["GoDateObject"] instanceof Array && data["GoDateObject"].length > 0) {
                //出发日期
                row = this.$createheadrow({
                    prop: "data-godate",
                    title: "出发日期"
                });

                $.each(data["GoDateObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["MonthVal"],
                        "text": n["MonthTxt"]
                    }));
                });
                timecontrol = this.$createtimecontrol();
                row.find(".choice-items").append(timecontrol);
                panel.append(row);
                tmpInt++;
            }

            if (data["CruisesPortObject"] !== null && data["CruisesPortObject"] instanceof Array && data["CruisesPortObject"].length > 0) {
                //出发港口
                row = this.$createheadrow({
                    prop: "data-port",
                    title: "出发港口",
                    hide: true
                });

                $.each(data["CruisesPortObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Real"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["JourneyDayObject"] !== null && data["JourneyDayObject"] instanceof Array && data["JourneyDayObject"].length > 0) {
                //行程天数
                row = this.$createheadrow({
                    prop: "data-journeyday",
                    title: "行程天数",
                    hide: true
                });

                $.each(data["JourneyDayObject"], function (i, n) {
                    var str;
                    var str1;
                    if (n["StartDay"] && n["EndDay"]) {
                        str = n["StartDay"] + "-" + n["EndDay"] + "天";
                        str1 = n["StartDay"] + "-" + n["EndDay"];
                    }
                    else if (n["StartDay"] && !n["EndDay"]) {
                        str = n["StartDay"] + "天及以上";
                        str1 = n["StartDay"];
                    }
                    else if (n["EndDay"]) {
                        str = n["EndDay"] + "天及以上";
                        str1 = "-" + n["EndDay"];
                    }
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": str1,
                        "text": str
                    }));
                });
                panel.append(row);
                tmpInt++;
            }
        }
        if (this.ischooseZYB()) {
            if (data["SubTypeObject"] !== null && data["SubTypeObject"] instanceof Array && data["SubTypeObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-subtype",
                    title: "游玩主题"
                });

                $.each(data["SubTypeObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Id"],
                        "text": n["Name"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if ((data["ZYBCityBaseQuick"] !== null && data["ZYBCityBaseQuick"].length > 0) || (data["ZYBCityBase"] !== null && data["ZYBCityBase"].length > 0)) {
                row = this.$createheadrow({
                    prop: "data-startcityzyb",
                    title: "出发城市",
                    dataval: ""
                });

                tmpBit = 0;
                $.each((data["ZYBCityBaseQuick"]["DepartureCityList"] || []), function (i, n) {

                    //循环境外参团
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["LocationNameReadOnly"],
                        "text": n["LocationNameReadOnly"]
                    }));
                });

                div = $("<div>", { "class": "choice-tab mt10", "data-event": "hover1" });
                div1 = $("<div>", { "class": "bd" });
                ul = $("<ul>", { "class": "hd clearfix" });
                //debugger
                $.each((data["ZYBCityBase"] || []), function (i, n) {
                    var tmpStr = i === 0 ? "on" : "";
                    li = $("<li>", { "class": "hd-item " + tmpStr, "text": n["title"] });
                    ul.append(li);

                    tmpStr = i === 0 ? "" : " hide ";
                    var tmpStr1 = i === 0 ? "display: block" : "display: none";
                    div2 = $("<div>", { "class": "item" + tmpStr, "style": tmpStr1 });
                    $.each(n["DepartureCityList"], function (ii, nn) {
                        div2.append($("<span>", { "class": "choice-item", "text": nn["LocationNameReadOnly"], "data-zybval": nn["LocationNameReadOnly"] }));
                    });
                    div1.append(div2);
                });
                if ((data["ZYBCityBase"] || []).length !== 0) {
                    div.append(ul).append(div1);
                    row.find(".choice-items").append(div);
                }
                panel.append(row);
                tmpInt++;
            }

            if (data["RBLTypeObject"] !== null && data["RBLTypeObject"] instanceof Array && data["RBLTypeObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-rbltype",
                    title: "产品类型"
                });

                $.each(data["RBLTypeObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Name"],
                        "text": n["Name"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["JourneyDayObject"] !== null && data["JourneyDayObject"] instanceof Array && data["JourneyDayObject"].length > 0) {
                row = this.$createheadrow({
                    prop: "data-journeyday",
                    title: "行程天数"
                });

                $.each(data["JourneyDayObject"], function (i, n) {
                    var str;
                    var str1;
                    if (n["StartDay"] && n["EndDay"]) {
                        str = n["StartDay"] + "-" + n["EndDay"] + "天";
                        str1 = n["StartDay"] + "-" + n["EndDay"];
                    }
                    else if (n["StartDay"] && !n["EndDay"]) {
                        str = n["StartDay"] + "天及以上";
                        str1 = n["StartDay"];
                    }
                    else if (n["EndDay"]) {
                        str = n["EndDay"] + "天及以上";
                        str1 = "-" + n["EndDay"];
                    }
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": str1,
                        "text": str
                    }));
                });
                panel.append(row);
                tmpInt++;
            }

            if (data["GoDateObject"] !== null && data["GoDateObject"] instanceof Array && data["GoDateObject"].length > 0) {
                //出发日期
                row = this.$createheadrow({
                    prop: "data-godate",
                    title: "出发日期",
                    hide: true
                });

                $.each(data["GoDateObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["MonthVal"],
                        "text": n["MonthTxt"]
                    }));
                });
                timecontrol = this.$createtimecontrol();
                row.find(".choice-items").append(timecontrol);
                panel.append(row);
                tmpInt++;
            }

            if (data["PastAddressObject"] !== null && data["PastAddressObject"] instanceof Array && data["PastAddressObject"].length > 0) {
                //途经景观
                row = this.$createheadrow({
                    prop: "data-pastaddress",
                    title: "途经景观",
                    hide: true
                });

                $.each(data["PastAddressObject"], function (i, n) {
                    row.find(".choice-items").append($("<span>", {
                        "class": "choice-item",
                        "data-val": n["Des"],
                        "text": n["Des"]
                    }));
                });
                panel.append(row);
                tmpInt++;
            }
            if (data["SuitManObject"] !== null && data["SuitManObject"] instanceof Array && data["SuitManObject"].length > 0) {
                //适宜人群
                // row = this.$createheadrow({
                //     prop: "data-suitman",
                //     title: "适宜人群",
                //     hide: true
                // });

                // $.each(data["SuitManObject"], function (i, n) {
                //     row.find(".choice-items").append($("<span>", {
                //         "class": "choice-item",
                //         "data-val": n,
                //         "text": n
                //     }));
                // });
                // panel.append(row);
                // tmpInt++;
            }

        }
        if (panel.find("dl").length > 4) {
            var moreInfo = this.$createheadmore();
            panel.append(moreInfo);
            panel.find("dl").slice(0, 4).removeClass("hide");
        }


        panel.attr("data-isload", "");
    };
    //邮轮 filter
    _app.prototype.filterbjarea = function () {
        if (this.ischooseYL()) {
            var panel = this.getchoosepanel();
            var row = panel.find("[data-startcity]");
            var rowarea = panel.find("[data-port]");
            var rowcompany = panel.find("[data-company]");
            var chooseitem = row.find(".choice-on");
            var text = chooseitem.text().trim();

            if (this.isbjarea(text)) {
                rowarea.find(".choice-all").addClass("choice-on");
                rowarea.find(".choice-item").removeClass("choice-on");
                rowarea.addClass("hide");
                rowcompany.addClass('hide');
                // if (panel.find('.btn-switch').is(".on")) {
                //     panel.find("dl").removeClass("hide");
                // }else{
                //     panel.find("dl").slice(0, 4).removeClass("hide");
                // }
            } else {
                if (panel.find('.btn-switch').is(".on")) {
                    panel.find("dl").removeClass("hide");
                } else {
                    panel.find("dl").slice(0, 4).removeClass("hide");
                }
            }

        }
    };

    //刷新筛选条件
    _app.prototype.flushchoose = function () {
        var panel = this.getchoosepanel();
    };

    //新建filter上的一行
    _app.prototype.$createheadrow = function (args) {
        var dl = $("<dl>", {
            "class": ("choice-section clearfix " + (args["hide"] === true ? "hide" : "")),
        });
        dl.attr(args["prop"], "");
        var dt = $("<dt>", {
            "class": "section-hd f999 fl"
        });
        dt.text(args["title"]);
        var dd = $("<dd>", {
            "class": "section-bd clearfix"
        });
        var div = $("<div>", { "class": "choice-items" });
        dd.append("<span class='choice-all fl choice-on' data-val='" + (args["dataval"] || "") + "'>全部</span>").append(div);
        dl.append(dt).append(dd);
        return dl;
    };
    //更多筛选条件
    _app.prototype.$createheadmore = function () {
        var p = $("<p>", {
            "class": "btn-bar tc"
        });
        var span = $("<span>", {
            "class": "btn-switch blue pointer"
        });
        var em = $("<em>", {
            "class": "switch-cont",
            "text": "更多筛选条件"
        });

        var span1 = $("<span>", {
            "class": "arrow-wrap f12 songti lh1 ml5 vm"
        });
        span1.append("<i class='arrow-icon'>◆</i>");
        span.append(em).append(span1);
        p.append(span);
        return p;
    };

    //详情的一行 正常分类
    _app.prototype.$createdetailtourrow = function (data) {
        var li, a, img, span, div, p, dl, dt, dd;
        var strZJTitle = "";
        if (data.ProductType == 3 ||
            data.ProductType == 8 ||
            data.ProductType == 9 ||
            data.ProductType == 11 ||
            data.ProductType == 12) {
            strZJTitle = "不限出发地";
        }
        else if (data.ProductType == 16) {
            strZJTitle = " " + (data.AbroadStartCity || "") + "出发 ";
        }
        else {
            strZJTitle = " " + data.StartCityName + "出发 ";
        }
        var strTreeJourney = (data.TreeJourney || "").replace(/\^/g, "、");
        var UzaiTravelClassCss = "product-gty";
        if (data.UzaiTravelClassName == "跟团游") { UzaiTravelClassCss = "product-gty"; }
        else if (data.UzaiTravelClassName == "自由行") { UzaiTravelClassCss = "product-zzy"; }
        else if (data.UzaiTravelClassName == "自驾游") { UzaiTravelClassCss = "product-zjy"; }
        else if (data.UzaiTravelClassName == "公司游") { UzaiTravelClassCss = "product-gsy"; }
        else if (data.UzaiTravelClassName == "当地游") { UzaiTravelClassCss = "product-ddy"; }
        else if (data.UzaiTravelClassName == "邮轮") { UzaiTravelClassCss = "product-yl"; }
        var travelClassName = data.ProductType == 16 ? "境外参团" : data.UzaiTravelClassName;


        var PageURL = data.ProductURL;
        if ($.trim($("#hdDataReq").attr("data-uztype")) == "manager") {

            var SuserId = _util.url.get("userId");
            var did = _util.url.get("did"); //渠道源ID

            if (data.ProductURL.toLowerCase().lastIndexOf("youlun/p-") >= 1) {
                //邮轮offline下单保留tour跟团地址 2014-08-13 JoJo
                PageURL = "http://sh.uzai.com/tour-" + data.ProductId + ".html";
            }
            if (UzaiTravelClassCss == "product-yl" || UzaiTravelClassCss == "product-gty") {
                PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
            }
            else if (UzaiTravelClassCss == "product-zzy") {
                PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineTripQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
            }
        }

        li = $("<li>", {
            "class": "list-item clearfix",
            "style": "display:block",
            "data-pid": data["ProductId"]
        });
        /*------------------------*/
        a = $("<a>", {
            "href": PageURL,
            "class": "item-pic fl",
            "target": "_blank"
        });

        img = $("<img>", {
            "data-original": data.PictureUrl,
            "src": "//r01.uzaicdn.com/content/m/images/common/gray.gif",
            "class": "g10",
            "style": "display: inline"
        });
        span = $("<span>", {
            "class": "tag-type white f14 tc",

        });
        span.html("<em>" + travelClassName + "</em>");
        div = $("<div>", {
            "class": "info-bar"
        });

        if (data.Satisfaction !== 0 || data.CommentNumber !== 0) {
            p = $("<p>", { "class": "info-mask" });
            div.append(p);
            p = $("<p>", { "class": "info-cont white" });
            data.Satisfaction = data.Satisfaction === 0 ? 100 : data.Satisfaction;
            p.html("满意度：<i>" + data.Satisfaction + "% </i>       |       <i> " + data.CommentNumber + "</i> 人点评");
        }
        div.append(p);
        a.append(img)
            .append(span)
            .append(div);
        li.append(a);
        /*------------------------*/
        div = $("<div>", { "class": "item-side tc fr" });
        p = $("<p>", { "class": "item-price f666 f16" });
        if (data.MinPrice > 0) {

            p.html("<i class='price red f22'>¥<em>" + data.MaxPrice + "</em></i> 起");
        } else {
            p.html("<i class='price red f22'>价格请电询<em></em></i>");
        }
        div.append(p);
        p = $("<p>", { "class": "mt5" });
        a = $("<a>", { "href": PageURL, "class": "btn-detail f14", "text": "查看详情", "target": "_blank" });
        p.append(a);
        div.append(p);
        li.append(div);
        /*------------------------*/
        dl = $("<dl>", { "class": "item-main" });
        dt = $("<dt>", { "class": "item-hd f16 b" });
        //console.log(data.ProductName);
        a = $("<a>", { "href": PageURL, "text": data.ProductName.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), "target": "_blank", "title": data["ProductNameFull"] });
        dt.append(a);
        dl.append(dt);
        dd = $("<dd>", { "class": "item-favorable ellipsis" });
        //循环产品图标
        $.each((data["ShowIconHTMLES"] || []), function (i, n) {
            span = $("<span>", { "class": "tag-item mr10", "text": n });
            dd.append(span);
        });
        dl.append(dd);
        if (strTreeJourney !== "") {
            strTreeJourney = "| " + strTreeJourney;
        }
        dd = $("<dd>", { "class": "item-info ellipsis f666 f14", "title": strTreeJourney, "text": strZJTitle + strTreeJourney });
        dl.append(dd);
        dd = $("<dd>", { "class": "item-date f14" });
        //增加众信自营标识
        var strSelfHtml = '';
        if (data.IsUtourSelf) {
            strSelfHtml = '<span class="uzai-self">众信自营｜</span>';
            dd.append(strSelfHtml);
        }
        span = $("<span>", { "class": "date-info f999", "text": "团期：" + data.GoDate });
        a = $("<a>", { "class": "more-date blue", "href": PageURL, "text": "更多班期", "target": "_blank" });
        dd.append(span).append(a);
        dl.append(dd);
        //优惠展示部分
        if ((data.TagNameDisp || []).length > 0) {
            dd = $("<dd>", { "class": "item-favorable ellipsis modify_12" });
            span = $("<span>", { "class": "tag-item mr10 left", "text": "优惠" });
            div = $("<div>", { "class": "modify_13" });
            var spansub = $("<span>", {});
            div.append(spansub);
            //优惠悬浮展示
            $.each((data["TagNameDispHover"] || []), function (i, n) {
                p = $("<p>", { "html": n });
                div.append(p);
            });
            span.append(div);
            dd.append(span);
            span = $("<span>", { "class": "right", "text": data.TagNameDisp });
            dd.append(span);
            div = $("<div>", { "class": "clear" });
            dd.append(div);
            dl.append(dd);
        }
        li.append(dl);
        return li;
    };
    //自由伴 详情的一行 正常分类
    _app.prototype.$createdetailzybrow = function (data) {
        var li, a, img, span, div, p, dl, dt, dd;
        var strZJTitle = "";
        if (data.ProductType == 3 ||
            data.ProductType == 8 ||
            data.ProductType == 9 ||
            data.ProductType == 11 ||
            data.ProductType == 12) {
            strZJTitle = "不限出发地";
        }
        else if (data.ProductType == 16) {
            strZJTitle = " " + (data.AbroadStartCity || "") + "出发 ";
        }
        else {
            strZJTitle = " " + data.StartCityName + "出发 ";
        }
        var strTreeJourney = (data.TreeJourney || "").replace(/\^/g, "、");
        var UzaiTravelClassCss = "product-gty";
        if (data.UzaiTravelClassName == "跟团游") { UzaiTravelClassCss = "product-gty"; }
        else if (data.UzaiTravelClassName == "自由行") { UzaiTravelClassCss = "product-zzy"; }
        else if (data.UzaiTravelClassName == "自驾游") { UzaiTravelClassCss = "product-zjy"; }
        else if (data.UzaiTravelClassName == "公司游") { UzaiTravelClassCss = "product-gsy"; }
        else if (data.UzaiTravelClassName == "当地游") { UzaiTravelClassCss = "product-ddy"; }
        else if (data.UzaiTravelClassName == "邮轮") { UzaiTravelClassCss = "product-yl"; }
        var travelClassName = data.ProductType == 16 ? "境外参团" : data.UzaiTravelClassName;


        var PageURL = data.ProductURL;
        if ($.trim($("#hdDataReq").attr("data-uztype")) == "manager") {

            var SuserId = _util.url.get("userId");
            var did = _util.url.get("did"); //渠道源ID

            if (data.ProductURL.toLowerCase().lastIndexOf("youlun/p-") >= 1) {
                //邮轮offline下单保留tour跟团地址 2014-08-13 JoJo
                PageURL = "http://sh.uzai.com/tour-" + data.ProductId + ".html";
            }
            if (UzaiTravelClassCss == "product-yl" || UzaiTravelClassCss == "product-gty") {
                PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
            }
            else if (UzaiTravelClassCss == "product-zzy") {
                PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineTripQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
            }
        }

        li = $("<li>", {
            "class": "list-item clearfix",
            "style": "display:block",
            "data-pid": data["ProductId"]
        });
        /*------------------------*/
        a = $("<a>", {
            "href": PageURL,
            "class": "item-pic fl",
            "target": "_blank"
        });

        img = $("<img>", {

            "data-original": data.PictureUrl,
            "src": "//r01.uzaicdn.com/content/m/images/common/gray.gif",
            "class": "g10",
            "style": "display: inline"
        });
        span = $("<span>", {
            "class": "tag-type white f14 tc",

        });
        span.html("<em>" + travelClassName + "</em>");
        div = $("<div>", {
            "class": "info-bar"
        });

        if (data.Satisfaction !== 0 || data.CommentNumber !== 0) {
            p = $("<p>", { "class": "info-mask" });
            div.append(p);
            p = $("<p>", { "class": "info-cont white" });
            data.Satisfaction = data.Satisfaction === 0 ? 100 : data.Satisfaction;
            p.html("满意度：<i>" + data.Satisfaction + "% </i>       ｜       <i> " + data.CommentNumber + "</i> 人点评");
        }
        div.append(p);
        a.append(img)
            .append(span)
            .append(div);
        li.append(a);
        /*------------------------*/
        div = $("<div>", { "class": "item-side tc fr" });
        p = $("<p>", { "class": "item-price f666 f16" });
        if (data.MinPrice > 0) {

            p.html("<i class='price red f22'>¥<em>" + data.MaxPrice + "</em></i> 起");
        } else {
            p.html("<i class='price red f22'>价格请电询<em></em></i>");
        }
        div.append(p);
        p = $("<p>", { "class": "mt5" });
        a = $("<a>", { "href": PageURL, "class": "btn-detail f14", "text": "查看详情", "target": "_blank" });
        p.append(a);
        div.append(p);
        li.append(div);
        /*------------------------*/
        dl = $("<dl>", { "class": "item-main" });
        dt = $("<dt>", { "class": "item-hd f16 b" });
        //console.log(data.ProductName);
        a = $("<a>", { "href": PageURL, "text": data.ProductName.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), "target": "_blank", "title": data["ProductNameFull"] });
        dt.append(a);
        dl.append(dt);
        dd = $("<dd>", { "class": "item-favorable ellipsis" });
        //循环产品图标
        $.each((data["ShowIconHTMLES"] || []), function (i, n) {
            span = $("<span>", { "class": "tag-item mr10", "text": n });
            dd.append(span);
        });
        if (strTreeJourney !== "") {
            strTreeJourney = "| " + strTreeJourney;
        }
        dd = $("<dd>", { "class": "item-info ellipsis f666 f14", "title": strTreeJourney, "text": strZJTitle + strTreeJourney });
        dl.append(dd);
        dd = $("<dd>", { "class": "item-date f14" });
        var strSelfHtml = '';
        if (data.IsUtourSelf) {
            strSelfHtml = '<span class="uzai-self">众信自营｜</span>';
            dd.append(strSelfHtml);
        }
        span = $("<span>", { "class": "date-info f999", "text": "团期：" + data.GoDate });
        a = $("<a>", { "class": "more-date blue", "href": PageURL, "text": "更多班期", "target": "_blank" });
        dd.append(span).append(a);
        dl.append(dd);
        //优惠展示部分
        if ((data.TagNameDisp || []).length > 0) {
            dd = $("<dd>", { "class": "item-favorable ellipsis modify_12" });
            span = $("<span>", { "class": "tag-item mr10 left", "text": "优惠" });
            div = $("<div>", { "class": "modify_13" });
            var spansub = $("<span>", {});
            div.append(spansub);
            //优惠悬浮展示
            $.each((data["TagNameDispHover"] || []), function (i, n) {
                p = $("<p>", { "html": n });
                div.append(p);
            });
            span.append(div);
            dd.append(span);
            span = $("<span>", { "class": "right", "text": data.TagNameDisp });
            dd.append(span);
            div = $("<div>", { "class": "clear" });
            dd.append(div);
            dl.append(dd);
        }
        li.append(dl);
        return li;
    };
    //创建签证的一行
    _app.prototype.$createdetailvisarow = function (data) {
        var li, a, img, span, div, p, dl, dt, dd, table, tbody, tr, td;
        var strZJTitle = "";
        var PageURL = data.ProductURL;
        li = $("<li>", {
            "class": "list-item clearfix",
            "style": "display:block",
            "data-pid": data["ProductId"]
        });
        /*------------------------*/
        a = $("<a>", {
            "href": PageURL,
            "class": "item-pic fl",
            "target": "_blank"
        });

        img = $("<img>", {
            "data-original": data.ProductVisa.ProductPic,
            "src": "//r01.uzaicdn.com/content/m/images/common/gray.gif",
            "class": "g10",
            "style": "display: inline"
        });
        // span = $("<span>", {
        //     "class": "tag-type white f14 tc",

        // });
        div = $("<div>", {
            "class": "info-bar"
        });
        a.append(img)
            //.append(span)
            .append(div);
        li.append(a);
        /*------------------------*/
        div = $("<div>", { "class": "item-side tc fr" });
        p = $("<p>", { "class": "item-price f666 f16" });
        if (data.MinPrice > 0) {

            p.html("<i class='price red f22'>¥<em>" + data.MaxPrice + "</em></i> 起");
        } else {
            p.html("<i class='price red f22'>价格请电询<em></em></i>");
        }
        div.append(p);
        p = $("<p>", { "class": "mt5" });
        a = $("<a>", { "href": PageURL, "class": "btn-detail f14", "text": "马上办理", "target": "_blank" });
        p.append(a);
        div.append(p);
        li.append(div);
        /*------------------------*/
        dl = $("<dl>", { "class": "item-main" });
        dt = $("<dt>", { "class": "item-hd f16 b" });
        //console.log(data.ProductName);
        a = $("<a>", { "href": PageURL, "text": data.ProductName.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), "target": "_blank", "title": data["ProductNameFull"] });
        dt.append(a);
        dl.append(dt);
        dd = $("<dd>", { "class": "item-favorable ellipsis" });
        dl.append(dd);
        dd = $("<dd>");
        table = $("<table>", { "class": "info-table f666 f14 g10" });
        tbody = $("<tbody>");
        tr = $("<tr>");
        td = $("<td>", { "text": "最长停留:" + (data.ProductVisa.RemainTime || "") });
        tr.append(td);
        td = $("<td>", { "text": "是否面试:" + (data.ProductVisa.FaceTypeName || "") });
        tr.append(td);
        tbody.append(tr);
        tr = $("<tr>");
        td = $("<td>", { "text": "入境次数:" + (data.ProductVisa.EntryNum == -1 ? "多次" : data.ProductVisa.EntryNum + " 次") });
        tr.append(td);
        td = $("<td>", { "text": "办理周期:" + (data.ProductVisa.ProcTime || "") });
        tr.append(td);
        tbody.append(tr);
        table.append(tbody);
        dd.append(table);
        dl.append(dd);
        li.append(dl);
        return li;
    };
    //日期空间
    _app.prototype.$createtimecontrol = function () {
        var span = $("<span>", { "class": "date-wrap j_afterCalendarWrap" });
        var input = $("<input>", {
            "type": "text",
            "class": "textbox start-date f14 yahei tc",
            "placeholder": "自定义出发日期",
            "data-val": "",
            "readonly": "readonly"
        });
        span.append(input);
        return span;
    };

    //推荐模块
    var recommend = function (container, producttypes, app) {
        //绑定容器
        this.container = $(container);
        //绑定产品类型
        this.producttypes = producttypes;
        //绑定APP
        this.app = app;

    };
    //渲染推荐视图
    recommend.prototype.renderview = function () {
        var _this = this;
        //console.clear();
        //清空视图
        this.container.html('');
        var type = this.app.getchoosetype();
        //循环增加视图
        $.each(this.producttypes, function (i, n) {
            var pro = n.toString();
            if (pro !== type) {
                _this.app.searchrecommend(n, function (err, result) {
                    if (err === null) {
                        var count = result["PageObject"]["TotalCount"];
                        if (count > 0) {
                            var row = _this.$createrecommand({ "producttype": pro, "obj": result });
                            $("#j_recommend").append(row);
                            uzLazy(['j_recommend']);
                        }
                    }
                });

            }
        });
    };
    recommend.prototype.geturl = function (protype) {
        var webStr = "http://search.uzai.com";
        var keyword = $.trim($("#hdDataReq").attr("data-keyword"));
        var hostCity = $.trim($("#hdDataReq").attr("data-hostcity"));
        if (!hostCity) {
            hostCity = "sh";
        }
        var url = webStr + "/" + hostCity + "/SearchResult?keyword=" + encodeURI($.trim(keyword)) + "&travelClass=" + protype;
        return url;
    };

    //生成推荐一行
    recommend.prototype.$createrecommand = function (args) {
        var _this = this;
        var div, div1, h2, ul, li, em, a, img, span, p;
        var obj = args['obj'];
        //总数量
        var count = obj["PageObject"]["TotalCount"];
        //取前三条数据
        var objs = obj["RouteObject"].slice(0, 3);
        //第一条数据
        var objfirst = objs[0];
        var producttype = args["producttype"];
        var PageURL = objfirst.ProductURL;
        div = $("<div data-producttype='" + producttype + "'>");
        //找到title 上对应类型
        li = $("#j_productTypeTab > ul > li[data-producttypetag='" + producttype + "']");
        //名字
        var title = li.text() + "推荐";
        h2 = $("<h2>", { "class": "main-hd box-fix clearfix" });
        div.append(h2);
        em = $("<em>", { "class": "hd-cont f16 fl", "text": title });

        a = $("<a>", { "class": "look-link blue f14 fr", "href": _this.geturl(producttype), "text": "查看全部" + count + "条产品" });
        h2.append(em).append(a);

        div1 = $("<div>", { "class": "comm-line-mod box-fix clearfix" });
        a = $("<a>", { "href": PageURL, "class": "mod-pic fl", "target": "_blank" });
        var picUrl;
        try {
            picUrl = objfirst.ProductVisa.ProductPic;
        } catch (e) {
            picUrl = objfirst.PictureUrl;
        }
        try {
            picUrl = picUrl.split('?')[0] + '?imageView2/1/w/230/h/172';
        } catch (e) { }
        img = $("<img>", { "src": "//r01.uzaicdn.com/content/m/images/common/gray.gif", "data-original": picUrl, "alt": "", "class": "g10", "style": "display: inline" });
        a.append(img);
        div1.append(a);
        ul = $("<ul>", { "class": "line-list f14 fl" });
        $.each(objs, function (i, n) {
            PageURL = n.ProductURL;
            li = $("<li>", { "class": "list-item clearfix " + (i === 0 ? "first" : "") });
            span = $("<span>", { "class": "item-price f666 fr" });
            if (n.MinPrice > 0) {
                span.html("<i class='price red f18'>¥<em>" + n.MinPrice + "</em></i> 起");
            } else {
                span.html("<i class='price red f18'>价格请电询</i>");
            }
            li.append(span);
            p = $("<p>", { "class": "item-hd" });
            a = $("<a>", { "href": PageURL, "class": "ellipsis", "text": n.ProductName.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), "target": "_blank" });
            p.append(a);
            li.append(p);
            ul.append(li);
        });

        div1.append(ul);
        div.append(div1);
        return div;
    };

    //浏览记录模块
    var history = function (container) {
        this.container = $(container);
    };
    //渲染搜索历史视图
    history.prototype.renderhistory = function () {
        var _this = this;
        this.gethistory(function (err, result) {
            if (err === null && result instanceof Array) {
                _this.container.show();
                $.each(result, function (i, n) {
                    var row = _this.$createhistoryrow(n);
                    _this.container.find(".side-browsed-list").append(row);
                });
            } else {
                //隐藏搜索历史
                _this.container.hide();
            }
        });
    };
    //获得搜索历史
    history.prototype.gethistory = function (callback) {
        $.ajax({
            url: '//aj.uzai.com/api/UzaiScanRecords/GetUzaiScanRecordsTop3',
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                if (data === null || data.length === 0) {
                    callback("没有数据");
                } else {
                    callback(null, data);
                }
            }
        });
    };
    //新建一行历史
    history.prototype.$createhistoryrow = function (data) {
        var row, a;

        row = $("<a>", { "class": "list-item", "href": data["ProductURL"], "target": "_blank" });
        var productname = data["ProductName"] || "";
        productname = productname.replace(/\&lt;/, "<").replace(/\&gt;/, ">");
        row.append($("<p>", { "class": "item-hd", "text": productname }));
        row.append($("<p class='item-ft tr'><ins class='price red'>¥" + data["ProductPrice"] + "</ins></p>"));
        return row;
    };

    return _app;
})(window);

$(function () {
    var app = new App();
    app.filterbjarea();
});








