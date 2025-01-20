const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

let newPrice = null;
let activePriceID = null;
let imageData = null;

function displayModal() {
  tabContent.classList.add("hide");
  modal.classList.add("active");
}

function hideModal() {
  tabContent.classList.remove("hide");
  modal.classList.remove("active");
}

function sendData(data) {
  const token = localStorage.getItem("VIPCLINIC-ADMINVIP-TOKEN");

  fetch("/private-api/adminvip/price", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status == 201) location.reload();
  });
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");
  const deleteBtn = item.querySelector(".btn.delete");

  btn.addEventListener("click", () => {
    activePriceID = btn.dataset.id;
    displayModal();
    modal.querySelector(".modal__img img").src =
      item.querySelector("img.img").src;
    modal.querySelector(".number-value").textContent =
      item.querySelector("p.info").dataset.order;
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Подтвердите удаление записи")) {
      sendData({ id: deleteBtn.dataset.id, delete: true });
    }
  });
}

addNewBtn.addEventListener("click", () => {
  newPrice = {
    id: "new",
    src: "/images/placeholders/placeholderImg.png",
    order: `${items.length + 1}`,
  };
  displayModal();
  modal.querySelector(".number-value").textContent = newPrice.order;
  modal.querySelector(".modal__img img").src = newPrice.src;
});

changeImgBtn.addEventListener("click", () => {
  changeImgInput.click();
});

changeImgInput.addEventListener("change", () => {
  const reader = new FileReader();
  const file = changeImgInput.files[0];
  const extension = file.type.split("/")[1];

  reader.readAsDataURL(file);

  reader.addEventListener("load", () => {
    imageData = {
      dataUrl: reader.result,
      extension: extension,
    };
    modal.querySelector(".modal__img img").src = reader.result;
  });
});

modalBtnBack.addEventListener("click", () => {
  hideModal();
  newPrice = null;
  activePriceID = null;
  imageData = null;
});

modalBtnSave.addEventListener("click", () => {
  //! Отправка данных на сервер
  const putPriceData = {};

  if (activePriceID) {
    putPriceData.id = activePriceID;
  }

  if (newPrice) {
    putPriceData.id = "new";
  }

  putPriceData.order = modal.querySelector(".number-value").textContent;

  if (imageData) {
    putPriceData.imageData = {
      dataUrl: imageData.dataUrl,
      extension: imageData.extension,
    };
  }

  if (!(newPrice && !imageData)) sendData(putPriceData);
});
