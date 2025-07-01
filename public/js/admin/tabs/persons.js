const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

let currentPerson;
let imageData;

function displayModal() {
  tabContent.classList.add("hide");
  modal.classList.add("active");
}

function getDeleteBtnForLi() {
  const res = document.createElement("button");
  res.classList.add("delete");
  const img = document.createElement("img");
  img.src = "/images/icons/delete.png";
  res.appendChild(img);

  return res;
}

function getNormalizeListElement(text, textContainer) {
  const contentLi = document.createElement("li");
  contentLi.classList.add("content-li");
  const textItemDiv = document.createElement("div");
  textItemDiv.setAttribute("contenteditable", "plaintext-only");
  textItemDiv.textContent = parseText(text, "toRead");
  const btnDelete = getDeleteBtnForLi();
  btnDelete.addEventListener("click", () => {
    textContainer.removeChild(contentLi);
  })
  contentLi.appendChild(btnDelete);
  contentLi.appendChild(textItemDiv);

  return contentLi;
}

function parseText(str, mode) {
  if (mode == "toRead") {
    str = str.replaceAll("<span></span>", "<dot>");
    str = str.replaceAll("<br>", "\n");
  } else if (mode == "toHTML") {
    str = str.replaceAll("<dot>", "<span></span>");
    str = str.replaceAll("\n", "<br>");
  }

  return str;
}

function getContentLists(item) {
  const container = document.createElement("div");
  container.classList.add("modal__person-text-section");
  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("modal__title-wrapper");
  const title = document.createElement("div");
  title.setAttribute("contenteditable", "plaintext-only");
  title.textContent = item.title;
  const deleteBtnSection = getDeleteBtnForLi();
  deleteBtnSection.addEventListener("click", () => {
    modal.querySelector(".modal__person-text-section-wrapper").removeChild(container);
  })
  titleWrapper.appendChild(deleteBtnSection);
  titleWrapper.appendChild(title);
  container.appendChild(titleWrapper);
  const textContainer = document.createElement("ul");
  textContainer.classList.add("person-text__list");
  container.appendChild(textContainer);

  for (let textItem of item.items) {
    const li = getNormalizeListElement(textItem, textContainer)
    textContainer.appendChild(li);
  }

  const addItemBtn = document.createElement("button");
  const addItemBtnImg = document.createElement("img");
  addItemBtnImg.src = "/images/icons/plus.png";
  addItemBtn.classList.add("btn", "add");
  addItemBtn.style.marginRight = "0";
  addItemBtn.style.marginLeft = "45px";
  addItemBtn.appendChild(addItemBtnImg);

  addItemBtn.addEventListener("click", () => {
    textContainer.appendChild(getNormalizeListElement("Ваш новый текст...", textContainer));
  });

  container.appendChild(addItemBtn);

  return container;
}

function sendData(data) {
  const token = localStorage.getItem("VIPCLINIC-ADMINVIP-TOKEN");

  fetch("/private-api/adminvip/persons", {
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

  deleteBtn.addEventListener("click", () => {
    if (confirm("Подтвердите удаление записи")) {
      sendData({ id: deleteBtn.dataset.id, delete: true });
    }
  });

  btn.addEventListener("click", () => {
    fetch(`/api/adminvip/person?id=${item.dataset.id}`)
      .then((rawData) => rawData.json())
      .then((data) => {
        currentPerson = {
          id: data.id,
          yclientsLink: data.yclientsLink,
          photo: data.photo,
          content: data.content,
        };
        displayModal();
        modal.querySelector(".modal__img img").src = data.photo;
        modal.querySelector("#firstname").textContent = data.content.firstname;
        modal.querySelector("#secondname").textContent =
          data.content.secondname;
        modal.querySelector("#profession").textContent =
          data.content.profession;
        modal.querySelector("#link").textContent =
          data.yclientsLink;

        for (let item of data.content.content) {
          modal.querySelector(".modal__person-text-section-wrapper").appendChild(getContentLists(item));
        }

        modal.querySelector(".modal__person-text-section-btn-add").addEventListener("click", () => {
          modal.querySelector(".modal__person-text-section-wrapper").appendChild(getContentLists({title: "Новый раздел", items: ["Ваш новый текст..."]}));
        })
      });
  });
}

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

addNewBtn.addEventListener("click", () => {
  displayModal();

  currentPerson = {
    id: "new",
    photo: "/images/placeholders/placeholderImg2.png",
    content: {
      firstname: "Имя",
      secondname: "Фамилия",
      profession: "Специальность",
      content: [
        {title: "Новый раздел", items: ["Ваш новый текст..."]}
      ]
    },
  };

  modal.querySelector(".modal__img img").src = currentPerson.photo;
  modal.querySelector("#firstname").textContent =
    currentPerson.content.firstname;
  modal.querySelector("#secondname").textContent =
    currentPerson.content.secondname;
  modal.querySelector("#profession").textContent =
    currentPerson.content.profession;
  modal.querySelector("#link").textContent =
    currentPerson.yclientsLink;
  for (let item of currentPerson.content.content) {
    modal.querySelector(".modal__person-text-section-wrapper").appendChild(getContentLists(item));
  }

  modal.querySelector(".modal__person-text-section-btn-add").addEventListener("click", () => {
    modal.querySelector(".modal__person-text-section-wrapper").appendChild(getContentLists({title: "Новый раздел", items: ["Ваш новый текст..."]}));
  })
});

modalBtnBack.addEventListener("click", () => {
  location.reload();
});

modalBtnSave.addEventListener("click", () => {
  //! Отправка данных на сервер
  currentPerson.content.firstname =
    modal.querySelector("#firstname").textContent;
  currentPerson.content.secondname =
    modal.querySelector("#secondname").textContent;
  currentPerson.content.profession =
    modal.querySelector("#profession").textContent;
  currentPerson.yclientsLink =
    modal.querySelector("#link").textContent;

  const textSections = modal.querySelectorAll(".modal__person-text-section");
  currentPerson.content.content = [];
  for (let item of textSections) {
    const newItem = {};
    newItem.title = item.querySelector(".modal__title-wrapper div").textContent;
    newItem.items = [];
    for (let text of item.querySelectorAll(".content-li div")) {
      newItem.items.push(parseText(text.textContent, "toHTML"));
    }
    currentPerson.content.content.push(newItem);
  }

  if (imageData) {
    currentPerson.imageData = imageData;
  }

  if (!(currentPerson.id == "new" && !imageData)) sendData(currentPerson);
  else {
    modal.querySelector(".modal__control-images-not-loaded").classList.add("active");
  }
});
