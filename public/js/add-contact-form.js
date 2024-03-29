const addContactForm = document.querySelector("#add-contact-form");

addContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const following_id = document.querySelector("#following-id").value;

  fetch("/auth/add-contact-form", {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ following_id:following_id })
  })

  .then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  })

  .then(data => {
    if (data.type === "success") {
      window.location.reload();
    } else {
      displayToast('error', data.message);
    }
  })

  .catch(error => {
    displayToast('error', error);
  });

});
