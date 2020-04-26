let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
    //Init Controller
    controller = new ScrollMagic.Controller();

    //Select Some things
    const slides = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');

    slides.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        //GSAP
        const slideTimeline = gsap.timeline({
            defaults: {duration: 1, ease: 'power2.inOut'},
        });
        slideTimeline.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        slideTimeline.fromTo(img, {scale: 2}, {scale: 1}, '-=1');
        slideTimeline.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75');

        //this create a bug
        // slideTimeline.fromTo(nav, {y: '-100%'}, {y: '0%'}, '-=0.5');

        //Create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            // duration: '50%',
            triggerHook: 0.25,
            reverse: false,
        })
            .setTween(slideTimeline)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide',
            // })
            .addTo(controller);

        //New ANimatiomn
        const pageTimeline = gsap.timeline();

        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        if (nextSlide === 'end') {
            return false;
        }
        pageTimeline.fromTo(nextSlide, {y: '0%'}, {y: '50%'});

        pageTimeline.fromTo(
            slide,
            {opacity: 1, scale: 1},
            {opacity: 0, scale: 0.5}
        );

        pageTimeline.fromTo(nextSlide, {y: '50%'}, {y: '0%'}, '-=0.50');

        //Create New scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0,
        })
            .setPin(slide, {pushFollowers: false})
            .setTween(pageTimeline)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'page',
            //     indent: 200,
            // })
            .addTo(controller);
    });
}

let mouse = document.querySelector('.cursor');
let mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.burger');

function cursor(e) {
    mouse.style.top = e.clientY + 'px';
    mouse.style.left = e.clientX + 'px';
}

function activeCursor(e) {
    const item = e.target;

    if (item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }

    if (item.classList.contains('nav-single-link')) {
        mouse.classList.add('nav-link-active');
    } else {
        mouse.classList.remove('nav-link-active');
    }

    if (item.classList.contains('explore')) {
        mouse.classList.add('explore-active');
        mouseTxt.innerText = 'Tap';
        gsap.to('.title-swipe', 1, {y: '0%'});
    } else {
        mouse.classList.remove('explore-active');
        mouseTxt.innerText = '';
        gsap.to('.title-swipe', 1, {y: '100%'});
    }
}

function navToggle(e) {
    if (e.target.classList.toggle('active')) {
        gsap.to('.line1', 0.5, {rotate: '45', y: 5, background: 'black'});
        gsap.to('.line2', 0.5, {rotate: '-45', y: -5, background: 'black'});
        gsap.to('#logo', 1, {color: 'black'});
        gsap.to('.nav-bar', 1, {clipPath: 'circle(2500px at 100% -10%)'});
        document.body.classList.add('hide');
    } else {
        gsap.to('.line1', 0.5, {rotate: '0', y: 0, background: 'white'});
        gsap.to('.line2', 0.5, {rotate: '0', y: 0, background: 'white'});
        gsap.to('#logo', 1, {color: 'white'});
        gsap.to('.nav-bar', 1, {clipPath: 'circle(50px at 100% -10%)'});
        document.body.classList.remove('hide');
    }
}

//Barba page transition
const logo = document.querySelector('#logo');
barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                animateSlides();
                logo.href = './index.html';
            },
            beforeLeave() {
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            },
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html';
                detailAnimation();
            },
            beforeLeave() {
                controller.destroy();
                detailScene.destroy();
            },
        },
    ],
    transitions: [
        {
            leave({current, next}) {
                let done = this.async();

                //An Animation
                const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
                tl.fromTo(current.container, 1, {opacity: 1}, {opacity: 0});
                tl.fromTo(
                    '.swipe',
                    0.75,
                    {x: '-100%'},
                    {x: '0%', onComplete: done}
                );
            },
            enter({current, next}) {
                let done = this.async();

                //Scroll to the top
                window.scrollTo(0, 0);

                //An Animation
                const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
                tl.fromTo(
                    '.swipe',
                    0.75,
                    {x: '0%'},
                    {x: '100%', stagger: 0.25, onComplete: done}
                );
                tl.fromTo(next.container, 1, {opacity: 0}, {opacity: 1});
                tl.fromTo(
                    '.nav-header',
                    1,
                    {y: '-100%'},
                    {y: '0%', ease: 'power2.inOut'}
                );
            },
        },
    ],
});

function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({
            defaults: {
                duration: 1,
            },
        });
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');

        //Set some delay
        slideTl.fromTo(nextSlide, {y: '0%'}, {y: '100%'});

        slideTl.fromTo(slide, {opacity: 1}, {opacity: 0});
        slideTl.fromTo(nextSlide, {y: '100%'}, {y: '0%'}, '-=0.50');
        slideTl.fromTo(nextSlide, {opacity: 0}, {opacity: 1}, '-=1');
        slideTl.fromTo(nextImg, {x: '50%'}, {x: '0%'}, '-=1');

        //Scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0,
        })
            .setPin(slide, {pushFollowers: false})
            .setTween(slideTl)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'detail',
            //     indent: 200,
            // })
            .addTo(controller);
    });
}

// Event Listenres
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

// animateSlides();
