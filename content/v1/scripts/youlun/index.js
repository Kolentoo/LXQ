/*! uzai - v0.1.11 - 2017 */

function ylHoverEvent(a){a.on("mouseover",function(){var a=$(this);a.addClass("on")}).on("mouseout",function(){var a=$(this);a.removeClass("on")})}function SelShipchange(){$("#j_filterSelShip").change(function(){var a=$("#j_filterSelShip").val(),b=a.split("=")[1];$.post("CruisesNew/GetCruiseshipList",{name:b},function(a){if($("#j_filterSelShipName option:gt(0)").remove(),""!==a)for(var b=0;b<a.length;b++){var c="<option value='data-cruisesname="+a[b].usertreeName+"'>"+a[b].usertreeName+"</option>";$("#j_filterSelShipName").append(c)}})})}function ylSlide(){var a=function(){var a=$(window).width();$("#j_ylBanner").width(a),$("#j_ylBanner").find(".item").width(a)};$(window).resize(function(){a()}),a(),$("#j_ylBanner").slides({preload:!0,preloadImage:"//r.uzaicdn.com/content/v1/images/common/preload.gif",currentClass:"on",fadeSpeed:300,effect:"fade",crossfade:!0,hoverPause:!1,pause:1e3,play:6e3,generatePagination:!1}),$(".slides_container").each(function(){var a=$(this),b=a.next(".pagination");b.get(0)||(b=a.next(".pagination-wrap").find(".pagination")),b.get(0)&&b.find("li").on("mouseenter",function(){var a=$(this);a.find("a").click()})}),easySlide("j_introShipDesc","intro-arrow-left","intro-arrow-right",1,9),easySlide("carousel-bar-item","prev","next",1,4)}function winResize(){var a=function(){var a=screen.width;if(1024>=a){var b="690px";$(".main-banner .slides_container a img").css({width:b}),$(".sale-bd ul li").css({width:"249px"}),$(".main-box").css({width:b}),$(".intro-bd .intro-items .tit, .intro-bd .intro-items .box").css({width:"106px"})}};a()}function ylShipSlide(){$("#j_shipSlide").animate({"margin-left":"0"},800,"swing",function(){var a=$(".youlun-hd");a.on("click",function(){skipFilterPosition()})})}function loadYLData(){var tp=$.trim($("#YLjson").val()).replace("/g","");_ylData=eval("("+tp+")"),loadStartPortData()}function loadStartPortData(){var a=[];if(_ylData){for(var b=0;b<_ylData.length;b++){var c=_ylData[b],d=c.StartPort;a.push(d)}if(a=_unique(a.sort()),a.length){for(var e=[],f=0;f<a.length;f++)e.push("<li>"+a[f]+"</li>");$("#j_voyageFilter").find(".voyage-uls").html(e.join(""))}}}function ylFilter(){var a=$("#j_voyageFilter");$("#j_customYL").on("click",function(){var b=$(this);b.parent(".side-nav-box").hide(),a.fadeIn("slow")}),a.find(".close").on("click",function(){$(this);a.prev(".side-nav-box").fadeIn("slow"),a.hide()}),a.find(".voyage-hd").find("li").on("click",function(){a.find(".voyage-go").hide(),a.find(".voyage-ulwraper").find("ul").show(),a.find(".voyage-hd").find(".endport").find("a").text("终点港");var c=$(this),d=($.trim(c.find("a").text()),c.siblings("li")),e=c.nextAll("li");c.addClass("on"),d.removeClass("on");var g=a.find(".voyage-hd").find("li:visible"),h=g.index(c);e.hide(),e.each(function(a,b){var c=$(this);c.hasClass("method")?c.find("a").text("途经地"):c.hasClass("endport")&&c.find("a").text("终点港")}),a.find(".voyage-bd").find("ul").empty(),b(h),c.hasClass("endport")&&f()}),a.find(".voyage-bd").on("click","ul li",function(){var c=$(this),d=c.parent("ul"),h=$.trim(c.text());d.empty();var i=a.find(".voyage-hd").find(".on").index();e(i,h);var j=a.find(".voyage-hd").find("li").eq(i+1);j.siblings("li").removeClass("on"),j.addClass("on").show(),b(i+1),f();var k=a.find(".voyage-hd").find(".endport");"终点港"!=k.find("a").text()&&g()});var b=function(b){var d=a.find(".voyage-hd").find("li").eq(0).find("a").text();if(_ylData){for(var e=[],f=[],g=[],h=[],i=[],j=0;j<_ylData.length;j++){var k=_ylData[j],l=k.StartPort,m=k.Methods,n=k.EndPort;omethodArr=m.split(",");var o,p,q;0===b?e.push(l):1===b?d==l&&omethodArr[0]&&f.push(omethodArr[0]):2===b?(o=a.find(".voyage-hd").find("li").eq(1).find("a").text(),d===l&&omethodArr[0]==o&&omethodArr[1]&&g.push(omethodArr[1])):3===b?(o=a.find(".voyage-hd").find("li").eq(1).find("a").text(),p=a.find(".voyage-hd").find("li").eq(2).find("a").text(),d===l&&omethodArr[0]==o&&omethodArr[1]==p&&omethodArr[2]&&h.push(omethodArr[2])):4===b&&(o=a.find(".voyage-hd").find("li").eq(1).find("a").text(),p=a.find(".voyage-hd").find("li").eq(2).find("a").text(),q=a.find(".voyage-hd").find("li").eq(3).find("a").text(),d===l&&omethodArr[0]==o&&omethodArr[1]==p&&omethodArr[2]==q&&i.push(n))}e=_unique(e.sort()),f=_unique(f.sort()),g=_unique(g.sort()),h=_unique(h.sort()),i=_unique(i.sort()),0===b?c(e,b):1==b?c(f,b):2===b?c(g,b):3===b?c(h,b):4===b&&c(i,b)}},c=function(a,b){if(a.length){for(var c=[],e=0;e<a.length;e++)c.push("<li>"+a[e]+"</li>");c.length&&d(c,b)}},d=function(b,c){var d=a.find(".voyage-bd").find(".voyage-uls");d.html(b.join(""))},e=function(b,c){var d=a.find(".voyage-hd").find("li").eq(b);d.show().find("a").text(c),d.nextAll().hide()},f=function(){var b=a.find(".voyage-hd").find(".startport").find("a").text(),c=[],d=[],e=a.find(".voyage-hd").find(".endport"),f=a.find(".voyage-bd").find(".voyage-uls");a.find(".voyage-hd").find(".method").find("a").each(function(a,b){var d=$(this).text();"途经地"!=d&&c.push(d)});for(var g=0;g<_ylData.length;g++){var h=_ylData[g],i=h.StartPort,j=h.Methods,k=h.EndPort;c.length&&i===b&&0===j.indexOf(c.join(","))&&d.push(k)}if(1==d.length){var l=e.prevAll("li");l.each(function(a,b){var c=$(this);"途经地"==c.find("a").text()&&c.hide()}),l.removeClass("on"),e.addClass("on").show(),f.show().html("<li>"+d+"</li>")}},g=function(){if(a.find(".voyage-hd").find(".endport").hasClass("on")){var b=a.find(".voyage-go");b.next(".voyage-ulwraper").find("ul").fadeOut("slow",function(){b.fadeIn("slow")}),a.find(".voyage-go").off("click").on("click",function(){var b=a.find(".startport").find(".txt").text(),c=a.find(".endport").find(".txt").text(),d=[],e=a.find(".method");e.each(function(a,b){var c=$(this);"途经地"!=c.find(".txt").text()&&d.push(c.find(".txt").text())}),$("#j_ylMultiFilter").find(".side-line-bd").find(".on").removeClass("on");var f=b+"-"+d.join("-")+"-"+c;$("#j_ylMultiFilter").find(".side-line-bd").find("a").each(function(a,b){var c=$(this);return c.text()==f?($("#j_ylMultiFilter").find(".side-line-bd").show(),ylClearSelect(),c.click(),!0):void 0}),skipFilterPosition()})}}}function specialTab(){$("#j_specialBox").find(".box-hd").find("li").on("click",function(){var a=$(this),b=a.parent("ul"),c=b.find("li").index(a);b.find("li").removeClass("on"),a.addClass("on");var d=a.parents(".box-hd").next(".sale-bd").find(".item");d.hide(),d.eq(c).show();var e=d.find("img");return e.each(function(a,b){var c=$(this),d=c.attr("data-src");c.attr("src",d)}),!1}),$("#j_specialBox").find(".box-hd").find("li").eq(0).click()}function ylClearSelect(){$("#j_filterSels").find("select").each(function(a,b){var c=$(this);c.get(0).selectedIndex=0}),$("#j_ylMultiFilter").find(".side-line-bd").show()}function ylMultiFilter(){$("#j_ylMultiFilter").find(".side-line").find("li").on("click",function(){var a=$(this),b=a.parents(".side-line"),c=b.find("li").not(a);return a.hasClass("on")?a.removeClass("on"):a.addClass("on"),c.removeClass("on"),unitFilter(),skipFilterPosition(),!1})}function selsFilter(){$("#j_filterSels").on("change","select",function(){var a=$(this);if("j_filterSelRoute"==a.attr("id")){var b=a.val().replace("data-route*=","");if(b){var c=$("#j_ylMultiFilter").find(".side-line").find("ul");c.each(function(a,c){var d=$(this),e=d.attr("data-tag");b.indexOf(e)>-1?d.show():d.hide()})}else $("#j_ylMultiFilter").find(".side-line").find("ul").show()}$("#j_ylMultiFilter").find(".side-line").find("li").removeClass("on"),unitFilter()})}function unitFilter(){var a=$("#j_filterSelRoute").val(),b=$("#j_filterSelMonth").val(),c=$("#j_filterSelPort").val(),d=$("#j_filterSelShip").val(),e=$("#j_filterSelShipName").val(),f=$("#j_ylMultiFilter").find(".side-line-bd").find(".on").find("a").attr("rel"),g=[];f&&g.push(f),a&&g.push(a),b&&g.push(b),c&&g.push(c),d&&g.push(d),e&&g.push(e),initSorter(g.join(","))}function initPager(){$("#ylPager").uzPager({pageSize:10,targetNode:$("#j_RouteList"),onInit:function(){},onCallback:function(a){skipFilterPosition()}})}function initSorter(a){$("#j_RouteList").uzSorter({sortBy:a,sortAscTag:"data-top",sortAscKey:"asc",onInit:function(){},onCallback:function(){initPager()}})}function ylSideNav(){$("#j_ylSideNav").find("dt").each(function(a,b){var c=$(this);c.parent("dl").find("dt").index(c);c.next("dd").find("a").on("click",function(){ylClearSelect();var a=$(this),b=($.trim(a.text()),a.attr("rel")),c=b.split("=")[1],d=$("#j_filterSels").find("select option[value*="+c+"]");return d.get(0)&&(d.prop("selected",!0),d.change()),skipFilterPosition(),!1})}),setTimeout(function(){$("#j_ylSideNav").find("a").each(function(){"日韩"===$(this).html()&&$(this).html("日本")})},1e3)}function skipFilterPosition(){var a=$("#j_MonthFilter"),b=a.offset().top;$("body,html").animate({scrollTop:b},500)}function ylMonthOff(){var a=[],b=$("#j_RouteList");b.find("li").each(function(b,c){var d=$(this),e=d.attr("data-month"),f=e.split(",");if(f.length)for(var g=0;g<f.length;g++)a.push(f[g]);else a.push(e)}),a=_unique(a),a=$.map(a,function(a,b){return a.replace("月","")}),a=a.sort(_asc),a=$.map(a,function(a,b){return a+"月"});var c=$("#j_filterSelMonth"),d=[];$.each(a,function(a,b){d.push("<option value='data-month="+b+"'>"+b+"</option>")}),d.length&&c.append(d.join(""))}function popMod(a,b){var c=a.parent();c.find(".mask").height(document.body.clientHeight),c.show().siblings(".pop-mod").hide(),a.show(),a.find(".pop-colse").on("click",function(){c.hide(),a.hide()}),$(window).bind("scroll",function(){fixIe6(a,b)})}function fixIe6(a,b){window.XMLHttpRequest||a.css("top",$(document).scrollTop()+b)}function ylCalendar(){var a=$("#j_ylCalendar"),b={jsonpUrl:"/ashx/GetCalendarPrice.ashx?type=1",isSmart:!0,extCallBack:function(b,c){var d=a.find(".item"),e=a.find("a.block");e.length&&d.each(function(b,c){var d=$(this),e=d.find("a.block"),f=d.attr("data-year")+"-"+d.attr("data-month")+"-"+d.attr("data-day");f&&e.on("mouseenter",function(){if(a.find(".ajaxData").hide(),e.find(".ajaxData").get(0))e.find(".ajaxData").show();else{var b=$.ajax({url:"/ashx/GetCalendarPrice.ashx?type=2&date="+f,type:"GET",contentType:"application/json; charset=utf-8"});b.done(function(b){e.append(b),a.find(".ajaxData").hide(),e.find(".ajaxData").show()})}}).on("mouseleave",function(){a.find(".ajaxData").hide()})})},preCallback:function(a,b){}};a.get(0)&&a.jsonCalendar(b)}_ylData="",$(function(){loadYLData(),winResize(),ylMonthOff(),ylHoverEvent($(".line-list .list-item")),ylSlide(),ylFilter(),initPager(),ylClearSelect(),ylMultiFilter(),selsFilter(),ylSideNav(),specialTab(),ylCalendar(),SelShipchange()}),winLoadFix(function(){ylShipSlide()});var _unique=function(a){for(var b=[],c={},d=0;d<a.length;d++)c[a[d]]||(b.push(a[d]),c[a[d]]=1);return b},_asc=function(a,b){return a-b};
//# sourceMappingURL=/sourcemaps/content/v1/scripts/youlun/index.js.map