"use strict";

(function (window, undefined) {

    var version = "1.0.0";
    var devicetype = "";
    var postTimes = 0;
    var iosGetTimes = 0;
    var apiUrlPre = "MobileCommon/RequestWebApi/544";
    var path = {
        dingzhilogic: 'http://mdingzhilogic.uzai.com/api/',
        msitelogic: 'http://localhost:8030/api/'
    };

    var loginConfig = {
        from: document.referrer,
        forword: location.href
    };

    var backUrl = "javascript:history.go(-1)";

    api = function (selector, context) {
        return api.prototype.init();
    };


    api = api.prototype = {

        version: version,

        init: function () {
            return this;
        },

        path: path,

        backUrl: backUrl,

        __callback__: [],

        __iosCallback__: [],

        //获取网址get方式的参数
        getQueryString: function (key, func) {
            if (!key || typeof (key) === 'undefined') {
                key = "";
                return null;
            }
            else {
                key = key.toLowerCase();
                var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                var r = window.location.search.toLowerCase().substr(1).match(reg);
                if (r) {
                    if (!func || func == "decodeURI" || typeof (func) === 'undefined') {
                        return decodeURI(r[2]);
                    }
                    else if (func == 'unescape') {
                        return window.unescape(r[2]);
                    }
                    else if (func == 'decodeURIComponent') {
                        return decodeURIComponent(r[2]);
                    }
                } else
                    return null;
            }
        },
        getValue: function (key, str, func) {
            if (!str || typeof (str) === 'undefined') {
                return str;
            }
            else {
                var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                var r = str.substr(1).match(reg);
                if (r) {
                    if (!func || func == "decodeURI" || typeof (func) == 'undefined') {
                        return decodeURI(r[2]);
                    }
                    else if (func == 'unescape') {
                        return window.unescape(r[2]);
                    }
                    else if (func == 'decodeURIComponent') {
                        return decodeURIComponent(r[2]);
                    }
                } else
                    return null;
            }
        },
        //获取cookie
        getCookie: function (key) {
            if (devicetype == 'ios') {
                return ios.getCookie(key);
            }
            else if (devicetype == 'android') {
                return android.getCookie(key);
            }
            else {

                var bikky = document.cookie;
                key += "=";
                var i = 0;
                while (i < bikky.length) {
                    var offset = i + key.length;
                    if (bikky.substring(i, offset) == key) {
                        var endstr = bikky.indexOf(";", offset);
                        if (endstr == -1) endstr = bikky.length;
                        return window.unescape(bikky.substring(offset, endstr));
                    }
                    i = bikky.indexOf(" ", i) + 1;
                    if (i === 0) {
                        break;
                    }
                }
                return null;
            }
        },
        //写入cookie
        setCookie: function (key, value, timeout) {

            if (!timeout || typeof (timeout) == 'undefined') {
                timeout = 0;
            } else {
                timeout = parseInt(timeout, 10);
            }
            if (devicetype == 'ios') {

                ios.setCookie(key, value, timeout);
            }
            else if (devicetype == 'android') {
                android.setCookie(key, value, timeout);
            }
            else {
                if (timeout === 0) {
                    document.cookie = key + "=" + value + ";domain=.uzai.com;path=/";
                }
                else {
                    var exp = new Date();
                    exp.setTime(exp.getTime() + timeout * 1000);
                    document.cookie = key + "=" + value + ";expires=" + exp.toGMTString() + ";domain=.uzai.com;path=/";
                }
            }
        },
        //移除cookie
        removeCookie: function (key) {
            if (devicetype == 'ios') {
                ios.removeCookie(key);
            }
            else if (devicetype == 'android') {
                android.removeCookie(key);
            }
            else {
                var exp = new Date();
                exp.setTime(exp.getTime() - 3600 * 24);
                var value = '';
                document.cookie = key + "=" + value + ";expires=" + exp.toGMTString() + ";domain=.uzai.com;path=/";
            }
        },
        //获取本地存储
        getLocalStorage: function (key) {
            return localStorage.getItem(key);
        },
        //存入本地存储
        setLocalStorage: function (key, value) {
            try {
                localStorage.removeItem(key);
                localStorage.setItem(key, value);
                return 1;
            }
            catch (_) {
                return 0;
                //alert("该功能无法使用，请关闭浏览器无痕模式（隐身模式）后重试");
            }
        },
        removeLocalStorage: function (key) {
            localStorage.removeItem(key);
        },
        loading: function () {
            var loading = document.createElement("div");
            loading.className = "loading";
            loading.id = "loading";
            var loader = document.createElement("div");
            loader.className = "loader";
            var backBtn = document.createElement("a");
            backBtn.className = "loading-return-btn";

            backBtn.setAttribute('href', api.backUrl);

            for (var i = 0; i < 2; i++) {
                var span = document.createElement("i");
                loader.appendChild(span);
            }
            loading.appendChild(backBtn);
            loading.appendChild(loader);
            document.body.appendChild(loading);
        },

        endloading: function () {
            var loading = document.getElementById('loading');
            document.body.removeChild(loading);
        },

        toast: function (value, timeout) {
            if (!timeout || typeof (timeout) == 'undefined' || parseInt(timeout, 10) === 0) {
                timeout = 3000;
            }
            var pop = document.createElement("div");
            pop.className = "common-pop";
            pop.id = "toast-pop";
            pop.innerHTML = value;
            document.body.appendChild(pop);
            setTimeout(function () {
                var pop = document.getElementById('toast-pop');
                document.body.removeChild(pop);
            }, timeout);
        },
        //获取接口
        post: function ($http, $scope, path, controller, action, param, callback, timeout, needLogin) {
            var useCache = true;
            if (!timeout || typeof (timeout) == 'undefined' || parseInt(timeout, 10) === 0) {
                timeout = 0;
                useCache = false;
            }

            if (devicetype == 'ios') {
                ios.post($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin);
            }
            else if (devicetype == 'android') {
                android.post($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin);
            }
            else {
                // api.loading();

                var user = api.getCookie("user");
                if (!needLogin && typeof (needLogin) == 'undefined') {
                    if (param.toLowerCase().indexOf("user") > -1 && (!user || user == "0" || typeof (user) == 'undefined')) {
                        needLogin = true;
                    }
                    else {
                        needLogin = false;
                    }

                }
                else if (!needLogin) {
                    needLogin = false;
                }

                if (needLogin) {
                    location.href = "https://u.uzai.com/mobile/Login?reurl=" + location.href;
                }
                else {
                    postTimes++;
                    api.__callback__.push([postTimes, callback, $scope]);

                    var url = "/data/post";
                    var apiParam = {
                        path: path,
                        controller: controller,
                        action: action,
                        param: param,
                        useCache: useCache
                    };

                    var config = {
                        timeout: 10000
                    };

                    $http.post(url, apiParam, config).success(function (data, status) {
                        api.endloading();
                        callback(data);

                    }).error(function (data, status) {
                        api.endloading();
                        data = { ErrorCode: -3, ErrorMsg: "网络连接失败，请重试" };
                        callback(data);
                    });

                }

            }
        },

        callback: function (index, data) {

            var currentArray = [];
            for (var i = 0; i < api.__callback__.length; i++) {
                if (api.__callback__[i][0] == index) {
                    currentArray = api.__callback__[i];
                    api.__callback__.splice(i, 1);
                    break;
                }
            }
            if (currentArray.length > 2) {
                currentArray[2].$apply(function () {
                    currentArray[1](data);
                });
            }
            api.endloading();

        },

        iosCallback: function (action, key, value, index, callbackData) {
            ios.callback(action, key, value, index, callbackData);
        },

        loginConfig: loginConfig,

        getUserId: function () {

            if (devicetype == 'ios') {
                return api.getLocalStorage('userid');
            }
            else if (devicetype == 'android') {
                return window.cookie.getUserId();
            }
            else {
                var user = api.getCookie('user');
                if (!user || typeof (user) == 'undefined' || user.length < 5) {
                    return null;
                }
                else {
                    return api.getValue('userid', user);
                }
            }
        },

        login: function (from, forword) {
            if (!from || typeof (from) == 'undefined') {
                api.loginConfig.from = from;
            }

            if (!forword || typeof (forword) == 'undefined') {
                api.loginConfig.forword = forword;
            }

            var loginParam = JSON.stringify(api.loginConfig);
            if (devicetype == 'ios') {
                ios.invokeApp("action.login", loginParam);
            }
            else if (devicetype == 'android') {
                window.action.exec('login', loginParam);
            }
            else {
                location.href = "https://u.uzai.com/mobile/Login?reurl=" + forword;
            }
        },

        checkLogin: function (callback) {
            if (devicetype == 'ios') {
                ios.checkLogin(callback);
            }
            else if (devicetype == 'android') {
                android.checkLogin(callback);
            }
            else {
                var user = api.getCookie("user");
                if (!user || typeof (user) == 'undefined' || user.length < 5) {
                    location.href = "https://u.uzai.com/mobile/Login?reurl=" + location.href;
                }
                else {
                    callback();
                }
            }
        },

        logout: function () {
            if (devicetype == 'ios') {
                ios.logout();
            }
            else if (devicetype == 'android') {
                android.logout();
            }
            else {
                api.removeCookie('user');
                location.href = 'https://u.uzai.com/mobile/Login';
            }
        },

        invoke: function (action, param) {
            if (devicetype == 'ios') {
                ios.invokeApp(action, param);
            }
        }

    };


    devicetype = api.getQueryString("devicetype");


    var android = {

        getCookie: function (key) {
            var value = "";
            if (key == "userid") {
                try {
                    value = window.cookie.getUserId();
                }
                catch (e) {
                    alert(e.message);
                }
            }
            else {
                try {
                    window.cookie.getCookie(key);
                }
                catch (e) {
                    alert(e.message);
                }
            }
            return value;

        },
        setCookie: function (key, value, timeout) {

            if (!timeout || typeof (timeout) == 'undefined') {
                timeout = 0;
            }

            window.cookie.setCookie(key, value, timeout);


        },

        removeCookie: function (key) {

            try {
                window.cookie.removeCookie(key);
            }
            catch (e) {
                alert(e.message);
            }

        },
        checkLogin: function (callback) {
            var userid = android.getCookie("userid");
            if (!userid || typeof (userid) == 'undefined') {

                var loginParam = JSON.stringify({
                    from: location.href
                });
                window.action.exec('login', loginParam);
            }
            else {
                callback();
            }
        },
        logout: function () {
            android.removeCookie('user');
            var loginParam = JSON.stringify({
                from: location.href,
                forward: location.href
            });
            try {
                window.action.exec('login', loginParam);
            }
            catch (e) {
                alert(e.message);
            }
        },

        post: function ($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin) {
            api.loading();
            postTimes++;
            api.__callback__.push([postTimes, callback, $scope]);

            var userid = android.getCookie("userid");
            if (!needLogin && typeof (needLogin) === 'undefined') {
                if (param.toLowerCase().indexOf("user") > -1 && (!userid || userid == "0" || typeof (userid) === 'undefined')) {
                    needLogin = true;
                }
                else {
                    needLogin = false;
                }

            }
            else if (!needLogin) {
                needLogin = false;
            }
            if (needLogin) {
                var loginParam = JSON.stringify(api.loginConfig);
                try {
                    window.action.exec('login', loginParam);
                    callback({ ErrorCode: -2, ErrorMsg: '未登录' });
                }
                catch (e) {
                    alert('调用Android登录失败，' + e.message);
                }

            }
            else {
                var apiParam = JSON.stringify({
                    Path: path.replace(/:/g, '：'),
                    ControllerName: controller,
                    ActionName: action,
                    PostData: JSON.parse(param)
                });
                try {
                    window.action.invoke(postTimes, apiUrlPre, apiParam, timeout);

                }
                catch (e) {
                    alert(e.message);
                }

            }
        }

    };

    var ios = {

        invokeApp: function (action, param) {


            var iframe;
            iframe = document.createElement("iframe");
            iframe.setAttribute("src", action + "://" + param);
            iframe.setAttribute("style", "display:none;");
            iframe.setAttribute("height", "0px");
            iframe.setAttribute("width", "0px");
            iframe.setAttribute("frameborder", "0");
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        },


        callback: function (action, key, value, index) {
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
        getCookie: function (key, index) {
            if (!index || typeof (index) == 'undefined') {
                return api.getLocalStorage(key);
            }
            else {

                var param = JSON.stringify({
                    index: index,
                    key: key
                });

                return ios.invokeApp("cookie.getCookie", param);

            }
        },
        setCookie: function (key, value, timeout) {
            var param;
            api.setLocalStorage(key, value);
            if (key == 'user') {
                param = JSON.stringify({
                    value: value
                });
                ios.invokeApp("cookie.setMemberID", param);
            }
            else {
                param = JSON.stringify({
                    key: key,
                    value: value,
                    timeout: timeout
                });
                ios.invokeApp("cookie.setCookie", param);
            }


        },

        removeCookie: function (key, index) {
            var param;
            if (key == 'user') {
                param = JSON.stringify({
                    index: index
                });
                ios.invokeApp("user.remove", index);

            }
            else {
                param = JSON.stringify({
                    index: index,
                    key: key
                });
                ios.invokeApp("cookie.remove", param);
            }

        },
        checkLogin: function (callback) {
            var userid = api.getLocalStorage('userid');
            if ((!userid || typeof (userid) === 'undefined')) {
                var loginParam = JSON.stringify({
                    from: location.href
                });
                ios.invokeApp("action.login", loginParam);
            } else {
                callback();
            }


        },
        logout: function () {
            iosGetTimes++;
            api.__iosCallback__.push([iosGetTimes, 'removeMemberID', 'user', function () {
                var loginParam = JSON.stringify({
                    action: 'login',
                    from: location.href,
                    forward: location.href
                });
                ios.invokeApp("action.exec", loginParam);
            }]);
            ios.removeCookie('user', iosGetTimes);
        },
        post: function ($http, $scope, path, controller, action, param, useCache, callback, timeout, needLogin) {


            api.loading();
            postTimes++;
            api.__callback__.push([postTimes, callback, $scope]);

            var url = '/api/' + apiUrlPre;

            var apiParam = {
                Path: path.replace(/:/g, '：'),
                ControllerName: controller,
                ActionName: action,
                PostData: JSON.parse(param)
            };
            var invokeParam;
            if (param && typeof (param) != 'undefined') {

                invokeParam = encodeURI(JSON.stringify({
                    index: postTimes,
                    url: url,
                    param: apiParam,
                    usecache: timeout
                }));
            }
            else {

                invokeParam = encodeURI(JSON.stringify({
                    index: postTimes,
                    url: url,
                    param: {},
                    usecache: timeout
                }));
            }

            if (!needLogin && typeof (needLogin) === 'undefined') {
                if (param.toLowerCase().indexOf("user") > -1) {
                    needLogin = true;
                }
                else {
                    needLogin = false;
                }

            }
            else if (!needLogin) {
                needLogin = false;
            }

            var userid = api.getLocalStorage('userid');


            if (needLogin && (!userid || typeof (userid) === 'undefined')) {
                var loginParam = JSON.stringify(api.loginConfig);
                ios.invokeApp("action.login", loginParam);
            }
            else {
                ios.invokeApp("action.invoke", invokeParam);
            }

        }

    };
    window.api = api;

}(window));