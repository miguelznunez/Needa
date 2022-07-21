document.querySelector("#newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
  const email = document.querySelector("#email").value;

  if(!pattern.test(email)){
    displayToast("warning", "The email you entered is invalid");
  }
  
  fetch("/auth/newsletter", {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      document.querySelector("#email").value = "";
      displayToast("success", data.message);
    } else {
      displayToast("error", data.message);
    }
  });
  
})
