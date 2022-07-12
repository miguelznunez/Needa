const toastOptions = {
  'success': { class: "fas fa-check-circle", color: "#47d764", header: "Success" },
  'error': { class: "fas fa-times-circle", color: "#ff1616", header: "Error" },
  'info': { class: "fas fa-info-circle", color: "#2F86EB", header: "Info" },
  'warning': { class: "fas fa-exclamation-circle", color: "#FFC021", header: "Warning" }
},
toastFE = document.querySelector(".toast-front-end"),
iconContainer = document.querySelector(".icon-container-front-end"),
messageContainer = document.querySelector(".message-container-front-end"),
closeToastFE = document.querySelector("#close-toast-btn-front-end");
let x;

function displayToast(type, msg) {
  clearTimeout(x);
  toastFE.style.borderLeft = `8px solid ${toastOptions[type].color}`;
  toastFE.style.transform = "translateX(0)";

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
    toastFE.style.transform = "translateX(400px)";
  }, 5000);
}

closeToastFE.addEventListener("click", () => {
  toastFE.style.transform = "translateX(400px)";
});