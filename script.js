var mobile = false,
mobileFunction = function () {
    if (mobile){
        $('.header-phones').appendTo('.header-phones-mobile');
    } else {
        $('.header-phones').appendTo('header');
    }
};
$(document).ready(function() {
    $(window).resize(function () {
        if (($(window).width()<1200) && !mobile){
            mobile = true;
            mobileFunction();
        } else if (($(window).width()>=1200) && mobile){
            mobile = false;
            mobileFunction();
        }
    }).trigger('resize');
});