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

function getDeleteBtnForLi() {
  const res = document.createElement("button");
  res.classList.add("delete");
  const img = document.createElement("img");
  img.src = "/images/icons/delete.png";
  res.appendChild(img);

  return res;
}

function getContentLi() {
  const res = document.createElement("li");
  res.classList.add("content-li");
  return res;
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

function setContentLists(container, data) {
  const mainList = document.createElement("ul");
  mainList.classList.add("person-text__list");

  for (let item of data) {
    if (item.type == "text") {
      const container = getContentLi();
      container.appendChild(getDeleteBtnForLi());
      
      const textDiv = document.createElement("div");
      textDiv.setAttribute("contenteditable", "plaintext-only");
      textDiv.textContent = parseText(item.text, "toRead");

      container.appendChild(textDiv);
      mainList.appendChild(container);
    }
  }

  modal.querySelector(container).innerHTML = "";
  modal.querySelector(container).appendChild(mainList);
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");

  btn.addEventListener("click", () => {
    fetch(`/api/adminvip/person?id=${item.dataset.id}`)
      .then((rawData) => rawData.json())
      .then((data) => {
        displayModal();
        modal.querySelector(".modal__img img").src = data.photo;
        modal.querySelector("#firstname").textContent = data.content.firstname;
        modal.querySelector("#secondname").textContent =
          data.content.secondname;
        modal.querySelector("#profession").textContent =
          data.content.profession;
        setContentLists(".modal__person-education", data.content.education);
        setContentLists(".modal__person-skills", data.content.skills);
      });
  });
}

addNewBtn.addEventListener("click", () => {
  displayModal();
});

modalBtnBack.addEventListener("click", () => {
  hideModal();
});

modalBtnSave.addEventListener("click", () => {
  location.reload();
  //! Отправка данных на сервер
});
