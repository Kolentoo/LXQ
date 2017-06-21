/*! uzai - v0.1.11 - 2016 */
"use strict";

function fixInputErr() {
    $(document).on("blur", ".input-err", function () {
        var a = $(this);
        a.removeClass("input-err");
        var b = $("#j_lrfTips");
        b.text("")
    })
}
function orderSide() {
    var a = $("#j_side"),
		b = a.siblings(".main-box").height(),
		c = a.find(".order-listing-box"),
		d = a.find(".ycs-mod");
    a.find(".ycs-info-mod");
    if (c.get(0) && (c.find(".switch").on("click", function () {
        var a = $(this),
			b = a.find(".border-arrow"),
			c = a.parents(".mod-item-hd").next(".mod-item-bd").find(".order-listing-wrap");
        b.hasClass("on") ? (b.removeClass("on"), c.hide()) : (b.addClass("on"), c.show())
    }), !d.get(0))) {
        var e = c.find(".deposit-bar"),
			f = 0;
        e.get(0) && (f = e.outerHeight(!0));
        var g = c.find(".order-listing"),
			h = $(".order-footer"),
			i = g.height(),
			j = c.offset().top,
			k = document.documentElement.clientHeight,
			l = k - 117 - f,
			m = 0,
			n = 0;
        i > l ? g.height(l) : "", n = c.outerHeight(), m = h.get(0) ? h.offset().top - n - 25 : 0, $(window).scroll(function () {
            o()
        });
        var o = function () {
            var a = $(window),
					d = a.scrollTop();
            b > n && (d >= j ? 0 !== m && d >= m ? c.css({
                position: "absolute",
                top: m
            }) : _util.check.isIE6 ? c.css({
                top: d,
                position: "absolute"
            }) : c.css({
                top: 0,
                position: "fixed"
            }) : c.css({
                top: 0,
                position: "static"
            }))
        };
        o()
    }
}
function tab(a, b) {
    var c = $("#" + a);
    if (c.get(0) ? "" : c = $("." + a), c.get(0)) {
        var d = c.children(".hd");
        d.get(0) ? "" : d = c.children().children(".hd"), d.find("li").on("click", function () {
            var a = $(this),
				c = a.index(),
				d = a.siblings("li"),
				e = a.parents(".hd").siblings(".bd"),
				f = e.children(".item");
            d.removeClass("on"), a.addClass("on"), f.hide().eq(c).show(), b && b()
        })
    }
}
function tipsInfo() {
    var a = function (a) {
        var b = $("." + a);
        b.get(0) && (b.each(function () {
            var a = $(this),
					b = a.height();
            a.find(".tips-close").css({
                "line-height": b + "px"
            })
        }), b.find(".tips-close").on("click", function () {
            var a = $(this);
            a.parents(".j_tipsBar").detach()
        }))
    };
    a("j_tipsBar");
    var b = function () {
        $(".travel-order").on("mouseover", ".hover-wrap", function () {
            var a = $(this);
            a.addClass("hover-wrap-on")
        }).on("mouseout", ".hover-wrap", function () {
            var a = $(this);
            a.removeClass("hover-wrap-on")
        })
    };
    b();
    var c = $(".J_powerFloat");
    c.get(0) && c.powerFloat({
        reverseSharp: !0
    })
}
function selectList() {
    var a = $(".j_selectItems"),
		b = $(".datalist-box"),
		c = b.width();
    a.find("li").on("click", function () {
        var a = $(this),
			b = a.siblings();
        b.removeClass("on"), a.addClass("on")
    }), b.find(".textbox").on("focus", function () {
        var a = $(this),
			c = b.find(".select-list-on");
        c.hide(), b.css({
            "z-index": "auto"
        }), a.siblings(".select-list").show().addClass("select-list-on"), a.parent().css({
            "z-index": 100
        })
    }).on("change", function () {
        var a = $(this);
        a.siblings(".select-list").hide().removeClass("select-list-on"), a.parent().css({
            "z-index": "auto"
        })
    }).width(c - 10)
}
function multiCalendar() {
    $("input[data-multi-calendar]").on("focus", function () {
        var a = $(this),
			b = location.href.toLowerCase();
        $(".after-calendar").hide();
        var c = a.parent(),
			d = c.find(".after-calendar");
        if (!d.get(0)) {
            a.after('<div class="after-calendar ca-norm ca-norm-multi"></div>'), d = c.find(".after-calendar");
            var e = {
                jsonpUrl: "",
                latestDate: "",
                skipDays: b.indexOf("otrains.uzai.com") > -1 ? 7 : 0,
                extCallBack: function (b, c) {
                    d.find(".item").on("click", function () {
                        var b = $(this),
							c = b.hasClass("item-expiry") || b.hasClass("item-gray") || b.hasClass("item-unused");
                        if (!c) {
                            var e = b.attr("data-year"),
								f = b.attr("data-month"),
								g = b.attr("data-day");
                            a.val(e + "-" + f + "-" + g), d.hide()
                        }
                    })
                },
                preCallback: function (a, b) { }
            };
            d.jsonMultiCalendar(e)
        }
        d.show(), blankFix("j_afterCalendarWrap", "after-calendar")
    })
}
function countryControl() {
    var a = $("#j_jpCountryListNode");
    $("input[data-countries-trigger]").on("focus", function () {
        var b = $(this),
			c = b.next("input[type=hidden]");
        $(".countries-select-mod").hide(), $("#j_jpAllCountryFilter").remove();
        var d = b.parent(".countries-select-wrap"),
			e = b.siblings(".countries-select-mod");
        e.after('<ul class="hide city-filter-mod" id="j_jpAllCountryFilter"></ul>'), globalCountrySelect = $("#j_jpAllCountryFilter");
        var f = e.find(".countries-select-tab");
        f.get(0) || (e.html(a.html()), _uzw.ui.tab("countries-select-tab"), e.find(".select-item").on("click", function () {
            var a = $(this),
				f = a.find(".s1").text(),
				g = a.attr("data-code");
            b.val(f), c.val(g), e.hide(), d.css({
                "z-index": "auto"
            })
        })), e.show(), d.css({
            "z-index": 10
        }), blankFix("countries-select-wrap", "countries-select-mod", function () {
            d.css({
                "z-index": "auto"
            }), globalCountrySelect.find("li").not(".li-none").eq(0).click(), globalCountrySelect.remove()
        }), e.find(".close-wrap").on("click", function () {
            e.hide(), d.css({
                "z-index": "auto"
            })
        })
    })
}
function orderInvoice() {
    var a = document.getElementById("noNeedInvoice");
    a && (a.checked = !0), $("#needInvoice").on("focus", function () {
        var a = $(this);
        a.parents(".info-listing").find(".hide").show()
    }), $("#noNeedInvoice").on("focus", function () {
        var a = $(this);
        a.parents(".info-listing").find(".hide").hide()
    });
    var b = document.getElementById("whetherInvoice");
    b && (b.checked = !1), $("#whetherInvoice").on("change", function () {
        var a = $(this),
			c = a.parents(".invoice-info").find(".info-listing");
        b.checked ? c.show() : c.hide()
    });
    var c = document.getElementById("sameContacts");
    c && (c.checked = !0), $("#sameContacts").on("focus", function () {
        var a = $(this);
        a.parents("li").find(".hide").hide()
    }), $("#notSameContacts").on("focus", function () {
        var a = $(this);
        a.parents("li").find(".hide").show()
    })
}
function orderRefund() {
    var a = $(".refund-main");
    if (a.get(0)) {
        var b = a.find(".side").outerHeight(),
			c = a.find(".refund-box");
        b > c.outerHeight() && c.outerHeight(b)
    }
}
function orderStore() {
    var a = $("#j_popStoreInfo"),
		b = $("#j_selectingStore"),
		c = $("#j_storeChoose"),
		d = $("#selectedStore"),
		e = c.find(".selecting-cont"),
		f = e.siblings(".btn-modify"),
		g = $(".store-item"),
		h = null,
		i = function () {
		    _uzw.ui.mask.show(), a.show().on("click", ".j_popClose", function () {
		        _uzw.ui.mask.hide(), a.hide()
		    }), fixIe6("j_popStoreInfo")
		};
		$("#j_btnStore").on("click", function () {
		    i()
		}), f.on("click", function () {
		    i()
		}), g.on("click", function () {
		    var a = $(this);
		    g.removeClass("on"), a.addClass("on")
		}), c.on("click", ".store-item", function () {
		    var a = $(this),
			b = a.find(".store-hd").text();
		    e.text(b), h = a.find("input[name=cbStore]").val(), d.val(h), f.hasClass("hide") && f.removeClass("hide")
		}), a.on("click", ".store-item", function () {
		    var a = $(this),
			c = a.find(".store-hd").text();
		    b.val(c), h = a.find("input[name=cbStore]").val()
		}).on("click", ".btn-confirm", function () {
		    // -----------------关闭弹出面板时，将选择的门店地址显示到当前选择中 2016-07-25 added by gaochong-------------------
		    var storeId = $('#storeId').val();
		    var storeName = $('#storeName').val();
		    var storeAddress = $('#storeAddress').val();
		    var storeTel = $('#storeTel').val();
		    //debugger;
		    $('#selectedStoreName').html(storeName);
		    $('#selectedStoreAddress').html(storeAddress);
		    $('#selectedStoreTel').html(storeTel);
		    $('#salesDefaultStore').val(storeId);

		    $('#j_popStoreInfo').hide();
		    $('.dialog-full').hide();
		    // -----------------关闭弹出面板时，将选择的门店地址显示到当前选择中 2016-07-25 added by gaochong-------------------
		    var a = ($(this), $.trim(b.val()));
		    a && e.text(a), d.val(h), f.hasClass("hide") && f.removeClass("hide")
		})
}
function contentSwitch() {
    var a = $("#j_addrInfoListing");
    if (a.get(0)) {
        var b = a.find("input[name=addr]"),
			c = a.find("table.hide"),
			d = function (a) {
			    a.on("focus", function () {
			        var a = $(this),
						b = a.parents("li");
			        this.checked = !0, b.find(".hide-cont").show(), b.siblings("li").find(".hide-cont").hide()
			    })
			};
        b[1].checked && c.show().parents("li").siblings("li").find(".hide-cont").hide(), d(b.eq(0)), d(b.eq(1))
    }
    var e = document.getElementById("whetherVoucher");
    e && (e.checked = !1), $("#whetherVoucher").on("change", function () {
        var a = $(this),
			b = a.parents(".reimburse-info").find(".hide");
        e.checked ? b.show() : b.hide()
    })
}
function unitGanged() {
    var a = $("#j_addrInfoListing");
    if (a.get(0)) {
        var b = a.find("select[name=sltCity]"),
			c = b.siblings("select[name=sltArea]"),
			d = b.siblings("select[name=sltShop]");
        $.ajax({
            type: "GET",
            cache: "false",
            url: "/mall/GetAddressList",
            dataType: "json",
            success: function (a) {
                var e = a.listCity,
					f = e.length,
					g = b.siblings("address"),
					h = g.find(".addr-name"),
					i = [],
					j = [],
					k = "",
					l = 0,
					m = function (a, b) {
					    var c = b.length,
							d = "";
					    a[0].length = 0;
					    for (var e = 0; c > e; e++) d += '<option value="' + b[e] + '">' + b[e] + "</option>";
					    return d
					},
					n = function (a, b) {
					    var d = a[b].listArea,
							e = [];
					    for (var f in d) e[f] = d[f].AreaName;
					    var g = m(c, e);
					    c.append(g), o(d, 0)
					},
					o = function (a, b) {
					    var c = a[b].listStore,
							e = [];
					    for (var f in c) e[f] = c[f].StoreName;
					    var g = m(d, e);
					    d.append(g), p(c, 0)
					},
					p = function (a, b) {
					    h.val(a[b].StoreAddress)
					};
                if (e) {
                    for (var q = 0; f > q; q++) a.IPAddress.indexOf(e[q].cityName) >= 0 && (l = q), k += '<option value="' + e[q].cityName + '">' + e[q].cityName + "</option>";
                    b.append(k).on("change", function () {
                        var a = this.selectedIndex;
                        i = e[a].listArea, n(e, a)
                    }), c.on("change", function () {
                        var a = this.selectedIndex;
                        !i.length && (i = e[l].listArea), j = i[a].listStore, o(i, a)
                    }), d.on("change", function () {
                        var a = this.selectedIndex;
                        !i.length && (i = e[l].listArea), !j.length && (j = i[0].listStore), p(j, a)
                    }), n(e, l), b.find("option").eq(l).prop("selected", "selected")
                }
            },
            error: function (a) { }
        })
    }
}
function fixIe8(a) {
    _util.check.isIE678 && (a.hasClass("visibility-fix") ? a.removeClass("visibility-fix") : a.addClass("visibility-fix"))
}
function fixIe6(a, b) {
    var c = $("#" + a);
    c = c.get(0) ? c : $("." + a), b = b || $(window).height() / 2, _util.check.isIE6 && (c.css("top", $(document).scrollTop() + b), $(window).on("scroll", function () {
        c.css("top", $(document).scrollTop() + b)
    }))
}
var globalCountrySelect = null,
	_orderCheckTips = {
	    show: function (a, b, c) {
	        var d = a.parent(".tb-wrap"),
				e = "",
				f = "";
	        d.get(0) ? (b && d.find(".err-tips-cont").text(b), d.find(".err-tips").show()) : (a.hasClass("ml10") ? (a.removeClass("ml10"), e = "ml10") : a.hasClass("ml5") && (a.removeClass("ml5"), e = "ml5"), f += '<span class="err-tips">', f += '<span class="err-tips-cont f666 f12">' + b + "</span>", f += '<span class="arrow-icon f14 songti lh1"><em>鈼�</em><i>鈼�</i></span>', f += "</span>", a.wrap('<span class="tb-wrap ' + e + '"></span>'), a.parent(".tb-wrap").append(f)), c && c()
	    },
	    hide: function (a, b) {
	        a.parent(".tb-wrap").find(".err-tips").hide(), b && b()
	    }
	};
$(function () {
    orderSide(), tab("j_orderTab", function () {
        var a = $(".j_orderTab");
        if (_util.check.isIE678 && a.hasClass("store-tab")) {
            var b = a.parents(".main-box");
            b.css({
                visibility: "visible"
            })
        }
    }), tipsInfo(), selectList(), multiCalendar(), countryControl(), orderInvoice(), orderRefund(), orderStore(), contentSwitch(), unitGanged(), "undefined" != typeof window.comGlobalCountry && window.comGlobalCountry(), fixInputErr(), "function" == typeof PCAS && (new PCAS("province", "city", "area"), $("select[name=area1]").get(0) && new PCAS("province1", "city1", "area1"))
});
var orderLoading = {
    show: function () {
        $(".order-loading").remove(), $("body").append("<div class='order-loading'><img src='" + _uzw.ui.preloader + "' </div>");
        var a = $(".order-loading");
        if (_util.check.isIE6) {
            var b = $(window),
				c = function () {
				    a.css({
				        top: b.scrollTop() + b.height() / 2 - 15
				    })
				};
            a.show(), c(), $(window).scroll(function () {
                c()
            })
        } else a.show()
    },
    hide: function () {
        $(".order-loading").hide()
    }
};
    /*门店地图绑定开始*/
    StoreCityChange(); //其他门店绑定
    var storeMap = new BMap.Map("storeMapContainer"); // 创建地图实例
    storeMap.centerAndZoom(new BMap.Point(116.158061, 40.055466), 11);
    storeMap.addControl(new BMap.NavigationControl()); //地图平移缩放控件
    storeMap.addControl(new BMap.ScaleControl()); //比例尺
    storeMap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var mapIcon = new BMap.Icon("//r01.uzaicdn.com/content/v1/images/common/map-mark.gif", new BMap.Size(25, 29), { offset: new BMap.Size(27, 27) })
    //将所有门店位置标注在地图上
    $("#storeItems").children().each(function (i, n) {
        var obj = $(n);
        var longitude = obj.attr("data-longitude");
        var latitude = obj.attr("data-latitude");
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标 
        var marker = new BMap.Marker(point, { icon: mapIcon });        // 创建标注    
        storeMap.addOverlay(marker);                     // 将标注添加到地图中
        var infoWindow = new BMap.InfoWindow(obj.find(".store-hd").html() + "<br/><div style='max-width:300px;'>" + obj.find(".store-detail span").html() + "</div>");  // 创建信息窗口对象 
        marker.addEventListener("mouseover", function (e) {
            //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
            this.openInfoWindow(infoWindow);
        });
        marker.addEventListener("click", function (e) {
            //alert("当前位置：" + this.getPosition().lng + ", " + this.getPosition().lat);
            var lng = this.getPosition().lng;
            var lat = this.getPosition().lat;
            //var selCity = $("#selectStoreCity").find("option:selected").val();
            //var selArea = $("#selectStoreArea").find("option:selected").val();
            $("#storeItems").children().each(function (i, m) {
                var item = $(m);
                if (item.attr("data-longitude") == lng && item.attr("data-latitude") == lat) {
                    var cid = item.attr("data-city");
                    var aid = item.attr("data-area");
                    $('#selectStoreCity option').each(function () {
                        this.removeAttribute('selected');
                    });
                    $("#selectStoreCity option[value='" + cid + "']").attr('selected', true);
                    $("#selectStoreArea").html("");
                    $("#selectStoreArea").html($("#storeAreaOption option[data-city='" + cid + "']").clone());
                    $("#selectStoreArea option[value='" + aid + "']").attr('selected', true);
                    item.css("display", "block");
                    $(m).click();
                }
                else {
                    item.css("display", "none");
                }
            });
        });
    });
    $("#storeItems").children().click(function () {
        var obj = $(this);
        // --------------------获取从弹出面板中选择的门店信息，并存储至隐藏域 2016-07-25 added by choon ---------------------------
        var storeId = obj.find(">input[type='radio']").val();
        var storeName = obj.find(">span").html();
        var storeAddress = obj.find(">div").find(">span").html();
        var storeTel = "";
        var storeTelText = obj.find(">div").text();
        if (storeTelText) {
            var textArr = storeTelText.split("：");
            if (textArr) {
                storeTel = textArr[textArr.length - 1];
            }
        }
        $('#storeId').val(storeId);
        $('#storeName').val(storeName);
        $('#storeAddress').val(storeAddress);
        $('#storeTel').val(storeTel);
        // --------------------获取从弹出面板中选择的门店信息，并存储至隐藏域 2016-07-25 added by choon ---------------------------
        var longitude = obj.attr("data-longitude");
        var latitude = obj.attr("data-latitude");
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标  
        storeMap.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别       
    });
    //门店搜索
    $("#storeSearch").click(function () {
        var selCity = $("#selectStoreCity").find("option:selected").val();
        var selArea = $("#selectStoreArea").find("option:selected").val();
        var txt = $("#storeSearchText").val();
        if (txt == "") {
            StoreAreaChange();
        } else {
            $("#storeItems label").hide();
            $("#storeItems label[data-city='" + selCity + "']:contains('" + txt + "')").css("display", "block");
        }
    });
    /*门店地图绑定结束*/

//门店选择城市
function StoreCityChange() {
    var selCity = $("#selectStoreCity").find("option:selected").val();
    $("#selectStoreArea").html("");
    $("#selectStoreArea").html($("#storeAreaOption option[data-city='" + selCity + "']").clone());
    StoreAreaChange();
}
//门店选择区域
function StoreAreaChange() {
    var selCity = $("#selectStoreCity").find("option:selected").val();
    var selArea = $("#selectStoreArea").find("option:selected").val();
    $("#storeItems").children().each(function (i, n) {
        var obj = $(n);
        if (obj.attr("data-city") == selCity && obj.attr("data-area") == selArea) {
            obj.css("display", "block");
        }
        else {
            obj.css("display", "none");
        }
    });
}