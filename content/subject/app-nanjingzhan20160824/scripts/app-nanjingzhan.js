/*
* @Author: lichen
* @Date:   2016-08-24 13:46:03
* @Last Modified by:   lichen
* @Last Modified time: 2016-08-25 16:02:45
*/

'use strict';



var myexports={};

myexports.init = function(){
	myexports.moreTxt();//调用
}

myexports.moreTxt = function(){
	//代码块
	var modell=$("#j_bottom-l");
	var modelr=$("#j_bottom-r");
	var moreinfor=$(".more-infor");
	var back=$(".back");
	var mainyu=$(".main-yu");
   
   	moreinfor.on("click",function(){

   	   modelr.addClass('hide');
   	   modell.addClass('more-w');
   	   mainyu.removeClass('hide');
   	   back.removeClass('hide');
   	   moreinfor.addClass('hide');

   });

    back.on("click",function(){
    	mainyu.addClass('hide');
    	back.addClass('hide');
    	modelr.removeClass('hide');
    	modell.removeClass('more-w');
    	moreinfor.removeClass('hide');

    })



}

$(function() {
  	myexports.init();
});
