const showPassword = document.querySelector("#show-password"),
password = document.querySelector("#password"),
passwordConfirm = document.querySelector("#password-confirm");

showPassword.addEventListener("click", function () {
  this.classList.toggle("fa-eye-slash");
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  passwordConfirm.setAttribute("type", type);
});