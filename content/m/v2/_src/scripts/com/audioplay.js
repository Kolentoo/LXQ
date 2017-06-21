var img_url = "";
var share_link = location.href;
var icon_link = "";
var desc = "";
var title = "";
var loading_int = null;
var cover_eraser_int = null;
var old_index = 1;
var percentint = null;
var percent = 0;
$(document).bind("onAssetsLoadComplete", onAssetsLoadComplete);
$(document).bind("onEraserComplete", onEraserComplete);

setTimeout(function () {
    document.getElementById("j_music").play();
},
1000);

document.addEventListener("WeixinJSBridgeReady",
function onBridgeReady() {
    WeixinJSBridge.call("hideToolbar");
    document.getElementById("j_music").play();
    WeixinJSBridge.on("menu:share:appmessage",
    function (b) {
        WeixinJSBridge.invoke("sendAppMessage", {
            appid: "",
            img_url: icon_link,
            img_width: "230",
            img_height: "230",
            link: share_link,
            desc: desc,
            title: title
        });
    });
    WeixinJSBridge.on("menu:share:timeline",
    function (b) {
        WeixinJSBridge.invoke("shareTimeline", {
            img_url: icon_link,
            img_width: "230",
            img_height: "230",
            link: share_link,
            desc: title,
            title: desc
        });
    });
    var a = "";
    WeixinJSBridge.on("menu:share:weibo",
    function (b) {
        WeixinJSBridge.invoke("shareWeibo", {
            content: title + " " + share_link,
            url: share_link
        });
    });
});

$("html, body").scrollTop(0);

function onEraserComplete() {

}

function onAssetsLoadComplete() {

}