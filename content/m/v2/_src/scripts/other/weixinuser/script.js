"use strict";

/* 
 * @Author: lxq
 * @Date:   2015-12-02 11:05:44
 * @Last Modified by:   anchen
 * @Last Modified time: 2015-12-03 15:04:53
 */

$(function () {
    var ibtn = $('#j_inforBtn');
    var pop = function (obj, v) {
        _uzm.pop.toast(v);
    };
    // ibtn.on('click', function () {
    // 提交表单
    var idetail = $('#j_inforDetail');
    idetail.on('submit', function () {
        var ibtn = $('#j_inforBtn');
        if (ibtn.hasClass('btn-off') || ibtn.val() == '已完成') {
            return false;
        }
        var sb = [];
        var _push = function (obj, name) {
            if (obj.val()) {
                sb.push(name + '=' + obj.val());
            }
        };
        var pi = $('#j_personalInfor');
        var username = pi.find('input[name=username]');
        var mobile = pi.find('input[name=mobile]');
        var job = pi.find('input[name=job]');
        var data = pi.find('input[name=data]');
        var sex = pi.find('input[name=man]');
        var height = pi.find('input[name=height]');
        var weight = pi.find('input[name=weight]');
        var outbound = pi.find('input[name=outbound]');
        var destination = pi.find('input[name=destination]');
        var interest = pi.find('input[name=interest]');
        if (!username.val()) {
            pop(username, '请输入姓名');
            return false;
        } else {
            _push(username, 'username');
        }
        if (!mobile.val()) {
            pop(mobile, '请填写手机号');
            return false;
        } else {
            var r = _uzm.regex.mobile;
            var isValid = new RegExp(r).test(mobile.val());
            if (!isValid) {
                pop(mobile, '请填写正确的手机号');
                return false;
            } else {
                _push(mobile, 'mobile');
            }
        }

        if (!data.val()) {
            pop(data, '请输入出生年月');
            return false;
        } else {
            _push(data, 'data');
        }
        if (!job.val()) {
            pop(job, '请输入职业');
            return false;
        } else {
            _push(job, 'job');
        }
        if (!height.val()) {
            pop(height, '请输入身高');
            return false;
        } else {
            _push(height, 'height');
        }
        if (!weight.val()) {
            pop(weight, '请输入体重');
            return false;
        } else {
            _push(weight, 'weight');
        }

        return true;
    });
});