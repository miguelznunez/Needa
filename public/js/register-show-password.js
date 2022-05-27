    const showPassword = document.querySelector("#show-password"),
    passwordField = document.querySelector("#password"),
    passwordMatchField = document.querySelector("#password-confirm");

    showPassword.addEventListener("click", function (e) {
      if (showPassword.checked) {
        passwordField.setAttribute("type", "text");
        passwordMatchField.setAttribute("type", "text");
      }
      else {
        passwordField.setAttribute("type", "password");
        passwordMatchField.setAttribute("type", "password");
      }
    })