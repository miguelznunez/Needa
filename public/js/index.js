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
  "animateIn": "jello",
  "animateOut": "rollOut",
  "slideBy": '1',
  "speed": 400,
  "nav": false,
  "swipeAngle": false,
  controlsContainer: '#controls_1',
  prevButton: '.previous_1',
  nextButton: '.next_1',
  responsive: {
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
  "animateIn": "jello",
  "animateOut": "rollOut",
  "slideBy": 'page',
  "speed": 400,
  "nav": false,
  "swipeAngle": false,
  controlsContainer: '#controls_2',
  prevButton: '.previous_2',
  nextButton: '.next_2',
  responsive: {
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

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Hide cookie message and call setCookie function on the click of the "I agree" button
document.querySelector("#cookies-btn").addEventListener("click", () => {
  document.querySelector("#cookies").style.display = "none";
  setCookie("cookie", true, 30);
})

// Set a cookie function (expires in 30 days)
function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

// Get the value of a cookie function
function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded .split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res;
}

// Check if a cookie does not exists ( display the cookie consent message )
function cookieMessage() {
  if (!getCookie("cookie"))
    document.querySelector("#cookies").style.display = "block";
}

// var result = document.getElementById("json-result");
const Http = new XMLHttpRequest();
function getLocation() {
    console.log("getLocation Called");
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    navigator.geolocation.getCurrentPosition(
        (position) => {
            bdcApi = bdcApi
                + "?latitude=" + position.coords.latitude
                + "&longitude=" + position.coords.longitude
                + "&localityLanguage=en";
            getApi(bdcApi);

        },
        (err) => { getApi(bdcApi); },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
}

function getApi(bdcApi) {
    Http.open("GET", bdcApi);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // result.innerHTML = this.responseText;
            console.log(this.responseText);
        }
    };
}

window.addEventListener("load", () => {
  // getLocation();
  cookieMessage();
});