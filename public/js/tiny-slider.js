// TINY SLIDER 1

  let slider_1 = tns({
    container: '.my-slider-1',
    animateIn: "jello",
    animateOut: "rollOut",
    slideBy: 1,
    speed: 400,
    nav: false,
    swipeAngle: false,
    autoplay: true,
    autoplayButtonOutput: false,
    controlsContainer: '#controls_1',
    prevButton: '.previous_1',
    nextButton: '.next_1',
    responsive: {
      1800: {
        items: 5,
        gutter: 20
      },
      1600: {
        items: 4,
        gutter: 20
      },
      1280: {
        items: 4,
        gutter: 20
      },
      768: {
        items: 2
      },
      480: {
        items: 1
      },
      320: {
        items: 1
      }
    }
  });

  // TINY SLIDER 2

  let slider_2 = tns({
    container: '.my-slider-2',
    animateIn: "jello",
    animateOut: "rollOut",
    slideBy: 'page',
    speed: 400,
    nav: false,
    swipeAngle: false,
    controlsContainer: '#controls_2',
    prevButton: '.previous_2',
    nextButton: '.next_2',
    responsive: {
      1800: {
        items: 5,
        gutter: 20
      },
      1600: {
        items: 4,
        gutter: 20
      },
      1280: {
        items: 4,
        gutter: 20
      },
      768: {
        items: 2
      },
      480: {
        items: 1
      },
      320: {
        items: 1
      }
    }
  });