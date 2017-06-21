var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);//1000 / 60
        };
})();

var log = null;
var el = document.querySelector("#layer_img");//获取你想要放大的图片<img>标签id
/*var START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);//居中
 var  START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);*/
var START_X = 0;//后来发现，出现位置设为0才居中
var START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);
var ticking = false;
var transform;
var timer;
// var start_scale=1;
var mc = new Hammer.Manager(el);

mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));

mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Rotate({threshold: 0})).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Pinch({threshold: 0})).recognizeWith([mc.get('pan'), mc.get('rotate')]);

mc.add(new Hammer.Tap({event: 'doubletap', taps: 2}));
mc.add(new Hammer.Tap({event: 'singletap'}));
mc.get('doubletap').recognizeWith('singletap');
mc.get('singletap').requireFailure('doubletap');
mc.add(new Hammer.Press({time: 500}));
mc.on("panstart panmove", onPan);//拖动事件
// mc.on("rotatestart rotatemove", onRotate);//旋转事件
mc.on("pinchstart pinchmove", onPinch);//放大缩小事件
mc.on("swipe", onSwipe);
mc.on("singletap", onSingleTap);//单击
mc.on("doubletap", onDoubleTap);//双击

mc.on("press", onPress);
mc.on("hammer.input", function (ev) {
    if (ev.isFinal) {//判断是否离开，或者事件结束
        //resetElement();//�ָ�
        /*	START_X=transform.translate.x;//把当前拖动到的坐标赋值给中间变量
         START_Y=transform.translate.y;*/
    }
});


function resetElement() {
    el.className = 'animate layer-img';
    transform = {
        translate: {x: START_X, y: START_Y},
        scale: 1,
        angle: 0,
        rx: 0,
        ry: 0,
        rz: 0
    };

    requestElementUpdate();

}

function updateElementTransform() {
    var value = [
        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
        'scale(' + transform.scale + ', ' + transform.scale + ')',
        'rotate3d(' + transform.rx + ',' + transform.ry + ',' + transform.rz + ',' + transform.angle + 'deg)'
    ];

    value = value.join(" ");
    el.textContent = value;
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
}

function requestElementUpdate() {
    if (!ticking) {
        reqAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

function logEvent(str) {
    //log.insertBefore(document.createTextNode(str +"\n"), log.firstChild);
}
var tX = 0;
var tY = Math.round((window.innerHeight - el.offsetHeight) / 2);
function onPan(ev) {
    el.className = 'layer-img';
    if (transform.scale == 1) {
        //图片大于屏幕高度允许上下拖拽
      if(el.offsetHeight>window.innerHeight)
      {
          transform.translate = {
              x: 0,
              y:START_Y+ev.deltaY
          };
          requestElementUpdate();
      }
      else
      {
          transform.translate = {
              x: 0,
              y: Math.round((window.innerHeight - el.offsetHeight) / 2)
          };
      }

    }
    else {
        var imgWidth = $("#layer_img").width() * transform.scale;//图片宽度
        var imgHeight = $("#layer_img").height() * transform.scale;//图片高度
        if (ev.additionalEvent === "panright") {//向右滑动
            if (ev.deltaX > (Math.round(imgWidth - window.innerWidth) / 2)) {
                tX = (Math.round(imgWidth - window.innerWidth) / 2) + 10;
            }
            else {
                if(tX>=(Math.round(imgWidth - window.innerWidth) / 2))
                {
                    return;
                }
                else
                {
                    tX = START_X + ev.deltaX;

                }
            }
        }
        else if (ev.additionalEvent === "panleft") {//向左滑动
            if (-ev.deltaX > (Math.round(imgWidth - window.innerWidth) / 2)) {
                tX = -(Math.round(imgWidth - window.innerWidth) / 2) - 10;
            }
            else {
                if(tX<= -(Math.round(imgWidth - window.innerWidth) / 2))
                {
                    return;
                }
                else
                {
                    tX = START_X + ev.deltaX;

                }

            }
        }

        transform.translate = {
            x: tX,
            y: tY
        };
        requestElementUpdate();

        logEvent(ev.type);


    }
}

var initScale = 1;
function onPinch(ev) {
    if (ev.type == 'pinchstart') {
        initScale = transform.scale || 1;
    }
    el.className = 'layer-img';
  /*  if (initScale * ev.scale >= 2) {
        transform.scale = 2;
    }*/
    if (initScale * ev.scale <= 1) {
        transform.scale = 1;
    }
    else {
        if(el.offsetHeight*initScale * ev.scale>window.innerHeight)
        {
            transform.scale=Math.round(window.innerHeight/el.offsetHeight);
        }
        else
        {
            transform.scale = initScale * ev.scale;
        }

    }


    requestElementUpdate();
    logEvent(ev.type);
}

var initAngle = 0;
function onRotate(ev) {
    if (ev.type == 'rotatestart') {
        initAngle = transform.angle || 0;
    }

    el.className = 'layer-img';
    transform.rz = 1;
    transform.angle = initAngle + ev.rotation;
    requestElementUpdate();
    logEvent(ev.type);
}

function onSwipe(ev) {
    var angle = 50;
    /*   transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
     transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
     transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;

     clearTimeout(timer);
     timer = setTimeout(function () {
     resetElement();
     }, 300);
     requestElementUpdate();
     logEvent(ev.type);*/
}
//单击
function onSingleTap(ev) {
    //if(transform.scale==1)
    //{
    $(".layer-img").hide();
    $('.keep').hide();
    $('.uzai_layer').hide();
    $('.layer-loading').hide();
    $("script[src='http://r03.uzaicdn.com/content/hybrid/scripts/member/hammerpluin.js']").remove();
    // }

    /* transform.rx = 1;
     transform.angle = 25;

     clearTimeout(timer);
     timer = setTimeout(function () {
     resetElement();
     }, 200);
     requestElementUpdate();
     logEvent(ev.type);*/
}
//双击
function onDoubleTap(ev) {
    /*if(transform.scale>1)
     {
     transform.rx = 1;
     transform.angle = 80;

     clearTimeout(timer);
     timer = setTimeout(function () {
     resetElement();
     }, 500);
     requestElementUpdate();
     logEvent(ev.type);
     }*/
    $(".layer-img").hide();
    $('.keep').hide();
    $('.uzai_layer').hide();
    $('.layer-loading').hide();
    $("script[src='http://r03.uzaicdn.com/content/hybrid/scripts/member/hammerpluin.js']").remove();
   /* if(transform.scale==1)
    {
        transform.scale=Math.round(window.innerHeight/el.offsetHeight);
        requestElementUpdate();
    }
    else
    {
        transform.scale=1;
         requestElementUpdate();
    }*/

}
//按压
function onPress() {
    if (api.isApp()) {
        $('.keep').show();
    }
}
resetElement();
