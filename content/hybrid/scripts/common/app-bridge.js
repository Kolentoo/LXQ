/**
 * Created by liuguozhu on 16/6/3.
 */


var bridge = (function (window, document, undefined) {
    'use strict';

    if (typeof (api) === 'undefined') {
        console.error('warning,please load api.js first!');
        return false;
    }

    var pageParam = {

        Url: '',
        IsTabBar: false,
        Content: {},
        TabBarIndex: 0,
        ServicesInfo: {},
        ClassInfo: {},
        GA: api.getLocalStorage('GA')
    },
        bridge = {};

    /*
    * 打开页面模块
    */

    //首页
    bridge.openIndex = function () {

        if (!api.isApp()) {
            window.location = 'http://m.uzai.com';
        } else {

            if (devicetype === 'ios') {
                pageParam.ClassName = 'UZHomeVC';
            } else if (devicetype === 'android') {
                pageParam.ClassName = 'MainActivityFragment';
            }
            api.invoke('open.page', JSON.stringify(pageParam));
        }
    };


    //会员等级
    bridge.openMemberLevel = function (memlevel) {
        var gaInfo = '->会员等级页';

        if (api.isApp()) {
            if (devicetype === 'ios') {
                pageParam.ClassInfo = { 'ClassName': 'UZMemberLevelVC', 'isStoryBoard': '0', storyBoardIdentifier: '' };
                pageParam.ServicesInfo = { 'serviceClass': 'UZLoginService', 'serviceName': '', serviceMethod: 'initWithService:' };
                pageParam.GA += gaInfo;
            } else if (devicetype === 'android') {
                pageParam.ClassInfo = { 'ClassName': 'com.uzai.app.activity.MemberLevelActivity' };
                pageParam.Content = { 'userLevel': memlevel };
                pageParam.GA += gaInfo;
            }
            api.invoke('open.page', encodeURI(JSON.stringify(pageParam)));
        }
    }

    //产品详情
    /*
    * travelType 产品类型  1,2,3：跟团
    * productId  产品Id
    * */
    bridge.openProduct = function (travelType, productId) {
        var isFree = false;                  //是否自由行,，默认为否
        var travelTypeName = '跟团游';        //类型名称
        if (travelType.toString() === '15' || travelType.toString() === '16' || travelType.toString() === '29' || travelType.toString() === '10') {
            isFree = true;
            travelTypeName = '自由行';
        }

        //GA信息
        var gaInfo = '->' + travelTypeName + '产品页';

        if (!api.isApp()) {
            //跟团url：http://m.uzai.com/waptour-129959.html
            //自由行url：http://m.uzai.com/trip/wap/129959.html
            var baseUrl = 'http://m.uzai.com/';
            //跟团
            var endUrl = 'waptour-' + productId + '.html';
            if (isFree) {
                endUrl = 'trip/wap/' + productId + '.html';
            }
            window.location = baseUrl + endUrl;
        } else {
            if (devicetype === 'ios') {
                // if (!isFree) {
                //     //跟团
                //     pageParam.ClassInfo = { 'ClassName': 'UZProductDetailVC', 'isStoryBoard': '0', storyBoardIdentifier: '' };
                // }
                // else
                // {
                //     pageParam.ClassInfo = { 'ClassName': 'UZProductInfoVC', 'isStoryBoard': '1', storyBoardIdentifier: 'ProductInfoVC' };
                // }
                pageParam.ClassInfo = { 'ClassName': 'UZProductInfoVC', 'isStoryBoard': '1', storyBoardIdentifier: 'ProductInfoVC' };
                pageParam.Content = { 'productId': productId, 'uzaiProductClassId': travelTypeName };
                pageParam.ServicesInfo = { 'serviceClass': 'UZProductService', 'serviceName': 'service', serviceMethod: '' };
                pageParam.GA += gaInfo;
            } else if (devicetype === 'android') {
                pageParam.ClassInfo = { 'ClassName': 'com.uzai.app.activity.ProductDetailUi540' };
                pageParam.Content = { 'ProductID': productId, 'UzaiTravelClass': travelTypeName };
                pageParam.GA += gaInfo;
            }
            api.invoke('open.page', encodeURI(JSON.stringify(pageParam)));
        }
    };

    //私人订制
    bridge.openDingzhi = function (udingzhitype) {
        var gaInfo = '->私人定制';
        if (api.isApp()) {
            if (devicetype === 'ios') {
                pageParam.ClassInfo = { 'ClassName': 'UZDingzhiYouVC', 'isStoryBoard': '0', storyBoardIdentifier: '' };
                pageParam.ServicesInfo = { 'serviceClass': 'UZHomeService', 'serviceName': 'service' };
                pageParam.Content = { 'webUrl': 'http://mdingzhi.uzai.com/hybrid/order/index.html?udingzhitype=' + udingzhitype };
                pageParam.GA += gaInfo;
            }
            else if (devicetype === 'android') {
                pageParam.Url = 'http://mdingzhi.uzai.com/hybrid/order/index.html?udingzhitype=' + udingzhitype;
                pageParam.GA += gaInfo;
            }
            api.invoke('open.page', encodeURI(JSON.stringify(pageParam)));
        }
        else {
            window.location.href = 'http://mdingzhi.uzai.com/order/index.html?udingzhitype=' + udingzhitype;
        }
    }

    //搜索结果
    /*
     * searchContent 是邮轮/海岛时,keyword为238,9896
     * productType 1跟团,2自由行,0全部
     * days 天数范围 1-2
     * appDayId APP天数范围Id
     * prices 价格范围 1-500
     * appPriceId APP价格范围Id
     * diamond 产品等级 3,4,5,6钻
     * orderby 排序 1热门推荐,2价格从低到高,3销量从高到低,5价格从高到低,6销量从低到高
     * */
    bridge.openSearch = function (searchContent, productType, days, prices, diamond, orderby, date, appPriceId, appDayId) {
        var className = '';
        var methedName = '';
        var dayId = 0;
        var priceId = 0;


        if (!api.isApp()) {
            var url = 'http://m.uzai.com/wd/?1=1&';
            if (days !== '' && typeof (days) !== 'undefined') {

                switch (days) {
                    case '1-2':
                        dayId = 1;
                        break;
                    case '3-5':
                        dayId = 2;
                        break;
                    case '6-8':
                        dayId = 3;
                        break;
                    case '8-?':
                        dayId = 4;
                        break;
                    default:
                        dayId = 0;
                        break;
                }
                if (dayId > 0) {
                    url += '&day=' + dayId;
                }
            }
            if (prices !== '' && typeof (prices)) {
                switch (prices) {
                    case '1-500':
                        priceId = 1;
                        break;
                    case '501-1000':
                        priceId = 2;
                        break;
                    case '1001-5000':
                        priceId = 3;
                        break;
                    case '5001-10000':
                        priceId = 4;
                        break;
                    case '10001-50000':
                        priceId = 5;
                        break;
                    case '50001-?':
                        priceId = 6;
                        break;
                    case '10001-?':
                        priceId = 5;
                        break;
                    default:
                        priceId = 0;
                        break;
                }
                if (priceId > 0) {
                    url += '&price=' + priceId;
                }
            }

            //http://m.uzai.com/wd/?day=2&price=3&date=2016-06-15&order=6&word=%E5%A4%8F%E5%A8%81%E5%A4%B7
            if (searchContent !== '' && typeof (searchContent) !== 'undefined') {
                url += '&word=' + encodeURIComponent(searchContent);
            }
            window.location.href = url;
            // window.location.href = 'http://m.uzai.com/wd/?day=' + days + '&price=3&date=2016-06-15&order=6&word=%E5%A4%8F%E5%A8%81%E5%A4%B7';
        } else {
            if (devicetype == 'ios') {
                // pricePara = appPriceId;
                // dayPara = appDayId;

                var param = {
                    UserID: api.getUserId(),
                    SearchContent: searchContent,
                    Keyword: '',
                    GoDate: date,
                    Days: appDayId,
                    Price: appPriceId,
                    Diamond: diamond,
                    Count: 15,
                    ProductType: productType,
                    TravelClassID: 0,
                    StartIndex: 1,
                    OrderBy: orderby
                };
                api.invoke('open.search', encodeURI(JSON.stringify(param)));
            }
            else if (devicetype == 'android') {
                if (priceId !== '' && typeof (priceId)) {
                    switch (appPriceId) {
                        case 0:
                            prices = '';
                            break;
                        case 1:
                            prices = '1-500';
                            break;
                        case 2:
                            prices = '501-1000';
                            break;
                        case 3:
                            prices = '1001-3000';
                            break;
                        case 4:
                            prices = '3001-5000';
                            break;
                        case 5:
                            prices = '5001-8000';
                            break;
                        case 6:
                            prices = '8001-10000';
                            break;
                        case 7:
                            prices = '10001-?';
                            break;
                        default:
                            prices = '';
                            break;
                    }

                    if (appDayId === 4) {
                        days = '9-11';
                    }
                    else if (appDayId === 11) {
                        days = '11-?';
                    }
                    else if (appDayId === 0) {
                        days = '';
                    }

                    var param = {
                        userID: api.getUserId(),
                        searchContent: searchContent,
                        keyword: '',
                        goDate: date,
                        days: days,
                        price: prices,
                        diamond: diamond,
                        count: 15,
                        productType: productType,
                        travelClassID: 0,
                        startIndex: 1,
                        orderBy: orderby
                    };
                    api.invoke('open.search', encodeURI(JSON.stringify(param)));
                }
            }
        }
    };


    /*
    *  调用组件模块
    */

    //添加到我的收藏
    bridge.addSubjectToFavorite = function () {
        if (api.isApp()) {
            api.invoke('action.collect', '');
        }
    };

    //取消收藏
    bridge.cancelSubjectFavorite = function (favoriteid) {
        if (api.isApp()) {
            var param = {
                favoriteid: favoriteid
            };
            api.invoke('action.cancelfavorite', encodeURI(JSON.stringify(param)));
        }
    };

    //分享
    /*
    * title    标题
    * content  简介
    * imageUrl 图片Url
    * pageUrl  页面Url
    * */
    bridge.shareSubject = function (title, content, imageUrl, pageUrl) {
        // console.log("share");
        var param = {
            Title: title,
            Content: content,
            ImageUrl: imageUrl,
            Url: pageUrl,
            GACategory: ''
        };
        if (api.isApp()) {
            api.invoke('action.share', encodeURI(JSON.stringify(param)));
        }
    };

    //复制会员俱乐部订单快递号
    bridge.copyExpress = function (code) {
        var copyParam = {
            Content: code
        };
        if (api.isApp()) {
            api.invoke('action.copy', encodeURI(JSON.stringify(copyParam)));
        }
    }

    //保存图片
    bridge.saveAlbum = function (strurl) {
        var copyParam = {
            Content: strurl
        };
        if (api.isApp()) {
            api.invoke('action.saveAlbum', encodeURI(JSON.stringify(copyParam)));
        }
    }
    /*
    *url 返回地址
    *islastpage 返回上一页
    *isrootpage 返回一级页面
    *calltype 跳转类型1为u圈定制返回，0默认返回
    * 返回页面模块
    */
    bridge.goBack = function (url, islastpage, isrootpage, calltype) {
        if (calltype == 1) {
            var backParam = {
                ClassInfo: {},
                GA: api.getLocalStorage('GA')
            }
            if (api.isApp()) {
                if (devicetype == 'ios') {
                    backParam.ClassInfo = { "ClassName": '', 'isLastPage': islastpage, 'isRootPage': isrootpage };
                }
                else if (devicetype == 'android') {
                    backParam.ClassInfo = { "ClassName": '', 'isLastPage': islastpage, 'isRootPage': isrootpage };
                }
                api.invoke('go.back', encodeURI(JSON.stringify(backParam)));
            }
            else {
                window.location.href = url;
            }
        }
        else {
            window.location.href = url;
        }
    }


    return bridge;



})(window, document);
