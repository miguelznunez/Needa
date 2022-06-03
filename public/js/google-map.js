let map,
infoWindow,
currentLocation = document.querySelector("#current-location"),
locationObject = localStorage.getItem('item') ? JSON.parse(localStorage.getItem('item')) : "",
locationSRC = document.querySelector("#location-src"); 

const Http = new XMLHttpRequest(),
useMyCurrentLocationBtn = document.querySelector("#use-my-current-location-btn"),
updateLocationInput = document.querySelector("#update-location-input"),
updateLocationBtn = document.querySelector("#update-location-btn"),
overlay = document.querySelector("#location-modal-overlay"),
showModalBtn = document.querySelector("#location-show-modal-btn"),
closeModalBtn = document.querySelector("#location-close-modal-btn");

if(showModalBtn)
  showModalBtn.addEventListener("click", () => {
    overlay.style.display = "block";
  })

if(closeModalBtn)
  closeModalBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  })

// HELPER FUNCTION

function titleCaseAll(string) {
  const splitString = (string === "") ? null : string.toLowerCase().split(' ');
  if(splitString){
    for (let i = 0; i < splitString.length; i++) 
      splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);   
    return splitString.join(' ');
  } 
  return splitString;   
}

// EVENT LISTENERS

useMyCurrentLocationBtn.addEventListener("click", function() {
  findMyLocation();
});

updateLocationBtn.addEventListener("click", function() {
  updateMyLocation();
})

updateLocationInput.addEventListener("keydown", function(event) {
  if(event.key == "Enter")
    updateMyLocation();
});


// DEFAULT COORDINATES

if(!locationObject){
  locationSRC.src = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDLVBTACqJtv8Od3WvXYZPV3kXZtDUwBrk&center=39.8283,-98.5795&zoom=4`;
} else {
  currentLocation.textContent = `${locationObject.city}, ${locationObject.state}`;
  document.querySelector("#location").value = `${locationObject.city}, ${locationObject.state}`;
  locationSRC.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDLVBTACqJtv8Od3WvXYZPV3kXZtDUwBrk&q=${locationObject.city},${locationObject.state}&zoom=12`;
  document.querySelector("#location-show-modal-btn").style.color = "#7449F5";
}

// LOGIC FUNCTIONS

function findMyLocation() {
  const success = (position) => {
    let bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";
    bdcApi = bdcApi
      + "?latitude=" + position.coords.latitude
      + "&longitude=" + position.coords.longitude
      + "&localityLanguage=en";
    getApi(bdcApi);
  }
  const error = () => {
    currentLocation.textContent = "Unavailable";
    document.querySelector("#location").value = "";
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function getApi(bdcApi) {
  Http.open("GET", bdcApi);
  Http.send();
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      const state = data.principalSubdivisionCode.split("-");
      locationObject = {
        "city"       : titleCaseAll(data.city),
        "state"      : state[1].toUpperCase()
      }
      updateLocationInput.value = "";
      localStorage.setItem('item', JSON.stringify(locationObject));
      currentLocation.textContent = `${locationObject.city}, ${locationObject.state}`;
      document.querySelector("#location").value = `${locationObject.city}, ${locationObject.state}`;
      locationSRC.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDLVBTACqJtv8Od3WvXYZPV3kXZtDUwBrk&q=${locationObject.city},${locationObject.state}&zoom=12`;
      document.querySelector("#location-show-modal-btn").style.color = "#7449F5";
    }
  };
}

function updateMyLocation() {
  const isValidCityState = /^([a-zA-Z ]+)(?:,([ A-Za-z]{3}))$/.test(updateLocationInput.value);

  if(isValidCityState){
    let location = updateLocationInput.value.split(",");
    locationObject = {
      "city"       : titleCaseAll(location[0]),
      "state"      : location[1].replace(/\s+/g, '').toUpperCase()
    }
    updateLocationInput.value = "";
    localStorage.setItem('item', JSON.stringify(locationObject));
    currentLocation.textContent = `${locationObject.city}, ${locationObject.state}`;
    document.querySelector("#location").value = `${locationObject.city}, ${locationObject.state}`;
    locationSRC.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDLVBTACqJtv8Od3WvXYZPV3kXZtDUwBrk&q=${locationObject.city},${locationObject.state}&zoom=12`;
  } else {
    console.log("wrong!")
  }
}