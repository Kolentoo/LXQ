var api = (function(window,document) {
    'use strict';

    var version = '1.0.3',

        devicetype = '',

        postTimes = 0,

        iosGetTimes = 0,

        apiUrlPre = 'MobileCommon/RequestWebApi/544',

        path = {
            dingzhilogic: 'http://mdingzhilogic.uzai.com/api/',
            msitelogic: 'http://msitelogic.uzai.com/api/',
            mhomelogic: 'http://mhomelogic.uzai.com/api/',
            mcurrencylogic: 'http://mcurrencylogic.uzai.com/api/',
            mproductlogic: 'http://mproductlogic.uzai.com/api/'
        },

        loginConfig = {
            from: document.referrer,
            forword: location.href
        },

        backUrl = 'javascript:history.go(-1)',

        serverVirtualDir = '',

        api = {},

        ios = {},

        android = {},

        asyncScript = [
            'a.mlinks.cc/scripts/dist/mlink.min.js',
            'r03.uzaicdn.com/content/hybrid/scripts/common/gmlinks.js',
            'www.google-analytics.com/analytics.js',
            'r03.uzaicdn.com/content/hybrid/scripts/common/pagestatistics.js'
        ];


    api = {

        version: version,

        path: path,

        backUrl: backUrl,

        serverVirtualDir: serverVirtualDir,

        __callback__: [],

        __iosCallback__: [],

        loginConfig: loginConfig,

        init: function() {

            if (api.isApp()) return false;

            window.addEventListener('DOMContentLoaded', function() {

                var arrayScript = [],
                    hasScripts = document.getElementsByTagName('script');


                for (var s = 0; s < hasScripts.length; s++) {
                    arrayScript = arrayScript.concat(hasScripts[s].getAttribute('src'));
                }

                arrayScript = arrayScript.toString();

                for (var a = 0; a < asyncScript.length; a++) {
                    var scripts = document.createElement('script');

                    if (arrayScript.indexOf(asyncScript[a]) < 0) {

                        //scripts.setAttribute('type', 'text/javascript');
                        scripts.setAttribute('async', 'async');
                        scripts.setAttribute('src', 'http://' + asyncScript[a]);

                        document.body.appendChild(scripts);
                    }

                }

            });


            return this;
        },

        //获取网址get方式的参数
        getQueryString: function(key, func) {
            if (!key || typeof(key) === 'undefined') {
                key = '';
                return null;
            } else {
                key = key.toLowerCase();
                var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
                var r = window.location.search.toLowerCase().substr(1).match(reg);
                if (r !== null) {
                    if (!func || func === '' || func == 'decodeURI' || typeof(func) == 'undefined') {
                        return decodeURI(r[2]);
                    } else if (func == 'unescape') {
                        return unescape(r[2]);
                    } else if (func == 'decodeURIComponent') {
                        return decodeURIComponent(r[2]);
                    }
                } else
                    return null;
            }
        },

        getValue: function(key, str, func) {
            if (!str || typeof(str) === 'undefined') {
                return str;
            } else {
                var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
                var r = str.substr(1).match(reg);
                if (r !== null) {
                    if (!func || func === '' || func == 'decodeURI' || typeof(func) == 'undefined') {
                        return decodeURI(r[2]);
                    } else if (func == 'unescape') {
                        return unescape(r[2]);
                    } else if (func == 'decodeURIComponent') {
                        return decodeURIComponent(r[2]);
                    }
                } else
                    return null;
            }
        },

        //获取cookie
        getCookie: function(key, func) {
            if (devicetype == 'ios') {
                return ios.getCookie(key);
            } else if (devicetype == 'android') {
                return android.getCookie(key);
            } else {

                var bikky = document.cookie;
                key += '=';
                var i = 0;
                while (i < bikky.length) {
                    var offset = i + key.length;
                    if (bikky.substring(i, offset) == key) {
                        var endstr = bikky.indexOf(';', offset);
                        if (endstr == -1) endstr = bikky.length;
                        var r = bikky.substring(offset, endstr);
                        if (r !== null) {
                            if (!func || func === '' || func == 'decodeURI' || typeof(func) == 'undefined') {
                                return decodeURI(r);
                            } else if (func == 'unescape') {
                                return unescape(r);
                            } else if (func == 'decodeURIComponent') {
                                return decodeURIComponent(r);
                            }
                        } else
                            return null;
                    }
                    i = bikky.indexOf(' ', i) + 1;
                    if (i === 0) {
                        return;
                    }
                }
                return null;
            }
        },

        //写入cookie
        setCookie: function(key, value, timeout) {

            if (!timeout || typeof(timeout) == 'undefined') {
                timeout = 0;
            } else {
                timeout = parseInt(timeout, 10);
            }

            if (devicetype == 'ios') {

                ios.setCookie(key, value, timeout);
            } else if (devicetype == 'android') {
                android.setCookie(key, value, timeout);
            } else {
                if (timeout === 0) {
                    document.cookie = key + '=' + value + ';domain=.uzai.com;path=/';
                } else {
                    var exp = new Date();
                    exp.setTime(exp.getTime() + timeout * 1000);
                    document.cookie = key + '=' + value + ';expires=' + exp.toGMTString() + ';domain=.uzai.com;path=/';
                }
            }
        },

        //移除cookie
        removeCookie: function(key) {
            if (devicetype == 'ios') {
                ios.removeCookie(key);
            } else if (devicetype == 'android') {
                android.removeCookie(key);
            } else {
                var exp = new Date();
                exp.setTime(exp.getTime() - 3600 * 24);
                var value = '';
                document.cookie = key + '=' + value + ';expires=' + exp.toGMTString() + ';domain=.uzai.com;path=/';
            }
        },

        //获取本地存储
        getLocalStorage: function(key) {
            return localStorage.getItem(key);
        },

        //存入本地存储
        setLocalStorage: function(key, value) {
            try {
                localStorage.removeItem(key);
                localStorage.setItem(key, value);
                return 1;
            } catch (_) {
                return 0;
                //alert('该功能无法使用，请关闭浏览器无痕模式（隐身模式）后重试');
            }
        },
        removeLocalStorage: function(key) {
            localStorage.removeItem(key);
        },
        loading: function() {
            var oldloading = document.getElementById('loading');
            if (oldloading !== null && typeof(oldloading) !== 'undefined') {
                return;
            } else {
                var loading = document.createElement('div');
                loading.className = 'loading';
                loading.id = 'loading';
                var loader = document.createElement('div');
                loader.className = 'loader';
                var backBtn = document.createElement('a');
                backBtn.className = 'loading-return-btn';

                backBtn.setAttribute('href', api.backUrl);

                for (var i = 0; i < 2; i++) {
                    var span = document.createElement('i');
                    loader.appendChild(span);
                }
                loading.appendChild(backBtn);
                loading.appendChild(loader);
                document.body.appendChild(loading);
            }
        },

        endloading: function() {
            var loading = document.getElementById('loading');
            if (loading !== null && typeof(loading) !== 'undefined') {
                document.body.removeChild(loading);
            }
        },

        toast: function(value, timeout) {
            var oldToast = document.getElementById("toast-pop");
            if (oldToast !== null && typeof(oldToast) !== 'undefined') {
                return;
            } else {
                if (!timeout || typeof(timeout) == 'undefined' || parseInt(timeout, 10) === 0) {
                    timeout = 3000;
                }
                var pop = document.createElement('div');
                pop.className = 'common-pop';
                pop.id = 'toast-pop';
                pop.innerHTML = value;
                document.body.appendChild(pop);
                setTimeout(function() {
                    var pop = document.getElementById('toast-pop');
                    if (pop !== null && typeof(pop) !== 'undefined') {
                        document.body.removeChild(pop);
                    }
                }, timeout);
            }

        },
        //获取接口
        post: function($http, $scope, path, controller, action, param, callback, timeout, needLogin) {
            var useCache = true;
            if (!timeout || typeof(timeout) == 'undefined' || parseInt(timeout, 10) === 0) {
                timeout = 0;
                useCache = false;
            }

            if (devicetype == 'ios') {
                ios.post($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin);
            } else if (devicetype == 'android') {
                android.post($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin);
            } else {
                api.loading();

                var user = api.getCookie('user');
                if (!needLogin && typeof(needLogin) == 'undefined') {
                    if (param.toLowerCase().indexOf('user') > -1 && (!user || user === '' || user === '0' || typeof(user) == 'undefined')) {
                        needLogin = true;
                    } else {
                        needLogin = false;
                    }

                } else if (needLogin === false) {
                    needLogin = false;
                }

                if (needLogin) {
                    location.href = 'https://u.uzai.com/mobile/Login?reurl=' + location.href;
                } else {
                    postTimes++;
                    api.__callback__.push([postTimes, callback, $scope]);

                    var url = '/data/post';
                    if (api.serverVirtualDir !== '') {
                        url = '/' + api.serverVirtualDir + url;
                    }
                    var apiParam = {
                        path: path,
                        controller: controller,
                        action: action,
                        param: param,
                        useCache: useCache
                    };

                    var config = {
                        timeout: 20000
                    };



                    var sParam = JSON.stringify(apiParam),
                        sessionData = sessionStorage.getItem(sParam);

                    if (sessionData !== null && sessionData !== '') {

                        sessionData = JSON.parse(sessionData);
                        var sessionTime = sessionData.sTime,
                            localTime = new Date();


                        sessionTime = new Date(Date.parse(sessionData.sTime));
                        var timeResult = localTime - sessionTime;



                        if (timeResult <= timeout * 60000) {
                            api.endloading();
                            callback(sessionData);
                            return;
                        }

                    }

                    $http.post(url, apiParam, config).success(function(data, status) {
                        api.endloading();

                        if (data.ErrorCode === 200 && timeout > 0) {
                            var sTime = new Date();
                            data.sTime = sTime;

                            var sData = JSON.stringify(data);
                            sessionStorage.setItem(sParam, sData);
                        }

                        callback(data);

                    }).error(function(data, status) {
                        api.endloading();
                        data = {
                            ErrorCode: -3,
                            ErrorMsg: '服务请求超时，请重试'
                        };
                        callback(data);
                    });




                }

            }
        },



        callback: function(index, data) {
            var currentArray = [];
            for (var i = 0; i < api.__callback__.length; i++) {
                if (api.__callback__[i][0] == index) {
                    currentArray = api.__callback__[i];
                    api.__callback__.splice(i, 1);
                    break;
                }
            }
            if (currentArray.length > 2) {
                currentArray[2].$apply(function() {
                    currentArray[1](data);
                });
            }
            api.endloading();

        },

        iosCallback: function(action, key, value, index, callbackData) {
            ios.callback(action, key, value, index, callbackData);
        },

        getUserId: function() {
            if (devicetype == 'ios') {
                return api.getLocalStorage('userid');
            } else if (devicetype == 'android') {
                return window.cookie.getUserId();
            } else {
                var user = api.getCookie('user');
                if (!user || typeof(user) == 'undefined' || user.length < 5) {
                    return null;
                } else {
                    return api.getValue('userid', user);
                }
            }
        },

        login: function(from, forword) {
            if (!from || typeof(from) == 'undefined') {
                api.loginConfig.from = from;
            }

            if (!forword || typeof(forword) == 'undefined') {
                api.loginConfig.forword = forword;
            }

            var loginParam = JSON.stringify(api.loginConfig);
            if (devicetype == 'ios') {
                ios.invokeApp('action.login', loginParam);
            } else if (devicetype == 'android') {
                window.action.exec('login', loginParam);
            } else {
                location.href = 'https://u.uzai.com/mobile/Login?reurl=' + forword;
            }
        },

        checkLogin: function(callback) {
            if (devicetype == 'ios') {
                ios.checkLogin(callback);
            } else if (devicetype == 'android') {
                android.checkLogin(callback);
            } else {
                var user = api.getCookie('user');
                if (!user || typeof(user) == 'undefined' || user.length < 5) {
                    location.href = 'https://u.uzai.com/mobile/Login?reurl=' + location.href;
                } else {
                    callback();
                }
            }
        },

        logout: function() {
            if (devicetype == 'ios') {
                ios.logout();
            } else if (devicetype == 'android') {
                android.logout();
            } else {
                api.removeCookie('user');
                location.href = 'https://u.uzai.com/mobile/Login';
            }
        },

        invoke: function(action, param) {
            if (devicetype == 'ios') {
                ios.invokeApp(action, param);
            } else if (devicetype === 'android') {
                window.action.exec(action, param);
            }
        },

        isApp: function() {
            if (devicetype === 'ios' || devicetype === 'android') {
                return true;
            } else {
                return false;
            }
        },

        // router
        router: function($http, $scope, $compile) {

            if (devicetype == 'ios') {
                // ios

            } else if (devicetype === 'android') {
                // android

            } else {

                // 执行一下
                router_init($http, $scope, $compile);

                // 监听url改变
                window.addEventListener('hashchange', function() {

                    router_init($http, $scope, $compile);

                });
            }
        },
        routerArray: []

    };

    function router_init($http, $scope, $compile) {

        var viewId = window.location.hash.slice(1).replace('/', '');

        // 判断之前是否加载过
        var div = document.getElementById('J_router_' + viewId);

        if (viewId && div === null) {

            api.routerArray = api.routerArray.concat(viewId);
            router($http, $scope, $compile, viewId);

        } else {

            for (var i = 0; i < api.routerArray.length; i++) {

                var arrayDiv = document.getElementById('J_router_' + api.routerArray[i]),
                    arrayDivStatus = arrayDiv.className;

                if (arrayDivStatus.indexOf('J-router-show') < 0 && api.routerArray[i] == viewId) {

                    arrayDiv.className += ' J-router-show';

                } else {

                    arrayDiv.className = arrayDiv.className.replace('J-router-show', '');

                }

            }

        }

    }

    // router方法

    function router($http, $scope, $compile, viewId) {

        api.loading();

        var path = window.location.origin + window.location.pathname,
            getURL = '',
            urlArray = [];

        if (path.indexOf('.html') > -1) {
            urlArray = path.split('/');
            path = '';
            for (var x = 0; x < urlArray.length - 1; x++) {
                path += urlArray[x] + '/';
            }
        }

        if (path !== '' && path.substr(path.length - 1, 1) !== '/') {
            path +=  '/';
        }

        getURL = path + viewId + '.html';
        $http.get(getURL).success(function(data) {

            var angular = window.angular,
                getData = angular.element(data),
                el = $compile(getData)($scope),
                createElement = document.createElement('section');

            createElement.id = 'J_router_' + viewId;
            createElement.className += 'J-router J-router-' + viewId;

            angular.element(document.body).append(createElement);
            angular.element(createElement).append(el).addClass('J-router-show');

            api.endloading();

        }).error(function(data) {

            console.error('API 路由： GetURL错误~');
            api.endloading();

        });


    }

    window.devicetype = devicetype = api.getQueryString('devicetype');

    android = {

        getCookie: function(key) {
            var value = '';
            if (key == 'userid') {
                try {
                    value = window.cookie.getUserId();
                } catch (e) {
                    alert(e.message);
                }
            } else {
                try {
                    window.cookie.getCookie(key);
                } catch (e) {
                    alert(e.message);
                }
            }
            return value;

        },
        setCookie: function(key, value, timeout) {

            if (!timeout || typeof(timeout) == 'undefined') {
                timeout = 0;
            }

            window.cookie.setCookie(key, value, timeout);


        },

        removeCookie: function(key) {

            try {
                window.cookie.removeCookie(key);
            } catch (e) {
                alert(e.message);
            }

        },
        checkLogin: function(callback) {
            var userid = android.getCookie('userid');
            if (!userid || typeof(userid) == 'undefined') {

                var loginParam = JSON.stringify({
                    from: location.href
                });
                window.action.exec('login', loginParam);
            } else {
                callback();
            }
        },
        logout: function() {
            android.removeCookie('user');
            var loginParam = JSON.stringify({
                from: location.href,
                forward: location.href
            });
            try {
                window.action.exec('login', loginParam);
            } catch (e) {
                alert(e.message);
            }
        },

        post: function($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin) {
            api.loading();
            postTimes++;
            api.__callback__.push([postTimes, callback, $scope]);

            var userid = android.getCookie('userid');
            if (!needLogin && typeof(needLogin) == 'undefined') {
                if (param.toLowerCase().indexOf('user') > -1 && (!userid || userid === '' || userid === '0' || typeof(userid) == 'undefined')) {
                    needLogin = true;
                } else {
                    needLogin = false;
                }

            } else if (needLogin === false) {
                needLogin = false;
            }
            if (needLogin === true) {
                var loginParam = JSON.stringify(api.loginConfig);
                try {
                    window.action.exec('login', loginParam);
                    callback({
                        ErrorCode: -2,
                        ErrorMsg: '未登录'
                    });
                } catch (e) {
                    alert('调用Android登录失败，' + e.message);
                }

            } else {
                var apiParam = '';
                if (param && typeof(param) != 'undefined') {
                    apiParam = JSON.stringify({
                        Path: path.replace(/:/g, '：'),
                        ControllerName: controller,
                        ActionName: action,
                        PostData: JSON.parse(param)
                    });
                } else {
                    apiParam = JSON.stringify({
                        Path: path.replace(/:/g, '：'),
                        ControllerName: controller,
                        ActionName: action,
                        PostData: {}
                    });
                }

                try {
                    window.action.invoke(postTimes, apiUrlPre, apiParam, timeout);

                } catch (e) {
                    alert(e.message);
                }

            }
        },

    };


    ios = {

        invokeApp: function(action, param) {

            if (api.getCookie('hybridversion') === '2') {
                window.action.execParam(action,param);
            }
            else {
                var iframe;
                iframe = document.createElement('iframe');
                iframe.setAttribute('src', action + '://' + param);
                iframe.setAttribute('style', 'display:none;');
                iframe.setAttribute('height', '0px');
                iframe.setAttribute('width', '0px');
                iframe.setAttribute('frameborder', '0');
                document.body.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            }
        },


        callback: function(action, key, value, index) {
            var currentArray = [];
            for (var i = 0; i < api.__iosCallback__.length; i++) {
                if (api.__iosCallback__[i][0] == index) {
                    currentArray = api.__iosCallback__[i];
                    api.__iosCallback__.splice(i, 1);
                    break;
                }
            }

            if (currentArray.length > 3) {
                currentArray[3](value);
            }
        },
        //
        getCookie: function(key) {
            var values="";
            try {
                 values = window.cookie.getCookie(key);
            }
            catch(e)
            {
                alert('ios cookie'+e.message);
            }
            if (values !== null && typeof(values) !== 'undefined') {
                var nowTime = (new Date()).getTime();
               var obj= JSON.parse(values);
                if (obj.expireTime === 0) {
                    return obj.value;
                } else if (nowTime <= obj.expireTime) {
                    return obj.value;
                }
                else {
                  return '';
                }
            }
        },
        setCookie: function(key, value, timeout) {

            var nowTime = new Date();
            var expireTime = 0;
            var values ={
                value: value,
                expireTime: expireTime
            };
            if (timeout > 0) {
                values.expireTime  = new Date(nowTime.getTime() + timeout * 60000).getTime();
            }
            window.cookie.setCookieValue(key, JSON.stringify(values));
        },

        removeCookie: function(key, index) {
            var param;
            if (key == 'user') {
                param = JSON.stringify({
                    index: index
                });
                ios.invokeApp('user.remove', index);

            } else {
                param = JSON.stringify({
                    index: index,
                    key: key
                });
                ios.invokeApp('cookie.remove', param);
            }

        },
        checkLogin: function(callback) {
            var userid = api.getLocalStorage('userid');

            if ((!userid || userid === '' || typeof(userid) == 'undefined')) {
                var loginParam = JSON.stringify({
                    from: location.href
                });
                ios.invokeApp('action.login', loginParam);
            } else {
                callback();
            }


        },
        logout: function() {
            iosGetTimes++;
            api.__iosCallback__.push([iosGetTimes, 'removeMemberID', 'user', function() {
                var loginParam = JSON.stringify({
                    action: 'login',
                    from: location.href,
                    forward: location.href
                });
                ios.invokeApp('action.exec', loginParam);
            }]);
            ios.removeCookie('user', iosGetTimes);
        },
        post: function($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin) {


            api.loading();
            postTimes++;
            api.__callback__.push([postTimes, callback, $scope]);
            var url = '/api/' + apiUrlPre;

            var invokeParam;
            if (param && typeof(param) != 'undefined') {
                var apiParam = {
                    Path: path.replace(/:/g, '：'),
                    ControllerName: controller,
                    ActionName: action,
                    PostData: JSON.parse(param)
                };
                invokeParam = encodeURI(JSON.stringify({
                    index: postTimes,
                    url: url,
                    param: apiParam,
                    usecache: timeout
                }));
            } else {

                invokeParam = encodeURI(JSON.stringify({
                    index: postTimes,
                    url: url,
                    param: {},
                    usecache: timeout
                }));
            }

            if (!needLogin && typeof(needLogin) == 'undefined') {
                if (param.toLowerCase().indexOf('user') > -1) {
                    needLogin = true;
                } else {
                    needLogin = false;
                }

            } else if (needLogin === false) {
                needLogin = false;
            }

            var userid = api.getLocalStorage('userid');


            if (needLogin === true && (!userid || userid === '' || typeof(userid) == 'undefined')) {
                var loginParam = JSON.stringify(api.loginConfig);
                ios.invokeApp('action.login', loginParam);
            } else {
                ios.invokeApp('action.invoke', invokeParam);
            }

        }

    };

    api.init();

    return api;
})(window,document);
