const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

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
    modal.querySelector(".modal__img img").src =
      item.querySelector("img.img").src;
    modal.querySelector(".number input").value =
      item.querySelector("p.info").dataset.order;
  });
}

addNewBtn.addEventListener("click", () => {
  displayModal();
  modal.querySelector(".number input").value = "";
  modal.querySelector(".modal__img img").src = "/images/placeholders/placeholderImg.png";
})

changeImgBtn.addEventListener("click", () => {
  changeImgInput.click();
})

changeImgInput.addEventListener("change", () => {
  const reader = new FileReader();
  const file = changeImgInput.files[0];
  const extension = file.type.split("/")[1];

  reader.readAsDataURL(file);

  reader.addEventListener("load", () => {
    modal.querySelector(".modal__img img").src = reader.result;
  })
})

modalBtnBack.addEventListener("click", () => {
  hideModal();
});

modalBtnSave.addEventListener("click", () => {
  location.reload();
  //! Отправка данных на сервер
});
