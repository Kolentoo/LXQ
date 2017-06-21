/*!
 * 通用方法
 * v: 1.1
 * d: 2014-3-6
*/

//uzai global param
//自动组装
_ug = {
    city: 'sh',
    cityCN: '上海',
    cityID: 2
};

//城市硬编码
_ug.cityPKG = {
    city: ['sh', 'bj', 'cd', 'nj', 'hz', 'gz', 'cq', 'yc', 'ty', 'sy', 'dl', 'zz', 'jn', 'weh', 'jl', 'tj', 'cc', 'sjz', 'nb', 'wx', 'nt', 'nc', 'hf', 'jh', 'cz', 'fz', 'xm', 'qz', 'nn', 'sz', 'hk', 'cs', 'wh', 'yic', 'jm', 'gy', 'km', 'heb', 'szh', 'xa', 'ts', 'lf', 'qd'],
    cityCN: ['上海', '北京', '成都', '南京', '杭州', '广州', '重庆', '银川', '太原', '沈阳', '大连', '郑州', '济南', '威海', '吉林', '天津', '长春', '石家庄', '宁波', '无锡', '南通', '南昌', '合肥', '金华', '常州', '福州', '厦门', '泉州', '南宁', '深圳', '海口', '长沙', '武汉', '宜昌', '江门', '贵阳', '昆明', '哈尔滨', '苏州', '西安', '唐山', '廊坊', '青岛'],
    cityID: [2, 1, 165, 57, 19, 144, 4, 253, 94, 29, 31, 204, 115, 309, 258, 3, 257, 8, 22, 58, 61, 83, 238, 27, 68, 134, 135, 138, 268, 149, 304, 190, 43, 51, 310, 277, 221, 125, 60, 286, 12, 13, 116],
    cityDistrict: [{ 'key': 1, 'cities': [165, 4, 1, 3, 8, 12, 43, 286, 29, 94, 204, 125, 31, 257, 116, 190, 115, 144, 5, 311] }, { 'key': 2, 'cities': [2, 57, 19, 22, 60, 58, 135, 238, 83, 68] }],
    getCityIDByCity: function (city) {
        city = city || 'sh';
        var idx = _util.array.inArray(city, _ug.cityPKG.city);
        return _ug.cityPKG.cityID[idx];
    },
    getCityIDByCityCN: function (citycn) {
        citycn = citycn || '上海';
        var idx = _util.array.inArray(citycn, _ug.cityPKG.cityCN);
        return _ug.cityPKG.cityID[idx];
    },
    getCityByCityID: function (cityid) {
        cityid = Number(cityid) || 2;
        var idx = _util.array.inArray(cityid, _ug.cityPKG.cityID);
        return _ug.cityPKG.city[idx];
    },
    getCityCNByCityID: function (cityid) {
        cityid = Number(cityid) || 2;
        var idx = _util.array.inArray(cityid, _ug.cityPKG.cityID);
        return _ug.cityPKG.cityCN[idx];
    },
    getDistrictByCityID: function (cityid) {
        cityid = Number(cityid) || 2;
        var cds = _ug.cityPKG.cityDistrict;
        var keyid = 2;
        for (var i = 0, les = cds.length; i < les; i++) {
            var item = cds[i];
            var itemCities = item.cities;
            if (_util.array.inArray(cityid, itemCities) > -1) {
                return item.key;
            }
        }
        return keyid;
    },
    isIndex: function () {
        //是否是www站首页
        var url = location.href.toLowerCase().replace('#', '');
        var pathname = location.pathname;
        var b = false;
        if (pathname == '/') {
            if (url == 'http://www.uzai.com/') {
                b = true;
            }
        }
        return b;
    },
    isSubIndex: function () {
        //是否是分站首页
        var url = location.href.toLowerCase().replace('#', '');
        var pathname = location.pathname;
        var b = false;
        if (pathname == '/') {
            var siteArr = this.city;//城市列表
            for (var i = 0, les = siteArr.length; i < les; i++) {
                var item = "http://" + siteArr[i] + ".uzai.com/";
                if (url == item) {
                    b = true;
                    break;
                }
            }

            //额外检查www
            if (url == "http://www.uzai.com/") {
                b = false;
            }
        }
        return b;
    }
};

//当前页面配置
_ug.pagePKG = {
    pageCN: ['首页', '频道页', '搜索页', '聚合页', '货架页', '会员中心页', '最近浏览页', 'POI页', '点评页', '专辑活动页', '产品页', '订单页', '其它页'],
    pageEN: ['home', 'channel', 'search', 'rss', 'list', 'member', 'history', 'poi', 'dianping', 'subject', 'product', 'order', 'other'],
    _index: function () {
        if (_ug.cityPKG.isIndex() || _ug.cityPKG.isSubIndex()) {
            return 0;
        } else if ($('#track_pageType').val() == 'channel') {
            return 1;
        } else if (_host.indexOf('search.uzai.com') > -1) {
            return 2;
        } else if ($('#track_pageType').val() == 'rss') {
            return 3;
        } else if ($('#track_pageType').val() == 'list') {
            return 4;
        } else if (_host.indexOf('//u.uzai.com') > -1) {
            return 5;
        } else if (_host.indexOf('.uzai.com/myhistory') > -1) {
            return 6;
        } else if ($('#track_pageType').val() == 'poi') {
            return 7;
        } else if (_host.indexOf('.uzai.com/dianping/') > -1) {
            return 8;
        } else if (_host.indexOf('www.uzai.com/subject') > -1) {
            return 9;
        } else if ($('#track_pageType').val() == 'product') {
            return 10;
        } else if ($('#track_pageType').val() == 'order') {
            return 11;
        } else {
            return 12;
        }
    },
    getTag: function () {
        var idx = this._index();
        return this.pageEN[idx];
    }
};

_uzw.web = {
    init: function () {
        _uzw.user.login();//载入user cookie
        this.gDEV();//通过ucache,开发环境调试
        this.gWebAppDetect();//中转至手机端
        this.gFixCity();
        this.gTopBar();
        this.gPageSideBar();//载入网站右侧节点
        this.gTel();//根据不同的SEM来源，改变400电话
        this.gNav();
        this.gAdTop();//广告位,通告
        this.gWinResize();
        this.gOrderSource();//订单SEO统计来源
        this.gSiteSurvey();//网站意见反馈
        this.gMaskBottom();//app底部蒙板
        this.gQuan();//代金券
        this.gFriendLink();//友情链接
        this.gFullADSlide();//全站通栏广告滑动
        this.gCallSpringFestival();//顶部客服电话春节设置
        gHoverEvent($('.crumbs').find('.menu-wrap'));
    },
    gWebAppDetect: function () {
        var u = location.href.toLowerCase();
        //url中包含mmm时候，表示测试URL请求
        if (u.indexOf('mmm') > -1) {
            return;
        }

        var bPc = _uzw.mobile.isPC();
        if (!bPc) {
            var head = $('head');
            var metas = head.find("meta[name='mobile-agent']");
            if (metas.length === 0) {
                metas = head.find("meta[http-equiv='mobile-agent']");
            }
            if (metas.length) {
                var o = metas.eq(0);
                var con = o.attr('content');
                var url = "";
                if (con) {
                    url = con.replace('format=xhtml; url=', '').replace('format=html5; url=', '');
                    location.href = url;
                    return false;
                }
            }
        }
    },
    gFixCity: function () {
        var o, oc, oh, ot;
        var cityId = 0; //城市id
        var _writeCookie = function (cityId) { // 写入cookie
            $.cookie("CurrentSubStationId",
                cityId, {
                    expires: 10, //有效期
                    path: "/", //cookie的路径
                    domain: "uzai.com" //cookie的域名
                });
			$.cookie("startcityid",
                cityId, {
                    expires: 10, //有效期
                    path: "/", //cookie的路径
                    domain: "uzai.com" //cookie的域名
                });
            $("#CurrentSubStation").html(_ug.cityPKG.getCityCNByCityID(cityId));
            $("#CurrentSubStation").attr("data-id", cityId);
            _ug.cityID = cityId; //将id赋值给全局变量
            _ug.city = _ug.cityPKG.getCityByCityID(cityId);
            _ug.cityCN = _ug.cityPKG.getCityCNByCityID(cityId);
        };
        var _getCityId = function () { // 根据链接获取分站
            var cityId = 0;
            for (var i = 0; i < _ug.cityPKG.cityID.length; i++) {
                var getCity = _subStationUrlGetCityId(_ug.cityPKG.cityID[i]);
                if (getCity === _ug.cityPKG.cityID[i]) {
                    cityId = _ug.cityPKG.cityID[i];
                    break;
                }
            }
            return cityId;
        };
        var _subStationUrlGetCityId = function (cityId) { // 判断分站链接
            var insideName = "inside";
            var currentUrl = window.location.href;
			currentUrl=currentUrl.split('?')[0];
            if (currentUrl === "http://www.uzai.com/" + _ug.cityPKG.getCityByCityID(cityId) || currentUrl === "http://" + _ug.cityPKG.getCityByCityID(cityId) + ".uzai.com/" || currentUrl === "http://" + _ug.cityPKG.getCityByCityID(cityId) + insideName + ".uzai.com/" || currentUrl === "http://www.uzai.com/" + _ug.cityPKG.getCityByCityID(cityId)+"/") {
                return cityId;
            } else {
                return 0;
            }
        };
        //首先判断cookie里是否有值，如果有值，则直接取出，否则根据ip取出对应的城市，否则默认北京
        var getCityId = _getCityId();
        if ($.cookie("CurrentSubStationId") === undefined || $.cookie("CurrentSubStationId") === "") {
            if (getCityId === 0) {
				  if($.cookie("startcityid")!==undefined&&$.cookie("startcityid")!==""){
					 cityId=$.cookie("startcityid");
				 }else{
					cityId=1;//默认北京
				 }
				_writeCookie(cityId);
            } else {
                cityId = getCityId; //说明是分站
            }
        } else {
            cityId = getCityId === 0 ? $.cookie("CurrentSubStationId") : getCityId;
        }
        _writeCookie(cityId);

        o = $('#J_startCityWrap').find('.start-city-name');
        if (!o.get(0)) {
            o = $('#j_gSubjectTop');
        }
        if (o.get(0)) {
            oc = o.attr('data-id') || 2;
            oh = _ug.cityPKG.getCityByCityID(oc);
            ot = _ug.cityPKG.getCityCNByCityID(oc);

            _ug.city = oh;
            _ug.cityCN = ot;
            _ug.cityID = oc;
        }
    },
    gDEV: function () {
        winLoadFix(function () {

            var ucc = _util.url.get('ucache');
            //param|ua|href|link|css|cookie|delcookie

            //param 弹出全局变量
            //ua 弹出ua
            //css 清空CDN缓存
            //href 弹出当前链接地址
            //link 弹出当前链接地址
            //cookie 弹出cookie,通过"," 获取多个
            //delcookie  删除cookie,通过"," 删除多个，常用于微信清空cookie

            var evtArr = [];
            if (ucc) {
                var uArr = ucc.split('|');
                for (var i = 0; i < uArr.length; i++) {
                    var item = uArr[i];
                    var ievt;
                    if (item.indexOf(':') > -1) {
                        var ita = item.split(':')[0];
                        var itb = item.split(':')[1];
                        var evList = itb.split(',');
                        for (var j = 0; j < evList.length; j++) {
                            var sub = evList[j];
                            //propagation
                            if (ita === 'cookie') {
                                (function (evtArr, sub) {
                                    evtArr.push(function () {
                                        alert(_uzw.cookie.get(sub));
                                    });
                                })(evtArr, sub);
                            } else if (ita === 'delcookie') {
                                (function (evtArr, sub) {
                                    _uzw.cookie.del(sub);
                                    evtArr.push(function () {
                                        alert(sub + "的cookie已删除！");
                                    });
                                })(evtArr, sub);
                            } else if (ita === 'param') {
                                (function (evtArr, sub) {
                                    evtArr.push(function () {
                                        var wsb = window[sub];
                                        if (wsb && typeof wsb === 'object') {
                                            alert(JSON.stringify(wsb));
                                        } else {
                                            if (!wsb) {
                                                alert('没有找到变量' + sub);
                                            } else {
                                                alert(window[sub]);
                                            }
                                        }
                                    });
                                })(evtArr, sub);
                            }
                        }
                    } else {
                        switch (item) {
                            case 'ua':
                                ievt = function () {
                                    alert(navigator.userAgent);
                                };
                                break;
                            case 'href':
                            case 'url':
                                ievt = function () {
                                    alert(decodeURIComponent(location.href));
                                };
                                break;
                            case 'css':
                                ievt = function () {
                                    _util.cdn.clear();
                                };
                                break;
                            case 'cookie':
                                ievt = function () {
                                    alert(document.cookie);
                                };
                                break;
                            case 'viewport':
                                ievt = function () {
                                    alert($('meta[name=viewport]').attr('content'));
                                };
                                break;
                        }
                    }
                    evtArr.push(ievt);
                }
            }
            if (evtArr.length) {
                for (var m = 0; m < evtArr.length; m++) {
                    var msub = evtArr[m];
                    msub && msub();
                }
            }
        });
    },
    gPageSideBar: function () {
        var sidebar, wechat, download, backTop;
        var u = location.href.toLowerCase();
        var _loadHtml = function () {
            sidebar = $('#j_globalSidebar');
            sidebar.remove();

            if (u.indexOf('.uzai.com/clubmed') > -1 || u.indexOf(_uzw.domain.u) > -1 || u.indexOf(_uzw.domain.buy) > -1 || u.indexOf(_uzw.domain.pay) > -1 || u.indexOf(_uzw.domain.manager) > -1 || u.indexOf('utourvisa.uzai.com') > -1 || u.indexOf('uztype=manager') > -1) {
                return;
            }

            try {
                if (window.frameElement && window.frameElement.nodeName == "IFRAME") {
                    //内嵌iframe页面
                    return;
                }
            } catch (e) {

            }

            var sb = '';
            var cityDistrict = _ug.cityPKG.getDistrictByCityID(_ug.cityID);

            sb =
            '<div class="global-sidebar" id="j_globalSidebar">' +
                '<ul class="sidebar-items">' +
                    '<li class="sidebar-item wechat">' +
                        '<i class="arrow-left">&nbsp;</i>' +
                        '<p class="icon-wrap"><i class="item-icon icon-common-part png"></i></p>' +
                        '<p class="item-hd">关注微信</p>' +
                        '<div class="pop-box focus-wechat">' +
                            '<i class="icons-qrcode code-wechat-' + (cityDistrict === 1 ? "bj" : "sh") + '"></i>' +
                            '<p>扫一扫，关注悠哉微信</p>' +
                        '</div>' +
                    '</li>' +
                    '<li class="sidebar-item app-download">' +
                        '<i class="arrow-left">&nbsp;</i>' +
                        '<p class="icon-wrap"><i class="item-icon icon-common-part png"></i></p>' +
                        '<p class="item-hd">APP下载</p>' +
                        '<div class="pop-box app-client">' +
                            '<i class="icons-qrcode code-app-download"></i>' +
                            '<p><a href="http://www.uzai.com/app/?ly=fkcode" rel="nofollow" target="_blank">手机专享优惠，价更低！</a></p>' +
                        '</div>' +
                    '</li>' +
                    '<li class="sidebar-item uzkf-online">' +
                        '<p class="icon-wrap"><i class="item-icon icon-common-part png"></i></p>' +
                        '<p class="item-hd"><a href="javascript:void(0)" onclick="_MEIQIA(\'showPanel\')" rel="nofollow" target="_blank">在线客服</a></p>' +
                    '</li>' +
                    '<li class="sidebar-item contactus">' +
                        '<p class="icon-wrap"><i class="item-icon icon-common-part png"></i></p>' +
                        '<p class="item-hd">联系我们</p>' +
                        '<p class="hotline"><s class="icon-common-part png"></s><span class="j_Gtel">' + _hotline + '</span></p>' +
                    '</li>' +
                    '<li class="sidebar-item back-top">' +
                        '<p class="icon-wrap"><span class="arrow-top"><em>◆</em><i>◆</i></span></p>' +
                        '<p class="item-hd">返回顶部</p>' +
                    '</li>' +
                '</ul>' +
            '</div>';
            $('body').append(sb);
        };

        _loadHtml();
        sidebar = $('#j_globalSidebar');
        wechat = sidebar.find('.wechat');
        download = sidebar.find('.app-download');
        backTop = sidebar.find('.back-top');

        $(window).scroll(function () {
            var st = $(window).scrollTop();
            if (st > 100) {
                backTop.show();
            } else {
                backTop.hide();
            }
        });

        wechat.on('mouseenter', function () { // 关注微信
            $(".focus-wechat").show();
        }).on('mouseleave', function () {
            $(".focus-wechat").hide();
        });

        download.on('mouseenter', function () { // app下载
            $(".app-client").show();
        }).on('mouseleave', function () {
            $(".app-client").hide();
        });

        backTop.click(function () { // 返回顶部
            $('body,html').animate({ scrollTop: 0 }, 800);
        });

        if (_uzw.domain.dingzhi.indexOf(_host) >= 0) { // 优定制页面
            sidebar.find('.sidebar-items').prepend('<li class="sidebar-item custom"><p class="icon-wrap"><i class="item-icon icon-common-part png"></i></p><p class="item-hd"><a href="/dingzhiIndex" class="block tc">优<br>定制</a></p></li>');
            if (_util.url.get(u, 'city') === '1') { // 北京大区
                wechat.find('.icons-qrcode').removeClass('code-wechat-sh').addClass('code-wechat-bj');
            }
        } else if (_ug.cityPKG.getDistrictByCityID(_ug.cityID) == 2) {
            // 上海大区
            // wechat.addClass('wechat-sh').find('.item-hd').text('这有红包');
            wechat.find('.focus-wechat').find('.icons-qrcode').addClass('code-wechat-wd');
        }
    },
    gSiteSurvey: function () {
        var advise = $('#j_advise');
        var _unitAdvise = function () {

            //load ui
            var sb = [];
            sb.push("<div class='pop-advise-mask'  id='J_popAdviseMask'></div>");
            sb.push("<div class='pop-advise' id='J_popAdviseBox'>");
            sb.push("<div class='tit'><span class='close'>&times;</span>当前网站页面，你怎么看？</div>");
            sb.push("<div class='hd'><ul class='fn-clear'><li >很糟糕</li><li >不咋的</li><li >一般</li><li >挺好</li><li class='on'>好赞</li></ul></div>");

            sb.push("<div class='bd'>");
            sb.push("<div class='d1'><textarea  onfocus=\"if (this.value==this.defaultValue) this.value = '';\" onblur=\"if (this.value=='') this.value = this.defaultValue;\">你的宝贵意见和建议，是对我们最大的帮助和鼓励，谢谢！</textarea></div>");
            sb.push("<div class='d2 fn-clear'><input onfocus=\"if (this.value==this.defaultValue) this.value = '';\" onblur=\"if (this.value=='') this.value = this.defaultValue;\"  value='如果方便，请留下你的联系方式！' /><span class='s1'>确定</span></div>");
            sb.push("</div></div>");

            $('body').append(sb.join(''));

            //load mask
            var wh = $('body').height();
            $('#J_popAdviseMask').height(wh).show();
            $('#J_popAdviseBox').show();

            $('#J_popAdviseBox').find('.hd li').bind('click', function () {
                var o = $(this);
                var os = o.siblings('li');
                var od = o.attr('data-rate');
                os.removeClass('on');
                o.addClass('on');
            });

            //提交表单
            $('#J_popAdviseBox').find('.s1').bind('click', function () {
                var o = $(this);
                var p1 = $('#J_popAdviseBox').find('li.on').index();
                var p2 = $('#J_popAdviseBox').find('textarea').val();
                var p3 = $('#J_popAdviseBox').find('input').val();
                var p4 = document.location.href;

                if (p2 == $('#J_popAdviseBox').find('textarea')[0].defaultValue) {
                    p2 = "";
                }

                if (p3 == $('#J_popAdviseBox').find('input')[0].defaultValue) {
                    p3 = "";
                }
                var qst = encodeURIComponent("当前网站页面，你怎么看？");
                var url = _uzw.domain.wapi + "/api/UzaiProductQuestion/Add?Question=" + qst + "&Answer=" + encodeURIComponent(p2) + "&URL=" + encodeURIComponent(p4) + "&Level=" + Number(p1 + 1) + "&Contact=" + encodeURIComponent(p3) + "&Type=1&UzaiProductId=0&UzaiTravelClassId=0";
                //可能需要用跨域jsonp
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: "jsonp",
                    cache: false,
                    success: function (d) {
                        closeAdvisePop();
                    }
                });
            });

            //关闭
            $('#J_popAdviseBox').find('.close').bind('click', function () {
                closeAdvisePop();
            });

            var closeAdvisePop = function () {
                $('#J_popAdviseMask').remove();
                $('#J_popAdviseBox').remove();
            };
        };
        //提交表单

        //var jaa = $('#J_advise').find('a');
        //jaa.text('问卷调查');
        //jaa.attr('target', '_blank');
        //jaa.attr('href', 'http://www.wenjuan.com/s/IBZ7Rz/');

        //return;
        advise.click(function () {
            _unitAdvise();
            return false;
        });

        $('#j_newHeader').find('.newMenu-service').find('.btn-advise').on('click', function () {
            _unitAdvise();
        });
    },
    gWinResize: function () {
        var unitResize = function () {
            var ow = screen.width;
            //处理全局通用css
            if (ow <= 1152) {
                $('.w').css({ 'width': 1000 });
                $('.newTop-search').css({ 'width': 465 });
                $('.newTop-srh-input').css({ 'width': 215 });
                $('.J_search_city_box').width($('.newTop-search').width() - 2);
                $('.J-autocomp').css({ 'width': 225, 'left': 77 });
                $('#hjPagerThumb').hide();
                $('.newTop-inter').hide();
                if (_util.check.isIE6) {
                    $('#J_searchDestinationBox').width(378);
                    $('#j_advancedSearch').find('.advanced-search-mod').width(465);
                }
            }
        };
        unitResize();

    },
    gNav: function () {
        gMenu();//全局菜单
        gHoverEvent($('.nav-bar').children('li'));
        gHoverEvent($('#j_sjSnsItems').children('li'));
    },
    gTopBar: function () {
        loadUser();
        loadWeiXin();
        topRouteHistory();
        changeStartCity();
    },
    gTel: function () {
        var gtl = $('.j_Gtel');
        if (!gtl.get(0)) {
            return;
        }

        var dfr = function () {
            return $.ajax({
                url: _uzw.domain.wapi + '/api/UzaiHotline/GetUzaiHotline',
                type: 'GET',
                dataType: "jsonp",
                cache: true
            });
        };

        var refer = document.referrer;
        var urlHref = location.href.toLowerCase();
        var urlSearch = location.search.toLowerCase();

        try {
            //fix malformed URI sequence bug
            urlHref = decodeURIComponent(urlHref);
            urlSearch = decodeURIComponent(urlSearch);
        } catch (e) {
            urlHref = unescape(urlHref);
            urlSearch = unescape(urlSearch);
        }

        //SEM-百度^^4008792351^^r000000216^^http://www.uzai.com/outbound/europe-search-sh?utm_source=baidu&utm_medium=cpc&utm_term=列支敦士登旅行网&utm_content=欧洲-各小国&utm_campaign=新上海-出境-欧洲
        var ckName = 'uzwCooperateSource';
        var ck = _uzw.cookie.get(ckName);

        var unitCK = function () { // 链接无来源渠道参数
            gtl.text(_hotline);
            if(!refer) { // 非超级链接访问（如链接回车），删除cookie
                _uzw.cookie.del(ckName);
            } else if (refer.indexOf('uzai.com') < 0) {
                _uzw.cookie.set(ckName, ':::' + refer, 1);
            }
        };

        var unitFixHotline = function (item) {
            if (window._uzw !== 'undefined') {
                gtl.text(item.d || _hotline);//pc
            } else {
                gtl.html('<a href="tel:' + (item.d || _hotline) + '" >' + (item.d || _hotline) + '</a>'); //m
            }
            _uzw.cookie.set(ckName, item.a + ':' + item.d + ':' + item.e + ':' + urlHref, 1);
        };

        var unitEvt = function () {
            if (urlSearch) {
                _util.localStorage.cache('uzwGtel', 1, dfr, function (data) {
                    if (data) {
                        var lst = data.listUzaiDicTable;
                        var items = [];
                        var i, j, k, nt, ntArr, ntc, urlsid, iMin;

                        urlsid = _util.url.get('sourceid');

                        if (urlsid) {
                            //check url sourceid
                            for (i = 0; i < lst.length; i++) {
                                var sid = lst[i].e;
                                if (sid && sid.toLowerCase() === urlsid.toLowerCase()) {
                                    unitFixHotline(lst[i]);
                                    return;
                                }
                            }
                        }

                        for (i = 0, k = 0; i < lst.length; i++) {
                            nt = decodeURIComponent(lst[i].b).toLowerCase();
                            ntArr = nt.split('|');
                            for (j = 0; j < ntArr.length; j++) {
                                ntc = ntArr[j];
                                if (urlSearch.indexOf(ntc) > -1) {
                                    items[k] = lst[i];
                                    k++;
                                    break;
                                }
                            }
                        }

                        iMin = items[0];

                        for (i = 1; i < items.length; i++) { // 多来源，优先值小的优先
                            iMin = iMin.c < items[i].c ? iMin : items[i];
                        }

                        if (iMin) {
                            unitFixHotline(iMin);
                            return;
                        }
                    }
                    unitCK();
                });
            } else {
                unitCK();
            }
        };

        unitEvt();

    },
    topSearch: function () {
        topSearchFocus();
        topDrop();
        topAuto();
        topSearchDestination();
    },
    gAdTop: function () {
        var u = document.location.href.toLowerCase();

        //顶部广告
        var _gAds = function () {
            var topNotice = $('#j_uzaiTopNotice');
            var date = topNotice.attr('data-ck');
            var indexTopAds = $('#j_indexTopAds');
            var topCKName = "uzwNotice" + date;

            //corner hover
            var cornerHover = function () {
                var oimg = indexTopAds.find('img');
                var oinit = oimg.attr('data-init');
                var ohover = oimg.attr('data-hover');
                oimg.bind('mouseenter', function () {
                    oimg.attr('src', ohover);
                }).bind('mouseleave', function () {
                    oimg.attr('src', oinit);
                });
            };
            cornerHover();

            //顶部广告效果
            (function () {
                var adBox = topNotice.find('.sad-box'),
                    speed = 300,
                    interval = 2000;

                setTimeout(function () {
                    topNotice.animate({
                        height: 90
                    }, speed, 'linear', function () {
                        adBox.find('img').addClass('sad-restore');
                    });
                }, interval);
            })();

            if (!topNotice.length) {
                return;
            }

            if (_uzw.cookie.get(topCKName)) {
                topNotice.hide();
                indexTopAds.show();
                return;
            } else {
                topNotice.show();
                indexTopAds.hide();

                //关闭
                topNotice.find(".close").bind('click', function () {
                    topNotice.hide();
                    indexTopAds.show();
                    _uzw.cookie.set(topCKName, "1", 1);

                });
            }
        };

        //顶部广告
        _gAds();

        //通告
        //预热时间
        var _gNoticePreScope = {
            start: '2017/2/28 00:00:00',
            end: '2017/2/28 05:30:59'
        };
        //真实时间
        var _gNoticeScope = {
            start: '2016/01/15 23:00:00',
            end: '2016/01/16 06:00:00'
        };

        var _gNoticeInGAP = function (timeScope) {
            var nd = Date.parse(new Date());
            var ndstart = Date.parse(timeScope.start);
            var ndend = Date.parse(timeScope.end);
            if (nd >= ndstart && nd <= ndend) {
                return true;
            }
            return false;
        };

        if (_gNoticeInGAP(_gNoticePreScope)) {
            _util.file.load(_uzw.domain.cdn + "/content/v1/scripts/com/notice.js", null);

            if (_gNoticeInGAP(_gNoticeScope)) {
                var zxFlag = $('#hidSupplierFlag').val();
                if (zxFlag == '008') {
                    var btnos = $('.btn-order');
                    var submitOrder = $('.submit-order');
                    btnos.each(function() {
                        var oThis = $(this);
                        oThis.after("<input class='btn-order-maintain tc f18 yahei ' type='button' value='维护中...' />");
                        oThis.remove();
                    });
                    submitOrder.after("<input class='btn-order-maintain tc f18 yahei ' type='button' value='维护中...' />");
                    submitOrder.remove();
                }
            }
        }


    },
    gMaskBottom: function () {
        var sidebar = $('#j_globalSidebar');
        var u = document.location.href.toLowerCase();
        if (_env === 'dev' || u.indexOf('.uzai.com/clubmed') > -1 || u.indexOf(_uzw.domain.u) > -1 || u.indexOf(_uzw.domain.buy) > -1 || u.indexOf(_uzw.domain.pay) > -1 || u.indexOf(_uzw.domain.manager) > -1 || u.indexOf('utourvisa.uzai.com') > -1 || u.indexOf('uztype=manager') > -1) {
            return;
        }

        try {
            if (window.frameElement && window.frameElement.nodeName == "IFRAME") {
                //内嵌iframe页面
                return;
            }
        } catch (e) {

        }

        //不显示app mask
        if (typeof (_appMaskDel) != 'undefined') {
            return;
        }

        var w_u_a = 'http://www.uzai.com/app/?ly=fc';
        var w_u_b = 'http://www.uzai.com/app/iphone/travel';
        var w_u_c = 'http://mobile.uzai.com:8080/%E6%82%A0%E5%93%89%E6%97%85%E6%B8%B8.apk';
        var w_u_d = 'https://itunes.apple.com/cn/app/you-zai-lu-you-hd/id588951281?mt=8';

        var oBody = $('body');

        var htmAM = [];

        htmAM.push('<div class="app-mask-wrap" id="J_appMask">');
        htmAM.push('<div class="mask"></div>');

        htmAM.push('<div class="app-mask clearfix">');
        htmAM.push('<div class="w clearfix">');
        htmAM.push('<div class="app-main fl clearfix">');
        htmAM.push('<div class="app-uz fl icon-common-bulky png"></div>');
        htmAM.push('</div>');
        htmAM.push('<div class="app-download fr clearfix">');
        htmAM.push('<dl class="code-download tc fl">');
        htmAM.push('<dd><i class="icon-code icon-common-bulky"></i></dd>');
        htmAM.push('<dt class="f14">扫描二维码快速下载</dt>');
        htmAM.push('</dl>');
        htmAM.push('</div>');
        htmAM.push('<i class="app-mask-close pointer icon-common-bulky png"></i>');
        htmAM.push('</div>');
        htmAM.push('</div>');
        htmAM.push('</div>');

        oBody.append(htmAM.join(''));
        oBody.append('<div class="png app-mask-sidebar" id="J_appMaskArr"></div>');

        var oAM = $('#J_appMask');
        var oAMA = $('#J_appMaskArr');
        var amCKName = 'uzwAppNotice';
        var ow = screen.width;
        var sbbs = 230; // global sidebar init bottom value
        var sbbe = 100; // global sidebar bottom value for app mask close
        var flag = true;

        if (ow <= 1152) {
            var amAs = oAM.find('.app-slogan');
            amAs.find('dt').css({ 'font-size': '36px', 'padding-top': 10 });
            amAs.find('dd').css({ 'font-size': '32px', 'padding-top': 10 });
        }

        //open
        oAMA.on('click', function () {
            var o = $(this);
            o.removeClass('app-mask-sidebar-on');
            setTimeout(function () {
                oAM.addClass('app-mask-wrap-on');
                flag && sidebar.animate({ 'bottom': sbbs }, 800);
            }, 500);
        });

        //close
        oAM.on('click', '.app-mask-close', function () {
            oAM.removeClass('app-mask-wrap-on');
            setTimeout(function () {
                _uzw.cookie.set(amCKName, "1", 7);
                //little sidebar
                oAMA.addClass('app-mask-sidebar-on');
                flag && sidebar.animate({ 'bottom': sbbe }, 300);
            }, 500);

        });

        var gAppMask = function () {
            if (_util.check.isIE6) {
                $(window).bind("scroll", function () {
                    var w = $(window);
                    var ist = w.scrollTop() + w.height();
                    oAM.css("top", ist - oAM.height());
                    oAMA.css("top", ist - oAMA.height() - 20);
                    sidebar.css("top", ist - sidebar.height() - sbbs);
                });
            }

            if (_uzw.cookie.get(amCKName)) {
                oAMA.addClass('app-mask-sidebar-on');
                return;
            } else {
                oAM.addClass('app-mask-wrap-on');
                flag && sidebar.css({ 'bottom': sbbs });
            }
        };

        gAppMask();

    },
    gQuan: function () {

        if (1) {
            return;
        }

        //return;//活动还未开始
        if (_ug.city !== 'sh') {
            //return;
        }
        //代金券
        var oAM = $('#J_appMask');
        var sb = [];

        oAM.find('.app-mask').hide();

        //新增 begin
        sb.push('<div class="app-mask app-mask-new">');
        sb.push('<div class="w clearfix">');
        sb.push('<div class="d2 fr tc white f14 "><p class="icon-code icon-common-bulky"></p><p class="hide">扫描二维码快速下载</p></div>');
        sb.push('<i class="app-mask-close pointer icon-common-bulky png"></i>');
        sb.push('</div>');
        sb.push('</div>');
        //end

        oAM.append(sb.join(''));

    },
    gOrderSource: function () {

        var cpsR = document.referrer;
        var cpsH = location.href;
        var bdUTM = "utm_source=baidu&utm_medium=juejin";

        //钟良敏 20120827 modify  --begin
        var saveURLReferToCookie = function () {
            var cookiename = "uzaiURLRefer";
            var resulturl = _uzw.cookie.get(cookiename);

            if (resulturl) {
                try {
                    if (decodeURIComponent(resulturl) != 'https://www.baidu.com/') {
                        return;
                    }
                } catch (ee) {
                    if (unescape(resulturl) != 'https://www.baidu.com/') {
                        return;
                    }
                }
            }

            var referUrl = cpsR;     //上一次URL
            var currentUrl = cpsH;  //当前URL

            //console.log("referUrl" + referUrl);
            //console.log("currentUrl" + currentUrl);

            var sourceUrl = getSourceUrl(referUrl, currentUrl);
            //console.log("sourceUrl" + currentUrl);
            //console.log(sourceUrl);
            if (!sourceUrl && referUrl) {
                sourceUrl = referUrl;
            }
            else if (!sourceUrl && currentUrl) {
                sourceUrl = currentUrl;
            }
            if (sourceUrl.indexOf("utm_medium=juejin") > -1) {
                _uzw.cookie.set(cookiename, sourceUrl, 7);
            }
            else {
                _uzw.cookie.set(cookiename, sourceUrl, 1);
            }
        };

        var saveCPSReferToCookie = function () {
            var cookiename = "uzaiNewURLRefer";
            var resulturl = _uzw.cookie.get(cookiename);
            var referUrl = cpsR;      //上一次URL
            var currentUrl = cpsH;  //当前URL
            var sourceUrl = getSourceUrl(referUrl, currentUrl);

            if (sourceUrl) {
                if (sourceUrl.indexOf("utm_medium=juejin") > -1) {
                    _uzw.cookie.set(cookiename, sourceUrl, 7);
                }
                else {
                    _uzw.cookie.set(cookiename, sourceUrl, 1);
                }
                return;
            }
            if (resulturl) {
                return;
            }
            if (!sourceUrl && referUrl) {
                sourceUrl = referUrl;
            }
            else if (!sourceUrl && currentUrl) {
                sourceUrl = currentUrl;
            }

            if (sourceUrl.indexOf("utm_source=baidu&utm_medium=juejin")) {
                _uzw.cookie.set(cookiename, sourceUrl, 7);
            }
            else {
                _uzw.cookie.set(cookiename, sourceUrl, 1);
            }
        };

        var getSourceUrl = function (referUrl, currentUrl) {

            //referrer:bzclk.baidu.com/adrc.php?t=00KL00c00f7LB6_0xkfO0AggQ00XD3IH000005rur…%B8%E7%BD%91&tn=baidu&ie=utf-8&oq=%E6%82%A0%E5%93%89&f=3&rsp=0&inputT=5522"
            //href:www.uzai.com/?utm_source=baidu&utm_medium=pinpai&utm_term=BT-1-1&utm_content=BT-1&utm_campaign=BT"
            //http://bj.uzai.com/lvyoucn/dongbei?sougou&guonei&dongbei&utm_source=sogou-bj&utm_medium=search_cpc

            var sourceUrl;
            if (currentUrl.indexOf("?sem") > 0 && currentUrl.indexOf("utm_source=qunar") > 0) {
                if (referUrl.indexOf('www.baidu.com') > -1) {
                    sourceUrl = currentUrl;
                }
                else {
                    sourceUrl = referUrl;
                }
            }
            else if (currentUrl.indexOf("?sem") > 0 || currentUrl.indexOf("utm_source=") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("source") > 0 && currentUrl.indexOf("panku") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("sogou") > 0 && currentUrl.indexOf("utm_medium=") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("360") > 0 && currentUrl.indexOf("utm_medium=") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("haoid") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("edm=kuaiqian") > 0) {
                sourceUrl = currentUrl;
            }
            else if (currentUrl.indexOf("gclid") > 0 && !referUrl) {
                sourceUrl = 'www.baidu.com' + '--T;';
            }
            else if (currentUrl.indexOf("bdclkid") > 0 && !referUrl) {
                sourceUrl = 'www.google.com.hk' + '--T';
            }
            else if (currentUrl.indexOf("laokehu") > 0 && referUrl.indexOf("uzai") < 0) {
                sourceUrl = referUrl + '--currentUrl';
            }
            else if (currentUrl.indexOf("uzai") > 0 && referUrl.indexOf("yiqifa.com") > 0) {
                sourceUrl = referUrl;
            }
            else if (referUrl.indexOf("uzai") < 0) {
                sourceUrl = referUrl;
            }
            else if (currentUrl.indexOf("uzai") < 0) {
                sourceUrl = currentUrl;
            }

            return sourceUrl;
        };
        //钟良敏 20120827 modify  --end

        saveURLReferToCookie(); //保存ReferURL
        saveCPSReferToCookie(); //保存cpsReferURL

        //全站跟踪代码
        if (_env !== 'dev') {
            //_ug.track.init();
        }

    },
    gFriendLink: function () {
        var lni = $('#j_linkNavItems');
        lni.find('span.arrow-link').on('click', function () {
            var o = $(this);
            var op = o.parents('dl');
            var oh = op.hasClass('on');
            if (oh) {
                op.removeClass('on');
            } else {
                op.addClass('on');
            }
        });
    },
    gFullADSlide: function () {
        //广告滑动
        var fcs = $('.full-column-slide');
        if (!fcs.get(0)) {
            return;
        }

        $('.full-column-slide').each(function () {
            var o = $(this);

            var pager = o.find('.pager');
            var box = o.find('.box');
            var size = box.find('img').length;
            var ems = pager.children('em');
            var timer = 0;

            if (size == 1) {
                pager.hide();
                return;
            }

            var i = 0;

            var fade = function () {
                //next 索引
                var ni = i + 1;
                if (ni == size) {
                    ni = 0;
                }
                ems.eq(ni).click();
            };

            fade();

            //ems click
            ems.on('mouseenter', function () {
                var oo = $(this);
                var index = oo.index();
                oo.siblings('em').removeClass('on').end().addClass('on');

                var oas = box.find('a');
                oas.hide();
                oas.eq(index).show();

                i = index;

                var opic = oas.eq(index).find('img');
                var osrc = opic.attr('data-original');
                opic.hide().attr('src', osrc).fadeIn('slow');
            });

            // unit timer
            var _unitTimer = function () {
                return setInterval(function () {
                    var idx = ems.filter('.on').index();
                    var les = ems.length;
                    var vidx = idx + 1;
                    if (vidx >= les) {
                        vidx = 0;
                    }
                    ems.eq(vidx).trigger('mouseenter').trigger('mouseleave');//fix hehe
                }, 4000);
            };

            //clear hover timer
            o.on('mouseenter', function () {
                clearInterval(timer);
            }).on('mouseleave', function () {
                timer = _unitTimer();
            });

            timer = _unitTimer();

        });
    },
    gCallSpringFestival: function () {
        //春节期间客服时间修改 2017-01-27 至 2017-02-02
        try {
            if ($('.newTop-tel').length > 0) {
                var t;

                $.ajax({ type: 'HEAD', async: true }).success(function (data, status, xhr) {

                    t = xhr.getResponseHeader('Date');

                    var curDate = new Date(t),

                        month = curDate.getMonth() + 1;

                    //console.log('时间是：' + curDate.getFullYear() + '-' + month + '-' + curDate.getDate() + '  ' + curDate.getHours() + ':' + curDate.getMinutes() + ':' + curDate.getSeconds());

                    if (curDate.getFullYear() == '2017' && month == 1 && curDate.getDate() >= 27) {

                        $('.newTop-tel').find('i,span').hide();
                        $('.newTop-tel').css('background', 'url(http://r.uzaicdn.com/content/v1/images/common/callspringfestiva.jpg) no-repeat');

                    } else if (curDate.getFullYear() == '2017' && month == 2 && curDate.getDate() < 3) {

                        $('.newTop-tel').find('i,span').hide();
                        $('.newTop-tel').css('background', 'url(http://r.uzaicdn.com/content/v1/images/common/callspringfestiva.jpg) no-repeat');
                    }



                });
            }


        } catch (e) {
            console.log(e.Message);
        }
    }

};

$(function () {
    _uzw.web.init();
    _uzw.web.topSearch();
    loadUserOrderTip();
    // loadSideBarAd();
    clearIEError();
    if (_env === 'dev') {
        //$('#j_globalNav').find('.menu-list').remove();
    }
	HidePageElement();

});

//global img lazyload
function uzLazy(obj) {

    var _unitLazyload = function (wrap) {
        var imgs = wrap.find('img[data-original]');
        if (imgs.get(0)) {
            try {
                imgs.lazyload({
                    effect: "fadeIn"
                });
            } catch (ee) {

            }
        }
    };

    var _unitEvent = function () {
        if (obj instanceof jQuery && obj.get(0)) {
            _unitLazyload(obj);
        } else {
            var arr = (typeof obj === 'string') ? [obj] : obj;
            for (var i = 0, les = arr.length; i < les; i++) {
                var item = arr[i];
                var o = $('#' + item);
                if (!o.get(0)) {
                    o = $('.' + item);
                }
                if (o.get(0)) {
                    _unitLazyload(o);
                }
            }
        }
    };

    if (!$.fn.lazyload) {
        _util.file.load(_uzw.domain.cdnRandom() + '/content/libs/plugin/jquery.lazyload/jquery.lazyload.min.js', function () {
            _unitEvent();
        });
    } else {
        _unitEvent();
    }

}

//载入用户信息UI
function loadUser() {

    //用户等级
    var userGrade = _uzw.user.userGrade.toLowerCase();
    if (userGrade) {
        var reTxt = "注册会员";
        switch (userGrade) {
            case "a":
                reTxt = "注册会员";
                break;
            case "b":
                reTxt = "金卡会员";
                break;
            case "c":
                reTxt = "白金会员";
                break;
            case "d":
                reTxt = "钻石会员";
                break;
            case "e":
                reTxt = "奇迹会员";
                break;
            default:
                reTxt = "注册会员";
                break;
        }
        var reUrl = _uzw.domain.cdnRandom() + "/content/v1/images/common/" + userGrade + ".png";

        $('.userGrade').html("<a target='_blank' href='https://u.uzai.com/reg/UserGradeMember' title='" + reTxt + "'><img alt='" + reTxt + "' src='" + reUrl + "' /></a>");
    }

    //私家团用户登录状态
    if (location.href.toLowerCase().indexOf('dingzhi.uzai.com') > -1) {
        var o = $("#j_loginStatus"),
           dm = 'https:' + _uzw.domain.u;
        if (_uzw.user.userid) {
            o.html("<a href='" + dm + "/manage/personal-info'>" + _uzw.user.userName + "</a><a href='" + dm + "/loginout'>退出</a>");
        } else {
            o.html('<a href="' + dm + '/reguser" title="登录" rel="nofollow">登录</a><a href="' + dm + '/register" title="注册" rel="nofollow">注册</a>');
        }
    }

    //判断登录&&未登录
    if (_uzw.user.userid) {

        //处理特殊ID
        if (_uzw.user.userid === '9999999999999') {
            $('#j_newHeader').on('click','a', function () {
                var oa = $(this);
                var oat = $.trim(oa.text());
                if (oat !== '退出') {
                    return false;
                }
            });
        }

        var userCookie = _uzw.cookie.get('user');
        var userThird = _util.url.get(userCookie,'thirdPartyUserSource');
        var nHead = $('#j_newHeader');
        var uName = nHead.find('.J-userName');
        var station = $('.start-city-name').text();

        if (!$('.dlhy-member').get(0)) {  
            if ($('.start-city-name').get(0)) { 
                if ( station === '上海') {
                    if (userThird == 1) {
                        uName.after('<img class="dlhy-member" src="//r01.uzaicdn.com/content/v1/images/common/dlhy.png" alt="">');
                    }
                }
            }
        }

        var userName = _uzw.user.userName || _uzw.user.Mobile;
        var thumbName = userName.length > 15 ? userName.substring(0, 12) + '...' : userName;
        $('.J-userName').attr("href", "https://u.uzai.com/manage/personal-info").html(thumbName);
        $('.J-login').show();
        $('.J-login1').hide();
        $(".J-loginDiv").hide();
        $(".J-loginIngDiv").show();
        $(".J-verline").hide();

    } else {
        $('.J-login').hide();
        $('.J-login1').show();
        $(".J-loginDiv").show();
        $(".J-loginIngDiv").hide();
    }

    //下拉菜单
    var jm = $(".J-newMenu");
    if (jm.length) {
        jm.hover(function () {
            var o = $(this);
            o.find('.J-newMenu-a').addClass("newMenu-aCur");
            o.find('.J-newTab').show();
        }, function () {
            var o = $(this);
            o.find('.J-newMenu-a').removeClass("newMenu-aCur");
            o.find('.J-newTab').hide();
        });
    }
}

//获取用户订单信息
function loadUserOrderTip() {

    var uop = $('#j_newHeader').find(".userOrderPart2");
    if (!uop.get(0)) {
        return;
    }

    if (!_uzw.user.userid) {
        return;
    }

    var ck = _uzw.cookie.get('uzwTopUserTips');
    if (ck) {
        return;
    }

    var df = _uzw.apis.getUserInfo();

    df.done(function (data) {

        var sb = [];

        if (data && data.length) {
            var item = data[0];
            var d1 = parseInt(item.unOrderNum, 10);//未支持订单数量
            var d2 = parseInt(item.unDianPinNum, 10);//未回访数量
            var d3 = parseInt(item.isValidatePhone, 10);//手机是否验证
            var d4 = parseInt(item.isValidateEmail, 10);//邮箱是否验证
            var d5 = parseInt(item.userUB, 10);//U币数量

            uop.find("p").remove();

            uop.attr('data-unOrderNum', d1 || 0);
            uop.attr('data-unDianPinNum', d2 || 0);
            uop.attr('data-userUB', d5 || 0);

            if (d1 && d1 > 0) {
                sb.push("<p>您还有" + d1 + "笔订单未支付，<a href='https://u.uzai.com/manage/order'>去支付 &gt;&gt;</a></p>");
            }
            if (d2 && d2 > 0) {
                sb.push("<p>您还有" + d2 + "笔订单未点评，<a href='https://u.uzai.com/manage/tour-record'>去点评 &gt;&gt;</a></p>");
            }
            if (d3 && d3 === 0) {
                //sb.push("<p>完成<a class='b' href='https://u.uzai.com/manage/UserAccountSecurity/UserValidateOrModifyMobile?laiyuan=dingbu'>手机安全验证后，可获得100U币</a></p>");
            }
            if (d4 && d4 === 0) {
                //sb.push("<p>完成<a class='b' href='https://u.uzai.com/manage/UserAccountSecurity/UserValidateOrModifyEmail?laiyuan=dingbu'>邮箱安全验证后，可获得100U币</a></p>");
            }
            if (d5 && d5 >= 100) {
                //sb.push("<p>您还有U币数量：<b>" + d5 + "</b>,你可以去<a class='b' href='http://www.uzai.com/subject/tejia'>旅游特卖会</>看看</p>");
            }
        }

        if (sb.length) {
            //等新版本更新在去掉
            uop.hide().html(sb.join(''));
        }

    });

    uop.find('.closetip').on('click', function () {
        uop.hide();
        _uzw.cookie.set('uzwTopUserTips', '1', 7);
    });

}

//顶部微信事件
function loadWeiXin() {

    //送抵用券
    $(".J-quickreg").hover(function () {
        $(".J-popUb").show();
    }, function () {
        $(".J-popUb").hide();
    });

    //微信
    $(".J-newMenu-weixin").hover(function () {
        $(".J-newMenu-weixinTip").show();
    }, function () {
        $(".J-newMenu-weixinTip").hide();
    });
}

//顶部产品浏览记录
function topRouteHistory() {
    var head = $('#j_newHeader');
    var history = head.find('.newMenu-history');

    head.on('mousemove', '.newMenu-history', function () {
        var oThis = $(this);
        if (!history.find('.recently-browsing-history').get(0)) {
            $.ajax({
                url: '//aj.uzai.com/api/UzaiScanRecords/GetUzaiScanRecordsTop3',
                type: 'GET',
                dataType: 'jsonp',
                success: function (data) {
                    var iLen = data.length;
                    var sb = [];
                    var _substr = function (str, len) {
                        if (str.length > len) {
                            return str.substr(0, len) + '...';
                        } else {
                            return str;
                        }
                    };
                    sb.push('<div class="recently-browsing-history">');

                    if (data && iLen > 0) {
                        sb.push('<div class="rbh-hd clearfix">');
                        sb.push('<span class="fl"><i class="icon-record mr5 vm icon-common-part png"></i><em class="hd-cont red f14 vm">最近浏览记录</em></span>');
                        sb.push('<span class="empty-record pointer fr"><i class="icon-empty mr5 vm icon-common-part png"></i><em class="blue f13 u vm">清空全部浏览记录</em></span>');
                        sb.push('</div>');
                        sb.push('<div class="rbh-bd">');
                        sb.push('<ul class="browsing-list pb5">');

                        for (var i = 0; i < iLen; i++) {
                            var item = data[i];
                            var dt = item.Date;
                            var pn = item.ProductName;
                            var ppu = item.ProductPicURL;
                            var pp = item.ProductPrice;
                            var pu = item.ProductURL;
                            var tm = item.Time;
                            var utc = item.UzaiTravelClass;

                            sb.push('<li class="list-item clearfix">');
                            sb.push('<div class="donut-wrap"><i class="icon-donut icon-common-part png"></i></div>');
                            sb.push('<div class="item-date f666 tr">');
                            sb.push('<p class="f14">' + dt + '</p>');
                            sb.push('<p>' + tm + '</p>');
                            sb.push('</div>');
                            sb.push('<a href="' + pu + '" target="_blank" class="item-pic block fl">');
                            sb.push('<img src="' + ppu + '" alt="" class="g10 vm">');
                            sb.push('<span class="tag-type white">' + utc + '</span>');
                            sb.push('</a>');
                            sb.push('<dl class="item-main">');
                            sb.push('<dt class="im-hd"><a href="' + pu + '" target="_blank" title="' + pn + '">' + _substr(pn, 22) + '</a></dt>');
                            if (pp === 0) {
                                sb.push('<dd class="im-ft f666 tr">请电询</dd>');
                            } else {
                                sb.push('<dd class="im-ft f666 tr"><span><i class="price red">¥<em class="f18 b">' + pp + '</em></i>起</span></dd>');
                            }
                            sb.push('</dl>');
                            sb.push('</li>');
                        }
                        sb.push('</ul>');
                        sb.push('<div class="more-bar tc"><a href="http://www.uzai.com/myhistory" rel="nofollow" target="_blank" class="blue f14 u">查看更多浏览记录</a></div>');
                        sb.push('</div>');
                    } else {
                        sb.push('<div class="none-history tc"><i class="icon-none icon-common-bulky png"></i></div>');
                    }
                    sb.push('<span class="arrow f14 songti lh1"><em>◆</em><i>◆</i></span>');
                    sb.push('</div>');

                    history.append(sb.join(''));
                }
            });
        }
        oThis.find('.recently-browsing-history').show();
    }).on('mouseleave', '.newMenu-history', function () {
        var oThis = $(this);
        oThis.find('.recently-browsing-history').hide();
    });

    history.on('click', '.empty-record', function () {
        if (confirm('确定要清空全部浏览记录？')) {
            $.ajax({
                url: '//aj.uzai.com/api/UzaiScanRecords/DelRecord',
                type: 'GET',
                dataType: 'jsonp',
                success: function (data) {
                    if (data && data.Success === true) {
                        var oMB = $('#j_recentlyViewedBox').find('.mod-bd');
                        var rbh = history.find('.recently-browsing-history');

                        if (oMB.get(0)) {
                            oMB.empty().append('<div class="fruitless-box tc"><i class="icon-uz vm icon-history png"></i><span class="f666 f24">暂无数据</span></div>');
                        }

                        rbh.find('.rbh-hd').remove();
                        rbh.find('.rbh-bd').remove();
                        rbh.find('.none-history').remove();
                        rbh.prepend('<div class="none-history tc"><i class="icon-none icon-common-bulky png"></i></div>');
                    } else {
                        alert(data.Message);
                    }
                },
                error: function () {
                }
            });
        }
    });
}

//顶部出发城市更换
function changeStartCity() {
    var oSCW = $('#J_startCityWrap');

    oSCW.bind('mousemove', function () {
        var oT = $(this);
        oT.addClass('start-city-on');
    }).bind('mouseleave', function () {
        var oT = $(this);
        oT.removeClass('start-city-on');
    });
}

//搜索分类下拉
function topDrop() {
    //搜索框选择类型
    $("#J_srhBox").hover(function () {
        var o = $(this);
        $("#J_srhBoxVal").addClass("on");
        o.find(".J-srhSe").show();
        $('#J_searchDestinationBox').hide();
    }, function () {
        var o = $(this);
        $("#J_srhBoxVal").removeClass("on");
        o.find(".J-srhSe").hide();
    });


    $('#J_srhBox').find('.J-srhSe').find('a').bind('click', function () {
        var o = $(this);
        var op = o.parent('li');
        var ops = op.siblings('li');

        var ot = o.text();
        var ov = o.attr('val');

        $('#J_srhBoxVal').find('.city-name').text(ot);
        $('#srhInput').val(decodeURIComponent(ov));
        $('.J-srhSe').hide();

        ops.removeClass('on');
        op.addClass('on');

        return false;
    });

}

//搜索框目的地分类下拉
function topSearchDestination() {
    var oNSK = $("#newSearchkey");
    var oSDB = $('#J_searchDestinationBox');
    var oSCB = $('#J_searchCityBox');
    var oAS = $('#j_advancedSearch');
    var oASM = oAS.find('.advanced-search-mod');

    oNSK.on('click', function () {
        if (!$(this).val()) {
            oSCB.hide();
            oASM.hide();
            oSDB
                .show()
                .on('click', '.close-search', function () {
                    oSDB.hide();
                })
                .on('click', '.btn-empty', function () {
                    var oThis = $(this);
                    oThis.parents('.recently-search-items').remove();
                    return false;
                });
        }
    });

    oNSK.on('keyup', function () {
        oSDB.hide();
        oSCB.hide();
    });

    //高级搜索
    oAS.find('.cont-bar').on('click', function () {
        var jmc = $.fn.jsonMultiCalendar;

        !jmc && _util.file.load(_uzw.domain.cdn + '/content/libs/plugin/jsonmulticalendar/jsonmulticalendar.min.js');

        oSDB.hide();
        oASM
            .show()
            .on('click', '.close-search', function () {
                oASM.hide();
            });

        blankFix('j_advancedSearch', 'advanced-search-mod');

        //clear
        oASM.find('.unlimited').on('click', function () {
            var o = $(this);
            var op = o.parent('.list-item');
            if (!op.get(0)) {
                op = o.parent('.info-bd');
            }
            op.find('input').val('');
            op.find('input').prop('checked', false);
        });

        //日历控件事件
        var lidate = oAS.find('.list-date');
        var jcw = lidate.find('.jm-calendar-wrap');

        lidate.find('input').on('focus', function () {

            lidate.find('.after-calendar').hide();

            var o = $(this);
            var op = o.parent('.jm-calendar-wrap');
            var opa = op.children('.after-calendar');

            if (!opa.get(0)) {
                op.append('<div class="after-calendar ca-norm ca-norm-multi"></div>');
                opa = op.children('.after-calendar');
            }
            opa.show();
            opa.jsonMultiCalendar({
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                extCallBack: function (year, month) {
                    //选中
                    opa.find('.item').on('click', function () {
                        var oi = $(this);
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray');
                        if (!oiExp) {
                            var oiY = oi.attr('data-year');
                            var oiM = oi.attr('data-month');
                            var oiD = oi.attr('data-day');
                            o.val(oiY + '/' + oiM + '/' + (parseInt(oiD, 10) <= 9 ? ('0' + oiD) : oiD));
                            opa.hide();

                        }
                    });
                },
                preCallback: function (year, month) {//上月下月预回调

                }
            });

            blankFix('jm-calendar-wrap', 'after-calendar', function () {

            });

        });

        //submit form
        var fom = $("#j_advancedSearch").find('form');
        fom.submit(function () {
            var d = [];
            fom.find("input[name^=txtsuperdays]:checked").each(function () {
                var oo = $(this);
                d.push(oo.attr("data-day"));
            });
            $('#txtsuperdayReal').val(d.join('|'));
        });

        //价格事件
        var atn = oAS.find('input[type=number]');
        atn.on('keyup', function () {
            var e = /^\d+$/.test(this.value);
            e || (this.value = '');
        });

    });
}

//搜索自动完成
function topAuto() {
    var autocomp = $('.J-autocomp');
    var url = document.URL;
    var valueIndex = 0; //下拉引索
    var $li; //li
    var sl; //li的个数
    var ons = $("#newSearchkey");
    var srhInput = $('#srhInput');
    var srhSe = $('#J_srhBox').find('.J-srhSe');
    var _unitRouteType = function(type) {
        srhSe.find('a').each(function(index, el) {
            var oThis = $(this);
            var oVal = oThis.attr('val');

            if (oVal === type) {
                oThis.trigger('click');
            }
        });
    };

    _unitRouteType(srhInput.val()); // 初始化线路类型文本

    ons.bind("keyup", function (event) {

        var kid = (event.keyCode ? event.keyCode : event.which);
        var oo = $(this);
        var activeText, activeVal;

        if (kid == 13) {
            //回车
            if ($li.length) {
                active = autocomp.find('.active');
                activeVal = active.attr('data-val');
                if (active.hasClass('type-item')) {
                    activeText = active.attr('data-pre');
                } else {
                    activeText = active.find('.item-cont').text();
                }
                _unitRouteType(activeVal);
                oo.val(activeText);
            }
            autocomp.hide();
            autocomp.empty();
            checksearchkey();
        } else if (kid == 38) { // Up Arrow
            if ($li.length) {
                if (valueIndex > 0) {
                    valueIndex--;
                } else {
                    valueIndex = sl - 1;
                }

                if ($li.eq(valueIndex).hasClass('type-item')) {
                    activeText = $li.eq(valueIndex).attr('data-pre');
                } else {
                    activeText = $li.eq(valueIndex).find('.item-cont').text();
                }

                $li.removeClass("active").eq(valueIndex).addClass("active");
                _unitRouteType($li.eq(valueIndex).attr('data-val'));
                oo.val(activeText);
            }
        } else if (kid == 40) { // Dw Arrow
            if ($li.length) {
                if (valueIndex < sl - 1) {
                    valueIndex++;
                } else {
                    valueIndex = 0;
                }

                if ($li.eq(valueIndex).hasClass('type-item')) {
                    activeText = $li.eq(valueIndex).attr('data-pre');
                } else {
                    activeText = $li.eq(valueIndex).find('.item-cont').text();
                }

                $li.removeClass("active").eq(valueIndex).addClass("active");
                _unitRouteType($li.eq(valueIndex).attr('data-val'));
                oo.val(activeText);
            }
        } else if (kid != 40 && kid != 38 && kid != 37 && kid != 13 && kid != 39) {
            if (oo.val()) {
                oo.addClass("J_searchLoding");
                valueIndex = -1;
                var keyWord = $.trim(oo.val());
                keyWord = encodeURI(keyWord);
                var url_1 = _uzw.domain.wapi + "/search/wordlink?q=" + keyWord;
                var sNode = '';

                $.ajax({
                    url: url_1,
                    dataType: "JSONP",
                    cache: false,
                    type: "GET",
                    success: function (data) {
                        var item, subItem, subData, i, j, les;
                        if (data) {
                            autocomp.show();
                            for (i = 0, les = data.length; i < les; i++) {
                                item = data[i];
                                subData = item.TagRouteCategories;

                                sNode += '<li>';
                                sNode +=
                                '<p class="list-item auto-item clearfix" data-val="0">' +
                                    '<em class="item-cont fl">' + item.Name + '</em>' +
                                    '<span class="item-info fr">约<i>' + item.TotalProducts + '</i>个结果</span>' +
                                '</p>';

                                if (i === 0 && subData.length > 0 && srhInput.val() === '0') {
                                    sNode += '<ul class="type-list">';

                                    for (j = 0; j < subData.length; j++) {
                                        subItem = subData[j];

                                        sNode +=
                                        '<li class="list-item type-item clearfix" data-pre="' + item.Name + '" data-val="' + subItem.TravelRouteCategory + '">' +
                                            '<em class="item-cont fl">' + subItem.TravelRouteCategoryName + '</em>' +
                                            '<span class="item-info fr">约<i>' + subItem.ProductCount + '</i>个结果</span>' +
                                        '</li>';
                                    }

                                    sNode += '</ul>';
                                }

                                sNode += '</li>';
                            }
                            oo.removeClass("J_searchLoding");
                            autocomp.empty().append(sNode);
                            //$(".J-autocomp .auto-item:first").addClass("active");
                            $li = autocomp.find('.list-item');
                            sl = $li.length;
                        }
                    },
                    error: function () {
                        oo.removeClass("J_searchLoding");
                    }
                });
            } else {
                autocomp.empty().hide();
            }
        }
    });
    //全局关闭
    $(document).click(function (event) {
        if ($(event.target).attr("id") != "newSearchkey") {
            autocomp.hide();
            autocomp.empty();
        }
    });
    //点击搜索
    autocomp.on('click', '.list-item', function () {
        var oThis = $(this);
        var activeText;

        if (oThis.hasClass('type-item')) {
            activeText = oThis.attr('data-pre');
        } else {
            activeText = oThis.find('.item-cont').text();
        }

        _unitRouteType(oThis.attr('data-val'));
        ons.val(activeText);
        autocomp.hide();
        autocomp.empty();
        checksearchkey();
    });
    autocomp.on('mouseenter', '.list-item', function (e) {
        var oThis = $(this);
        autocomp.find('.list-item').removeClass("active");
        oThis.addClass("active");
    });
}

//搜索框Focus 事件
function topSearchFocus() {

    var nsk = $('#newSearchkey');
    var sdb = $('#J_searchDestinationBox');
    //2016-08-23 修改搜索框默认值 jiaozhanjing 开始
    var defaultVal = "目的地/关键字";
    if ($('#hfSearchBox').get(0)) {
        defaultVal = $('#hfSearchBox').val() || defaultVal;
    }

    var initKey = nsk.attr('data-old') || defaultVal; //"目的地/关键字"
    nsk.val(initKey);

    nsk.bind("focus", function () {
        if ($(this).val() == initKey) {
            $(this).val("");
        }
    });
    //2016-08-23 修改搜索框默认值 jiaozhanjing 结束
    nsk.bind("blur", function () {
        if (!$(this).val()) {
            $(this).val(initKey);
        }
    });

    nsk.bind('focus', function () {

        if ($(this).val() == initKey) {
            $(this).val("");
        }

        if (!$(this).val()) {

            var kn = "uzwSearchDrop-" + _ug.city;//localStorage 存储名

            var dfr = function () {
                var mydfr = $.ajax({
                    url: _uzw.domain.wapi + '/api/UzaiIndex/GetSearchMenu/?city=' + _ug.cityID,
                    dataType: "jsonp",
                    jsonp: "callback", //用以获得jsonp回调函数名的参数名
                    contentType: "application/json; charset=utf-8",
                    cache: true,
                    beforeSend: function () {
                        sdb.addClass('loading');
                    }
                });

                mydfr.fail(function () {
                    mydfr.doneExt();
                });

                mydfr.doneExt = function (mycb) {
                    setTimeout(function () {
                        sdb.removeClass('loading');
                        mycb && mycb();
                    }, 2000);
                };

                return mydfr;
            };

            _util.localStorage.cache(kn, 1, dfr, function (data) {
                if (data && data.length) {
                    var sb = [];
                    sb.push("<div class='floor'>&nbsp;</div>");
                    for (var i = 0, les = data.length; i < les; i++) {
                        var item = data[i];
                        var list = item.List;
                        if (list && list.length) {
                            if (i === 0) {
                                sb.push("<dl class='city-items city-items-first clearfix'>");
                            } else {
                                sb.push("<dl class='city-items clearfix'>");
                            }
                            sb.push("<dt>" + item.Title + "</dt>");
                            sb.push("<dd class='hot-city-list'>");
                            for (var j = 0, les2 = list.length; j < les2; j++) {
                                var atom = list[j];
                                sb.push("<a target='_blank' href='" + atom.URL + "'>" + atom.Title + "</a>");
                            }
                            sb.push("</dd>");
                            sb.push("</dl>");
                        }
                    }

                    sdb.html(sb.join(''));
                    sdb.show();
                }
            });

            //获取搜索记录
            $.ajax({
                type: 'get',
                cache: false,
                dataType: 'jsonp',
                url: '//aj.uzai.com/api/UzaiSearch/GetUzaiSearchLately',
                success: function (res) {
                    if (res && res.length) {
                        var ct = _ug.city;
                        var sb = [];
                        var i, les, item, surl;

                        if (sdb.find('.recently-search-items').get(0)) {
                            sb.push('<span class="btn-empty blue pointer">清空</span>');

                            for (i = 0, les = res.length; i < les; i++) {
                                item = res[i];
                                if (i < 10) {
                                    surl = _uzw.domain.search + '/' + ct + '/SearchResult?keyword=' + encodeURIComponent(item);
                                    sb.push('<a href="' + surl + '" target="_blank">' + item + '</a>');
                                }
                            }

                            sdb.find('.recently-search-items').find('.rsi-bd').html(sb.join(''));
                        } else {
                            if (!sdb.find('.floor').get(0)) {
                                sb.push("<div class='floor'>&nbsp;</div>");
                            }
                            sb.push('<span class="close-search pointer lh1"><i class="close-icon">&times;</i></span>');
                            sb.push('<dl class="recently-search-items f999">');
                            sb.push('<dt class="rsi-hd f14">您最近搜索</dt>');
                            sb.push('<dd class="rsi-bd">');
                            sb.push('<span class="btn-empty blue pointer">清空</span>');

                            for (i = 0, les = res.length; i < les; i++) {
                                item = res[i];
                                if (i < 10) {
                                    surl = _uzw.domain.search + '/' + ct + '/SearchResult?keyword=' + encodeURIComponent(item);
                                    sb.push('<a href="' + surl + '" target="_blank">' + item + '</a>');
                                }
                            }

                            sb.push('</dd>');
                            sb.push('</dl>');

                            sdb.prepend(sb.join(''));
                        }

                        //clear search history event
                        var clr = sdb.find('.btn-empty');
                        clr.bind('click', function () {

                            sdb.find('.recently-search-items').remove();

                            $.ajax({
                                type: 'get',
                                cache: false,
                                dataType: 'jsonp',
                                url: '//aj.uzai.com/api/UzaiSearch/ClearSearchKeywordByUser',
                                success: function (res) {

                                }
                            });
                        });
                    }
                }
            });

        }
        blankFix('J_searchDestinationWrap', 'J_searchDestinationBox');
    });

    nsk.bind('keyup', function () {
        sdb.hide();
    });

}

//清除IE错误
function clearIEError() {
    if (_ua.indexOf('msie') > -1) {
        window.onerror = function () {
            return true;
        };
    }
}

//判断搜索框原始值
function checksearchkey() {
    var searchkey = $("#newSearchkey").val();
    //2016-08-23 修改搜索框默认值 jiaozhanjing 开始
    if ($('#hfSearchBox').get(0)) {
        var linkUrl = $("#hfSearchBox").attr("link-url");

        //默认值和url同时存在  url优先匹配
        if (linkUrl && searchkey == $("#hfSearchBox").val()) {
            location.href = linkUrl;
            return;
        }
    }
    //2016-08-23 修改搜索框默认值 jiaozhanjing 结束
    if (searchkey === "目的地/关键字" || !searchkey) {
        $("#newSearchkey").focus();

        blankFix('J_searchDestinationWrap', 'J_searchDestinationBox');

        return;
    }
    else {
        $.ajax({
            type: 'get',
            cache: false,
            dataType: 'jsonp',
            url: _uzw.domain.wapi + '/api/UzaiInterest/IsProduct',
            data: { 'searchtxt': searchkey },
            success: function (data) {
                var paras;
                if (data && data === 1 && _uzw.user.userid) {
                    paras = {
                        "userId": _uzw.user.userid,//用户ID
                        "city": 0,//发起请求的城市站点，为0时取产品的出发城市
                        "channel": 1,//信息渠道：1 PC、2 IPhone、3 Ipad、4 Android、5 M站
                        "type": 6, //来源类型：1浏览历史、2我的收藏、3我的咨询、4意向订单、5支付订单、6关键词搜索、7自主点击不喜欢
                        "productIds": searchkey//productIds：相关产品ID，多个产品ID可以用","分隔
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
        });
        $("#indexsearchform").submit();
    }
}

//加入收藏
function uzaiAddFavorite(sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        }
        catch (ee) {
            window.alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}

function gMenu() {

    gJsonMenu();//全局菜单
    sjNavMenu();

    var oGN = $('#j_globalNav'),
        oNT = oGN.siblings('.newTop'),
        oNM = oGN.find('.nav-menu');

    //导航菜单
    oNM.find('.menu-list').children('li').hover(function () {
        var o = $(this);
        o.addClass("on");
        $('#J_searchDestinationBox').hide();
        $('#j_advancedSearch').find('.advanced-search-mod').hide();
        $('.J-autocomp').hide();
    }, function () {
        var o = $(this);
        o.removeClass("on");
    }).mouseover(function(){
		 var o = $(this);
        o.removeClass("on");	
	});

    oGN.on('mouseenter', function () {
        var o = $(this);
        o.addClass('global-nav-on');
        oNT.children('.w').addClass('newTop-on');
        //$('#J_searchDestinationBox').hide();
        //$('#j_advancedSearch').find('.advanced-search-mod').hide();
        //$('.J-autocomp').hide();
    }).on('mouseleave', function () {
        var o = $(this);
        o.removeClass('global-nav-on');
        oNT.children('.w').removeClass('newTop-on');
    }).on('mouseenter', '.nav-menu', function () {
        var o = $(this);
        o.addClass("on");
    }).on('mouseleave', '.nav-menu', function () {
        var o = $(this);
        o.removeClass("on");
    });


    //选中的前导航
    var hrf = location.href.toLowerCase();
    var uls = oGN.find('.nav-bar');
    var liks = uls.find('li').find('a');
    liks.each(function (k, v) {
        var o = $(this);
        var ohrf = o.attr('href');
        if (hrf === ohrf) {
            //o.addClass('on');
            var op = o.parent('li');
            var ops = op.parent('ul');
            if (ops.get(0)) {
                if (ops.hasClass('sub-nav-list')) {
                    ops.parents('li').children('.nav-item').addClass('on');//子菜单
                } else if (ops.hasClass('nav-bar')) {
                    o.addClass('on');
                }
            }
            return false;
        }
    });

    //选中首页
    if (_ug.cityPKG.isIndex() || _ug.cityPKG.isSubIndex()) {
        uls.children('li').eq(0).children('.nav-item').addClass('on');
    }

}

//全局菜单
function gJsonMenu() {

    var oG = $('#j_globalNav');

    if (!oG.get(0)) {
        return;
    }

    //菜单选中当前
    var lh = location.href.toLowerCase();
    var navItem = oG.find('.nav-bar').find('.nav-item');

    if (_ug.cityPKG.isIndex() || _ug.cityPKG.isSubIndex()) {
        return;
    }

    var kn = "uzwGlobalMenu-" + _ug.city; //localStorage 存储名

    var dfr = function () {
        return $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiIndex/GetIndexNav/?city=' + _ug.cityID,
            type: 'GET',
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            cache: true
        });
    };

    _util.localStorage.cache(kn, 1, dfr, function (data) {
        if (data) {
            var d = data;
            if (d.length) {
                for (var i = 0, les = d.length; i < les; i++) {
                    var row = d[i];
                    var v = row.v;

                    if (v.length) {
                        var ext = row.ext;
                        var sb = [];

                        sb.push("<div class='submenu-list clearfix'>");
                        sb.push("<ul>");
                        for (var m = 0, mles = v.length; m < mles; m++) {
                            var row2 = v[m];

                            var name = _util.unicode.un(row2.n);
                            var url = "http://" + row2.u;
                            var links = row2.i;

                            var first = (m === 0) ? "class='first'" : "";

                            sb.push("<li " + first + ">");
                            sb.push("<dl class='clearfix'>");
                            sb.push("<dt class='fl'><a target='_blank' href='" + url + "'>" + name + "</a></dt>");
                            sb.push("<dd>");
                            for (var n = 0, lkles = links.length; n < lkles; n++) {
                                var linkItem = links[n];
                                var lurl = "http://" + linkItem.split('|')[0];
                                var lname = _util.unicode.un(linkItem.split('|')[1]);
                                var lb = linkItem.split('|')[2]; //是否高亮
                                var strong = lb ? "class='strong'" : "";
                                sb.push("<a " + strong + " title='" + lname + "'  target='_blank' href='" + lurl + "'>" + lname + "</a>");
                            }
                            sb.push("</dd>");
                            sb.push("</dl>");
                            sb.push("</li>");
                        }
                        sb.push("</ul>");
                        sb.push("</div>");

                        oG.find('.menu-list').children('li').eq(i).find('.menu-list-item').after(sb.join(''));

                        //额外链接
                        if (ext) {
                            var sb2 = [];
                            if (ext[0]) {
                                sb2.push("<a class='submenu-cover' target='_blank' href='http://" + ext[0].u + "'><img alt='' src='//" + ext[0].p + "'></a>");
                                oG.find('.menu-list').children('li').eq(i).find('.menu-list-item').next('.submenu-list').append(sb2.join(''));
                            }
                        }
                    } else {
                        oG.find('.menu-list').children('li').eq(i).find('.menu-list-item').addClass('no-submenu-data');
                    }
                }
            }
        }
    });

}

// global hover event
// mecb: mouseenter callback
// mlcb: mouseleave callback
function gHoverEvent(obj, mecb, mlcb) {
    obj.on('mouseenter', function () {
        var oo = $(this);
        oo.addClass("on");
        mecb && mecb(oo);
    }).on('mouseleave', function () {
        var oo = $(this);
        oo.removeClass("on");
        mlcb && mlcb(oo);
    });
}

//特别注意：该事件必须在源事件触发后执行，节点隐藏后移除事件，禁止全局触发。
//点击文档，隐藏目标节点
//node 父节点
//targetNode 需要隐藏的目标节点
function blankFix(node, targetNode, callback) {
    var evt = function (e) {
        var nodeTag = $('#' + node).get(0) ? "#tag,#tag *" : ".tag,.tag *";
        nodeTag = _util.string.replaceAll(nodeTag, 'tag', node);
        if (!$(e.target).is(nodeTag)) {
            var tNode = $('#' + targetNode);
            if (!tNode.get(0)) {
                tNode = $('.' + targetNode);
            }
            tNode.hide();
            //解决性能问题
            $(document).unbind('click', evt);

            if (callback) {
                callback();
            }
            //console.log('NO不当前节点内部元素');
        } else {
            //console.log('YES是当前节点内部元素');
        }
    };

    $(document).bind('click', evt);
}

//防止window.onload事件重载
function winLoadFix(fn) {
    if (fn) {
        if (window.addEventListener) {
            window.addEventListener('load', fn, false);
        } else {
            window.attachEvent('onload', fn);
        }
    }
}

//统计热点,市场部人员使用，高级浏览器兼容
_ug.hotview = {
    get: function () {
        _util.file.load(_uzw.domain.cdn + "/content/v1/scripts/com/append.js");
    },
    set: function () {
        _util.file.load(_uzw.domain.cdn + "/content/v1/scripts/com/hotclick.js");
    }
};

//全站用户统计跟踪
_ug.track = {
    init: function () {
        _util.file.load(_uzw.domain.cdn + "/content/v1/scripts/com/track.js", null);
    }
};

//形如："www","sh"
function gaSiteTag() {
    var url = location.href;
    var citys = _ug.cityPKG.city;
    var tag = '';
    for (var i = 0, les = citys.length; i < les; i++) {
        var item = 'http://' + citys[i] + '.';
        if (url.indexOf(item) > -1) {
            tag = citys[i];
        }
    }
    return tag;
}

//形如："#source_shelf=shfp"
function gaChannelTag() {
    var url = location.href;
    var pathname = location.pathname;
    var channels = ['outbound', 'lvyoucn', 'neartravel', 'youlun'];
    var channelsTag = ['cp', 'fp', 'np', 'yl'];
    var tag = '';
    var site = gaSiteTag();
    for (var i = 0, les = channels.length; i < les; i++) {
        var item = '/' + channels[i];
        if (url.indexOf(item) > -1) {
            tag = site + channelsTag[i];
        }
    }
    if (tag) {
        return "#source_shelf=" + tag;
    } else {
        if (pathname == '/') {
            return "#source_shelf=" + site + "sy";
        }
    }
    return "";
}

//弹出行程日历
function popSchdule(pid, mine, url) {
    var oss = $('#j_scheduleSub');
    oss.remove();
    $('body').append("<div id='j_scheduleSub' class='ca-norm'><a class='close'>&times;</a></div>");
    oss = $('#j_scheduleSub');
    oss.jsonCalendar({
        jsonpUrl: 'http://sh.uzai.com/ashx/ashx_Calendar.ashx?pid=' + pid + '&type=1',
        latestDate: '',//初始最近班期
        isSmart: true,//是否是智能双日历
        extCallBack: function (year, month) {
            oss.find('td.item').find('a.block').each(function (k, v) {
                var oa = $(this);
                oa.attr({ 'target': '_blank', 'href': url });
            });
            //console.log(year, month);
        },
        preCallback: function (year, month) {//上月下月预回调
            //console.log(year, month);
        }
    });
    oss.find('a.close').on('click', function () {
        oss.remove();
    });
}

//私家团导航菜单
function sjNavMenu() {
    if (location.href.toLowerCase().indexOf('dingzhi.uzai.com') > -1) {
        var o = $('#j_navMenu').children('li');
        o.bind('mouseover', function () {
            var oo = $(this);
            oo.addClass("item-wrap-on");
        }).bind('mouseout', function () {
            var oo = $(this);
            oo.removeClass("item-wrap-on");
        });
    }
}

//首页，邮轮页面边栏广告
function loadSideBarAd() {

    var url = location.href.toLowerCase().replace('#', '');

    var ptype = _ug.pagePKG.getTag();

    if (url == 'http://cruise.uzai.com' || _ug.cityPKG.isSubIndex() || _ug.cityPKG.isIndex()) {

        if (_ug.cityPKG.getDistrictByCityID(_ug.cityID) == 1) {
            return;
        }

        var ckName = "uzwYlSideAd607";
        var ck = _uzw.cookie.get(ckName);
        if (ck) {
            return;
        }

        var u = "http://cruise.uzai.com/p-136027#t01a00w01a02071";
        var sb = [];

        sb.push("<div class='yl-sideAd ' id='j_ylSlideAd'>");
        sb.push("<a href='" + u + "' target='_blank' class='block'>");
        sb.push("<div class='sidebar'><div class='child'></div></div>");
        sb.push("<div class='txt'><div class='child'></div></div>");
        sb.push("<div class='bg'><div class='child'><div class='close'>&times;</div></div></div>");
        sb.push("<div class='ship'><div class='child'></div></div>");
        sb.push("</a>");
        sb.push("</div>");

        $('body').append(sb.join(''));

        $('#j_ylSlideAd').find('.close').on('click', function () {
            $('#j_ylSlideAd').hide();
            _uzw.cookie.set(ckName, '1', 1);
            return false;
        });

    }
}

// 导航菜单是否展示
function isDisplayNav() {
    var cookieCityId = $.cookie("CurrentSubStationId") === undefined || $.cookie("CurrentSubStationId") === "" ? 1 : $.cookie("CurrentSubStationId");
    $.ajax({
        type: "post",
        dataType: "jsonp",
        data: "text",
        url: "http://bj.uzai.com/ashx/ashx_topnav.ashx?cityId=" + cookieCityId,
        success: function (data) {
            if (data) {
                data = unescape(data);
                var htmlNav = data.substring(data.indexOf('id="j_globalNav"') + 17);
                htmlNav = htmlNav.substring(0, htmlNav.lastIndexOf("</div>"));
				var j_classbal=$("#j_globalNav").attr("class");
			    j_classbal=j_classbal.split(' ');
				for (var i = 0; i < j_classbal.length; i++) {
					if(j_classbal[i].indexOf('global-nav-')>-1){
						$("#j_globalNav").removeClass(j_classbal[i]);
					}
				}
				var cityBJ1= ['bj','sjz','ts','lf','cq','cd','tj','wh','xa','xg','se','sy','ty','zz','dl','cc','cs','jn','heb','qd','xm','gz','xg','se','km'];
				var citySH1= ['sh','hz','nb','jh','nj','wx','szh','cz','hf','nc'];
				var currentCity1=_ug.cityPKG.getCityByCityID(cookieCityId);
				for (var j = 0; j < cityBJ1.length; j++) {
					if(cityBJ1[j] == currentCity1){
						$("#j_globalNav").addClass("global-nav-bj");
					}
				}
			    for (var x = 0; x < citySH1.length; x++) {
					if(citySH1[x] == currentCity1){
						$("#j_globalNav").addClass("global-nav-sh");
					}
				}
                $("#j_globalNav").html(htmlNav);
            } else {
                console.info('html document is empty.');
            }
        }
    });
}

//隐藏页面元素
function HidePageElement()
{
	//$('.bar-main').find('p').eq(1).hide();
	//$('.nav-bar').find('li').each(function(){
		
	//	if($.trim($(this).find('a').eq(0).html())==='国内游')
	//	{
	//		$(this).hide();
	//	}
	//});
	//$('.menu-item-wrap-7').hide();
	//$('.p-last').hide();
	$('.foot-copyright').find('span').eq(0).hide();
	//$('.start-city-box').hide();
	$('#J_appMaskArr').hide();
	var url=location.href;
	if(url.indexOf('utour-about')>0)
	{
	    if(!$('.sidebar-bd').find('dl').eq(1).hasClass('grouping-pack'))
	    {
		    $('.sidebar-bd').find('dl').eq(1).hide();
	    }
	}

}