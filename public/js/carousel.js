 const images = ["/images/carpenter.webp", "/images/barber.webp", "/images/djs.webp", "/images/lessons.webp"],
  carousel = document.querySelector("#carousel"),
  submitBtn = document.querySelector("#submitBtn"),
  interval = setInterval(function () {
    startCarousel();
  }, 8000);

  let index = 1;

  // CAROUSEL

  startCarousel = () => {
    carousel.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0, 0, 0, 0.7)), url(${images[index++]})`;
    carousel.classList.remove("fade");
    void carousel.offsetWidth;
    carousel.classList.add("fade");
    if (index > images.length - 1) index = 0;
  }