let files = [], // STORE THE PHOTOS
showcaseForm = document.querySelector("#showcaseForm"), // form id
form = document.querySelector('.showcase-photos'), // form ( drag area )
text = document.querySelector('.inner'), // inner text of form
browse = document.querySelector('.select'), // "Browse" to run input field
input = document.querySelector('.showcase-photos input'), // file input
container = document.querySelector('.images-container'); // container in which images will be inserted

browse.addEventListener('click', () => input.click());

// INPUT CHANGE EVENT 
input.addEventListener('change', () => {
	let file = input.files;

	for (let i = 0; i < file.length; i++) {
		if (files.every(e => e.name !== file[i].name)) files.push(file[i])
	}

	// input.value = "";
  showcaseForm.reset();
	showImages();
})

// DISPLAY PHOTOS

const showImages = () => {
	let images = '';
	files.forEach((e, i) => {
		images += `<div class="image">
    			<img src="${URL.createObjectURL(e)}" alt="image">
    			<span onclick="delImage(${i})">&times;</span>
    		</div>`
	})

	container.innerHTML = images;
} 

// DELETE A PHOTO

const delImage = index => {
	files.splice(index, 1)
	showImages()
} 

// DRAG AND DROP

form.addEventListener('dragover', e => {
	e.preventDefault()

	form.classList.add('dragover')
	text.innerHTML = 'Drop images here'
})

form.addEventListener('dragleave', e => {
	e.preventDefault()

	form.classList.remove('dragover')
	text.innerHTML = 'Drag & drop image here or <span class="select">Browse</span>'
})

form.addEventListener('drop', e => {
	e.preventDefault()

  form.classList.remove('dragover')
	text.innerHTML = 'Drag & drop image here or <span class="select">Browse</span>'

	let file = e.dataTransfer.files;

  for (let i = 0; i < file.length; i++) {
    if (!file[i].type.match("image")) continue; // ONLY PHOTOS (SKIP CURRENT ITERATION IF NOT A PHOTO)
    if (files.every(e => e.name !== file[i].name)) files.push(file[i]) // NO REPEATED PHOTOS
  }
  files = files.slice(0,8); // UPLOAD 8 PHOTOS MAX
  showImages();
	
})

// SUBMIT REQUEST WITH FETCH

showcaseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(showcaseForm);
  
  files.forEach((e, i) => 
    formData.append(`file[${i}]`, e))

  fetch("/auth/showcase-settings", {
    method: "POST",
    body: formData
  })

  .then(response => {
    if (!response.ok) throw Error(response.statusText);
    else return response.json();
  })

  .then(data => {
    if(data.success) {
      removeElementsByClass("success");
      removeElementsByClass("alert-message");

      const div = document.createElement("div");
      div.className = "alert-message success";
      div.innerHTML = data.message;
      document.querySelector(".forms-container").append(div);

      // let clearTime = setInterval(() => {
      //   removeElementsByClass("success");
      //   clearInterval(clearTime);
      // }, 5000);

    } else {
      removeElementsByClass("success");
      removeElementsByClass("alert-message");

      const div = document.createElement("div");
      div.className = "alert-message";
      div.innerHTML = data.message;
      document.querySelector(".forms-container").append(div);
    } 
  })

  .catch(error => console.log(error));

});

function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

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



