const slider_1 = tns({
  container: '.slider-1',
  animateIn: "jello",
  animateOut: "rollOut",
  slideBy: 1,
  speed: 400,
  nav: false,
  swipeAngle: false,
  autoplay: true,
  autoplayButtonOutput: false,
  controlsContainer: '#controls-1',
  prevButton: '.prev-1',
  nextButton: '.next-1',
  responsive: {
    1700: {
      items: 5,
      gutter: 15
    },
    1280: {
      items: 4,
      gutter: 15
    },
    1024: {
      items: 3,
      gutter: 15
    },
    768: {
      items: 2,
      gutter: 15
    },
    480: {
      items: 1
    }
  }
});

const slider_2 = tns({
  container: '.slider-2',
  animateIn: "jello",
  animateOut: "rollOut",
  slideBy: 1,
  speed: 400,
  nav: false,
  swipeAngle: false,
  autoplay: true,
  autoplayTimeout: 6000,
  autoplayButtonOutput: false,
  controlsContainer: '#controls-2',
  prevButton: '.prev-2',
  nextButton: '.next-2',
  responsive: {
    1700: {
      items: 5,
      gutter: 15
    },
    1280: {
      items: 4,
      gutter: 15
    },
    1024: {
      items: 3,
      gutter: 15
    },
    768: {
      items: 2,
      gutter: 15
    },
    480: {
      items: 1
    }
  }
});

 const slider_3 = tns({
    container: ".slider-3",
    animateIn: "jello",
    animateOut: "rollOut",
    slideBy: 1,
    speed: 700,
    nav: true,
    navPosition: "bottom",
    swipeAngle: false,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayButtonOutput: false,
    controlsContainer: '#controls-3',
    prevButton: ".prev-3",
    nextButton: ".next-3",
    responsive: {
      1700: {
        items: 1
      }
    }
  });
