const images = ["/images/barber.png", "/images/dj.png", "/images/lessons.jpg", "/images/carpenter.png"],
carousel = document.querySelector("#carousel"),
submitBtn = document.querySelector("#submitBtn"),
toast = document.querySelector(".toast"),
iconContainer = document.querySelector(".icon-container"),
messageContainer = document.querySelector(".message-container"),
closeToast = document.querySelector("#closeToast"),
interval = setInterval(function() {
   startCarousel();
 }, 8000);

let x,
index = 1,
msg = "";

// CAROUSEL

startCarousel = () => {
  carousel.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0, 0, 0, 0.7)), url(${images[index++]})`;
  carousel.classList.remove("fade");
  void carousel.offsetWidth;
  carousel.classList.add("fade");
  if(index > images.length - 1) index = 0;
}

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

// TOAST FUNCTIONALITY

closeToast.addEventListener("click", () => {
  toast.style.transform = "translateX(400px)";
})

const toastOptions = {
  'success' : {class: "fas fa-check-circle", color: "#47d764", header: "Success"},
  'error'   : {class: "fas fa-times-circle", color: "#ff1616", header: "Error"},
  'info'    : {class: "fas fa-info-circle", color: "#2F86EB", header: "Info"},
  'warning' : {class: "fas fa-exclamation-circle", color: "#FFC021", header: "Warning"}
}

function displayToast(type, msg){
  clearTimeout(x);
  toast.style.borderLeft = `8px solid ${toastOptions[type].color}`;
  toast.style.transform = "translateX(0)";

  const icon = document.createElement("i");
  const header = document.createElement("p");
  const message = document.createElement("p");

  icon.className = toastOptions[type].class;
  icon.style.color = toastOptions[type].color;
  header.textContent = toastOptions[type].header;
  message.textContent = msg;

  iconContainer.innerHTML = "";
  iconContainer.appendChild(icon);

  messageContainer.innerHTML = "";
  messageContainer.appendChild(header);
  messageContainer.appendChild(message);

  x = setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    // toast.style.transform = "translateX(-400px)";
  }, 5000);  
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const profession = document.querySelector("#profession").value;
  const location = document.querySelector("#location").value;

  const isValidProfession = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(profession);
  const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(location);
  const isValidCityState = /^([a-zA-Z ]+)(?:,([ A-Za-z]{3}))$/.test(location);

  if(isValidProfession && isValidZip) {
    document.querySelector("#zip").value = location;
    document.querySelector("#findProsForm").submit();
  } else if (isValidProfession && isValidCityState) {
    const arrLocation = location.replace(/\s/g, '').split(',');
    document.querySelector("#city").value = arrLocation[0];
    document.querySelector("#state").value = arrLocation[1]
    document.querySelector("#findProsForm").submit();
  } else {
    displayToast("warning", "The data you entered is invalid.");
  }
})

// const Http = new XMLHttpRequest();

// function getLocation() {
//     var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             bdcApi = bdcApi
//                 + "?latitude=" + position.coords.latitude
//                 + "&longitude=" + position.coords.longitude
//                 + "&localityLanguage=en";
//             getApi(bdcApi);

//         },
//         (err) => { getApi(bdcApi); },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0
//         });
// }

// function getApi(bdcApi) {
//     Http.open("GET", bdcApi);
//     Http.send();
//     Http.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             // result.innerHTML = this.responseText;
//             console.log(this.responseText);
//         }
//     };
// }

    