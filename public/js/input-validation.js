const firstNameError = document.querySelector("#first-name-error"),
lastNameError = document.querySelector("#last-name-error"),
emailError = document.querySelector("#email-error"),
passwordError = document.querySelector("#password-error"),
passwordConfirmError = document.querySelector("#password-confirm-error");

function validateFirstName() {
  let firstName = document.querySelector("#first-name").value;
  validate(firstName, /^[A-Za-z]*$/, firstNameError)
}

function validateLastName() {
  let lastName = document.querySelector("#last-name").value;
  validate(lastName, /^[A-Za-z]*$/, lastNameError)
}

function validateEmail() {
  let email = document.querySelector("#email").value;
  validate(email, /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/, emailError);
}

function validatePassword() {
  let password = document.querySelector("#password").value;
  validate(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,60}$/, passwordError);
}

function validatePasswordConfirm() {
  let passwordConfirm = document.querySelector("#password-confirm").value;
  validate(passwordConfirm, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,60}$/, passwordConfirmError);
}

function validate(input, regex, output) {
  if (input.match(regex) && input.length !== 0) {
    output.innerHTML = "<i class='fa-solid fa-circle-check'></i>";
    return true;
  } else if (input.length === 0) {
    output.innerHTML = "";
    return false;
  } else {
    output.innerHTML = "<i class='fa-solid fa-circle-xmark'></i>";
  }
}