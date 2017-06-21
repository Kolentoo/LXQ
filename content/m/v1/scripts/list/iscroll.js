var listID = "thelist";
var wraperID = "wrapper";


var myScroll,
	pullUpEl, pullUpOffset,
	generatedCount = 0;
 

function pullUpAction() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        var el, li, i;
        el = document.getElementById(listID);
        var length = 10;
        for (i = 0; i < length; i++) {
            li = document.createElement('li');
            var sb=[];
            sb.push("<li><a class='block' href='#'>");
            sb.push("<div class='pic fl'><img class='block g10' alt='' src='/content/m/v1/images/rushbuy/r1.png'></div>");
            sb.push("<div class='txt'>");
            sb.push("<p class='p1 f333 f14'>" + i + "【周三周四劲爆特价】塞班一地5日半自助游</p>");
            sb.push("<p class='p2'><span class='f18 orange'>￥2950</span>&nbsp;<del class='f999'>￥3590</del></p>");
            sb.push("<p class='p3'><span class='jian'>减1000</span> <span class='fan'>返200</span> <span class='shoujitehui'>手机特惠</span></p>");
            sb.push("<div class='p4 f12 clearfix'><span class='fl'>4天行</span> <span class='fr'>已有4560人出行</span></div>");
            sb.push("</div>");
            sb.push("</a></li>");
            li.innerHTML = sb.join('');
            el.appendChild(li, el.childNodes[0]);
        }




        myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    myScroll = new iScroll(wraperID, {
        useTransition: true,
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
            }
        },
        onScrollMove: function () {
             if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                pullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });

    setTimeout(function () { document.getElementById(wraperID).style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);