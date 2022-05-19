let files = [], // STORE THE PHOTOS
showcaseForm = document.querySelector("#showcaseForm"), // form id
form = document.querySelector('.showcase-photos'), // form ( drag area )
text = document.querySelector('.inner'), // inner text of form
browse = document.querySelector('.select'), // "Browse" to run input field
input = document.querySelector('.showcase-photos input'), // file input
container = document.querySelector('.images-container'); // container in which images will be 

const toastOptions = {
  'success' : {class: "fas fa-check-circle", color: "#47d764", header: "Success"},
  'error'   : {class: "fas fa-times-circle", color: "#ff1616", header: "Error"},
  'info'    : {class: "fas fa-info-circle", color: "#2F86EB", header: "Info"},
  'warning' : {class: "fas fa-exclamation-circle", color: "#FFC021", header: "Warning"}
},
toast = document.querySelector(".toast"),
iconContainer = document.querySelector(".icon-container"),
messageContainer = document.querySelector(".message-container"),
closeToast = document.querySelector("#closeToast");
let x;

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
  }, 5000);  
}

// TOAST FUNCTIONALITY

closeToast.addEventListener("click", () => {
  toast.style.transform = "translateX(400px)";
})

browse.addEventListener('click', () => input.click());

// INPUT CHANGE EVENT 

input.addEventListener('change', () => {
  let file = input.files;

  for (let i = 0; i < file.length; i++) {
    if (files.every(e => e.name !== file[i].name)) files.push(file[i])
  }
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
  files = files.slice(0, 8); // UPLOAD 8 PHOTOS MAX
  showImages();

})

// SUBMIT REQUEST WITH FETCH

showcaseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(showcaseForm);

  messageContainer.innerHTML = "";

  files.forEach((e, i) =>
    formData.append(`file[${i}]`, e))

  fetch("/auth/showcase-settings", {
    method: "POST",
    body: formData
  })

  .then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else { 
      return response.json();
    }
  })

  .then(data => {
    if (data.type === "success"){
      displayToast('success', data.message);
    } else {
      displayToast('error', data.message);
    }
  })

  .catch(error => {
    displayToast('error', error);
  });

});


// ==========================================================================
// const length = "<%= length %>";
// const showcasePhotos = JSON.parse('<%-JSON.stringify(showcasePhotos)%>');
// ===========================================================================