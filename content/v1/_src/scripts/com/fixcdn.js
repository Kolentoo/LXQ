// ==UserScript==
// @name        CDN
// @namespace   chinacache
// @description cdn smart refresh
// @include     https://portal.chinacache.com/config/refresh/index.do
// @version     1
// @grant       none
// ==/UserScript==

// @allow pasting

//用于清空蓝汛CDN
//需使用firefox+Greasemonkey插件

$(function () {

    var unique = function (arr) {
        if (arr.length) {
            //数组去重
            var res = [];
            var json = {};
            for (var i = 0; i < arr.length; i++) {
                if (!json[arr[i]]) {
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        }
    };
    var replaceFirst = function (v, tag, ntag) {
        if (!v) {
            return '';
        }
        tag = tag || ' ';
        ntag = ntag || '';
        if (v.indexOf(tag) === 0) {
            return v.replace(tag, ntag);
        }
        return v;
    };
    var replaceAll = function (v, tag, ntag) {
        if (v) {
            var str = v;
            try {
                str = v.replace(new RegExp(tag, 'g'), ntag);
            } catch (e) {

            }
            return str;
        }
        return '';
    };
    var revertVal = function (v) {
        if (v) {

            var muArr = [];
            var muArrReal = [];

            //remove blank str
            var arr = v.split(/\r|\r\n|\n/);
            arr.forEach(function (item, idx) {
                var im = replaceAll(item, ' ', '');
                if (im) {
                    muArr.push(im);
                }
            });

            muArr = unique(muArr);

            //remove "*://*.uzaicdn.com/"
            muArr.forEach(function (item, idx) {
                if (item.indexOf('.com:443/') > -1) {
                    muArrReal.push(item.slice(item.indexOf('.com:443/') + 8));
                } else if (item.indexOf('.com/') > -1) {
                    muArrReal.push(item.slice(item.indexOf('.com/') + 4));
                } else {
                    muArrReal.push('/' + replaceFirst(item, '/', ''));
                }
            });

            muArrReal = unique(muArrReal);

            //prefix \r\n
            muArrReal = muArrReal.map(function (item, idx) {
                return item + '\r\n';
            });

            muArrReal = unique(muArrReal);

            return muArrReal.join('');
        }
    };

    var urls = $('#timely-urls');
    if (urls.get(0)) {

        urls.css({ 'height': 265 });

        urls.append('<textarea cols="30" style="height:265px;width:100%;border:2px dotted red;box-sizing:border-box" class="j_myTxt" />');
        urls.append('<input type="button" style="position:absolute;left:0;bottom:0" class="j_myModify" value="提交" />');

        urls.find('.scrollTextArea').css({ 'opacity': '0', 'display': 'none' });

        var mu = urls.find('.j_myModify');//清空url
        var muDiv = urls.find('.j_myTxt');
        var muTxt = urls.find('.scrollTextArea');

        var trg = $('#cd-refresh-task-timely-submit-btn');

        muDiv.val(revertVal(muTxt.val()));

        var cdn = ['r', 'r01', 'r02', 'r03'];

        //html5 input event listenner 
        muDiv.on('blur', function () {
            var o = $(this);
            var ov = o.val();
            ov && o.val(revertVal(ov));
        });

        mu.click(function () {

            var muDivV = muDiv.val();

            var muArr = [];
            var muArrReal = [];
            var muArrOutput = [];

            if (muDivV) {
                var arr = muDivV.split(/\r|\r\n|\n/);
                arr.forEach(function (item, idx) {
                    var im = replaceAll(item, ' ', '');
                    if (im) {
                        muArr.push(im);
                    }
                });

                muArr = unique(muArr);

                //fix muArr  remove all  "*://*.uzaicdn.com/"
                muArr.forEach(function (item, idx) {
                    if (item.indexOf('.com:443/') > -1) {
                        muArrReal.push(item.slice(item.indexOf('.com:443/') + 8));
                    }else if (item.indexOf('.com/') > -1) {
                        muArrReal.push(item.slice(item.indexOf('.com/') + 4));
                    } else {
                        muArrReal.push('/' + replaceFirst(item, '/', ''));
                    }
                });

                muArrReal = unique(muArrReal);

                for (var i = 0; i < cdn.length; i++) {
                    var item = cdn[i];
                    for (var j = 0; j < muArrReal.length; j++) {
                        var sub = muArrReal[j];
                        muArrOutput.push('https://' + item + '.uzaicdn.com' + sub + '\r\n');
                        muArrOutput.push('https://' + item + '.uzaicdn.com:443' + sub + '\r\n');
                        muArrOutput.push('http://' + item + '.uzaicdn.com' + sub + '\r\n');
                    }
                }

                muArrOutput = unique(muArrOutput);

                console.table(muArrOutput);

                muTxt.val(muArrOutput.join(''));

                //trigger
                trg.trigger('click');
            }
        });

    }
});





