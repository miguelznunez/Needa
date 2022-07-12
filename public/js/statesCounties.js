async function loadStates() {
  let url = "https://cst336.herokuapp.com/projects/api/state_abbrAPI.php";
  let response = await fetch(url);
  let data = await response.json();
  data.forEach(function (i) {
    var state = document.createElement("option");
    state.textContent = i.state;
    state.value = i.usps;
    document.querySelector("#user-state").appendChild(state);
  });
};

async function addCounties() {
  const state = document.querySelector("#user-state").value;
  const res = await fetch("/data/counties.json");
  const counties = await res.json();

  document.querySelector("#county").innerHTML = "";
  var county = document.createElement("option");
  county.textContent = "County";
  county.value = "";
  document.querySelector("#county").appendChild(county);
  counties[state].forEach(c => {
    var county = document.createElement("option");
    county.textContent = c;
    county.value = c;
    document.querySelector("#county").appendChild(county);
  })
  }

window.addEventListener("load", loadStates);