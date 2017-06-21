/*
* @Author: lxq
* @Date:   2016-11-17 10:24:30
* @Last Modified by:   lxq
* @Last Modified time: 2016-11-17 17:32:50
*/

'use strict';

$(function(){

	var subject = $('#j_subject');
	var chartlist = subject.find('.chart-list');
	var mc = subject.find('.mc');

	chartlist.on('click',function(){
		var t = $(this);
		var ts = t.siblings();
		var tindex = t.index();
		var mct = mc.eq(tindex);
		var mcother = mct.siblings();

		ts.removeClass('chart-on')
		t.addClass('chart-on');
		
		mct.removeClass('hide');
		mcother.addClass('hide');
	});


	uzLazy(['subject-main']);



});