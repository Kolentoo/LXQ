'use strict';$('#j_chanel').find('li').on('click',function(){var o=$(this);var op=o.siblings('li');op.find('.box-hide').hide();o.find('.box-hide').show()});
