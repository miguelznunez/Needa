const images = ["/images/barber.png", "/images/dj.png", "/images/lessons.jpg", "/images/carpenter.png"];
const carousel = document.querySelector("#carousel");
const interval = setInterval(function() {
   startCarousel();
 }, 7000);
var index = 1;

startCarousel = () => {
  carousel.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0, 0, 0, 0.7)), url(${images[index++]})`;
  carousel.classList.remove("fade");
  void carousel.offsetWidth;
  carousel.classList.add("fade");
  if(index > images.length - 1) index = 0;
}

  // TINY SLIDER
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

