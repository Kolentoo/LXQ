/*! uzai - v0.1.11 - 2015-11 */function jpHoverEvent(a){a.on("mouseover",function(){var a=$(this);a.addClass("on")}).on("mouseout",function(){var a=$(this);a.removeClass("on")})}$(function(){jpHoverEvent($(".tip-box"))});