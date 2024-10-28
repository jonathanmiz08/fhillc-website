/*const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar_menu')
menu.addEventListener('click', function () {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active');
})

 */

import Masonry from 'masonry-layout';

/*
window.onload = () => {
    const grid = document.querySelector('.grid');
    const masonry = new Masonry(grid, {
        itemSelector: '.grid-item',
        gutter: 10,
        originLeft: false,
        originTop: false,
    });
    masonry.on('layoutComplete', () => console.log('Layout Complete'));
};

 */
import Masonry from 'masonry-layout';

const $grid = $('.grid').imagesLoaded(() => {
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        fitWidth: true,
    })
});

