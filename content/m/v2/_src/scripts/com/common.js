"use strict";

function imgLoad(_img){
    for(var i=0;i<_img.length;i++){
        if(_img.eq(i).offset().top - $(document).scrollTop() < $(window).height()){
            _img.eq(i).attr('src',_img.eq(i).attr('data-src'));
        }
    }
}


window.goBack=function(){
    var refer = document.referrer;
    if (refer.indexOf('m.uzai.com/product') > -1) {
        location.href = 'http://m.uzai.com';
    } else {
        return window.history.go(-1);
    }
};