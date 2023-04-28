const hamburger = document.querySelector('.hamburger');
const mobile_menu = document.querySelector('.mobile-menu');

const discord_svg = document.querySelector('#discord');
const twitter_svg = document.querySelector('#twitter');
const instagram_svg = document.querySelector('#instagram');

const FAVICON_WHITE = "src/theoccultlogolaunchw.png";
const FAVICON_BLACK = "src/theoccultlogolaunch.png";

const MAX_SIZE = 2;
const door = document.querySelector('#door');
const link = document.querySelector("link[rel~='icon']");
let zoom = 1;
const zoomingSpeed = 0.1;


const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', themeChange)

function themeChange(event) {
    if (event.matches) {
        link.href = FAVICON_WHITE;
    } else {
        link.href = FAVICON_BLACK;
    }
}


hamburger.addEventListener('click', function () {
    this.classList.toggle('is-active');
    mobile_menu.classList.toggle('is-active');
    document.querySelector('.body').classList.toggle('overlay');
});

/* Change SVG color */

discord_svg.addEventListener('mouseover', function () {
    this.style.fill = '#e81747'
});
discord_svg.addEventListener('mouseout', function () {
    this.style.fill = '#fff'
});

twitter_svg.addEventListener('mouseover', function () {
    this.style.fill = '#e81747'
});
twitter_svg.addEventListener('mouseout', function () {
    this.style.fill = '#fff'
});

instagram_svg.addEventListener('mouseover', function () {
    this.style.fill = '#e81747'
});
instagram_svg.addEventListener('mouseout', function () {
    this.style.fill = '#fff'
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }// else {
        //    entry.target.classList.remove('show');
        //}
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));