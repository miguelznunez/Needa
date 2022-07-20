  const toast = document.querySelector(".toast"),
  closeToast = document.querySelector("#closeToast");
  let y;
  if (toast) {

    setTimeout(function(){ 
      document.querySelector(".toast").style.transform = "translateX(0)";
    }, 500);

    y = setTimeout(() => {
      toast.style.transform = "translateX(400px)";
    }, 5000);

    closeToast.addEventListener("click", () => {
      toast.style.transform = "translateX(400px)";
    })
  }