const Http = new XMLHttpRequest(),
forms = document.querySelectorAll(".my-form"),
overlay = document.querySelector("#location-modal"),
currentLocationBtn = document.querySelector("#user-current-location-btn"),
showModalBtn = document.querySelector("#location-show-modal-btn"),
closeModalBtn = document.querySelector("#location-close-modal-btn");

let map,infoWindow, administrative, state, locationObject, 
currentLocation = document.querySelector("#current-location"),
myLocation = document.querySelectorAll(".my-location");

showModalBtn.addEventListener("click", () => {
  overlay.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});

currentLocationBtn.addEventListener("click", () => {
  getCoordinates();
});

function getCoordinates() {
  let bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  if(navigator.geolocation){
    let giveUp = 1000 * 30; // Attempt to retrive users location for = 30 seconds
    let tooOld = 1000 * 30 * 30; //cache their position for = 30 minutes
    navigator.geolocation.getCurrentPosition(
      (position) => {
        bdcApi = bdcApi
            + "?latitude=" + position.coords.latitude
            + "&longitude=" + position.coords.longitude
            + "&localityLanguage=en";
        getLocation(bdcApi);
      },
      (err) => { 
        currentLocation.style.color = "orange";
        currentLocation.textContent = "Oops! Please enable your browsers Geolocation.";
        forms.forEach(f => {
          f.addEventListener("submit", (e) => {
            e.preventDefault();
            displayToast("warning", "Please enable your browsers Geolocation to use this feature or input profession, city, state, or zip manually.")
          });
        })
      },
      {
        enableHighAccuracy: true,
        timeout: giveUp,
        maximumAge: tooOld
      });
  } else {
    currentLocation.textContent = "Sorry, your browser does not support Geolocation";
    forms.forEach(f => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        displayToast("warning", "Sorry, your browser does not support Geolocation. Please input profession, city, state, or zip manually.")
      });
    })
  }
}

function getLocation(bdcApi) {
  Http.open("GET", bdcApi);
  Http.send();
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      setDynamicSettings(data);
      getGoogleMap(data.latitude, data.longitude);
    }
  };
}

function setDynamicSettings(data){
  state = data.principalSubdivisionCode.split("-");
  locationObject = {
    "city"       : titleCaseAll(data.city),
    "state"      : state[1].toUpperCase()
  }
  myLocation.forEach(l => {
    l.value = `${locationObject.city}, ${locationObject.state}`;
  });
  currentLocation.textContent = `${locationObject.city}, ${locationObject.state}`;
  document.querySelector("#location").value = `${locationObject.city}, ${locationObject.state}`;
  showModalBtn.style.color = "#7449F5";
}

function getGoogleMap(latitude, longitude) {
  const myLatLng = { lat: latitude, lng: longitude };
  const map = new google.maps.Map(document.querySelector(".map-container"), {
    center: myLatLng,
    zoom: 15
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello!",
  });
}

function titleCaseAll(string) {
  const splitString = (string === "") ? null : string.toLowerCase().split(' ');
  if(splitString){
    for (let i = 0; i < splitString.length; i++) 
      splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);   
    return splitString.join(' ');
  } 
  return splitString;   
}