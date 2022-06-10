let slider_1 = tns({
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
    1600: {
      items: 5,
      gutter: 15
    },
    1280: {
      items: 5,
      gutter: 15
    },
    768: {
      items: 2,
      gutter: 15
    },
    480: {
      items: 1
    },
    320: {
      items: 1
    }
  }
});

let slider_2 = tns({
  container: '.slider-2',
  animateIn: "jello",
  animateOut: "rollOut",
  slideBy: 1,
  speed: 400,
  nav: false,
  swipeAngle: false,
  autoplay: true,
  autoplayButtonOutput: false,
  controlsContainer: '#controls-2',
  prevButton: '.prev-2',
  nextButton: '.next-2',
  responsive: {
    1700: {
      items: 5,
      gutter: 15
    },
    1600: {
      items: 5,
      gutter: 15
    },
    1280: {
      items: 5,
      gutter: 15
    },
    768: {
      items: 2,
      gutter: 15
    },
    480: {
      items: 1
    },
    320: {
      items: 1
    }
  }
});