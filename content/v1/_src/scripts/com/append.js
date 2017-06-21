/*
@使用方法
@1,复制到浏览器：javascript: void (_ug.hotview.get());
@2,console 控制台:_ug.hotview.get()
*/

/*
@author:丁坚
@modify:jsonchou 2015-3-30
*/

function txt() {
    console.log(111);
}

$(function () {
    uzai_hotclick = {
        init: function () {
            var that = this;
            that.appcss();

            if (that.getusername()) {
                that.loginInit();
            } else {
                $("body").append(that._loginhtml());
                that.bindLoginEvent();
            }

        },
        //loginhtml 段
        _loginhtml: function () {
            var htm = [];

            htm.push('<div class="hot_click_box">');
            htm.push('<div class="title">');
            htm.push('<h3>用户登录</h3>');
            htm.push('<a href="javascript:;" title="关闭" class="hot_click_close">X</a>');
            htm.push('</div>');
            htm.push('<div class="con">');
            htm.push('<div class="selform"><label>帐号：</label><input class="txt" id="hot_click_iname" type="text" /></div>');
            htm.push('<div class="selform"><label>密码：</label><input class="txt" id="hot_click_ipsd" type="password" /></div>');
            htm.push('<div class="selform"><label></label><input type="button" class="huitubtn" id="hot_click_login" value="登录" /></label></div>');
            htm.push('<div class="selform">');
            htm.push('<div class="tip">注：账号、密码为网站后台账号和密码。</div>');
            htm.push('</div>');
            htm.push('</div>');
            htm.push('</div>');
            return htm.join('');

        },
        //html段
        _gethtml: function () {
            var that = this;
            if ($("body").find(".hot_click_box").length) {
                return;
            }
            var tip = "";
            if (!window.__hotclick) {
                tip = "<span style='color:#f00;'>(该页还未部署！)</span>";
            }
            var htm = [];
            htm.push('<div class="hot_click_box">');
            htm.push('<div class="title"><h3>点击图参数设置</h3><a href="javascript:;" title="关闭" class="hot_click_close">X</a></div>');
            htm.push('<div class="con">');
            htm.push('<div class="selform"><label>选择时间：</label><input  id="J_hot_start" class="time"  readonly /> - <input id="J_hot_end" onfocus="WdatePicker();" readonly   class="time" /></div>');

            htm.push('<div class="selform"><label></label><input type="button" class="huitubtn" id="hot_click_show" value="绘图" />');
            htm.push('</div>');

            htm.push('<div class="hot_click_bortop">已经部署页面：' + tip + '</div>');
            htm.push('<ul class="hot_click_ulpage fn-clear">');
            htm.push('<li><label><a href="//www.uzai.com">WWW首页</a></label></li><li><label><a href="//sh.uzai.com">SH首页</a></label></li>');
            htm.push('<li><label><a href="//bj.uzai.com">BJ首页</a></label></li><li><label><a href="//sh.uzai.com/outbound/">SH出境游</a></label></li>');
            htm.push('<li><label><a href="//bj.uzai.com/outbound/">BJ出境游</a></label></li><li><label><a href="//sh.uzai.com/lvyoucn/">SH国内游</a></label></li>');
            htm.push('<li><label><a href="//bj.uzai.com/lvyoucn/">BJ国内游</a></label></li><li><label><a href="//sh.uzai.com/neartravel/">SH周边游</a></label></li>');
            htm.push('<li><label><a href="//bj.uzai.com/neartravel/">BJ周边游</a></label></li><li><label><a href="//www.uzai.com/subject/tejia/">SH特价</a></label></li><li>部分列表页</li>');
            htm.push('</ul>');
            htm.push('</div>');
            htm.push('</div>');
            return htm.join('');

        },
        //bind loginevent
        bindLoginEvent: function () {
            var that = this;
            $(".hot_click_close").bind("click", function () {
                $(".hot_click_box").remove();
            });

            $("#hot_click_login").bind("click", function () {
                var name = $("#hot_click_iname").val();
                var psd = $("#hot_click_ipsd").val();
                var url = "//aj.uzai.com/hotclike.ashx?type=a&admin=" + name + "&pwd=" + psd;
                $.ajax({
                    type: "get",
                    url: url,
                    dataType: "jsonp",
                    jsonp: "hotcallback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    success: function (data) {
                        if (data.res == 1) {
                            that.addusercookie(name);
                            that.loginInit();
                        } else {
                            alert("帐号密码有误，请确认后再登录！");
                        }
                    },
                    error: function () {
                        alert("帐号密码有误，请确认后再登录！");
                    }
                });
            });
        },
        loginInit: function () {
            var that = this;
            $(".hot_click_box").remove();
            $("body").append(that._gethtml());
            that.bindEvent();
        },
        //bind event
        bindEvent: function () {

            var date = new Date();
            var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            var that = this;
            $(".hot_click_close").bind("click", function () {
                $(".hot_click_box").remove();
            });
            $("#hot_click_show").bind("click", function () {
                that.drawimg(false);
            });

            $("#hot_click_history").bind("click", function () {
                that.showhistory();
            });

            $("#J_hot_start").bind("click", function () {
                WdatePicker({ maxDate: $("#J_hot_end").val() || today });
            });
            $("#J_hot_end").bind("click", function () {
                WdatePicker({ minDate: "2013-01-01", maxDate: today });
            });

        },
        drawimg: function (ishailong) {

            var that = this;
            var username = that.getusername();
            var host = location.host + location.pathname;
            var s = $("#J_hot_start").val();
            var e = $("#J_hot_end").val();
            $(".hotclick_ud").remove();

            $("body").append('<div id="hot_win" style=" width:auto; position:fixed; left:0; top:0; bottom:0; right:0; height:auto; display:block; background:url(//r.uzaicdn.com/static/channels/images/wenjun/over.png) repeat; z-index:88887;"><span style="position:fixed; top:200px; left:45%; color:#fff; font-size:16px; "><img src="//r.uzaicdn.com/content/v1/images/common/loading.gif" />数据准备中,请耐心等待...</span></div>');

            var url = "//aj.uzai.com/hotclike.ashx?type=g&url=" + host + "&admin=" + username + "&startcity=" + _ug.cityID + "&begindate=" + s + "&enddate=" + e;

            var unitHandleSeed = function (obj) {
                if (obj.find(".hotclick_ud").length) {
                    var _o = parseInt(obj.find(".hotclick_ud").text(), 10);
                    _o = _o || 0;
                    _o = _o + parseInt(item.num, 10);
                    obj.find(".hotclick_ud").text(_o);
                } else {
                    obj.append('<pre class="hotclick_ud" >' + item.num + '</pre>');
                }
            };

            $.ajax({
                type: "get",
                url: url,
                dataType: "jsonp",
                jsonp: "hotcallback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                success: function (datalist) {
                    for (var i = 0; i < datalist.length; i++) {
                        var item = datalist[i];
                        var obj = null;
                        if (item.o != "body" && item.o !== "data-seed") {
                            var tlist = $("[data-chunk='" + item.o + "']").find("a[href='" + item.d + "']");

                            if (tlist.length == 1) {
                                obj = $(tlist[0]);
                            }
                            if (tlist.length > 1) {
                                obj = $(tlist[1]);
                            }

                            if (obj) {
                                if (ishailong) {
                                    if (obj.parents(".newBanner-list").length) {
                                        if (obj.index() > 0) {
                                            obj = $(obj.parents(".newBanner-list").find("a")[1]);
                                        }
                                    } else {
                                        obj = null;
                                    }
                                }
                            }

                            if (obj) {
                                if (obj.css("position") != "absolute") {
                                    obj.css("position", "relative");
                                }
                                unitHandleSeed(obj);
                            }
                        }
                        if (item.o == "data-seed") {
                            obj = $("[data-seed='" + item.d + "']");
                            if (obj.css("position") != "absolute") {
                                obj.css("position", "relative");
                            }
                            unitHandleSeed(obj);

                        }

                    }
                    if (datalist.length === 0) {
                        alert("您没有该页面的权限，或者该时间段内数据不存在，需要开通权限请通过权限申请流程.");
                    }
                    $("#hot_win").remove();
                },
                error: function () {
                    alert('fail');
                    $("#hot_win").remove();
                }
            });
        },
        appcss: function () {
            var style = document.createElement("link");
            style.type = "text/css";
            style.setAttribute("rel", "stylesheet");
            style.setAttribute("href", "http://r01.uzaicdn.com/content/v1/styles/com/append.css");
            //style.setAttribute("href", "http://10.1.13.9/demo/oheatclick/append.css");
            document.getElementsByTagName("head")[0].appendChild(style);
            if (!window.WdatePicker) {
                var scri = document.createElement("script");
                scri.type = "text/javascript";
                scri.setAttribute("src", "http://r.uzaicdn.com/static/base/my97datepicker/wdatepicker.js");
                document.getElementsByTagName("head")[0].appendChild(scri);
            }
        },
        addusercookie: function (name) {
            _uzw.cookie.set("heatclick_user", name, 1);
        },
        loginout: function () {
            _uzw.cookie.del("heatclick_user");
        },
        getusername: function () {
            return _uzw.cookie.get("heatclick_user");
        }
    };
    uzai_hotclick.init();
});
