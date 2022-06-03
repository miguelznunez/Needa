// TINY SLIDER 1

  let slider_1 = tns({
    container     : '.my-slider-1',
    animateIn     : "jello",
    animateOut    : "rollOut",
    slideBy       : 1,
    speed         : 400,
    nav           : false,
    swipeAngle    : false,
    autoplay      : true,
    autoplayButtonOutput: false,
    controlsContainer: '#controls-1',
    prevButton: '.previous-1',
    nextButton: '.next-1',
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

  document.querySelector(".previous-2").addEventListener("click", () => {
    console.log("hey");
  })

  let slider_2 = tns({
    container: '.my-slider-2',
    animateIn: "jello",
    animateOut: "rollOut",
    slideBy: 1,
    speed: 400,
    nav: false,
    swipeAngle: false,
    autoplay: true,
    autoplayButtonOutput: false,
    controlsContainer: '#controls-2',
    prevButton: '.previous-2',
    nextButton: '.next-2',
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