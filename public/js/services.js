const servicesBTNS = document.querySelectorAll(".services__btn");
const servicesSECTIONS = document.querySelectorAll(".services__list-inner");

let activeBTN = servicesBTNS[0];

function animationItems(section) {
  const items = section.querySelectorAll(".item");

  for (let item of items) {
    item.classList.add("hiden");
  }

  let index = 0;
  const maxIndex = items.length;

  const interval = setInterval(() => {
    if (index > maxIndex) {
      clearInterval(interval);
    } else {
      items[index].classList.remove("hiden");
      index += 1;
    }
  }, 80);
}

for (let btn of servicesBTNS) {
  btn.addEventListener("click", () => {
    for (let section of servicesSECTIONS) section.classList.remove("show");
    activeBTN.classList.remove("selected");
    activeBTN = btn;
    activeBTN.classList.add("selected");
    for (let section of servicesSECTIONS) {
      if (
        section.dataset.index == activeBTN.dataset.index ||
        "a" + activeBTN.dataset.index == section.dataset.index
      ) {
        section.classList.add("show");
        animationItems(section);
      }
    }
  });
}