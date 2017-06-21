$(function() {
    qaSideMenu(); 
});

function qaSideMenu() {
    var oSM = $('#j_sideMenu');

    oSM.find('.menu-item').on('click', function() {
        var oThis = $(this),
            op = oThis.parent('.mi-wrap'),
            os = op.siblings();

        if (op.hasClass('on')) {
            op.removeClass('on');
        } else {
            os.removeClass('on');
            op.addClass('on');
        }
    });
}