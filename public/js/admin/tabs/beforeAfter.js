const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

function displayModal () {
  tabContent.classList.add("hide");
  modal.classList.add("active");
}

function hideModal () {
  tabContent.classList.remove("hide");
  modal.classList.remove("active");
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");

  btn.addEventListener("click", () => {
    displayModal();
    modal.querySelector(".modal__img img").src = item.querySelector("img.img").src;
    modal.querySelector(".title input").value = item.querySelector("p.name").textContent;
    
    for (let check of document.querySelectorAll(".modal__item")) {
      for (let person of document.querySelectorAll(".inlist__item")) {
        if (check.dataset.id == person.dataset.id) {
          check.querySelector("input").checked = true;
        }
      }
    }
  })
}

addNewBtn.addEventListener("click", () => {
  hideModal();
  modal.querySelector(".title input").value = "";
  modal.querySelector(".modal__img img").src = "/images/placeholders/placeholderImg.png";
  for (let check of document.querySelectorAll(".modal__item")) {
    check.querySelector("input").checked = false;
  }
})

modalBtnBack.addEventListener("click", () => {
  hideModal();
})

modalBtnSave.addEventListener("click", () => {
  location.reload();
  //! Отправка данных на сервер
})