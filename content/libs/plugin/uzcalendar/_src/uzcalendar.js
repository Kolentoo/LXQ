/*!
* 李云 2014-01-13 列表日历
* CODE:加私家团数据获取方式
* Copyright 2014,http://www.uzai.com/ JoJo
*/

function Calendars() {
    var ui; //this.ui = null;
    var $this = this;
    var $date = new Date();
    var $weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var $days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var $id = 0;
    var mineObject = function () {
        this.firstShow = false; //首次显示
        this.sjt = false; //当前对象具有属性，后期加属性字段可在此对象内扩展；使用时用mineObject.sjt
    };

    var regzhongwen = /[A-Za-z_\-\~\!\@\#\$\%\^\&\*\(\)\|\0-9]+/; //过滤特殊字符、英文与数字

    //2013年2月22日添加
    var SolarTermStr = new Array(
                        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
                        "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"); //24节气
    var DifferenceInMonth = new Array(
                        1272060, 1275495, 1281180, 1289445, 1299225, 1310355, 1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
                        1358580, 1355055, 1348695, 1340040, 1329630, 1318455, 1306935, 1297380, 1286865, 1277730, 1274550, 1271556); //24节气值

    var V = { "0101": "*1元旦", "0214": "情人节", "0305#": "学雷锋纪念日", "0308": "妇女节", "0312#": "植树节", "0315#": "消费者权益日", "0401#": "愚人节", "0501": "*1劳动节", "0504": "青年节", "0601": "儿童节", "0701": "建党节", "0801": "建军节", "0910": "教师节", "1001": "*3国庆节", "1224": "平安夜", "1225": "圣诞节" }; //阳历节日
    var T = { "0101": "*2春节", "0115": "元宵节", "0505": "*1端午节", "0815": "*1中秋节", "0707": "七夕", "0909": "重阳节", "1010#": "感恩节", "1208#": "腊八节", "0100": "除夕" }; //阴历节日

    this.year = $date.getFullYear();
    this.month = $date.getMonth() + 1;
    this.date = $date.getDate();
    this.isSolarTerm = true; //是否显示节日、节气

    Calendars.isLeapYear = function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    this.createUI = function () {
        var grid = document.createElement("TABLE");
        var gridBody = document.createElement("TBODY");
        var btnPrev = document.createElement("A");
        var btnNext = document.createElement("A");

        grid.className = "calendar";
        grid.style.display = "none";

        //href = "#";
        btnPrev.innerHTML = btnPrev.textContent = "&lt;";
        btnPrev.className = "subPrev";
        btnPrev.href = "#";
        btnPrev.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month, 1);
            //                $this.year = date.getFullYear();
            //                $this.month = date.getMonth() - 1;
            //                $this.date = date.getDate();
            $this.year = $this.year;
            $this.month = $this.month - 1;
            $this.date = date.getDate();
            if ($this.month === 0) {
                $this.year = $this.year - 1;
                $this.month = 12;
            }
            mineObject.firstShow = false; //陈静 2012-07-04 修改
            $this.change($this.year, $this.month, $this.date);

        };

        //href = "#";
        btnNext.innerHTML = btnNext.textContent = "&gt;";
        btnNext.className = "subNext";
        btnNext.href = "#";
        //btnNext.style.marginLeft = "-30px";
        btnNext.onclick = function (e) {
            e = e || window.event;
            var date = new Date($this.year, $this.month, 1);
            $this.year = date.getFullYear();
            $this.month = date.getMonth() + 1;
            mineObject.firstShow = false; //陈静 2012-07-04 修改
            $this.change($this.year, $this.month, $this.date);
        };

        grid.appendChild(gridBody);
        for (var i = 0; i < 8; ++i) {
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
            for (var j = 0; j < 7; ++j) {
                var cell = document.createElement("TD");
                //星期日
                if (j === 0) {
                    cell.className = "calendar-td-sunday";
                }
                //星期六
                if (j === 6) {
                    cell.className = "calendar-td-saturday";
                }

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

    this.change = function (year, month, date) {
        var ToUrl = "http://sh.uzai.com/outbound/calendar201208031417/" + year + "-" + month + "-01_" + $id + "_" + Math.random();
        if (mineObject.sjt) {
            //表示私家团
            ToUrl = "http://sijia.uzai.com/ashx/calendar.ashx?pid=" + $id + "&pdate=" + year + "-" + month + "-01&ran=" + Math.random();
        }

        $.getScript(ToUrl, function () {

            $(".calendar").siblings('.loader').remove(); //去除loader
            $(".calendar").show();

            var itinerary = eval("(" + objCalendarDataArr + ")"); //转换为json对象
            if (itinerary && itinerary.data.length >= 1) {

                var dtime = itinerary.data[0].pdatetime.split('-');
                //陈静 2012-07-04 修改
                if (dtime.length >= 2 && mineObject.firstShow) { //取到第一个对象的日期
                    year = dtime[0];
                    $this.year = year;
                    month = Number(dtime[1]); //重新指定时间日期为数据时间
                    $this.month = month;
                }
            }
            ui.rows[0].children[1].innerText = ui.rows[0].children[1].textContent = year + " 年 " + month + " 月"; //+ (month < 10 ? "0" : "")
             //end with

            for (var m = 2; m < ui.rows.length; ++m) {
                for (var n = 0; n < 7; ++n) {
                    var urc = ui.rows[m].children[n];
                    urc.innerText = urc.textContent = "";
                }
            }// end for

            var date = new Date(year, month - 1, 1);
            var dayOfWeek = date.getDay();
            var day = 1, days = $days[month - 1] + (month == 2 && Calendars.isLeapYear(year) ? 1 : 0);
            for (var i = 2; i < ui.rows.length; ++i) {
                for (var j = i == 2 ? dayOfWeek : 0; j < 7; ++j) {
                    var isToday = (year == $date.getFullYear() && month == $date.getMonth() + 1 && day == $date.getDate());
                    var nde=ui.rows[i].children[j];
                    if (nde) {
                        nde.className = isToday ? "calendar-box calendar-today" : "calendar-box";
                        var dayT = "";
                        if ($this.isSolarTerm === true) {
                            var tdate = new Date(date.getFullYear(), date.getMonth(), day);
                            dayT = T[showCal(tdate, true)]; dayT = dayT ? dayT : ""; //GetCNDate.js showCal(date, lockNum)//以阴历节日为主
                            if (!dayT) {
                                var dayV = V[(parseInt(month, 10) < 10 ? "0" + parseInt(month, 10) : month.toString()) + (day < 10 ? "0" + day : day.toString())]; //阳历节日
                                dayT = dayV ? dayV : "";
                                if (!dayT) {
                                    var dayJ = $this.jieqi(tdate); //24节气 如果当前天没有公历与农历节日则判断性取节气
                                    if (dayJ) dayT = dayJ ? dayJ : "";
                                }
                            }
                            dayT = dayT ? dayT.replace(regzhongwen, '') : ""; //节日text
                        } //end if (this.isSolarTerm == true)  是否显示节日、节气

                        var nDayT = dayT ? "<i class='v-day' title='" + dayT + "'>" + dayT + "</i>" : "";

                        if (itinerary) {
                            for (var itr = 0; itr < itinerary.data.length; itr++) {
                                var otime = itinerary.data[itr].pdatetime.split('-'); //当前服务器的时间
                                var _day = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getDate();
                                var _month = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getMonth() + 1;
                                var _year = new Date(otime[1] + '/' + otime[2] + '/' + otime[0]).getFullYear();
                                if (_day == day && month == _month && _year == year) {
                                    nde.className = isToday ? "calendar-box calendar-tag" : "calendar-box";  //表示当前天为今天则改有红色字体及12号字

                                    var time1 = new Date(itinerary.data[itr].pdatetime.replace(/-/, "/").replace("-", "/"));
                                    var time2 = new Date(new Date().setDate(parseInt(new Date().getDate(), 10) + parseInt(itinerary.data[itr].hour, 10) / 24));
                                    //判断当前日历日期是否小于当前日期加上提前预定天数
                                    var flag = time1 < time2;

                                    if (flag) {
                                        nde.textContent = "<div class='item-data'>" + nDayT + "<i class='day'>" + day + "</i><i class='price'>￥" + itinerary.data[itr].price + "</font><i class='man'>已满</i></div>";
                                        nde.innerHTML = nde.textContent;
                                    } else {
                                        //设置成团标签
                                        var calTag = "";
                                        if (itinerary.data[itr].CalendarTag) {
                                            var arrTag = itinerary.data[itr].CalendarTag.split(',');
                                            for (var k = 0; k < arrTag.length; k++) {
                                                if (arrTag[k] == "1")
                                                    calTag += "成团" + ",";
                                            }
                                            if (calTag)
                                                calTag = calTag.substring(0, calTag.length - 1);
                                        }

                                        if (itinerary.data[itr].price == "-1") {
                                            nde.textContext = "<div class='item-data'>" + nDayT + "<i class='day'>" + day + "</i><a class='telephone' href=\"" + $url + " \" target=\"_blank\" >请电询</a><i class='chengtuan'>" + calTag + "</i></div>";
                                            nde.innerHTML = nde.textContext;
                                        }
                                        else if (itinerary.data[itr].cuteNum == "0") {
                                            nde.textContext = "<div class='item-data'>" + nDayT + "<i class='day'>" + day + "</i><a class='price' href=\"" + $url + " \" target=\"_blank\" >" + (mineObject.sjt ? "" : "￥" + itinerary.data[itr].price) + "</a><i class='search'>" + (mineObject.sjt ? "可以预定" : "实时查询") + "</i><i class='chengtuan'>" + calTag + "</i></div>";
                                            nde.innerHTML = nde.textContext;
                                        }
                                        else if (itinerary.data[itr].cuteNum == "-1") {
                                            nde.textContext = "<div class='item-data'>" + nDayT + "<i class='day'>" + day + "</i><a class='price' href=\"" + $url + " \" target=\"_blank\" >￥" + itinerary.data[itr].price + "</a><i class='chengtuan'>" + calTag + "</i></div>";
                                            nde.innerHTML = nde.textContext;
                                        }
                                        else {
                                            nde.innerHTML = nde.textContext = "<div class='item-data'>" + nDayT + "<i class='day'>" + day + "</i><a class='price' href=\"" + $url + "\" target=\"_blank\" >￥" + itinerary.data[itr].price + "</a><i class='chengtuan'>" + calTag + "</i><i class='yuwei'>余位";
                                            if (itinerary.data[itr].cuteNum > 9) {
                                                nde.textContext += ">9</i>";
                                            } else {
                                                nde.textContext += ":" + itinerary.data[itr].cuteNum + "</i>";
                                            }
                                            nde.innerHTML = nde.textContext + "</div>";
                                        }
                                    }
                                }
                            } //end for
                        } //end if
                        if (!nde.innerHTML) {
                            nde.innerHTML = nde.textContent = "<td class='calendar-box'><div class='item-null'>" + nDayT + "<i class='day'>" + day + "</i></div></td>";
                        }
                    } // end with
                    ++day;
                    if (day > days) return;
                } //end for
            } //end for
        }); //end $.getScript
    };
    //节气 2013/02/22添加 //by  cmy
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
    /*-------------导入节气JS----------*/
    var CalendarData = new Array(100);
    var unlockNum = true; //是否开启数字格式值返回 如：2011-12-15返回值为1121 [false则为 冬月廿十一]
    var madd = new Array(12);
    var tgString = "甲乙丙丁戊己庚辛壬癸";
    var dzString = "子丑寅卯辰巳午未申酉戌亥";
    var numString = "1234567890"; //"一二三四五六七八九十";//***   
    var monString = "123456789"; //"正二三四五六七八九十冬腊";//*** 
    var weekString = "日一二三四五六";
    var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
    var cYear, cMonth, cDay, TheDate;
    CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
    madd[0] = 0;
    madd[1] = 31;
    madd[2] = 59;
    madd[3] = 90;
    madd[4] = 120;
    madd[5] = 151;
    madd[6] = 181;
    madd[7] = 212;
    madd[8] = 243;
    madd[9] = 273;
    madd[10] = 304;
    madd[11] = 334;
    function GetBit(m, n) {
        return (m >> n) & 1;
    }
    //D当前日期 lockNum是否开启数字格式值返回 //var D = new Date(); 
    function showCal(D, lockNum) {
        if (lockNum === false || lockNum === "false") {
            unlockNum = false;
            numString = "一二三四五六七八九十";
            monString = "正二三四五六七八九十冬腊";
        }
        var yy = D.getFullYear();
        var mm = D.getMonth() + 1;
        var dd = D.getDate();
        var ww = D.getDay();
        var ss = parseInt(D.getTime() / 1000, 10);
        if (yy < 100)
            yy = "19" + yy;
        return GetLunarDay(yy, mm, dd);
    }

    function GetLunarDay(solarYear, solarMonth, solarDay) {
        //solarYear = solarYear<1900?(1900+solarYear):solarYear;
        if (solarYear < 1921 || solarYear > 2020) {
            return "";
        } else {
            solarMonth = (parseInt(solarMonth, 10) > 0) ? (solarMonth - 1) : 11;
            e2c(solarYear, solarMonth, solarDay);
            return GetcDateString();
        }
    }

    function e2c() {
        TheDate = (arguments.length !== 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
        var total, m, n, k;
        var isEnd = false;
        var tmp = TheDate.getYear();
        if (tmp < 1900) {
            tmp += 1900;
        }
        total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
        if (TheDate.getYear() % 4 === 0 && TheDate.getMonth() > 1) {
            total++;
        }
        for (m = 0; ; m++) {
            k = (CalendarData[m] < 0xfff) ? 11 : 12;
            for (n = k; n >= 0; n--) {
                if (total <= 29 + GetBit(CalendarData[m], n)) {
                    isEnd = true; break;
                }
                total = total - 29 - GetBit(CalendarData[m], n);
            }
            if (isEnd) break;
        }
        cYear = 1921 + m;
        cMonth = k - n + 1;
        cDay = total;
        if (k == 12) {
            if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth = 1 - cMonth;
            }
            if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth--;
            }
        }
    }
    function GetcDateString() {
        var P = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42448, 83315, 21200, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448];

        var tmp = "";
        tmp += tgString.charAt((cYear - 4) % 10);
        tmp += dzString.charAt((cYear - 4) % 12);
        tmp += "(";
        tmp += sx.charAt((cYear - 4) % 12);
        tmp += ")年 ";
        tmp = ""; //***
        if (cMonth < 1) {
            if (unlockNum === false) {
                tmp += "(闰)";
                tmp += monString.charAt(-cMonth - 1);
            } else {
                //tmp += "(闰)"; //**
                tmp += cMonth < 10 ? "0" + (cMonth - 2) : (cMonth - 2);  //monString.charAt(-cMonth - 1);//**        
            }
        } else {
            if (unlockNum === false) {
                tmp += monString.charAt(cMonth - 1);
            } else {
                tmp += cMonth < 10 ? "0" + cMonth : cMonth;  //monString.charAt(cMonth - 1);//**
            }
        }

        if (unlockNum === false) {
            tmp += "月";
            tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
            if (cDay % 10 !== 0 || cDay === 10) {
                tmp += numString.charAt((cDay - 1) % 10);
            }
        } else {
            tmp += (cDay < 10 ? "0" + cDay : cDay);
            if (cMonth === 12 && cDay == ((P[cYear - 1900] & (65536 >> 12)) ? 30 : 29)) {
                tmp = "0100";
            }
        }
        return tmp;
    }
    /*--------------/导入节气JS-------------*/
    this.show = function (ele, id, url, mine, mask) {

        ui = ui || this.createUI();
        $id = id;
        $url = url;
        mineObject.firstShow = true;
        mineObject.sjt = url.lastIndexOf("sijia.uzai.com") >= 1;
        if (!mineObject.sjt && $(mine).attr("data-url")) {
            mineObject.sjt = $(mine).attr("data-url").lastIndexOf("sijia.uzai.com") >= 1; //当前日历是否为私家团
        }

        var ID = ele.id;
        var MaskID = ID + "Mask";

        //添加关闭按钮
        var close = document.createElement("a");
        close.title = "关闭";
        close.className = "close";
        close.innerHTML = close.htmlContent = "&times";
        close.onclick = function () {
            $("#" + ID).remove();
            $("#" + MaskID).remove();
            return false;
        };
        ele.appendChild(close);

        //添加头部容器.hd
        var hd = document.createElement("div");
        hd.className = "hd";
        hd.innerHTML = hd.htmlContent = "请选择班期";
        ele.appendChild(hd);

        //添加内容容器.bd
        var bd = document.createElement("div");
        bd.className = "bd";
        ele.appendChild(bd);

        var wh = $('body').height();
        var ww = screen.width;

        //添加mask
        if (mask) {
            var width = document.documentElement.clientWidth + document.documentElement.scrollLeft;
            var height = document.documentElement.clientHeight + document.documentElement.scrollTop;

            var msk = document.createElement("div");
            msk.id = MaskID;
            msk.style.position = 'absolute';
            msk.style.top = '0px';
            msk.style.left = '0px';
            msk.style.height = wh + 'px';
            msk.style.width = '100%';
            msk.style.opacity = '.3';
            msk.style.backgroundColor = '#000000';
            msk.style.zIndex = 9998;
            msk.style.filter += ("progid:DXImageTransform.Microsoft.Alpha(opacity=30)");
            document.body.appendChild(msk);
        }

        //添加loader
        var loader = document.createElement("div");
        loader.className = "loader";
        loader.style.height = '300px';
        loader.style.backgroundImage = 'url(' + _uzw.ui.preloader + ')';
        loader.style.backgroundRepeat = 'no-repeat';
        loader.style.backgroundPosition = 'center center';

        hd.appendChild(loader);

        //生成calender
        hd.appendChild(ui);

        this.change(this.year, this.month, this.date);
    };

    this.toString = function () {
        // alert(this.year + "-" + this.month + "-" + this.date);
    };
}

/*window.onload = function() {
new Calendar().show(document.getElementById("dv_01"));
}*/