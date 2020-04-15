let controller;
let slideScene;

function animateSlides() {
    //Init Controller
    controller = new ScrollMagic.Controller();

    //Select Some things
    const slides = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');

    slides.forEach( slide => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        //GSAP
        const slideTimeline = gsap.timeline({defaults: {duration: 1, ease: 'power2.inOut'}})
        slideTimeline.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        slideTimeline.fromTo(img, {scale:2}, {scale:1}, '-=1');
        slideTimeline.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75');
        slideTimeline.fromTo(nav, {y: '-100%'}, {y: '0%'}, '-=0.5')
    } )
}

animateSlides();