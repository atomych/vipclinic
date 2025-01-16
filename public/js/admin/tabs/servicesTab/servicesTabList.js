const btns = document.querySelectorAll(".tab-menu__btn");
const tabItems = document.querySelectorAll(".tab__item");
let activeBtn = document.querySelector(".tab-menu__btn.active");
let activeItem = document.querySelector(".tab__item.active");
const tabMenu = document.querySelector("ul.tab-menu");

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
    currentMobileStructItem = null;
    currentDesktopStructItem = null;
    desktopStructList.classList.remove("active");
  });
}

const items = document.querySelectorAll("li.default__item");
const modal = document.querySelector(".tab-modal");
const tabContent = document.querySelector(".tab__content");
const addNewBtn = document.querySelector("button.add-new");
const changeImgBtnCollection = document.querySelectorAll(".modal__img button");
const changeImgInputCollection = document.querySelectorAll(".modal__img input");

const modalBtnSave = document.querySelector(".modal__control .save");
const modalBtnBack = document.querySelector(".modal__control .back");

var currentService;
var currentServicePrices = [];
var activeServicePricesSection = 0;

for (let btn of changeImgBtnCollection) {
  btn.addEventListener("click", () => {
    const imgInput = btn.parentElement.querySelector("input[type='file']");
    imgInput.click();
  });
}

for (let input of changeImgInputCollection) {
  input.addEventListener("change", () => {
    const reader = new FileReader();
    const file = input.files[0];
    const extension = file.type.split("/")[1];

    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      input.parentElement.querySelector("img").src = reader.result;
    });
  });
}

function displayModal() {
  tabContent.classList.add("hide");
  modal.classList.add("active");
  tabMenu.classList.add("hide");
}

function hideModal() {
  tabContent.classList.remove("hide");
  modal.classList.remove("active");
  tabMenu.classList.remove("hide");
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

function getNormalizeListElement(text, index) {
  const newItem = getContentLi();
  const deleteBtn = getDeleteBtnForLi();
  newItem.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    newItem.parentElement.removeChild(newItem);
    currentService.content.textPlace.splice(index, 1);
  });

  const textDiv = document.createElement("div");
  textDiv.setAttribute("contenteditable", "true");
  textDiv.innerHTML = parseText(text, "toRead");

  newItem.appendChild(textDiv);
  return newItem;
}

function getModalPricesPlaceMenuItem(
  text,
  filterIndex,
  servicesMenuHTML,
  servicesPriceHTML
) {
  const defaultItem = document.createElement("div");
  defaultItem.classList.add("modal__service-prices-menu-item");
  const defaultItemBtn = document.createElement("button");
  defaultItemBtn.dataset.filterIndex = filterIndex;
  const editableP = document.createElement("p");
  editableP.setAttribute("contenteditable", "plaintext-only");
  editableP.textContent = text;
  defaultItemBtn.appendChild(editableP);
  defaultItemBtn.addEventListener("click", () => {
    selectPricesContentSection(filterIndex);
  });

  const deleteBtn = getDeleteBtnForLi();
  deleteBtn.addEventListener("click", () => {
    if (currentServicePrices.filter((item) => item != null).length > 1) {
      currentServicePrices[filterIndex] = null;
      servicesMenuHTML.removeChild(
        modal.querySelector(
          `.modal__service-prices-menu-item button[data-filter-index="${filterIndex}"]`
        ).parentElement
      );
      for (let deleteItem of modal.querySelectorAll(
        `.modal__service-prices-content-item[data-filter-index="${filterIndex}"]`
      )) {
        servicesPriceHTML.removeChild(deleteItem);
      }
      if (filterIndex == activeServicePricesSection) {
        for (let localItem of currentServicePrices) {
          if (localItem != null) {
            selectPricesContentSection(currentServicePrices.indexOf(localItem));
            break;
          }
        }
      }
    }
  });

  defaultItem.appendChild(deleteBtn);
  defaultItem.appendChild(defaultItemBtn);

  return defaultItem;
}

function getModalPricesPlacePriceItem(
  priceItem,
  filterIndex,
  orderIndex,
  index,
  priceContainer
) {
  const newPrice = document.createElement("div");
  newPrice.classList.add("prices-item");

  const deletePriceItemBtn = getDeleteBtnForLi();
  deletePriceItemBtn.addEventListener("click", () => {
    currentServicePrices[filterIndex].items[orderIndex].prices[index] = null;
    priceContainer.removeChild(newPrice);
  });

  newPrice.appendChild(deletePriceItemBtn);

  const timeItem = document.createElement("div");
  timeItem.setAttribute("contenteditable", "plaintext-only");
  timeItem.classList.add("time");
  timeItem.textContent = priceItem.time;

  const volumeItem = document.createElement("div");
  volumeItem.setAttribute("contenteditable", "plaintext-only");
  volumeItem.classList.add("time");
  volumeItem.textContent = priceItem.volume;

  const priceTextItem = document.createElement("div");
  priceTextItem.setAttribute("contenteditable", "plaintext-only");
  priceTextItem.classList.add("time");
  priceTextItem.textContent = priceItem.price;

  newPrice.appendChild(timeItem);
  newPrice.appendChild(volumeItem);
  newPrice.appendChild(priceTextItem);

  return newPrice;
}

function getModalPricesPlaceContentItem(data, filterIndex, orderIndex) {
  const container = document.createElement("div");
  container.classList.add("modal__service-prices-content-item");
  container.dataset.filterIndex = filterIndex;
  container.dataset.orderIndex = orderIndex;

  const name = document.createElement("div");
  name.classList.add("name");
  name.setAttribute("contenteditable", "plaintext-only");
  name.textContent = data.title;

  const desc = document.createElement("div");
  desc.classList.add("desc");
  desc.setAttribute("contenteditable", "plaintext-only");
  desc.textContent = data.description;

  const priceContainer = document.createElement("div");
  priceContainer.classList.add("prices");
  let index = 0;
  for (let priceItem of data.prices) {
    const newPrice = getModalPricesPlacePriceItem(
      priceItem,
      filterIndex,
      orderIndex,
      index,
      priceContainer
    );
    priceContainer.appendChild(newPrice);
    index += 1;
  }

  const addPriceItemBtn = document.createElement("button");
  addPriceItemBtn.classList.add("btn");
  addPriceItemBtn.textContent = "Добавить";
  addPriceItemBtn.addEventListener("click", () => {
    const dataObj = {
      time: "время",
      volume: "...",
      price: "цена",
    };
    currentServicePrices[filterIndex].items[orderIndex].prices.push(dataObj);
    const newPrice = getModalPricesPlacePriceItem(
      dataObj,
      filterIndex,
      orderIndex,
      currentServicePrices[filterIndex].items[orderIndex].prices.length - 1,
      priceContainer
    );
    priceContainer.insertBefore(newPrice, addPriceItemBtn);
  });
  priceContainer.appendChild(addPriceItemBtn);

  const deleteBtn = getDeleteBtnForLi();
  deleteBtn.addEventListener("click", () => {
    currentServicePrices[filterIndex].items[orderIndex] = null;
    const deleteItem = document.querySelector(
      `.modal__service-prices-content-item[data-filter-index="${filterIndex}"][data-order-index="${orderIndex}"]`
    );
    deleteItem.parentElement.removeChild(deleteItem);
  });

  container.appendChild(name);
  container.appendChild(desc);
  container.appendChild(priceContainer);
  container.appendChild(deleteBtn);

  return container;
}

function setAddBtnForPriceMenu(servicesMenuHTML, servicesPriceHTML) {
  const addMenuItemBtn = document.createElement("button");
  addMenuItemBtn.textContent = "Добавить";
  servicesMenuHTML.appendChild(addMenuItemBtn);
  addMenuItemBtn.addEventListener("click", () => {
    currentServicePrices.push({ title: "Новый раздел", items: [] });
    const trueIndex = currentServicePrices.length - 1;
    servicesMenuHTML.insertBefore(
      getModalPricesPlaceMenuItem(
        "Новый раздел",
        trueIndex,
        servicesMenuHTML,
        servicesPriceHTML
      ),
      addMenuItemBtn
    );
    selectPricesContentSection(currentServicePrices.length - 1);
  });
}

function getAddBtnForPricePlaceItem(container) {
  const addPricesItemBtn = document.createElement("button");
  addPricesItemBtn.textContent = "Добавить";
  addPricesItemBtn.addEventListener("click", () => {
    const newData = {
      title: "название...",
      description: "описание...",
      prices: [
        {
          time: "время",
          volume: "...",
          price: "цена",
        },
      ],
    };
    currentServicePrices[activeServicePricesSection].items.push(newData);
    container.insertBefore(
      getModalPricesPlaceContentItem(
        newData,
        activeServicePricesSection,
        currentServicePrices[activeServicePricesSection].items.length - 1
      ),
      addPricesItemBtn
    );
    selectPricesContentSection(activeServicePricesSection);
  });
  return addPricesItemBtn;
}

function selectPricesContentSection(index) {
  const allItems = document.querySelectorAll(
    ".modal__service-prices-content-item"
  );
  for (let item of allItems) {
    item.classList.remove("active");
    if (item.dataset.filterIndex == index) {
      item.classList.add("active");
    }
  }
  activeServicePricesSection = index;
}

function setAddTextItemInTextPlace(textPlaceList) {
  const addItemBtn = document.createElement("button");
  addItemBtn.classList.add("btn", "add");
  addItemBtn.textContent = "Добавить";
  textPlaceList.parentElement.appendChild(addItemBtn);
  addItemBtn.addEventListener("click", () => {
    textPlaceList.appendChild(getNormalizeListElement("Ваш новый текст..."));
    currentService.content.textPlace.push({
      type: "text",
      text: "Ваш новый текст...",
    });
  });
}

function parseText(str, mode) {
  if (mode == "toRead") {
    str = str.replaceAll("<span>", "<b>");
    str = str.replaceAll("</span>", "</b>");
    // str = str.replaceAll("<br>", "\n");
  } else if (mode == "toHTML") {
    str = str.replaceAll("</b>", "</span>");
    str = str.replaceAll("<b>", "<span>");
    str = str.replaceAll("\n", "<br>");
  }

  return str;
}

for (let item of items) {
  const btn = item.querySelector(".btn.edit");

  btn.addEventListener("click", () => {
    fetch(`/api/adminvip/service?id=${item.dataset.id}`)
      .then((rawData) => rawData.json())
      .then((data) => {
        displayModal();
        currentService = data;
        modal.querySelector(".modal__img img#desktop_1").src =
          data.images.desktop.first;
        modal.querySelector(".modal__img img#desktop_2").src =
          data.images.desktop.second;
        modal.querySelector(".modal__img img#desktop_3").src =
          data.images.desktop.third;
        modal.querySelector(".modal__img img#desktop_4").src =
          data.images.mobile.first;
        modal.querySelector(".modal__img img#desktop_5").src =
          data.images.mobile.second;
        modal.querySelector("#name").textContent = data.content.name;

        modal.querySelector("#time").textContent = data.content.stats[0].value;
        modal.querySelector("#anesthesia").textContent =
          data.content.stats[1].value;
        modal.querySelector("#periodicity").textContent =
          data.content.stats[2].value;
        modal.querySelector("#effect").textContent =
          data.content.stats[3].value;
        modal.querySelector("#course").textContent =
          data.content.stats[4].value;
        modal.querySelector("#drugs").textContent = data.content.stats[5].value;
        modal.querySelector("#drugs_p").textContent =
          data.content.stats[5].title;

        const textPlaceList = modal.querySelector("ul.main-text");
        let index = 0;
        for (let textItem of data.content.textPlace) {
          textPlaceList.appendChild(
            getNormalizeListElement(textItem.text, index)
          );
          index += 1;
        }
        setAddTextItemInTextPlace(textPlaceList);

        const servicesMenuHTML = modal.querySelector(
          ".modal__service-prices-menu"
        );
        const servicesPriceHTML = modal.querySelector(
          ".modal__service-prices-content"
        );

        if (data.content.pricePlace.type == "only") {
          currentServicePrices.push({
            title: "Default",
            items: data.content.pricePlace.value,
          });
        } else if (data.content.pricePlace.type == "multi") {
          currentServicePrices = data.content.pricePlace.value;
        }

        let filterIndex = 0;
        for (let localItem of currentServicePrices) {
          servicesMenuHTML.appendChild(
            getModalPricesPlaceMenuItem(
              localItem.title,
              filterIndex,
              servicesMenuHTML,
              servicesPriceHTML
            )
          );
          let orderIndex = 0;
          for (let localPriceItem of localItem.items) {
            servicesPriceHTML.appendChild(
              getModalPricesPlaceContentItem(
                localPriceItem,
                filterIndex,
                orderIndex
              )
            );
            orderIndex += 1;
          }
          filterIndex += 1;
        }

        for (let localPriceItem of modal.querySelectorAll(
          ".modal__service-prices-content-item"
        )) {
          if (localPriceItem.dataset.filterIndex == 0) {
            localPriceItem.classList.add("active");
          }
        }

        setAddBtnForPriceMenu(servicesMenuHTML, servicesPriceHTML);

        servicesPriceHTML.appendChild(
          getAddBtnForPricePlaceItem(servicesPriceHTML)
        );
      });
  });
}

addNewBtn.addEventListener("click", () => {
  displayModal();
  modal.querySelector(".modal__img img#desktop_1").src =
    "/images/placeholders/placeholderImg2.png";
  modal.querySelector(".modal__img img#desktop_2").src =
    "/images/placeholders/placeholderImg2.png";
  modal.querySelector(".modal__img img#desktop_3").src =
    "/images/placeholders/placeholderImg2.png";
  modal.querySelector(".modal__img img#desktop_4").src =
    "/images/placeholders/placeholderImg.png";
  modal.querySelector(".modal__img img#desktop_5").src =
    "/images/placeholders/placeholderImg.png";
  modal.querySelector("#name").textContent = "Название";

  currentService = {
    content: {
      textPlace: [],
    },
  };
  currentServicePrices = [{ title: "Новый раздел", items: [] }];

  const servicesMenuHTML = modal.querySelector(".modal__service-prices-menu");
  const servicesPriceHTML = modal.querySelector(
    ".modal__service-prices-content"
  );

  setAddTextItemInTextPlace(document.querySelector("ul.main-text"));

  servicesMenuHTML.appendChild(
    getModalPricesPlaceMenuItem(
      "Новый раздел",
      0,
      servicesMenuHTML,
      servicesPriceHTML
    )
  );

  setAddBtnForPriceMenu(servicesMenuHTML, servicesPriceHTML);

  servicesPriceHTML.appendChild(getAddBtnForPricePlaceItem(servicesPriceHTML));
});

modalBtnBack.addEventListener("click", () => {
  currentService = {};
  currentServicePrices = [];
  activeServicePricesSection = 0;
  hideModal();
});

modalBtnSave.addEventListener("click", () => {
  location.reload();
  //! Отправка данных на сервер
});
