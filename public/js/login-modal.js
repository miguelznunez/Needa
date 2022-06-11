const modal = document.querySelector(".overlay"),
closeLoginModalBtn = document.querySelector("#close-login-modal-btn"),
showLoginModalBtn = document.querySelector("#show-login-modal-btn");

setTimeout(function () {
  modal.classList.add("show-modal");
  modal.style.zIndex = "1";
}, 1000);

showLoginModalBtn.addEventListener("click", () => {
  modal.classList.remove("hide-modal");
  modal.classList.add("show-modal");
  modal.style.zIndex = "1";
})

closeLoginModalBtn.addEventListener("click", () => {
  modal.classList.remove("show-modal");
  modal.classList.add("hide-modal");
  modal.style.zIndex = "-1";
})