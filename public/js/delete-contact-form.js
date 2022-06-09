const deleteContactForm = document.querySelector("#delete-contact-form");

deleteContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const following_id = document.querySelector("#following-id").value;

  fetch("/auth/deleteContactForm", {
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
