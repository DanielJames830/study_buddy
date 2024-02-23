document.addEventListener('DOMContentLoaded', function () {
    var parent = document.querySelector('.paralaxBackdrop');
    var children = document.querySelectorAll('.floater');
    var scrollSpeed = 0.5; // Adjust this value to change the scroll speed

    window.addEventListener('scroll', function () {
        var scrollPosition = this.scrollY;

        parent.style.transform = 'translateY(' + -scrollPosition * scrollSpeed + 'px)';

        children.forEach(function (child) {
            child.style.transform = 'translateY(' + scrollPosition * scrollSpeed + 'px)';
        });
    });
});