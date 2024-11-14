// ?
// ? Бургер-меню
// ?

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

// ?
// ? Услуги
// ?

const servicesBTNS = document.querySelectorAll(".services__btn");
const servicesSECTIONS = document.querySelectorAll(".services__list-inner");

let activeBTN = servicesBTNS[0];

for (let btn of servicesBTNS) {
  btn.addEventListener("click", () => {
    for (let section of servicesSECTIONS) section.classList.remove("show");
    activeBTN.classList.remove("selected");
    activeBTN = btn;
    activeBTN.classList.add("selected");
    if (activeBTN.dataset.index == 3) {
      for (let section of servicesSECTIONS) {
        section.classList.add("show");
      }
    } else {
      for (let section of servicesSECTIONS) {
        if (
          section.dataset.index == activeBTN.dataset.index ||
          "a" + activeBTN.dataset.index == section.dataset.index
        ) {
          section.classList.add("show");
        }
      }
    }
  });
}
