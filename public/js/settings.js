window.addEventListener("load", loadStates);

async function loadStates(){
  let url = "https://cst336.herokuapp.com/projects/api/state_abbrAPI.php";
  let response = await fetch(url);
  let data = await response.json();
  data.forEach( function(i){ 
    var state = document.createElement("option");
    state.textContent = i.state;
    state.value = i.usps;
    document.querySelector("#state").appendChild(state);
  });
};



