$(function () {
    $('.announcement-notification li').hide(); // hide all slides
    $('.announcement-notification li:first-child').show(); // show first slide
    setInterval(function () {
        $('.announcement-notification li:first-child').fadeOut(200, function () {
            $(this).next('li').fadeIn(400).end().appendTo('.announcement-notification ul');
        })
    },
    1000); // slide duration
});