var windowLocation = window.location.pathname; 

switch(windowLocation){
  case "/":
    var indexJS = document.createElement('script');
    indexJS.type = "text/javascript";
    indexJS.src = "/js/index.js";
    document.body.append(indexJS);
    break;  
  case "/register":
    var registerJS = document.createElement('script');
    registerJS.type = "text/javascript";
    registerJS.src = "/js/register.js";
    document.body.append(registerJS);
    break;
  case "/auth/register":
    var registerJS = document.createElement('script');
    registerJS.type = "text/javascript";
    registerJS.src = "/js/register.js";
    document.body.append(registerJS);
    break;
  case "/login":
    var loginJS = document.createElement('script');
    loginJS.type = "text/javascript";
    loginJS.src = "/js/login.js";
    document.body.append(loginJS);
    break;
  case "/auth/login":
    var loginJS = document.createElement('script');
    loginJS.type = "text/javascript";
    loginJS.src = "/js/login.js";
    document.body.append(loginJS);
    break; 
  case "/password-reset":
    var passwordResetJS = document.createElement('script');
    passwordResetJS.type = "text/javascript";
    passwordResetJS.src = "/js/password-reset.js";
    document.body.append(passwordResetJS);
    break;
  case "/auth/password-reset":
    var passwordResetJS = document.createElement('script');
    passwordResetJS.type = "text/javascript";
    passwordResetJS.src = "/js/password-reset.js";
    document.body.append(passwordResetJS);
    break;
  case "/auth/update-password":
    var passwordResetUpdateJS = document.createElement('script');
    passwordResetUpdateJS.type = "text/javascript";
    passwordResetUpdateJS.src = "/js/password-reset-update.js";
    document.body.append(passwordResetUpdateJS); 
}

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
