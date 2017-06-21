Calendar_GetPdateAndPrice(document.getElementById("calenderPartEven"), $("#pid").val(), "", false);

/*!
* 李云 2011-12-15 网页日历，带有公历和农历节日与节气
* Copyright 2011, //www.uzai.com/ JoJo
*/
var Calendar_itinerary; //日历数据的全局变量
function Calendar() {
    var $id = 0, $url = "#";
    var $this = this;
    var $date = new Date();
    var $weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var $days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var SolarTermStr = new Array(
                        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
                        "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"); //24节气
    var DifferenceInMonth = new Array(
                        1272060, 1275495, 1281180, 1289445, 1299225, 1310355, 1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
                        1358580, 1355055, 1348695, 1340040, 1329630, 1318455, 1306935, 1297380, 1286865, 1277730, 1274550, 1271556); //24节气值

    var V = { "0101": "*1元旦", "0214": "情人节", "0305#": "学雷锋纪念日", "0308": "妇女节", "0312#": "植树节", "0315#": "消费者权益日", "0401#": "愚人节", "0501": "*1劳动节", "0504": "青年节", "0601": "儿童节", "0701": "建党节", "0801": "建军节", "0910": "教师节", "1001": "*3国庆节", "1224": "平安夜", "1225": "圣诞节" }; //阳历节日
    var T = { "0101": "*2春节", "0115": "元宵节", "0505": "*1端午节", "0815": "*1中秋节", "0707": "七夕", "0909": "重阳节", "1010#": "感恩节", "1208#": "腊八节", "0100": "除夕" }; //阴历节日

    var regzhongwen = /[A-Za-z_\-\~\!\@\#\$\%\^\&\*\(\)\|\0-9]+/; //过滤特殊字符、英文与数字
    var $reservation_title = ""; //"<span>(点击日历上价格可以进行预订)<span>";

    this.year = $date.getFullYear();
    this.month = $date.getMonth() + 1;
    this.date = $date.getDate();
    var ui; //this.ui = null;
    this.even = false; //是否启用两个日历框
    this.isSolarTerm = true; //是否显示节日、节气
    this.isChangeCss = false; //是否改变当前对象的样式 2012-08-01 JoJo
    this.isWeb = false; //当前是否为前台调用 2012-08-02 JoJo

    var i = 0, j = 0;

    Calendar.isLeapYear = function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    this.createUI = function () {
        var grid = document.createElement("TABLE");
        var gridBody = document.createElement("TBODY");
        var btnPrev = document.createElement("A");
        var btnNext = document.createElement("A");

        grid.border = "0";
        grid.className = "calendar";
        grid.cellPadding = "0";
        grid.cellSpacing = "0";

        btnPrev.href = "#";
        btnPrev.id = "subPrev";
        btnPrev.innerText = btnPrev.textContent = "";
        btnPrev.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month - 1, $this.date);
            $this.year = date.getFullYear(); // $this.year;
            $this.month = date.getMonth(); // $this.month;
            $this.date = date.getDate();
            if ($this.month === 0) {
                $this.year = $this.year - 1;
                $this.month = 12;
            }
            $this.change($this.year, $this.month, $this.date);
        };

        btnNext.href = "#";
        btnNext.id = "subNext";
        btnNext.innerText = btnNext.textContent = "";
        btnNext.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month + 0, $this.date);
            $this.year = date.getFullYear();
            $this.month = date.getMonth() + 1;
            $this.date = date.getDate();
            if ($this.even) {
                $(this).parent().parents("div").find("a[id='subNext']").eq(0).attr("even", "1").click();
            }
            $this.change($this.year, $this.month, $this.date);
        };

        grid.appendChild(gridBody);
        
        for (i = 0; i < 8; ++i) {
            var row = document.createElement("TR");
            switch (i) {
                case 0:
                    row.className = "calendar-title";
                    break;
                case 1:
                    row.className = "calendar-weeks";
                    break;
                default:
                    row.className = "calendar-week-days";
                    break;
            }
            for (j = 0; j < 7; ++j) {
                var cell = document.createElement("TD");
                cell.style.width = "auto";
                cell.className = (j === 0 || j === 6) ? "calendar_color_ff6600" : ""; //星期日 星期六
                switch (i) {
                    case 0:
                        switch (j) {
                            case 0:
                                cell.appendChild(btnPrev);
                                break;
                            case 1:
                                j = 5;
                                cell.colSpan = "5";
                                cell.className = "calendar-title-current-month";
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

    this.change = function (year, month, date, frequency) {
        var nowDate = new Date(year, month, date);
        var itinerary = Calendar_itinerary; //日历切位对象集合
        var dtime = [year, month]; //初始当前日期为传入日期值，即使ajax未返回查询集合最小值也能正常向下走
        //var itinerary = eval("(" + msg + ")"); //转换为json对象
        if (itinerary && itinerary.data.length >= 1) {
            dtime = itinerary.data[0].pdatetime.split('-'); //重新给定返回集合的最小日期
        }
        if (frequency == 1) { //取到第一个对象的日期

            var tempDate = new Date(year, month, 1);

            var regExp = /^0\d{1}$/;
            if (dtime[1].length > 1 && regExp.test(dtime[1])) {
                var monthArr = dtime[1].split("0");
                if (monthArr.length > 1) {
                    dtime[1] = monthArr[1];
                }
            }

            if ($(ui).parent("div").find("table").length == 1) {
                tempDate = new Date(parseInt(dtime[0], 10), parseInt(dtime[1], 10), 1); //当前返回数据的最小日期
                year = tempDate.getFullYear(); month = tempDate.getMonth();
            }
            else {
                if (itinerary.data.length <= 0) {
                    tempDate = new Date(parseInt(dtime[0], 10), parseInt(dtime[1], 10), 1); //无数据时的日期
                }
                else {
                    tempDate = new Date(parseInt($.trim(dtime[0]), 10), parseInt($.trim(dtime[1]), 10) + 1, 1); //取第一个日期加一
                }
                year = tempDate.getFullYear(); month = tempDate.getMonth();
            }
            $date = new Date(year, month, 1);
            $this.year = $date.getFullYear();
            $this.month = $date.getMonth();
            $this.date = $date.getDate();
            if ($this.month === 0) {
                $this.year = $this.year - 1;
                $this.month = 12;
                year = $this.year; month = 12;
            }
        } //end if (frequency == 1 && dtime.length >= 2)//首次加载可跨月
        var urc1 = ui.rows[0].children[1];
        urc1.innerText = urc1.textContent = year + " 年 " + month + " 月"; //+ (month < 10 ? "0" : "")
        urc1.innerHTML = urc1.innerText + $reservation_title; //标题

        for (i = 2; i < ui.rows.length; ++i) {
            for (j = 0; j < 7; ++j) {
                var urci = ui.rows[i].children[j];
                urci.innerText = urci.textContent = "";
            }
        } // end for

        var mydate = new Date(year, month - 1, 1);
        var dayOfWeek = mydate.getDay();
        var day = 1, days = $days[month - 1] + (month == 2 && Calendar.isLeapYear(year) ? 1 : 0);
        //$this.date = (month == 2 && Calendar.isLeapYear(year)) ? day : $this.date; /*$this.date = day;****/改动1

        for (i = 2; i < ui.rows.length; ++i) {

            for (j = i == 2 ? dayOfWeek : 0; j < 7; ++j) {
                var isToday = (year == $date.getFullYear() && month == $date.getMonth() + 1 && day == $date.getDate());
                var nde=ui.rows[i].children[j];
                if (nde) {
                    nde.className = isToday ? "calendar-today" : "";
                    var dayT = "";
                    if ($this.isSolarTerm === true) {
                        var tdate = new Date(mydate.getFullYear(), mydate.getMonth(), day);
                        dayT = T[showCal(tdate, true)]; dayT = dayT ? dayT : ""; //GetCNDate.js showCal(date, lockNum)//以阴历节日为主

                        if (!dayT) {
                            var dayV = V[(month < 10 ? "0" + month : month.toString()) + (day < 10 ? "0" + day : day.toString())]; //阳历节日
                            dayT = dayV ? dayV : "";
                            if (!dayT) {
                                var dayJ = $this.jieqi(tdate); //24节气 如果当前天没有公历与农历节日则判断性取节气
                                if (dayJ) dayT = dayJ ? dayJ : "";
                            }
                        }
                        dayT = dayT ? "<span class='v-holiday'>" + dayT.replace(regzhongwen, '') + "</span>" : ""; //节日text
                    } //end if (this.isSolarTerm == true)  是否显示节日、节气
                    if (itinerary) {
                        var minprice = 0;
                        var strMinPrice = "";
                        for (var itr = 0; itr < itinerary.data.length; itr++) {
                            var supPrice = parseInt(itinerary.data[itr].price, 10) - parseInt(itinerary.data[itr].TotalCheapPrice, 10);
                            if (itr === 0) {
                                minprice = itinerary.data[itr].price;
                                strMinPrice = "优惠价" + supPrice + "元=悠哉价" + itinerary.data[itr].price + "元-最大优惠价" + itinerary.data[itr].TotalCheapPrice + "元";
                            }
                            if (minprice > itinerary.data[itr].price) {
                                minprice = itinerary.data[itr].price;
                                strMinPrice = "优惠价" + supPrice + "元=悠哉价" + itinerary.data[itr].price + "元-最大优惠价" + itinerary.data[itr].TotalCheapPrice + "元";
                            }

                            var otime = itinerary.data[itr].pdatetime.split('-'); //当前服务器的时间
                            var _day = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getDate();
                            var _month = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getMonth() + 1;
                            var _year = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getFullYear();
                            var preDate = (!itinerary.data[itr].preDate) ? "" : itinerary.data[itr].preDate;
                            var preTime = (!itinerary.data[itr].PreTime) ? "" : itinerary.data[itr].PreTime;
                            if (_day == day && month == _month && _year == year) {
                                nde.className = isToday ? "calendar-tag" : "";  //表示当前天为今天则改有红色字体及12号字
                                var time1 = new Date(itinerary.data[itr].pdatetime.replace(/-/, "/").replace("-", "/"));
                                var time2 = new Date(new Date().setDate(parseInt(new Date().getDate(), 10) + parseInt(itinerary.data[itr].hour, 10) / 24));

                                var flag = time1 < time2; //判断当前日历日期是否小于当前日期加上提前预定天数
                                var tempDateTime = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day); //2012-08-02 JoJo 考虑值的获取与传递 标签自定义属性date >>exists 是否存在切位于后台使用
                                if (flag) {
                                    nde.innerHTML = nde.textContext = "<div class='calendar_bg_ffffcc J_calendardiv' cheap='" + itinerary.data[itr].TotalCheapPrice + "' datetime='" + tempDateTime + "' predate='" + preDate + "' pretime='" + preTime + "' exists='false' >" + dayT + day + "<div><font class='calendar_color_333'>￥" + itinerary.data[itr].price + "<br/>已满</font></div></div>";
                                }
                                else {
                                    var thhtml = "<div id='d" + itr + "' class='calendar_bg_ffffcc J_calendardiv'  cheap='" + itinerary.data[itr].TotalCheapPrice + "' datetime='" + tempDateTime + "'  predate='" + preDate + "' pretime='" + preTime + "'  exists='true'  >" + dayT + day + "<div><a class='calendar_red'  >￥" + itinerary.data[itr].price + "</a>${text}</div></div>";
                                    if (itinerary.data[itr].price == "-1") {
                                        thhtml = thhtml.replace("${text}", "<br />请电询");
                                    }
                                    else if (itinerary.data[itr].cuteNum == "0") {
                                        thhtml = thhtml.replace("${text}", "<br />实时查询");
                                    }
                                    else if (itinerary.data[itr].cuteNum == "-1") {
                                        thhtml = thhtml.replace("${text}", "");
                                    }
                                    else {
                                        if (itinerary.data[itr].cuteNum > 9) {
                                            thhtml = thhtml.replace("${text}", "<br />余位>9");
                                        } else {
                                            thhtml = thhtml.replace("${text}", "<br />余位:" + itinerary.data[itr].cuteNum);
                                        }
                                    }
                                    nde.textContext = nde.innerHTML = thhtml;
                                } //end else
                            } //end if                                    
                        } //end for
                        $("#strMinPrice").val(strMinPrice);
                    } //end if
                    if (!nde.innerHTML) {
                        nde.innerHTML = nde.textContext = "<div>" + dayT + (day) + "</div>"; //innerText = textContent = (isToday ? "今天" : day) + dayV;  
                    }

                } // end with
                ++day;
                if (day > days)
                    return;
            } //end for
        } //end for
    };    //**************************************************************** end change ********************************************

    //节气
    this.jieqi = function (date) {
        var DifferenceInYear = 31556926;
        var BeginTime = new Date(1901 / 1 / 1);
        BeginTime.setTime(947120460000);
        for (; date.getFullYear() < BeginTime.getFullYear() ;) {
            BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
        }
        for (; date.getFullYear() > BeginTime.getFullYear() ;) {
            BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
        }
        for (var M = 0; date.getMonth() > BeginTime.getMonth() ; M++) {
            BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        }
        if (date.getDate() > BeginTime.getDate()) {
            BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
            M++;
        }
        if (date.getDate() > BeginTime.getDate()) {
            BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
            M == 23 ? M = 0 : M++;
        }
        var JQ = "";
        if (date.getDate() == BeginTime.getDate()) {
            JQ += SolarTermStr[M];
        }
        return JQ;
    };

    this.show = function (ele, id, url, iseven, ischangecss, isweb) {
        ui = ui || this.createUI();
        this.date = 1; //初始化
        $id = id; $url = url ? url : $url;
        $this.even = Boolean(iseven); //表示为两个日历框
        $this.isChangeCss = (typeof ischangecss !== 'undefined' && ischangecss === false) ? false : true; //ischangecss不传值或非false则进行样式的改变 传false不做改变 2012-08-01 JoJo
        $this.isWeb = (typeof isweb !== 'undefined' && isweb === false) ? false : true; // Js等相关信息的调用

        if (this.even === false && ele) {
            ele.appendChild(ui);
            this.change(this.year, this.month, this.date, 1);
            if (this.isChangeCss === true) {
                //   $(ele).css({ "filter": "alpha(opacity=0,finishopacity=100,style=1)" }).show().fadeTo(2000, 0.9, function () { $(this).removeAttr("style").find("table").css({ "float": "left" }); }); //滤镜效果
            }
        } //不为双日历时快速填充，否则用下面方法进行填充
    };

    this.toString = function () {
        alert(this.year + "-" + this.month + "-" + this.date);
    };
}
/**
* ele 为显示日期对象的层
* id 为产品ID
* url 需要请求的URL
* iseven 是否显示双日历  默认为false
* ischangecss 是否改变样式启用前台滤镜等效果 默认为true
* isweb 当前不否为前台调用 前后台调用请求方式不一样 默认为true
**/
function Calendar_GetPdateAndPrice(ele, id, url, iseven, ischangecss, isweb) {
    var nd = new Date();
    var year = nd.getFullYear();
    var month = nd.getMonth() + 1;
    var date = nd.getDate();
    if (typeof isweb !== 'undefined' && isweb === false) {
        //当前非前台请求，后台或其它渠道请求
        if (!url) {
            url = "http://www.uzai.com/outbound/calendar/" + year + "-" + month + "-01_" + id + "_" + Math.random(); //视为请求跟团
        }
        $.getScript(url, function () {
            //objCalendarDataArr 为函数中声明的一个JS属性存储的Json对象
            //Calendar_itinerary 为http://r.uzaicdn.com/Scripts/Calendar-12.15.js中的一个属性
            Calendar_itinerary = eval("(" + objCalendarDataArr + ")"); //转换为json对象
            new Calendar().show(ele, id, url, iseven, ischangecss, isweb); //E1D8F4  dashed  grove ridge
            $(ele).find("td").css({ "padding": "0px"});
        });
    }
    else {
        $.ajax({
            type: "get",
            url: "/outbound/calendar/" + year + "-" + month + "-01_" + id + "_" + Math.random(),
            success: function (msg) {
                Calendar_itinerary = eval("(" + msg + ")"); //转换为json对象
                new Calendar().show(ele, id, url, iseven);

            }
        });       //end ajax
    }
	
}