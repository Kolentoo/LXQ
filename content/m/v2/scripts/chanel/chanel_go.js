'use strict';$(document).ready(function(){var _img=$('.img-lazy');var mySwiper=new Swiper('.swiper-container',{loop:true});imgLoad(_img);$(window).scroll(function(){imgLoad(_img)})});
