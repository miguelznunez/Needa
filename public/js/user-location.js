const Http = new XMLHttpRequest(),
forms = document.querySelectorAll(".my-form");
let myLocation = document.querySelectorAll(".my-location");

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

function getCoordinates() {
  let bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

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
    forms.forEach(f => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        displayToast("error", "Sorry, your browser does not support Geolocation. Please input profession, city, state, or zip manually.")
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
      state = data.principalSubdivisionCode.split("-");
      locationObject = {
        "city"       : titleCaseAll(data.city),
        "state"      : state[1].toUpperCase()
      }
      myLocation.forEach(l => {
        l.value = `${locationObject.city}, ${locationObject.state}`;
      })
    }
  };
}

window.addEventListener("load", getCoordinates);