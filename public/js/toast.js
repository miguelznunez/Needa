  const toast = document.querySelector(".toast"),
  closeToast = document.querySelector("#closeToast");
  if (toast) {
    closeToast.addEventListener("click", () => {
      toast.style.transform = "translateX(400px)";
    })
  }