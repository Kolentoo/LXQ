$(document).ready(function(){
    /*公用弹层*/
    function toast(e,time){
        if(time==undefined){
            time=3000;
        }
        var html=$('body').append('<div class="common-pop">'+e+'</div>');
        setTimeout(function(){
            $('.common-pop').remove();
        },time);
        return true;
    }

   //调用 toast('公用的弹层弹层'，3000);

});