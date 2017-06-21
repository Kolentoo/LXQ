/*!
 * jsonchou 单日历插件,智能双半月日历
 * d:2014-08-12
 * v:0.1.2
 * modify:因兼容mobile 去除jquery deferred done事件
 * lulisheng 增加未付款余位
 */



;(function ($) {

    var $weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var $weeksEn = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var $days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var $date = new Date();
    //var $solarN = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"]
    //var $solarV = [1272060, 1275495, 1281180, 1289445, 1299225, 1310355, 1321560, 1333035, 1342770, 1350855, 1356420, 1359045, 1358580, 1355055, 1348695, 1340040, 1329630, 1318455, 1306935, 1297380, 1286865, 1277730, 1274550, 1271556]

    //阳历节日
    var $holidaP = { "0101": "元旦", "0214": "情人节", "0305": "学雷锋纪念日", "0308": "妇女节", "0312": "植树节", "0315": "消费者权益日", "0401": "愚人节", "0405": "清明节", "0501": "劳动节", "0504": "青年节", "0601": "儿童节", "0701": "建党节", "0801": "建军节", "0903": "抗战胜利日", "0910": "教师节", "1124": "感恩节", "1224": "平安夜", "1225": "圣诞节" };

    //阴历节日
    var $holidaN = { "0101": "春节", "0115": "元宵节", "0505": "端午节", "0815": "中秋节", "0707": "七夕", "0909": "重阳节", "1208": "腊八节", "0100": "除夕" };

    var _jcUtil = {
        //是否是润年
        isLeapYear: function (year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        },
        //string类型date 格式化
        formatDate: function (date) {
            if (date) {
                return new Date(Date.parse(date.replace(/-/g, "/")));
            }
            return new Date();
        },
        //比较日期大小,字符类型,返回1,0,-1;
        compareDate: function (d1, d2) {
            if (d1 && d2) {
                d1 = Date.parse(d1.replace(/-/g, "/"));
                d2 = Date.parse(d2.replace(/-/g, "/"));
                if (d1 > d2) {
                    return 1;
                } else if (d1 == d2) {
                    return 0;
                } else {
                    return -1;
                }
            }
        },
        //获取该年份
        getYear: function (date) {
            var d = date ? this.formatDate(date) : $date;
            return d.getFullYear();
        },
        //获取该月份
        getMonth: function (date) {
            var d = date ? this.formatDate(date) : $date;
            return d.getMonth() + 1;
        },
        //获取该日
        getDate: function (date) {
            var d = date ? this.formatDate(date) : $date;
            return d.getDate();
        },
        //获取当前月第一天是星期几
        getFirstDate: function (year, month) {
            return new Date(year, month - 1, 1).getDay();
        },
        //获取该月总天数
        getMonthDays: function (year, month) {
            var m = month;
            var mcount = 0; //该月天数
            mcount = $days[m - 1];
            if (m === 2) {
                if (this.isLeapYear(year)) {
                    mcount = 29;
                } else {
                    mcount = 28;
                }
            }
            return mcount;
        },
        //通过操作月份，致年份变化
        //形如 "2014-8"
        //year:当前年
        //month:当前月
        //tag:通过next,prev标识，返回新年、月
        fixYearByMonth: function (year, month, tag) {
            var y = year;
            var m = month;

            if (tag == 'next') {
                m = month + 1;
                if (m === 13) {
                    m = 1;
                    y += 1;
                }
            } else if (tag == 'prev') {
                m = month - 1;
                if (m === 0) {
                    m = 12;
                    y -= 1;
                }
            }
            return y + '-' + m;
        },
        //通过阴历日期，获取阳历日期
        getLunarBySolar: function (ymd) {
            if (ymd) {
                var y = parseInt(ymd.split('-')[0], 10);
                var m = parseInt(ymd.split('-')[1], 10);
                var d = parseInt(ymd.split('-')[2], 10);

                // 数组LunarDaysOfMonth存入农历2001年到2050年每年中的月天数信息
                // 农历每月只能是29或30天，一年用12(或13)个二进制位表示，从高到低，对应位为1表示30天，否则29天
                var LunarDaysOfMonth = [
                    0xd4a8, 0xd4a0, 0xda50, 0x5aa8, 0x56a0, 0xaad8, 0x25d0, 0x92d0, 0xc958, 0xa950, // 2001-2010
                    0xb4a0, 0xb550, 0xb550, 0x55a8, 0x4ba0, 0xa5b0, 0x52b8, 0x52b0, 0xa930, 0x74a8, // 2011-2020
                    0x6aa0, 0xad50, 0x4da8, 0x4b60, 0x9570, 0xa4e0, 0xd260, 0xe930, 0xd530, 0x5aa0, // 2021-2030
                    0x6b50, 0x96d0, 0x4ae8, 0x4ad0, 0xa4d0, 0xd258, 0xd250, 0xd520, 0xdaa0, 0xb5a0, // 2031-2040
                    0x56d0, 0x4ad8, 0x49b0, 0xa4b8, 0xa4b0, 0xaa50, 0xb528, 0x6d20, 0xada0, 0x55b0  // 2041-2050
                ];

                // 数组LunarLeapYear存放农历2001年到2050年闰月的月份，如没有则为0，从高到低，每字节存两年
                var LunarLeapYear = [
                    0x40, 0x02, 0x07, 0x00, 0x50, // 2001-2010
                    0x04, 0x09, 0x00, 0x60, 0x04, // 2011-2020
                    0x00, 0x20, 0x60, 0x05, 0x00, // 2021-2030
                    0x30, 0xb0, 0x06, 0x00, 0x50, // 2031-2040
                    0x02, 0x07, 0x00, 0x50, 0x03  // 2041-2050
                ];


                // 返回农历iLunarYear年的闰月月份，如没有则返回0
                var GetLeapMonth = function (iLunarYear) {
                    var Leap = LunarLeapYear[(iLunarYear - 2001) >> 1];
                    return (((iLunarYear - 2001) & 1) === 0) ? (Leap >> 4) : (Leap & 0x0f);
                };

                // 返回农历iLunarYer年iLunarMonth月的天数，结果是一个长整数
                // 如果iLunarMonth不是闰月， 高字为0，低字为该月的天数
                // 如果iLunarMonth是闰月， 高字为后一个月的天数，低字为前一个月的天数
                var LunarMonthDays = function (iLunarYear, iLunarMonth) {
                    var High;
                    var Low;
                    var Bit;

                    High = 0;
                    Low = 29;
                    Bit = 16 - iLunarMonth;
                    if ((iLunarMonth > GetLeapMonth(iLunarYear)) && (GetLeapMonth(iLunarYear) > 0)) Bit--;
                    if ((LunarDaysOfMonth[iLunarYear - 2001] & (1 << Bit)) > 0) Low++;
                    if (iLunarMonth == GetLeapMonth(iLunarYear)) {
                        High = ((LunarDaysOfMonth[iLunarYear - 2001] & (1 << (Bit - 1))) > 0) ? 30 : 29;
                    }

                    return Low + (High << 16);
                };

                // 返回农历iLunarYear年的总天数
                var LunarYearDays = function (iLunarYear) {
                    var Days;
                    var tmp;

                    Days = 0;
                    for (var i = 1; i <= 12; i++) {
                        tmp = LunarMonthDays(iLunarYear, i);
                        Days = Days + ((tmp >> 16) & 0xffff); //取高位
                        Days = Days + (tmp & 0xffff); //取低位
                    }

                    return Days;
                };

                // 将农历iLunarYear年格式化成天干地支记年法表示的字符串
                var FormatLunarYear = function (iLunarYear) {
                    var szText1 = "甲乙丙丁戊己庚辛壬癸";
                    var szText2 = "子丑寅卯辰巳午未申酉戌亥";
                    var strYear;

                    strYear = szText1.substr((iLunarYear - 4) % 10, 1);
                    strYear = strYear + szText2.substr((iLunarYear - 4) % 12, 1);

                    return strYear + "年";
                };

                // 将农历iLunarMonth月格式化成农历表示的字符串
                var FormatLunarMonth = function (iLunarMonth) {
                    return iLunarMonth + '月';
                };

                // 将农历iLunarDay日格式化成农历表示的字符串
                var FormatLunarDay = function (iLunarDay) {
                    return iLunarDay + '日';
                };

                // 将公历日期转换为农历日期，返回农历表示的字符串
                var GetLunarDateString = function (ymd) {
                    var tmp;
                    var iLunarYear;
                    var iLunarMonth;
                    var iLunarDay;
                    var Leap = false;
                    var MinMilli = 1000 * 60;
                    var HrMilli = MinMilli * 60;
                    var DyMilli = HrMilli * 24;

                    if (!ymd) {
                        return "";
                    }

                    var SolarDate = _jcUtil.formatDate(ymd);

                    // 从2001年1月1日算起，给定的公历日期已经过去的天数
                    // 11323是1970年1月1日到2001年1月1日之间的天数，因为Date是从1970年1月1日作为起点的
                    var iSpanDays = Math.round(SolarDate.getTime() / DyMilli) - 11323;

                    // 公历2001年1月24日为农历2001年正月初一，差23天
                    if (iSpanDays < 23) {
                        iYear = 2000;
                        iLunarMonth = 12;
                        iLunarDay = iSpanDays + 7;
                    }
                    else {
                        // 从农历2001年正月初一算起
                        iSpanDays = iSpanDays - 23;
                        iLunarYear = 2001;
                        iLunarMonth = 1;
                        iLunarDay = 1;

                        // 计算农历年
                        tmp = LunarYearDays(iLunarYear);
                        while (iSpanDays >= tmp) {
                            iSpanDays -= tmp;
                            iLunarYear++;
                            tmp = LunarYearDays(iLunarYear);
                        }

                        // 计算农历月
                        tmp = LunarMonthDays(iLunarYear, iLunarMonth) & 0xffff; //取低字
                        while (iSpanDays >= tmp) {
                            iSpanDays -= tmp;
                            if (iLunarMonth == GetLeapMonth(iLunarYear))  // 该年该月闰月
                            {
                                tmp = LunarMonthDays(iLunarYear, iLunarMonth) >> 16; //取高字
                                if (iSpanDays < tmp) {
                                    Leap = (tmp > 0) ? true : false;  // 闰月的后个月？
                                    break;
                                }
                                iSpanDays = iSpanDays - tmp;
                            }

                            iLunarMonth++;
                            tmp = LunarMonthDays(iLunarYear, iLunarMonth) & 0xffff; //取低字
                        }

                        // 计算农历日
                        iLunarDay += iSpanDays;
                    }

                    return FormatLunarYear(iLunarYear) + "|" + (Leap ? "闰" : "平") + "|" + FormatLunarMonth(iLunarMonth) + "|" + FormatLunarDay(iLunarDay);
                };

                return GetLunarDateString(ymd);

            }
            return "";
        }
    };


    $.fn.jsonCalendar = function (options) {

        var opt = $.extend({}, $.fn.jsonCalendar.option, options);

        return this.each(function (k, v) {

            var ojc = $(this);//box 对象

            var ojcData = [];

            if (!ojc.get(0)) {
                return;
            }

            var userDate = opt.latestDate;
            if (userDate) {
                if (new Date(userDate) < new Date()) {
                    userDate = _jcUtil.getYear() + '-' + _jcUtil.getMonth() + '-' + _jcUtil.getDate();
                }
            }

            var wrap = ojc.find('.j_jsonCalendarWrap');

            var draw = function (ye, mo, flag) {

                var sm = opt.isSmart;
                var year = ye || _jcUtil.getYear();
                var month = mo || _jcUtil.getMonth();

                if (wrap.get(0)) {
                    wrap.remove();
                }

                ojc.append("<div class='clearfix j_jsonCalendarWrap'></div>");

                wrap = ojc.find('.j_jsonCalendarWrap');

                var toDay = _jcUtil.getDate();//今天

                var whichDay = _jcUtil.getFirstDate(year, month); //该月第一天星期几？
                var countDays = _jcUtil.getMonthDays(year, month); //该月的天数

                var ymPrev = _jcUtil.fixYearByMonth(year, month, 'prev'); //上个月日期形状
                var countPrevMonthDays = _jcUtil.getMonthDays(parseInt(ymPrev.split('-')[0], 10), parseInt(ymPrev.split('-')[1], 10)); //上月的天数

                var ymNext = _jcUtil.fixYearByMonth(year, month, 'next'); //下个月日期形状
                var countNextMonthDays = _jcUtil.getMonthDays(parseInt(ymNext.split('-')[0], 10), parseInt(ymNext.split('-')[1], 10)); //下月的天数

                var sb = [];
                sb.push("<div class='calendarBox'>");
                sb.push('<table>');

                //thead
                sb.push('<thead>');
                sb.push('<tr>');
                for (var n = 0; n < $weeks.length; n++) {
                    var wk = "";
                    if (n === 0 || n === 6) {
                        wk = "class='th-weekend-tit'";
                    }
                    sb.push("<th><p class='p1'><span class='s1'>周</span><span class='s2'>" + $weeks[n].replace('周', '') + "</span></p><p class='p2'>" + $weeksEn[n] + "</p></th>");
                }
                sb.push('</tr>');
                sb.push('</thead>');

                //tbody
                sb.push('<tbody>');

                var dArr = [];

                var i = 0;

                //填充42格
                var pushArr = function () {
                   
                    for (i = whichDay - 1; i >= 0; i--) {
                        dArr.push(parseInt('-' + (countPrevMonthDays - i), 10));
                    }

                    for (i = 1; i <= countDays; i++) {
                        dArr.push(i);
                    }

                    var gridSize = 42;
                    var lastGridCount = gridSize - whichDay - countDays;
                    for (i = 0; i < lastGridCount; i++) {
                        dArr.push(parseInt('-' + (i + 1), 10));
                    }
                };

                //复杂半日历填充42格
                var pushArrExt = function (po) {
                    for (i = po; i <= countDays; i++) {
                        dArr.push(parseInt('-' + i, 10));
                    }

                    var gridSize = 42;
                    var lastGrid = gridSize - (countDays - po);
                    for (i = 1; i < lastGrid; i++) {
                        dArr.push(i);
                    }
                };

                var point = 15;
                //判断初始状态，及点击月份后初始状态
                if (opt.isSmart) {
                    //console.log(_jcUtil.getMonth());
                    var pointDay = new Date(_jcUtil.getYear(), _jcUtil.getMonth() - 1, 15).getDay();//15号临界点星期几;
                    point = 15 - pointDay;//智能半日历第一天
                    //console.log(toDay,point);
                    if (toDay >= point && ye == _jcUtil.getYear() && mo == _jcUtil.getMonth()) {
                        sm = true;
                    } else {
                        sm = false;
                    }
                } else {
                    sm = false;
                }

                if (!sm) {
                    //普通日历
                    pushArr();
                } else {
                    //智能半月日历
                    pushArrExt(point);
                }

                //console.log(dArr);

                for (i = 0; i < dArr.length; i++) {

                    var item = dArr[i];
                    var tag = '';
                    var mutil = i % 7;
                    if (mutil === 0) {
                        sb.push('<tr>');
                    }

                    if (item <= 0) {
                        tag = sm ? "item item-half" : "item item-gray";
                        if (mutil === 0) {
                            tag += ' item-sun';
                        } else if (mutil === 6) {
                            tag += ' item-sat';
                        }
                        var day = parseInt(item.toString().replace('-', ''), 10);

                        if (sm) {
                            //当前月无效日期处理
                            if (_jcUtil.getYear() == year && _jcUtil.getMonth() == month && _jcUtil.getDate() > day) {
                                tag += ' item-expiry';
                            }
                        }

                        if (sm) {
                            if (_jcUtil.getYear() == year && _jcUtil.getMonth() == month && _jcUtil.getDate() == day) {
                                tag += ' today';
                            }
                        }
                        if (sm) {
                            //当前月份
                            sb.push("<td data-day='" + day + "' data-month='" + month + "'  data-year='" + year + "' class='" + tag + "'><div class='box'><div class='day'>" + day + "</div></div></td>");

                        } else {
                            //上月份过期月份
                            var y, m, ym;
                            if (day >= 20) {
                                ym = _jcUtil.fixYearByMonth(year, month, 'prev');
                            }
                                //下月份过期月份
                            else if (day <= 15) {
                                ym = _jcUtil.fixYearByMonth(year, month, 'next');
                            }

                            sb.push("<td data-day='" + day + "' data-month='" + ym.split('-')[1] + "'  data-year='" + ym.split('-')[0] + "' class='" + tag + "'><div class='box'><div class='day'>" + day + "</div></div></td>");
                        }
                    } else {
                        //可用日期数据格
                        tag = "item";
                        if (mutil === 0) {
                            tag += ' item-sun';
                        } else if (mutil === 6) {
                            tag += ' item-sat';
                        }

                        if (!sm) {
                            //当前月无效日期处理
                            if (_jcUtil.getYear() == year && _jcUtil.getMonth() == month && _jcUtil.getDate() > item) {
                                tag += ' item-expiry';
                            }
                        }

                        if (!sm) {
                            if (_jcUtil.getYear() == year && _jcUtil.getMonth() == month && _jcUtil.getDate() == item) {
                                tag += ' today';//今天
                            }
                            //前半日历
                            sb.push("<td  data-day='" + item + "' data-month='" + month + "'  data-year='" + year + "' class='" + tag + "'><div class='box'><div class='day'>" + item + "</div></div></td>");
                        } else {
                            //console.log();
                            //后半日历
                            sb.push("<td  data-day='" + item + "' data-month='" + parseInt(ymNext.split('-')[1], 10) + "'  data-year='" + parseInt(ymNext.split('-')[0], 10) + "' class='" + tag + "'><div class='box'><div class='day'>" + item + "</div></div></td>");
                        }
                    }

                    if (mutil == 6) {
                        sb.push('</tr>');
                    }
                }

                sb.push('</tbody>');
                sb.push('</table>');
                sb.push('</div>');

                wrap.html(sb.join(''));

                wrap.attr('year', year); //写year标识
                wrap.attr('month', month); //写month标识

                //写入阳历，阴历，节气标识
                var loadJCHoliday = function () {
                    var wi = wrap.find('.item');

                    //返回日期的节日名称
                    var _getArrayObjectByKeyName = function (kn, obj) {
                        var res = "";
                        for (var key in obj) {
                            if (key == kn) {
                                res = obj[key];
                                break;
                            }
                        }
                        return res;
                    };


                    wi.each(function (k, v) {
                        var wik = $(this);
                        var wiY = parseInt(wik.attr('data-year'), 10);
                        var wiM = parseInt(wik.attr('data-month'), 10);
                        var wiD = parseInt(wik.attr('data-day'), 10);

                        wiY = wiY < 10 ? ('0' + wiY) : wiY + '';
                        wiM = wiM < 10 ? ('0' + wiM) : wiM + '';
                        wiD = wiD < 10 ? ('0' + wiD) : wiD + '';

                        var holiday = _getArrayObjectByKeyName((wiM + wiD), $holidaP);//阳历节日
                        if (!holiday) {
                            var ld = _jcUtil.getLunarBySolar(wiY + '-' + wiM + '-' + wiD);//农历节日

                            if (ld) {
                                var ldArr = ld.split('|');
                                var ldm = parseInt(ldArr[2].replace('月', ''), 10);//农历月
                                var ldd = parseInt(ldArr[3].replace('日', ''), 10);//农历日
                                var lddate = (ldm < 10 ? ('0' + ldm) : ldm + '') + '' + (ldd < 10 ? ('0' + ldd) : ldd + '');
                                holiday = _getArrayObjectByKeyName(lddate, $holidaN);//阴历节日
                            }
                        }

                        if (holiday) {
                            var wikBox = wik.find('.box');
                            var wkBoxH = wikBox.find('a.holiday');
                            if (!wkBoxH.get(0)) {
                                wikBox.addClass('box-holiday');
                                wikBox.append("<a class='holiday' href='javascript:;' title='" + holiday + "' >" + holiday + "</a>");
                            }
                        }

                    });
                };

                loadJCHoliday();

                drawBar(year, month, sm);

                //数据节点绑定
                var loadJCData = function () {
                    if (ojcData && ojcData.length > 0) {
                        var data = ojcData;
                        for (i = 0; i < data.length; i++) {
                            var item = data[i];
                            var id = item.id ? "data-id='" + item.id + "' " : " ";
                            var title = item.title;
                            var ext = item.ext;
                            var date = item.date.replace('-0', '-').replace('-0', '-'); //格式化日期
                            var url = item.url ? item.url : "#";
                            var tg = item.url ? "target='_blank' " : " ";
                            var price = item.price || 0;
                            var cprice = item.Chprice || 0;//儿童价格
                            var tag = item.tag;

                            var cut = parseInt(item.cut, 10);
                            var beforeday = item.beforeDay;
                            var beforehour = item.beforeHour;
                            var enddate = item.endDate;
                            var endtime = item.endTime;
                            var pricecheap = item.priceCheap || 0;
                            var cheapext = item.cheapExt;
							var unpaycustnum=parseInt(item.unpaycustnum,10);
                            //多行程ID
                            var groupID = item.UzaiJouneryGroupID;

                            var cheapList = [];
                            if (cheapext && cheapext.length > 0) {
                                for (var n = 0; n < cheapext.length; n++) {
                                    var nitem = cheapext[n];
                                    cheapList.push("<div class='cheap-item' data-tag='" + nitem.Tag + "'  data-desc='" + nitem.Desc + "'  data-price='" + nitem.Price + "'  data-max='" + nitem.Max + "' ></div>");
                                }
                            }

                            var cutFix = "";
                            if (cut === 0&&unpaycustnum===0) {
                                cutFix = "<i class='sq'>售罄</i>";
                            } else if (cut <=1) {
                                cutFix = "";
                            } else if (cut >= 2 && cut <= 8) {
                                cutFix = "<i class='yw'>余位:" + cut + "</i>";
                            } else if (cut >= 9) {
                                cutFix = "<i class='cz'>充足</i>";
                            }

                            var getYear = date.split('-')[0];
                            var getMonth = date.split('-')[1];
                            var getDay = date.split('-')[2];

                            var td = wrap.find(".item[data-year='" + getYear + "'][data-month='" + getMonth + "'][data-day='" + getDay + "']");

                            //当前月数组绑定
                            if (td.get(0)) {
                                var bb = [];

                                bb.push("<a " + tg + " " + id + " href='" + url + "' class='block'>");

                                if (title) {
                                    bb.push("<div class='title hide'>" + title + "</div>");
                                }
                                if (ext) {
                                    bb.push("<div class='ext hide'>" + ext + "</div>");
                                }
                                if (date) {
                                    bb.push("<div class='date hide'>" + date + "</div>");
                                }
                                if (price) {
                                    if (price.indexOf('￥') > -1) {
                                        bb.push("<div class='price hide'>" + price + "</div>");
                                    }
                                    else {
                                        bb.push("<div class='price hide'>￥" + price + "</div>");
                                    }
                                }
                                if (cprice) {
                                    if (cprice.indexOf('￥') > -1) {
                                        bb.push("<div class='cprice hide'>" + cprice + "</div>");
                                    }
                                    else {
                                        bb.push("<div class='cprice hide'>￥" + cprice + "</div>");
                                    }
                                }
                                if (tag) {
                                    bb.push("<div class='tag hide'>" + tag + "</div>");
                                }
                                if (cutFix) {
                                    bb.push("<div class='cut hide' data-cut='" + cut + "' >" + cutFix + "</div>");
                                }
                                if (beforeday) {
                                    bb.push("<div class='before-day hide'>" + beforeday + "</div>");
                                }
                                if (beforehour) {
                                    bb.push("<div class='before-hour hide'>" + beforehour + "</div>");
                                }
                                if (enddate) {
                                    bb.push("<div class='end-date hide'>" + enddate + "</div>");
                                }
                                if (endtime) {
                                    bb.push("<div class='end-time hide'>" + endtime + "</div>");
                                }
                                if (pricecheap) {
                                    bb.push("<div class='price-cheap hide'>" + pricecheap + "</div>");
                                }
                                //对象
                                if (cheapList.length > 0) {
                                    bb.push("<div class='cheap-ext hide'>" + cheapList + "</div>");
                                }
                                if (groupID) {
                                    bb.push("<div class='group-id hide'>" + groupID + "</div>");
                                }
                                bb.push("</a>");
                                td.find('.box').append(bb.join(''));

                            } else {
                                //console.log('can not find data row');
                            }
                        }

                    }
                    //不管是否有数据，都需要回调
                    opt.extCallBack(year, month);
                };

                //初次ajax加载班期
                if (opt.jsonpUrl) {
                    if (ojcData && ojcData.length > 0) {
                        loadJCData();
                    } else {
                        var url = opt.jsonpUrl;
                        $.ajax({
                            url: url,
                            type: 'GET',
                            cache: false,
                            dataType: "jsonp",
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                if (!data || data.length <= 0) {
                                    var bar = wrap.find('.calendarBar');
                                    bar.find('.prev').addClass('prev-off');
                                    bar.find('.next').addClass('next-off');
                                    return;
                                }
                                ojcData = data;
                                loadJCData();
                            }
                        });

                    }
                } else {
                    //不管是否有数据，都需要回调
                    opt.extCallBack(year, month);
                }

            };

            var getCurrentYear = function () {
                return parseInt(wrap.attr('year'), 10);
            };
            var getCurrentMonth = function () {
                return parseInt(wrap.attr('month'), 10);
            };
            //画控制器
            var drawBar = function (year, month, smt) {
                var sm = smt || false;
                if (!sm) {
                    wrap.append("<div class='calendarBar'></div>");
                }
                else {
                    wrap.append("<div class='calendarBar calendarBar-half'></div>");
                }
                var bar = wrap.find('.calendarBar');

                var y = getCurrentYear();
                var m = getCurrentMonth();

                var sb = [];

                var tagPrevOff = (m == _jcUtil.getMonth() && y == _jcUtil.getYear()) ? 'prev-off' : ''; //当前月之前禁止点击

                if (userDate) {
                    var ld = _jcUtil.getYear(userDate) + '-' + _jcUtil.getMonth(userDate) + '-1';
                    var cd = y + '-' + m + '-1';
                    var cr = _jcUtil.compareDate(ld, cd); //compare result
                    if (cr >= 0) {
                        tagPrevOff == 'prev-off';
                    }
                }

                if (!sm) {
                    sb.push("<div class='fix'></div>");
                    sb.push("<div class='prev " + tagPrevOff + "' title='上月'>上月</div>");
                    sb.push("<div class='current'><p class='year'>" + y + "年</p><p class='month'>" + m + "月</p></div>");
                    sb.push("<div class='next' title='下月'>下月</div>");
                } else {
                    sb.push("<div class='fix'></div>");

                    sb.push("<div class='month-half month-half-prev'>");
                    sb.push("<div class='prev " + tagPrevOff + "' title='上月'>上月</div>");
                    sb.push("<div class='current'><p class='year'>" + y + "年</p><p class='month'>" + m + "月</p></div>");
                    sb.push("</div>");

                    var ymNext = _jcUtil.fixYearByMonth(y, m, 'next'); //下个月日期形状

                    sb.push("<div class='month-half month-half-next'>");
                    sb.push("<div class='current'><p class='year'>" + parseInt(ymNext.split('-')[0], 10) + "年</p><p class='month'>" + parseInt(ymNext.split('-')[1], 10) + "月</p></div>");
                    sb.push("<div class='next' title='下月'>下月</div>");
                    sb.push("</div>");
                }


                bar.html(sb.join(''));

                //trigger;
                bar.find('.prev').on('click', function () {
                    var o = $(this);
                    if (o.hasClass('prev-off')) {
                        return;
                    }
                    prevMonth();
                    var ym = _jcUtil.fixYearByMonth(y, m, 'prev');
                    opt.preCallback(parseInt(ym.split('-')[0], 10), parseInt(ym.split('-')[1], 10));
                });

                bar.find('.next').on('click', function () {
                    var o = $(this);
                    if (o.hasClass('next-off')) {
                        return;
                    }
                    nextMonth();
                    var ym = _jcUtil.fixYearByMonth(y, m, 'next');
                    opt.preCallback(parseInt(ym.split('-')[0], 10), parseInt(ym.split('-')[1], 10));
                });

            };

            var nextYear = function () {
                var y = getCurrentYear();
                draw(y += 1, 1);
            };
            var prevYear = function () {
                var y = getCurrentYear();
                draw(y -= 1, 1);
            };
            var nextMonth = function () {
                var y = getCurrentYear();
                var m = getCurrentMonth();
                var ym = _jcUtil.fixYearByMonth(y, m, 'next');
                draw(parseInt(ym.split('-')[0], 10), parseInt(ym.split('-')[1], 10), 'next');
            };
            var prevMonth = function () {
                var y = getCurrentYear();
                var m = getCurrentMonth();
                var ym = _jcUtil.fixYearByMonth(y, m, 'prev');
                draw(parseInt(ym.split('-')[0], 10), parseInt(ym.split('-')[1], 10), 'prev');
            };


            var uyear = _jcUtil.getYear();
            var umonth = _jcUtil.getMonth();

            if (userDate) {
                uyear = _jcUtil.getYear(userDate);
                umonth = _jcUtil.getMonth(userDate);
            }

            //初始化
            draw(uyear, umonth);

            //初始化init
            opt.preCallback(uyear, umonth);

        });

    };

    $.fn.jsonCalendar.option = {
        jsonpUrl: '',
        latestDate: '',//初始最近班期
        isSmart: false,//是否是智能双日历
        extCallBack: function (year, month) {
            //console.log(year, month);
        },
        preCallback: function (year, month) {//上月下月预回调
            //console.log(year, month);
        }
    };



})(window.jQuery || window.Zepto);