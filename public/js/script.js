var windowLocation = window.location.pathname; 

switch(windowLocation){ 
  case "/auth/update-password":
    var passwordResetUpdateJS = document.createElement('script');
    passwordResetUpdateJS.type = "text/javascript";
    passwordResetUpdateJS.src = "/js/password-reset-update.js";
    document.body.append(passwordResetUpdateJS);
    break;
}

// DROPDOWN MENU

document.addEventListener("click", e => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]")
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

  let currentDropdown
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]")
    currentDropdown.classList.toggle("active")
  }

  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    if (dropdown === currentDropdown) return
    dropdown.classList.remove("active")
  })
})

// COOKIES MESSAGE
setCookie = (cName, cValue, expDays) => {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

getCookie = (cName) => {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let value;
  cArr.forEach(val => {
    if(val.indexOf(name) === 0) value = val.substring(name.length);
  })

  return value;
}

document.querySelector("#cookies-btn").addEventListener("click", () => {
  document.querySelector("#cookies").style.display = "none";
  setCookie("cookie", true, 90);
})

cookieMessage = () => {
  if(!getCookie("cookie"))
    document.querySelector("#cookies").style.display = "block";
}

window.addEventListener("load", cookieMessage);