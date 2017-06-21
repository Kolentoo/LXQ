 $(function () {
          var num = 520;
          var sid = 15;
          if (_uzw.user && _uzw.user.userid > 0) {
              $.ajax({
                  url: "//www.uzai.com/ashx/ashx_Get520HongBao.ashx",
                  data: { "p": num, "s": sid, "f": 1 },
                  dataType: "jsonp",
                  success: function (msg) {
                      //0获取失败，1获取成功，-1未登录，-2已领取
                      switch (msg) {
                          case 2:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b1.png");
                              break;
                          case 1:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b1.png");
                              $("#GetA").removeAttr("onclick");
                              break;
                          case -1:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b.png"); //未领取图片 
                              break;
                          case -2:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b1.png");
                              $("#GetA").removeAttr("onclick");
                              break;
                          default:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b.png");

                              break;
                      }

                  },
                  error: function () {
                      $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b.png");
                  }
              });
          } else {
              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b.png"); //未领取图片 
          }
        $("#hb200").click(function () {
            getHongbao2(200, 14);
        });

        $("#hb300").click(function () {
            getHongbao2(300, 14);
        });
      })
 function GetHongBao() {
          var actName = "GetHongBao";
          var sid = 15;
          var num = 520;
          _uzw.user.refresh();
          if (_uzw.user && _uzw.user.userid > 0) {
              $.ajax({
                  url: "//www.uzai.com/ashx/ashx_Get520HongBao.ashx",
                  data: { "p": num, "s": sid, "f": 0 },
                  dataType: "jsonp",
                  success: function (msg) {
                      //0获取失败，1获取成功，-1未登录，-2已领取
                      switch (msg) {
                          case 2:
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b1.png");
                              $("#GetA").removeAttr("onclick");
                              popMod("j_popSuccess");
                              break;
                          case 1:
                              popMod("j_popSuccess");
                              break;
                          case -1:
                              _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
                              break;
                          case -2:
                              alert("您已领取过该红包！");
                              $("#520Img").attr("src", "//r01.uzaicdn.com/content/v1/images/subject/b1.png");
                              $("#GetA").removeAttr("onclick");
                              break;
                          default:
                              alert("领取失败，请稍后再试！");
                              break;
                      }

                  },
                  error: function () {
                      alert("领取失败，请稍后再试！");
                  }
              });
          }
          else {
              _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
          }
      }
     function getHongbao2(num, sid) {
        var actName = "getHongbao2";
        _uzw.user.refresh();
        if (_uzw.user && _uzw.user.userid > 0) {
            $.ajax({
                url: "//www.uzai.com/ashx/ashx_GetActiveCode.ashx",
                data: { "p": num, "s": sid },
                dataType: "jsonp",
                success: function (msg) {
                    //0获取失败，1获取成功，-1未登录，-2已领取
                    switch (msg) {
                        case 1:
                            popMod("j_popSuccess");
                            break;
                        case -1:
                            _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
                            break;
                        case -2:
                            alert("您已领取过该红包！");
                            break;
                        default:
                            alert("领取失败，请稍后再试！");
                            break;
                    }

                },
                error: function () {
                    alert("领取失败，请稍后再试！");
                }
            });
        }
        else {
            _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
        }
    }
      function popMod(node, xAxis) {
          var obj = $('#' + node);
          xAxis = xAxis || $(window).height() / 2;
          obj = (obj.get(0) == null) ? $('.' + node) : obj;

          _uzw.ui.mask.show();
          obj.show();
          obj.on('click', '.j_popClose', function () {
              var oThis = $(this);
              var op = oThis.parents('.pop-mod1');

              op.hide();
              _uzw.ui.mask.hide();
          });
      }