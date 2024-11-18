const burgerBTN = document.querySelector(".btn.btn--burger");
const closeBTN = document.querySelector(".btn.btn--close");
const burgerPanel = document.querySelector(".burger-panel");

burgerBTN.addEventListener("click", () => {
  burgerPanel.classList.add("show");
  burgerBTN.style.display = "none";
  closeBTN.style.display = "block";
});

closeBTN.addEventListener("click", () => {
  burgerPanel.classList.remove("show");
  burgerBTN.style.display = "block";
  closeBTN.style.display = "none";
});