$(function () {

    // var _ua = navigator.userAgent.toLowerCase();
    // var isHuaWei = (_ua.match(/huawei/i) == 'huawei' ? true : false);
    var sh = window.innerHeight || document.body.clientHeight || screen.height;
    var oFP = $('#j_fullPage');

    //alert(navigator.userAgent.toLowerCase());

    if (oFP.get(0)) {
        oFP.fullpage({
            navigation: true,
            afterRender: function () {
                if (_terminal === 'app' && _uzm.mobile.isAndroid) {
                    $('body').height(sh);
                    oFP.children('.section').height(sh);
                }
                // setTimeout(function () {
                    //$.fn.fullpage.moveSectionDown();
                // }, 3000);
            },
            afterLoad: function (anchorLink, index) {


            },
            onLeave: function (index, direction) {

            }
        });
    }


    $('#j_marquee').kxbdMarquee({
        direction: 'up',
        isEqual: false
    });
});
