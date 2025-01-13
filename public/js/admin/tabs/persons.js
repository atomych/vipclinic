const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtn = document.querySelector(".modal__img button");
const changeImgInput = document.querySelector(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

let currentPerson;

function displayModal() {
  tabContent.classList.add("hide");
  modal.classList.add("active");
}

function hideModal() {
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

function getNormalizeListElement(text, section, index) {
  const container = getContentLi();
  const btn = getDeleteBtnForLi();
  container.appendChild(btn);

  const textDiv = document.createElement("div");
  textDiv.setAttribute("contenteditable", "plaintext-only");
  textDiv.textContent = parseText(text, "toRead");

  container.appendChild(textDiv);

  btn.addEventListener("click", () => {
    container.parentElement.removeChild(container);
    currentPerson.content[section].splice(index, 1);
  });

  return container;
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

function setContentLists(container, data, section) {
  const mainList = document.createElement("ul");
  mainList.classList.add("person-text__list");

  let index = 0;
  for (let item of data) {
    if (item.type == "text") {
      mainList.appendChild(getNormalizeListElement(item.text, section, index));
      index += 1;
    }
  }

  const addItemBtn = document.createElement("button");
  addItemBtn.classList.add("btn", "add");
  addItemBtn.textContent = "Добавить";
  modal.querySelector(container).parentElement.appendChild(addItemBtn);

  modal.querySelector(container).innerHTML = "";
  modal.querySelector(container).appendChild(mainList);
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");

  btn.addEventListener("click", () => {
    fetch(`/api/adminvip/person?id=${item.dataset.id}`)
      .then((rawData) => rawData.json())
      .then((data) => {
        currentPerson = data;
        displayModal();
        modal.querySelector(".modal__img img").src = data.photo;
        modal.querySelector("#firstname").textContent = data.content.firstname;
        modal.querySelector("#secondname").textContent =
          data.content.secondname;
        modal.querySelector("#profession").textContent =
          data.content.profession;
        setContentLists(
          ".modal__person-education",
          data.content.education,
          "education"
        );
        setContentLists(".modal__person-skills", data.content.skills, "skills");

        modal
          .querySelector(".modal__person-education + .btn.add")
          .addEventListener("click", () => {
            currentPerson.content.education.push({
              type: "text",
              text: "Ваш новый текст...",
            });
            modal
              .querySelector(".modal__person-education .person-text__list")
              .appendChild(
                getNormalizeListElement(
                  "Ваш новый текст...",
                  "education",
                  currentPerson.content.education.length
                )
              );
          });

        modal
          .querySelector(".modal__person-skills + .btn.add")
          .addEventListener("click", () => {
            currentPerson.content.skills.push({
              type: "text",
              text: "Ваш новый текст...",
            });
            modal
              .querySelector(".modal__person-skills .person-text__list")
              .appendChild(
                getNormalizeListElement(
                  "Ваш новый текст...",
                  "skills",
                  currentPerson.content.skills.length
                )
              );
          });
      });
  });
}

changeImgBtn.addEventListener("click", () => {
  changeImgInput.click();
});

changeImgInput.addEventListener("change", () => {
  const reader = new FileReader();
  const file = changeImgInput.files[0];
  const extension = file.type.split("/")[1];

  reader.readAsDataURL(file);

  reader.addEventListener("load", () => {
    modal.querySelector(".modal__img img").src = reader.result;
  });
});

addNewBtn.addEventListener("click", () => {
  displayModal();

  currentPerson = {
    photo: "/images/placeholders/placeholderImg2.png",
    content: {
      firstname: "Имя",
      secondname: "Фамилия",
      profession: "Специальность",
      education: [
        {
          type: "text",
          text: "Ваш новый текст...",
        },
      ],
      skills: [
        {
          type: "text",
          text: "Ваш новый текст...",
        },
      ],
    },
  };

  modal.querySelector(".modal__img img").src = currentPerson.photo;
  modal.querySelector("#firstname").textContent =
    currentPerson.content.firstname;
  modal.querySelector("#secondname").textContent =
    currentPerson.content.secondname;
  modal.querySelector("#profession").textContent =
    currentPerson.content.profession;
  setContentLists(
    ".modal__person-education",
    currentPerson.content.education,
    "education"
  );
  setContentLists(
    ".modal__person-skills",
    currentPerson.content.skills,
    "skills"
  );
  modal
    .querySelector(".modal__person-skills + .btn.add")
    .addEventListener("click", () => {
      currentPerson.content.skills.push({
        type: "text",
        text: "Ваш новый текст...",
      });
      modal
        .querySelector(".modal__person-skills .person-text__list")
        .appendChild(
          getNormalizeListElement(
            "Ваш новый текст...",
            "skills",
            currentPerson.content.skills.length
          )
        );
    });
  modal
    .querySelector(".modal__person-education + .btn.add")
    .addEventListener("click", () => {
      currentPerson.content.education.push({
        type: "text",
        text: "Ваш новый текст...",
      });
      modal
        .querySelector(".modal__person-education .person-text__list")
        .appendChild(
          getNormalizeListElement(
            "Ваш новый текст...",
            "skills",
            currentPerson.content.education.length
          )
        );
    });
});

modalBtnBack.addEventListener("click", () => {
  hideModal();
  currentPerson = {};
});

modalBtnSave.addEventListener("click", () => {
  location.reload();
  //! Отправка данных на сервер
});
