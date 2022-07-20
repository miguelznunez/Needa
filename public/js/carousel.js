 const webpImages = ["/images/carpenter.webp", "/images/barber.webp", "/images/djs.webp", "/images/lessons.webp"],
  carousel = document.querySelector("#carousel"),
  submitBtn = document.querySelector("#submitBtn");
  interval = setInterval(function () {
    startCarousel();
  }, 8000);

  let index = 1;
  // let index2 = 1;

  // CAROUSEL

  startCarousel = () => {
    // carousel.style.backgroundImage = `url(${pngImages[index1++]}), url(${webpImages[index2++]})`;
    carousel.style.backgroundImage = `url(${webpImages[index++]})`;
    carousel.classList.remove("fade");
    void carousel.offsetWidth;
    carousel.classList.add("fade");
    if (index > webpImages.length - 1) {
      index = 0;
      // index2 = 0;
    }
  }