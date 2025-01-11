const btns = document.querySelectorAll(".tab-menu__btn");
const tabItems = document.querySelectorAll(".tab__item");
let activeBtn = document.querySelector(".tab-menu__btn.active");
let activeItem = document.querySelector(".tab__item.active");

for (let btn of btns) {
  btn.addEventListener("click", () => {
    activeBtn.classList.remove("active");
    activeItem.classList.remove("active");
    activeBtn = btn;
    activeBtn.classList.add("active");
    for (let item of tabItems) {
      if (item.dataset.index == activeBtn.dataset.index) {
        activeItem = item;
      }
    }
    activeItem.classList.add("active");
  });
}
