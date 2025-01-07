const serviceLists = document.querySelectorAll(".service-page__price-list");

if (serviceLists.length == 1) {
  serviceLists[0].classList.add("show");
  serviceLists[0].classList.add("bg");
}

const imgSection = document.querySelector(`.service-page__photo:not(.service-page__photo--adaptive)`);

const serviceNavBtns = document.querySelectorAll(
  ".service-page__nav-item button"
);
let selectedBtn = serviceNavBtns[0];

function showList(list) {
  const items = list.querySelectorAll(".service-page__price-item");

  for (let item of items) {
    item.classList.add("hidden");
  }

  list.classList.add("show");

  const maxIndex = items.length - 1;
  let index = 0;

  const interval = setInterval(() => {
    if (index > maxIndex) {
      list.classList.add("bg");
      clearInterval(interval);
    } else {
      items[index].classList.remove("hidden");
      index += 1;
    }
  }, 80);
}

for (let btn of serviceNavBtns) {
  btn.addEventListener("click", () => {
    imgSection.classList.remove(`img${selectedBtn.dataset.type}`);
    selectedBtn.classList.remove("selected");
    selectedBtn = btn;
    selectedBtn.classList.add("selected");
    imgSection.classList.add(`img${selectedBtn.dataset.type}`);

    serviceLists.forEach((item) => {
      item.classList.remove("show");
      item.classList.remove("bg");
    });

    for (let list of serviceLists) {
      if (list.dataset.type == selectedBtn.dataset.type) {
        showList(list);
      }
    }
  });
}
