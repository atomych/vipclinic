const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

let newPromo = null;
let activePromoID = null;
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

  fetch("/private-api/adminvip/promo", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data)
  }).then((res) => {
    if (res.status == 201) location.reload();
  });
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");
  const deleteBtn = item.querySelector(".btn.delete");

  btn.addEventListener("click", () => {
    activePromoID = btn.dataset.id;
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
  newPromo = {
    id: "new",
    src: "/images/placeholders/placeholderImg.png",
    order: `${items.length + 1}`,
  };
  displayModal();
  modal.querySelector(".number-value").textContent = newPromo.order;
  modal.querySelector(".modal__img img").src = newPromo.src;
});

changeImgBtn.addEventListener("click", () => {
  modal.querySelector(".modal__control-images-not-loaded").classList.remove("active");
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
  newPromo = null;
  activePromoID = null;
  imageData = null;
});

modalBtnSave.addEventListener("click", () => {
  //! Отправка данных на сервер
  const putPromoData = {};

  if (activePromoID) {
    putPromoData.id = activePromoID;
  }

  if (newPromo) {
    putPromoData.id = "new";
  }

  putPromoData.order = modal.querySelector(".number-value").textContent;

  if (imageData) {
    putPromoData.imageData = {
      dataUrl: imageData.dataUrl,
      extension: imageData.extension,
    };
  }

  if (!(newPromo && !imageData)) sendData(putPromoData)
  else {
    modal.querySelector(".modal__control-images-not-loaded").classList.add("active");
  }
});
