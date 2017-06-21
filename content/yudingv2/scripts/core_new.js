/*
* 获取cookie值
*/
function getCookieValue(cookieName) {
    var cookieValue = document.cookie;
    var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
    if (cookieStartAt == -1) {
        cookieStartAt = cookieValue.indexOf(cookieName + "=");
    }
    if (cookieStartAt == -1) {
        cookieValue = null;
    }
    else {
        cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
        cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
        if (cookieEndAt == -1) {
            cookieEndAt = cookieValue.length;
        }
        cookieValue = unescape(cookieValue.substring(cookieStartAt, cookieEndAt)); //解码latin-1  
    }
    return cookieValue;
}
// 设置客服电话
function setCustomerPhone() {
    var cooperateSourceCookie = getCookieValue("uzwCooperateSource");
    if (cooperateSourceCookie) {
        cooperateSourceCookie = decodeURIComponent(cooperateSourceCookie); //eg:百度-网盟:4008791625:r000000300
        var cookieArr = cooperateSourceCookie.split(':');
        if (cookieArr != null && cookieArr.length > 1) {
            var phone = cookieArr[1];
            if (phone) {
                $("em[class='call-num']").html(phone);
            }
        }
    }
}
setCustomerPhone();