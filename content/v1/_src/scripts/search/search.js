/**
 * @author HuangZhao 2017/02/17
 * @search 改版
 * @jquery js框架
 * **/

(function(window){
    'use strict';

    $('.lazy1,.lazy2').lazyload();

    var $uzaiResult = $('.uzai-choose-result').find('.c-rights em'),//全部删除按钮
        $length,//choose-tips的长度
        $flg = 0,
        $allUrl = 'search.uzai.com/list';

    /**
     * @body所有的事件委托处理点击交互
     * **/

    $('body').on('click','.uzai-choose-box .c-right .switch-down',function(){// 单项-查看更多(展开)
        var $this = $(this),$center = $this.parents('.c-right').siblings('.c-center').css('height','auto');
        var $upArrow = $this.find('.up-arrow');
        $upArrow.show();
        $this.find('i').html('收起').siblings('.down-arrow').hide();
        $this.addClass('switch-up').removeClass('switch-down');

        //是否出现滚动条
        var $chooseConts = $this.parents('.c-right').siblings('.c-center').find('.choose-conts');
        ($chooseConts.height() > 90 ) && $chooseConts.addClass('height-scroll');

    }).on('click','.uzai-choose-box .c-right .switch-up',function(){//   单项-收起
        var $this = $(this),$downArrow = $this.find('.down-arrow'),
            $center = $this.parents('.c-right').siblings('.c-center').css('height','31px');
        $this.find('i').html('展开').siblings('.up-arrow').hide();
        $downArrow.show();
        $this.addClass('switch-down').removeClass('switch-up');

    }).on('click','.uzai-choose-box .c-right .btns',function(e){//   点击多选
        var $this = $(this),$single = $this.parents('.c-right').siblings('.c-center').find('.single-choose'),
            $btn = $this.parents('.c-right').siblings('.c-center').find('.btn'),
            $yesOrNo = $this.parents('.c-right').siblings('.c-center').find('.yes-or-no'),
            $btns = $this.parents('.c-right'),
            $e = e|| event,
            $target = $e.target;
        $single.addClass('more-choose').removeClass('single-choose choosing');
        $btn.css('display','inline-block');
        $this.parents('.c-right').siblings('.c-center').css('height','auto');//
        $yesOrNo.show();
        $btns.hide();
        if($this.parents().siblings('.c-center').find('.go-when').length >0){
            $this.parents().siblings('.c-center').find('.go-when').hide().siblings('.choose-conts').find('span').removeClass('zHide');
        }

        //是否出现滚动条
        var $chooseConts = $this.parents('.c-right').siblings('.c-center').find('.choose-conts');
        ($chooseConts.height() > 90 ) && $chooseConts.addClass('height-scroll');

    }).on('click','.uzai-choose-box .c-center .more-choose',function(){//   用户可以多选
        var $this = $(this);
        if($this.hasClass('more-active')){
            $this.removeClass('more-active');
        }else{
            $this.addClass('more-active');
        }
    }).on('click','.uzai-choose-box .yes-or-no .cancle',function(){//   当用户点击"取消"选项的时候
        var $this = $(this),$btns = $this.parents('.c-center').siblings('.c-right'),
            $moreChoose = $this.parents('.yes-or-no').siblings('.choose-conts').find('span'),
            $btn = $this.parents('.c-center').find('.more-choose .btn'),
            $yesOrNo = $this.parent(),
            $downArrow = $this.parents('.c-center').siblings('.c-right').find('.down-arrow'),
            $upArrow = $downArrow.next();
        $this.parents('.c-center').css('height','31px');
        $btn.hide();
        $moreChoose.addClass('single-choose').removeClass('more-choose more-active');
        $btns.show();
        $yesOrNo.hide();
        $downArrow.show();
        $upArrow.hide();
        $btns.find('.switch i').html('展开');
        if($this.parent().siblings('.go-when').length > 0){
            $this.parent().siblings('.go-when').show().siblings('.choose-conts').find('span').each(function(m){
                if(m > 5){
                    $(this).addClass('zHide');
                }
            });
        }

        $this.parents('.yes-or-no').siblings('.choose-conts').removeClass('height-scroll');

    }).on('click','.uzai-choose-box .yes-or-no .sure',function(){// 当用户点击"确认"选项的时候
            var $this = $(this);
            var url_pre = $this.parents('.c-center').attr("data-url-pre");
            var url_values="";
            var span_values = $this.parents('.c-center').find("span.more-active");
            if (span_values.length === 0) {
                return false;
            }
            $(span_values).each(function() {
                url_values += $.trim($(this).attr("data-value")) + "_";
            });
            url_values = url_values.substring(0, url_values.length - 1);
            var patt2 = new RegExp("/\\d{1,4}");
            var url = window.location.href;
            url = url.replace(patt2, "-" + url_pre + url_values + "/1");
            window.location.href = url;
            return false;
    }).on('click','.uzai-new-choose .my-choose',function(){//   点击"优惠""首发团""促销优惠"
        var $this = $(this);
        if($this.hasClass('uzai-choosing')){
            $this.removeClass('uzai-choosing');
        }else{
            $this.addClass('uzai-choosing');
        }
    }).on('click','.choose-more .more',function(){// 点击"查看更多选项"
        var $this = $(this),
            $chooseHide = $this.parents('.choose-more').siblings('.choose-tips-all').find('.choose-hide');
        $chooseHide.show();
        $this.find('.t').html('收起').end().addClass('less').removeClass('more');
        $this.find('.arrows').addClass('up-arrows');

    }).on('click','.choose-more .less',function(){
        var $this = $(this),
            $chooseHide = $this.parents('.choose-more').siblings('.choose-tips-all').find('.choose-hide');
        $chooseHide.hide();
        $this.find('.t').html('查看更多选项').end().addClass('more').removeClass('less');
        $this.find('.arrows').removeClass('up-arrows');

    }).on('keyup,','.uzai-new-choose .p-tips .input',function(e){// 价格筛选只能输入数字

        //$(this).val($(this).val().replace(/[^\d]/g,''));

    }).on('click','.uzai-new-choose .qujian .btn',function(){// 点击价格区间的确定按钮
            var $this = $(this), $more = $this.prev(), $less = $more.prev().prev();
            var more = $more.val();
            var less = $less.val();
            var url = window.location.href;
            var patt1 = new RegExp("-t\\d{1,}_\\d{1,}");
            var patt2 = new RegExp("/\\d{1,4}");

            if (more.length === 0 && less.length === 0) {
                url = url.replace(patt1, "").replace(patt2, "/1");
            } else {
                less = less.length === 0 ? 0 : less;
                more = more.length === 0 ? 0 : more;
                if (less > more) {
                    var temp = less;
                    less = more;
                    more = temp;
                }
                if (patt1.test(url)) {
                    url = url.replace(patt1, "-t" + less + "_" + more).replace(patt2, "/1");
                } else {
                    url = url.replace(patt2, "-t" + less + "_" + more + "/1");
                }
            }
            window.location.href = url;
    }).on('click','.uzai-choose-box .c-right .switchs',function(){//点击"境外参团"的展开按钮
        var $this = $(this),$cityConts = $('.c-city-conts'),
            $down = $this.find('.down-arrow'),
            $up = $down.next();

        if($cityConts.hasClass('t3')){
            $cityConts.removeClass('t3');
            $cityConts.hide();
            $down.show();
            $up.hide();
            $this.find('i').html('展开');
        }else{
            $cityConts.addClass('t3');
            $cityConts.show();
            $down.hide();
            $up.show();
            $this.find('i').html('收起');
        }
    }).on('click','.uzai-choose-box .c-city-conts .cuntory b', function () {//点击"境外参团"中tab切换
        var $this = $(this),$index = $this.index(),$ul = $this.parents('.cuntory').siblings('.citys').find('div');
        $this.addClass('active').siblings().removeClass('active');
        $ul.hide().eq($index).show();
    }).on('click','.uzai-choose-box .c-city-conts .citys b',function(){//点击"境外参团"中的子菜单
        var $this = $(this),
            _inner = $this.html(),
            _html='',
            $chooseTips = $this.parents('.choose-tips'),
            $uzaiChooseResutl = $this.parents('.choose-tips-all').siblings('.uzai-choose-result');

        $this.addClass('active').siblings().removeClass('active');

        var _names = $chooseTips.attr('data-name');

        _html+='<b><i class="choose-names">'+_names+'</i><i class="choose-cont">'+_inner+'</i><i class="close"></i></b>';

        $chooseTips.hide();
        $uzaiChooseResutl.show().find('.c-rights em').before(_html);

        $chooseTips.addClass('t1');
        $chooseTips.siblings('.choose-tips').each(function(i){
            if(!$(this).hasClass('t1')){
                $(this).addClass('t2');
            }
        });
        $chooseTips.removeClass('t2');
        var _blen;
        $chooseTips.siblings('.t2').each(function(i){
            _blen = $chooseTips.siblings('.t2').length;
            if(_blen <= 4){
                $chooseTips.siblings('.t2').show();
                $chooseTips.parents('.choose-tips-all').siblings('.choose-more').hide();
            }
        });
    }).on('click','.after-calendar:eq(0) table tr td',function(){//处理日历部分
            var $this = $(this),
            _year = $this.attr('data-year'),
            _month = $this.attr('data-month'),
            _day = $this.attr('data-day');
            _month = parseInt(_month) < 10 ? "0" + _month : _month;
            _day = parseInt(_day) < 10 ? "0" + _day : _day;

            if ($this.hasClass('item-expiry')) {
                return;
            } else {
                var $date1 = $this.parents('.after-calendar').prev(),
                    $date2 = $('.date2 .tc');
                $('.after-calendar:eq(0) .item').removeClass('active');
                $this.addClass('active');
                $date1.val(_year + '/' + _month + '/' + _day);
                $date1.attr("data-value", _year + _month + _day);
                $this.parents('.after-calendar').hide();
                $date2.trigger('focus');
                $date2.trigger('click');
            }
    }).on('click','.after-calendar:eq(1) table tr td',function(){
            var $this = $(this),
            _year = $this.attr('data-year'),
            _month = $this.attr('data-month'),
            _day = $this.attr('data-day');
            _month = parseInt(_month) < 10 ? "0" + _month : _month;
            _day = parseInt(_day) < 10 ? "0" + _day : _day;

            var $date2 = $this.parents('.after-calendar').prev(),
                $chooseTips = $this.parents('.choose-tips');

            if ($this.hasClass('item-expiry') || $this.hasClass('forzen')) {
                return;
            } else {
                $('.after-calendar:eq(1) .item').removeClass('active');
                $this.addClass('active');
                $date2.val(_year + '/' + _month + '/' + _day);
                $date2.attr("data-value", _year + _month + _day);
                $this.parents('.after-calendar').hide();
            }

            var _inputVal1 = $('.date1 .tc').attr("data-value"),
                _inputVal2 = $('.date2 .tc').attr("data-value");
            $chooseTips.hide();
            var patt2 = new RegExp("/\\d{1,4}");
            var url = window.location.href;
            url = url.replace(patt2, "-r" + _inputVal1 + "_" + _inputVal2 + "/1");
            window.location.href = url;
    }).on('click','.date2 .tc',function(){
        var $this = $(this),
            $input1 = $this.parents('.date2').siblings('.date1').find('.tc'),
            _val1 = $input1.val(),
            _newVal1;
        if(_val1 === ''){
            $this.next().addClass('ca-norm-hide');
        }else{
            $this.next().removeClass('ca-norm-hide');
            _newVal1 = _val1.split('/');
            var $calendar = $this.siblings('.after-calendar').find('td');
            var _year,_month,_day;
            var _date;
            $calendar.each(function(i){
                _year = $(this).attr('data-year');
                _month = $(this).attr('data-month');
                _day = $(this).attr('data-day');

                $(this).removeClass('forzen');
                $(this).attr('data-date',_year+'/'+_month+'/'+_day);
                _date = new Date($(this).attr('data-date')).getTime();
                if(_date <= new Date(_val1).getTime()){
                    $(this).addClass('forzen');
                }
                if((_year === _newVal1[0])&&(_month === _newVal1[1])&&(_day === _newVal1[2])){
                    $(this).prevAll('td').addClass('forzen');
                    $(this).parents('tr').prevAll('tr').find('.item').addClass('forzen');
                    $(this).parents('.calendar-R').siblings('.calendar-L').find('.item').addClass('forzen');
                }
            });
        }
    }).on('click','.date1 .ca-norm-multi .next',function(){//start-date框中的next按钮
        var $this = $(this),
            _val = $('.date1').find('.tc').val(),
            _newVal;
        var $calendar = $this.parents('.after-calendar').find('td');
        var _year,_month,_day;

        if(_val !==''){
            _newVal = _val.split('/');
            $calendar.each(function(){
                _year = $(this).attr('data-year');
                _month = $(this).attr('data-month');
                _day = $(this).attr('data-day');
                ((_year === _newVal[0])&&(_month === _newVal[1])&&(_day === _newVal[2])) && $(this).addClass('active');
            });
        }
    }).on('click','.date1 .ca-norm-multi .prev',function(){//start-date框中的prev按钮
        var $this = $(this),
            _val = $('.date1').find('.tc').val(),
            _newVal;
        var $calendar = $this.parents('.after-calendar').find('td');
        var _year,_month,_day;
        if(_val !==''){
            _newVal = _val.split('/');
            $calendar.each(function(){
                _year = $(this).attr('data-year');
                _month = $(this).attr('data-month');
                _day = $(this).attr('data-day');

                ((_year === _newVal[0])&&(_month === _newVal[1])&&(_day === _newVal[2])) && $(this).addClass('active');
            });
        }
    }).on('click','.date2 .ca-norm-multi .prev',function(){
        var $this = $(this),
            _val = $('.date1').find('.tc').val();
        var $calendar = $this.parents('.after-calendar').find('td');
        var _year,_month,_day;
        var _newVal,_date;
        if(_val !==''){
            _newVal = _val.split('/');
            $calendar.each(function(){
                _year = $(this).attr('data-year');
                _month = $(this).attr('data-month');
                _day = $(this).attr('data-day');
                $(this).attr('data-date',_year+'/'+_month+'/'+_day);
            });
            $calendar.each(function(i){
                _date = new Date($(this).attr('data-date')).getTime();
                if(_date <= new Date(_val).getTime()){
                    $(this).addClass('forzen');
                }
            });
        }

    }).on('click','.date2 .ca-norm-multi .next',function(){
        var $this = $(this),
            _val = $('.date1').find('.tc').val();
        var $calendar = $this.parents('.after-calendar').find('td');
        var _year,_month,_day;
        var _newVal,_date;
        if(_val !==''){
            _newVal = _val.split('/');
            $calendar.each(function(){
                _year = $(this).attr('data-year');
                _month = $(this).attr('data-month');
                _day = $(this).attr('data-day');
                $(this).attr('data-date',_year+'/'+_month+'/'+_day);
            });
            $calendar.each(function(i){
                _date = new Date($(this).attr('data-date')).getTime();
                if(_date <= new Date(_val).getTime()){
                    $(this).addClass('forzen');
                }
            });
        }
    });

    $(".conts .label b").hover(function(){
        var $this = $(this);
        $this.parents('.p-product').siblings('.uzai-p-f').find('.label-window').show();
    },function(){
        var $this = $(this);
        $this.parents('.p-product').siblings('.uzai-p-f').find('.label-window').hide();
    });


    //处理tab切换内容中"展开"按钮初次加载的时候是否显示
    $('.choose-conts').each(function(i){
        var $this  = $(this),_height = $this.height(),
            _parentH = $this.parents('.c-center').height(),
            $switch = $this.parents('.c-center').siblings('.c-right').find('.switch');
        if(_height > _parentH){//   内容大于2行

        }else{
            $switch.addClass('myHide');
        }
    });
    //初次加载的时候选项box是先显示再隐藏----提示每次提交的时候记得注释掉下面的
    //$('.uzai-result-tabs b').each(function(i){
    //    if($(this).hasClass('choose-active')){
    //        $('.uzai-choose-box').hide().eq(i).show();
    //    }
    //});
    $('.uzai-choose-box').each(function(i){
        $(this).find('.choose-tips').each(function(m){
            if(m>3){
                $(this).addClass('zHide choose-hide');
            }
        });
        $length = $(this).find('.choose-tips').length;
        if($length <=4){
            $(this).find('.choose-more').addClass('zHide');
        }

        $(this).find('.choose-date .choose-conts span').each(function(n){
            if(n > 5){
                $(this).addClass('zHide');
            }
        });

    });
    $('.uzai-new-tab').addClass('uzai-tab-inherit');
    $('.choose-tips-all').each(function(i){
        $(this).addClass('choose-tips-inherit');
    });
    //产品中h2标题超过两行显示省略号......
    $('.p-all .conts h2').each(function(){
        var $this = $(this),_chartLen = $this.html().length;
        $this.addClass('del-max');
        (_chartLen >=50) && $this.html($this.html().substring(0,55) +'......');
    });
    //特卖精选标题超过两行显示省略号......
    function subString(ele){
        $(ele).each(function(){
            var $this = $(this),_chartLen = $this.html().length;
            (_chartLen >=24) && $this.html($this.html().substring(0,24) +'......');
        });
    }
    subString('.r-products .conts h2');
    subString('.r-history .history h2');

    //特卖精选出发团期和特卖两行的情况
    $('.r-products .products').each(function(){
        $(this).find('.go-date').each(function(i){
            if($(this).children().length >= 2){
                $(this).find('p').eq(0).addClass('bot-b');
            }

        });
    });

    /***/
    function multiCalendar(objs, callback) {
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


                        //items.on('click', function () {
                            //var oi = $(this);
                            //var oiY = oi.attr('data-year');
                            //var oiM = oi.attr('data-month');
                            //var oiD = oi.attr('data-day');
                            //var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray') || oi.hasClass('item-disabled');
                            //var selLen = ac.find('.item-sel').length;
                            //
                            //if (!oiExp && selLen < 2) {
                            //
                            //    if (selLen > 0) {
                            //        date += '-';
                            //        selDate += '|';
                            //    }
                            //
                            //    oi.addClass('item-sel').prevAll('.item').addClass('item-disabled');
                            //    oi.parent('tr').prevAll('tr').find('.item').addClass('item-disabled');
                            //    oi.parents('.calendar-mod').prev('.calendar-mod').find('.item').addClass('item-disabled');
                            //    date += oiM + '月' + oiD + '日';
                            //    selDate += oiY + '-' + oiM + '-' + oiD;
                            //    daterel = selDate;
                            //    o.attr('data-selDate', selDate);
                            //}

                            //oi.parents('.ca-norm-multi').hide().prev().val(oiY + '/' + oiM + '/' + oiD);

                        //});

                        //ac.on('click', '.btn-reset', function () {
                        //    items.removeClass('item-sel').removeClass('item-disabled');
                        //    date = '';
                        //    selDate = '';
                        //    o.val('').removeClass('choice-on').attr('data-selDate', '');
                        //}).on('click', '.btn-confirm', function () {
                        //    o.val(date).addClass('choice-on').parent().siblings('.choice-item').removeClass('choice-on');
                        //    ac.hide();
                        //    op.css({ 'z-index': 'auto' });
                        //    //选择日期
                        //    o.closest("dl").find(".choice-on[data-val]").removeClass("choice-on");
                        //    if (date === "") {
                        //        o.removeClass('choice-on');
                        //        o.closest("dl").find("[data-val]:eq(0)").addClass("choice-on");
                        //    } else {
                        //        o.addClass("choice-on");
                        //    }
                        //    daterel = daterel;
                        //    if (callback !== null) {
                        //        callback();
                        //    }
                        //});
                    },
                    preCallback: function (year, month) {//上月下月预回调
                        //console.log(year, month);
                    }
                };
                ac.jsonMultiCalendar(cfg).append('<p class="calendar-btn-bar tc"><input type="button" value="清除" class="btn-reset yahei" /><input type="button" value="确认" class="btn-confirm yahei" /></p>');
            }

            ac.show();
            op.css({ 'z-index': 10 });


            var _sInput = o.parents('.date-wrap').siblings('.date-wrap').find('.tc');
            if(_sInput.val() === ''){
                o.siblings('.after-calendar').find('.btn-confirm').css('color','red');
            }else{
                o.siblings('.after-calendar').find('.btn-confirm').css('color','red');
            }

            blankFix('j_afterCalendarWrap', 'after-calendar', function () { // 点击其它部分隐藏
                op.css({ 'z-index': 'auto' });
            });
        });
    }
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
    multiCalendar($('.start-date'));

})(window);