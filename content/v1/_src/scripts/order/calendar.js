var calendar = function (time, obj) {
    obj = obj || 'body';
    var NewDate = new Date(time.split('-')[0], time.split('-')[1] - 1) || new Date(),
        nYear = NewDate.getFullYear(),	//年
        nMonth = NewDate.getMonth() + 1;	    //月
    //nDay = NewDate.getDate(),	        //日
    //nWeek = NewDate.getDay();	       //星期
    // 某月有多少天
    var curMonthDate = getDayNum(nYear, nMonth);
    // box
    var calendarBox = $('<div></div>', { 'class': 'calendar-box' });      //日历外框
    var boxcenter = $('<div></div>', { 'class': 'box-center' });

    var head = $('<div></div>', {"class": "cal-head","data-yearmonth":nYear+'-'+nMonth});     //显示  年   月   抬头
    var headC = '<span>'+nYear + '年' + nMonth + '月'+'</span>';
    head.html(headC);
    //// 添加星期头
    boxcenter.append(head);  //  放入到calendar-box盒子里

    // 星期
    //var week_list = $("<ul></ul>", {"class": "week-list"}
    //$('.week-list').html('<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>');
    //$('.year-list').html(head);
    boxcenter.append('<ul class="week-list"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>');

    // 日
    var day_box = $('<ul></ul>', { 'class': 'day-list' });
    var dayLi = '';

    // 求当月一号是星期几
    var newDate = new Date(nYear, nMonth - 1, 1);
    var curMonthWeek = newDate.getDay();

    for (var i = 1; i <= 42; i++) {
        if (i <= curMonthWeek) {
            dayLi += '<li class="new"></li>';
        } else if (i >= curMonthWeek && i <= curMonthDate + curMonthWeek) {

            dayLi += '<li data-time=' + nYear + '-' + nMonth + '-' + (i - curMonthWeek) + '><p class="text">' + (i - curMonthWeek) + '</p><p class="end"></p><p class="price"></p><p class="jieqi"></p></li>';
        } else {
            dayLi += '<li class="old"></li>';
        }
    }
    day_box.html(dayLi);
    // 插入星期
    //calendarBox.append(week_list);   //星期   放入到canlendar盒子里
    calendarBox.append(day_box);     //天     放入到canlendar盒子里
    boxcenter.append(calendarBox);
    $(obj).append(boxcenter);     //放入到   最外框box-cente里
    // 得到当月多少天
    function getDayNum(year, month) {
        //闰月
        var veadar = !Boolean(2016 % 400) || (!Boolean(year % 4) && (year % 100));
        var num;
        switch (month) {
            case 2:
                num = veadar ? 29 : 28;
                break;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                num = 31;
                break;
            default:
                num = 30;
        }
        return num;
    }
};
