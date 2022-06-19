 const webpImages = ["/images/carpenter.webp", "/images/barber.webp", "/images/djs.webp", "/images/lessons.webp"],
  pngImages = ["/images/carpenter.png", "/images/barber.png", "/images/djs.png", "/images/lessons.jpg"],
  carousel = document.querySelector("#carousel"),
  submitBtn = document.querySelector("#submitBtn"),
  interval = setInterval(function () {
    startCarousel();
  }, 8000);

  let index1 = 1;
  let index2 = 1;

  // CAROUSEL

  startCarousel = () => {
    carousel.style.backgroundImage = `url(${pngImages[index1++]}), url(${webpImages[index2++]})`;
    carousel.classList.remove("fade");
    void carousel.offsetWidth;
    carousel.classList.add("fade");
    if (index1 > webpImages.length - 1) {
      index1 = 0;
      index2 = 0;
    }
  }