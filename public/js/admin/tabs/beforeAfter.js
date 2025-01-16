const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

let newBeforeAfter = null;
let activeBeforeAfterID = null;
let imageData = null;

for (let btn of modal.querySelectorAll(".modal__item")) {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  })
}

function displayModal () {
  tabContent.classList.add("hide");
  modal.classList.add("active");
}

function hideModal () {
  tabContent.classList.remove("hide");
  modal.classList.remove("active");
}

function sendData(data) {
  fetch("/private-api/adminvip/before-after", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"free-token"}`,
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
    activeBeforeAfterID = btn.dataset.id;
    displayModal();
    modal.querySelector(".modal__img img").src = item.querySelector("img.img").src;
    modal.querySelector(".title.before-after").textContent = item.querySelector("p.name").textContent;
    
    for (let check of document.querySelectorAll(".modal__item")) {
      for (let person of document.querySelectorAll(`.inlist[data-id="${activeBeforeAfterID}"] .inlist__item`)) {
        if (check.dataset.id == person.dataset.id) {
          check.classList.add("active");
        }
      }
    }
  })

  deleteBtn.addEventListener("click", () => {
    if (confirm("Подтвердите удаление записи")) {
      sendData({ id: deleteBtn.dataset.id, delete: true });
    }
  });
}

addNewBtn.addEventListener("click", () => {
  newBeforeAfter = {
    id: "new",
    text: "",
    url: "/images/placeholders/placeholderImg.png",
    persons: [],
  };
  displayModal();
  modal.querySelector(".title.before-after").textContent = newBeforeAfter.text;
  modal.querySelector(".modal__img img").src = newBeforeAfter.url;
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
    imageData = {
      dataUrl: reader.result,
      extension: extension,
    };
    modal.querySelector(".modal__img img").src = reader.result;
  })
})

modalBtnBack.addEventListener("click", () => {
  hideModal();
  newBeforeAfter = null;
  activeBeforeAfterID = null;
  imageData = null;
})

modalBtnSave.addEventListener("click", () => {
  //! Отправка данных на сервер
  let putBeforeAfterData = {};

  if (activeBeforeAfterID) {
    putBeforeAfterData.id = activeBeforeAfterID;
  }

  if (newBeforeAfter) {
    putBeforeAfterData.id = "new";
  }

  putBeforeAfterData.text = modal.querySelector(".title.before-after").textContent;
  putBeforeAfterData.persons = [];

  for (let checkItem of document.querySelectorAll(".modal__item")) {
    if (checkItem.classList.contains("active")) {
      putBeforeAfterData.persons.push(checkItem.dataset.id);
    }
  }
  
  if (imageData) {
    putBeforeAfterData.imageData = {
      dataUrl: imageData.dataUrl,
      extension: imageData.extension,
    };
  }

  if (!(newBeforeAfter && !imageData)) sendData(putBeforeAfterData);
})