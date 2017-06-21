Date.prototype.FORMAT = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

function Calendar(year, month, date) {
    var $this = this;
    var $date = new Date();
    var $weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var $days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.year = year; // $date.getFullYear();
    this.month = month;  //$date.getMonth() + 1;
    this.date = date;  //$date.getDate();
    this.ui = null;

    Calendar.isLeapYear = function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    this.createUI = function () {
        var grid = document.createElement("TABLE");
        var gridBody = document.createElement("TBODY");
        var btnPrev = document.createElement("A");
        var btnNext = document.createElement("A");

        grid.className = "calendars g10";

        btnPrev.href = "#";
        btnPrev.className = 'songti f20';
        btnPrev.innerText = btnPrev.textContent = "<-";
        btnPrev.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month - 2, $this.date);
            $this.year = date.getFullYear();
            $this.month = date.getMonth() + 1;
            $this.date = date.getDate();
            $this.change($this.year, $this.month, $this.date);
        };

        btnNext.href = "#";
        btnNext.className = 'songti f20';
        btnNext.innerText = btnNext.textContent = "->";
        btnNext.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month, $this.date);
            $this.year = date.getFullYear();
            $this.month = date.getMonth() + 1;
            $this.date = date.getDate();
            $this.change($this.year, $this.month, $this.date);
        };

        grid.appendChild(gridBody);
        for (var i = 0; i < 8; ++i) {
            var row = document.createElement("TR");
            switch (i) {
                case 0:
                    row.className = "calendars-title";
                    break;
                case 1:
                    row.className = "calendars-weeks";
                    break;
                default:
                    row.className = "calendars-week-days";
                    break;
            }
            for (var j = 0; j < 7; ++j) {
                var cell = document.createElement("TD");
                switch (i) {
                    case 0:
                        switch (j) {
                            case 0:
                                cell.appendChild(btnPrev);
                                break;
                            case 1:
                                j = 5;
                                cell.colSpan = "5";
                                cell.className = "calendars-title-current-month";
                                break;
                            default:
                                cell.appendChild(btnNext);
                                break;
                        }
                        break;
                    case 1:
                        cell.innerText = cell.textContent = $weeks[j];
                        break;
                    default:
                        cell.innerText = cell.textContent = " ";
                        break;
                }
                row.appendChild(cell);
            }
            gridBody.appendChild(row);
        }

        return grid;
    };

    this.change = function (year, month, date) {

        $("#div_Calendar tr td div").css({ "background-color": "", "cursor": "" });

        var addday = 7;
        if ((month == 1 && date == 31) || (month == 3 && date == 31) || (month == 5 && date == 31) || (month == 7 && date == 31) || (month == 8 && date == 31) || (month == 10 && date == 31) || (month == 12 && date == 31)) {
            var mdt = new Date(year, month, date);
            $this.year = mdt.getFullYear();
            $this.month = mdt.getMonth() - 1;
            $this.date = mdt.getDate();
        }

        var urc=this.ui.rows[0].children[1];
        urc.innerText = urc.textContent = year + "年" + (month < 10 ? "0" : "") + month + "月";

        for (var i = 2; i < this.ui.rows.length; ++i) {
            for (var j = 0; j < 7; ++j) {
                var urc2 = this.ui.rows[i].children[j];
                urc2.className = "";
                urc2.innerText = urc2.textContent = "";
            }
        }
        date = new Date(year, month - 1, 1);
        var dayOfWeek = date.getDay();
        var day = 1, days = $days[month - 1] + (month == 2 && Calendar.isLeapYear(year) ? 1 : 0);
        var w = 33;
        var t = 0;
        var rows = this.ui.rows;
        var getDate = new Date();
        var getyear = getDate.getFullYear();
        var getmonth = getDate.getMonth() + 1;
        var getday = getDate.getDate();
        var nowDate = getyear + "-" + CalendarFormat(getmonth) + "-" + CalendarFormat(getday);

        var fixJieQi = function (result) {
            //result = { "temperature0": "高温 13℃", "wind0": "3-4级", "temperature1": "高温 15℃", "wind1": "3-4级", "temperature2": "高温 17℃", "wind2": "微风", "temperature3": "高温 16℃", "wind3": "微风", "temperature4": "高温 17℃", "wind4": "微风", "temperature5": "高温 19℃", "wind5": "微风", "temperature6": "高温 16℃", "wind6": "微风", "d_temperature0": "低温 10℃", "d_wind0": "3-4级", "d_temperature1": "低温 11℃", "d_wind1": "微风", "d_temperature2": "低温 11℃", "d_wind2": "微风", "d_temperature3": "低温 12℃", "d_wind3": "微风", "d_temperature4": "低温 12℃", "d_wind4": "微风", "d_temperature5": "低温 12℃", "d_wind5": "微风", "d_temperature6": "", "d_wind6": "", "imageTip0": "//r.uzaicdn.com/content/weather/images/1/阴.gif", "d_imageTip0": "//r.uzaicdn.com/content/weather/images/2/阵雨.gif", "imageTip1": "//r.uzaicdn.com/content/weather/images/1/阵雨.gif", "d_imageTip1": "//r.uzaicdn.com/content/weather/images/2/阵雨.gif", "imageTip2": "//r.uzaicdn.com/content/weather/images/1/多云.gif", "d_imageTip2": "//r.uzaicdn.com/content/weather/images/2/多云.gif", "imageTip3": "//r.uzaicdn.com/content/weather/images/1/多云.gif", "d_imageTip3": "//r.uzaicdn.com/content/weather/images/2/阵雨.gif", "imageTip4": "//r.uzaicdn.com/content/weather/images/1/多云.gif", "d_imageTip4": "//r.uzaicdn.com/content/weather/images/2/多云.gif", "imageTip5": "//r.uzaicdn.com/content/weather/images/1/多云.gif", "d_imageTip5": "//r.uzaicdn.com/content/weather/images/2/阵雨.gif", "imageTip6": "//r.uzaicdn.com/content/weather/images/1/多云.gif", "d_imageTip6": "//r.uzaicdn.com/content/weather/images/2/.gif", "w_descript0": "阵雨", "d_descript0": "阴", "w_descript1": "阵雨", "d_descript1": "阵雨", "w_descript2": "多云", "d_descript2": "多云", "w_descript3": "阵雨", "d_descript3": "多云", "w_descript4": "多云", "d_descript4": "多云", "w_descript5": "阵雨", "d_descript5": "多云", "w_descript6": "", "d_descript6": "多云" };
            for (var i = 2; i < rows.length; ++i) {
                for (var j = i == 2 ? dayOfWeek : 0; j < 7; ++j) {
                    var isToday = (year == $date.getFullYear() && month == $date.getMonth() + 1 && day == $date.getDate());
                    var nde = rows[i].children[j];
                    if (nde) {
                        nde.className = isToday ? "calendars-today" : "";
                        nde.innerText = nde.textContent = day; // isToday ? "今天" : day;
                        var dates = year + "-" + CalendarFormat(month) + "-" + CalendarFormat(day);
                        if (parseInt(dates.replace(/-/g, ""), 10) > parseInt(nowDate.replace(/-/g, ""), 10)) {
                            w = day;
                        }
                        //alert(dates + "  " + nowDate);
                        if (parseInt(dates.replace(/-/g, ""), 10) > parseInt(nowDate.replace(/-/g, ""), 10)) {
                            var s = new Date(dates);
                            var e = new Date(nowDate);
                            var iDays = daysBetween(dates, nowDate);
                            if (isChina !== '0') {
                                iDays = iDays - 1;
                            } else {
                                iDays = iDays;
                            }
                            if (iDays === 0) {
                                nde.innerHTML = "<div date=\"" + dates + "\" ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear '> <p class='fl'><img src='" + result.imageTip0 + "' alt='' title='白天:" + result.d_descript0 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature0 + "</p><p style='padding-top:4px'>风力：" + result.wind0 + "</p></span></span><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear'><p class='fl'><img src='" + result.d_imageTip0 + "' alt='' title='夜晚:" + result.w_descript0 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature0 + "</p><p style='padding-top:4px'>风力：" + result.d_wind0 + "</p></span></span></div>";
                            }
                            else if (iDays === 1) {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear '> <p class='fl'><img src='" + result.imageTip1 + "' alt='' title='白天:" + result.d_descript1 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature1 + "</p><p style='padding-top:4px'>风力：" + result.wind1 + "</p></span></span><span style='width:100px; display:block; height:30px;margin-left:6px;' class='fn-clear'><p class='fl'><img src='" + result.d_imageTip1 + "' alt='' title='夜晚:" + result.w_descript1 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature1 + "</p><p style='padding-top:4px'>风力：" + result.d_wind1 + "</p></span></span></div>";
                            }
                            else if (iDays === 2) {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear'> <p class='fl'><img src='" + result.imageTip2 + "' alt='' title='白天:" + result.d_descript2 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature2 + "</p><p style='padding-top:4px'>风力：" + result.wind2 + "</p></span></span><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'><p class='fl'><img src='" + result.d_imageTip2 + "' alt='' title='夜晚:" + result.w_descript2 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature2 + "</p><p style='padding-top:4px'>风力：" + result.d_wind2 + "</p></span></span></div>";
                            }
                            else if (iDays === 3) {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear'> <p class='fl'><img src='" + result.imageTip3 + "' alt='' title='白天:" + result.d_descript3 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature3 + "</p><p style='padding-top:4px'>风力：" + result.wind3 + "</p></span></span><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'><p class='fl'><img src='" + result.d_imageTip3 + "' alt='' title='夜晚:" + result.w_descript3 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature3 + "</p><p style='padding-top:4px'>风力：" + result.d_wind3 + "</p></span></span></div>";
                            }
                            else if (iDays === 4 && isChina !== '0') {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear'> <p class='fl'><img src='" + result.imageTip4 + "' alt='' title='白天:" + result.d_descript4 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature4 + "</p><p style='padding-top:4px'>风力：" + result.wind4 + "</p></span></span><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'><p class='fl'><img src='" + result.d_imageTip4 + "' alt='' title='夜晚:" + result.w_descript4 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature4 + "</p><p style='padding-top:4px'>风力：" + result.d_wind4 + "</p></span></span></div>";
                            }
                            else if (iDays === 5 && isChina !== '0') {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span style=' display:block; width:100px; height:30px;margin-left:6px;' class='fn-clear'> <p class='fl'><img src='" + result.imageTip5 + "' alt='' title='白天:" + result.d_descript5 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature5 + "</p><p style='padding-top:4px'>风力：" + result.wind5 + "</p></span></span><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'><p class='fl'><img src='" + result.d_imageTip5 + "' alt='' title='夜晚:" + result.w_descript5 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature5 + "</p><p style='padding-top:4px'>风力：" + result.d_wind5 + "</p></span></span></div>";
                            }
                            else if (iDays === 6 && isChina !== '0') {
                                nde.innerHTML = "<div date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'> <p class='fl'><img src='" + result.imageTip6 + "' alt='' title='白天:" + result.d_descript6 + "'/></p>  <span class='fl td_has_text'> <p>" + result.temperature6 + "</p><p style='padding-top:4px'>风力：" + result.wind6 + "</p></span></span><span class='fn-clear' style=' display:block; width:100px; height:30px;margin-left:6px;'><p class='fl'><img src='" + result.d_imageTip6 + "' alt='' title='夜晚:" + result.w_descript6 + "' /></p><span class='fl td_has_text'><p>" + result.d_temperature6 + "</p><p style='padding-top:4px'>风力：" + result.d_wind6 + "</p></span></span></div>";
                            }
                            else {
                                var bkdate = $("#bookDate").val();
                                var datet = bkdate.split('、');

                                if (iDays < 14) {
                                    //alert(bkdate.replace(/-/g, "") + " " + dates.replace(/-/g, "")); alert(bkdate.replace(/-/g, "").indexOf(dates.replace(/-/g, "")));
                                    if (isChina !== '0' && iDays > 6) {

                                        if (bkdate.replace(/-/g, "").indexOf(dates.replace(/-/g, "")) > -1) {
                                            nde.innerHTML = "<div class='bg_c' id=\"" + dates + "\" date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span  id=\"s" + dates + "\" class='onget'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy' style='display:none;'  onclick='check(this)'><a href='javascript:void(0)'>选择</a></span></div>";
                                        } else {
                                            nde.innerHTML = "<div date=\"" + dates + "\" id=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span id=\"s" + dates + "\" class='onget' style='display:none;'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy'  onclick='check(this)'><a href='javascript:void(0)' >选择</a></span></div>";
                                        }
                                    } else {
                                        if (iDays > 7) {
                                            if (bkdate.replace(/-/g, "").indexOf(dates.replace(/-/g, "")) > -1) {
                                                nde.innerHTML = "<div class='bg_c' id=\"" + dates + "\" date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span  id=\"s" + dates + "\" class='onget'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy' style='display:none;'  onclick='check(this)'><a href='javascript:void(0)'>选择</a></span></div>";
                                            } else {
                                                nde.innerHTML = "<div date=\"" + dates + "\" id=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span id=\"s" + dates + "\" class='onget' style='display:none;'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy'  onclick='check(this)'><a href='javascript:void(0)' >选择</a></span></div>";
                                            }
                                        } else {
                                            nde.innerHTML = "<div date=\"" + dates + "\" onclick=\"getDate('" + dates + "')\" ><p style='padding-left:5px;'>" + day + "</p><br/><a style='display:none;margin-top:9px;' href='javascript:delDate(\"" + dates + "\")'>取消订阅</a></div>";
                                        }
                                    }

                                } else {
                                    if (bkdate.replace(/-/g, "").indexOf(dates.replace(/-/g, "")) > -1) {
                                        nde.innerHTML = "<div class='bg_c' id=\"" + dates + "\" date=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span  id=\"s" + dates + "\" class='onget'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy' style='display:none;'  onclick='check(this)'><a href='javascript:void(0)'>选择</a></span></div>";
                                    } else {
                                        nde.innerHTML = "<div date=\"" + dates + "\" id=\"" + dates + "\"  ><p style='padding-left:5px;'>" + day + "</p><span id=\"s" + dates + "\" class='onget' style='display:none;'><p>已选择</p><p class='J_removechange'><a href='javascript:void(0)' onclick='cancel(this)'>取消选择</a></p></span><span id=\"c" + dates + "\" class='getDy js_getDy'  onclick='check(this)'><a href='javascript:void(0)' >选择</a></span></div>";
                                    }
                                }
                            }
                            t++;
                        }
                        else {
                            if (isToday) {
                                nde.innerHTML = "<div date=\"" + dates + "\" onclick=\"getDate('" + dates + "')\" style='color:#FF0000;'><p style='padding-left:5px;'>今天</p><br/></div>";
                            } else {
                                nde.innerHTML = "<div date=\"" + dates + "\" onclick=\"getDate('" + dates + "')\" ><p style='padding-left:5px;'>" + day + "</p><br/><a style='display:none;margin-top:9px;' href='javascript:delDate(\"" + dates + "\")'>取消订阅</a></div>";
                            }
                        }

                    } ++day;



                    var lastDate = new Date(this.year, getmonth, getday);
                    var d = nowDate.replace(/-/g, "/");
                    var startdate = new Date(d);
                    var enddate = AddDays(startdate, 6).FORMAT("yyyy-MM-dd"); //alert(nowDate + "-" + enddate);
                    //alert(addday);
                    var nowday = getday; //this.date;
                    var nowmonth = getmonth;
                    var nowyear = getyear;

                    var dNodes = $("#div_Calendar tr td div");
                    for (var k = 0; k < dNodes.length; k++) {
                        var me = dNodes[k];
                        var num = parseInt(me.html(), 10);
                        if (num && num > 0 && num < 32) {
                            var nDate = year + "-" + CalendarFormat(month) + "-" + CalendarFormat(num); //alert(year + "-" + month + "-" + num);
                            if (parseInt(nDate.replace(/-/g, ""), 10) >= parseInt(nowDate.replace(/-/g, ""), 10)) {
                                me.addClass("calendartdbg1");
                                if ($("#bookDate").html().indexOf(nDate) > -1) {
                                    me.addClass("calendartdbg3");
                                    me.find("a").css("display", "block");
                                }
                            }

                        }
                    }

                    if (day > days)
                        return;

                }



            } //end for
        };

        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            cache: false,
            url: _uzw.domain.wapi + '/api/UzaiWeather/BookWeatherToWeek/' + treeid,
            success: function (data) {
                fixJieQi(data);
            },
            error: function (info) {

            }
        });


    };

    this.show = function (ele) {
        this.ui = this.ui || this.createUI();
        this.change(this.year, this.month, this.date);
        ele.appendChild(this.ui);
        var getDate = new Date();
        var getday = getDate.getDate();
        var getyear = getDate.getFullYear();
        var nowDate = getyear + "-" + CalendarFormat(this.month) + "-" + CalendarFormat(getday + 1); //陈静 2012-09-03 修改
        var d = nowDate.replace(/-/g, "/");
        var startdate = new Date(d);
        var enddate = AddDays(startdate, 6).FORMAT("yyyy-MM-dd");
        //var lastDate = Date.parse(new Date(this.year, this.month, getday + 7));
        //alert(this.year + "-" + this.month + "-" + getday);
        var nowday = this.date;
        var nowmonth = this.month;
        var nowyear = this.year;
        $("#div_Calendar tr td div").each(function () {
            var num = parseInt($(this).html(), 10);
            if (num > 0 && num < 32) {
                var nDate = nowyear + "-" + CalendarFormat(nowmonth) + "-" + CalendarFormat(num);
                if (parseInt(nDate.replace(/-/g, ""), 10) >= parseInt(nowDate.replace(/-/g, ""), 10)) {
                    $(this).addClass("calendartdbg1"); //.css({ "background-color": "#FCEFA0", "cursor": "pointer" });
                    if ($("#bookDate").html().indexOf(nDate) > -1) {
                        $(this).addClass("calendartdbg3");
                        $(this).find("a").css("display", "block");
                    }
                }
            }
        });
        //        for (var i = 0; i < $("#div_Calendar tr td").length; i++) {
        //            alert($($("#div_Calendar tr td")[i]).html());
        //        }
    };

    this.toString = function () {
        alert(this.year + "-" + this.month + "-" + this.date);
    };
}

function AddDays(date, value) {
    return new Date(Date.parse(date) + (86400000 * value));
}

function CalendarFormat(str) {
    if (!str) {
        return '0';
    }
    return str.toString().replace(/^(\d)$/, "0$1");
}

function daysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}
