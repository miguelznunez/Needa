  document.querySelector("#find-professionals-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const isValidProfession = /^[a-zA-Z][a-zA-Z\s]*$/.test(document.querySelector("#header-search").value);
    const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(document.querySelector("#header-location").value);
    const isValidCityState = /^[A-Za-z]+,[ ]?[A-Za-z]{0,2}$/.test(document.querySelector("#header-location").value);

    if ((isValidProfession && isValidZip) || (isValidProfession && isValidCityState))
      document.querySelector("#find-professionals-form").submit();
    else
      displayToast("error", "Please enter a valid profession and/or location");
  });