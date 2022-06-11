const modal = document.querySelector(".overlay"),
closeDeleteModalBtn = document.querySelector("#close-login-modal-btn"),
showDeleteModalBtn = document.querySelector("#delete-account-modal-btn");

showDeleteModalBtn.addEventListener("click", () => {
  modal.classList.add("show-modal");
  modal.style.zIndex = "1";
})

closeDeleteModalBtn.addEventListener("click", () => {
  modal.classList.remove("show-modal");
  modal.style.zIndex = "-1";
})