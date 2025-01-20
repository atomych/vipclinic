const desktopStructContentAll = document.querySelectorAll(
  ".desktop-struct-content"
);
const desktopStructMenuItems = document.querySelectorAll(
  ".desktop-struct-item"
);

let activeDesktopStructMenuItem = document.querySelector(
  ".desktop-struct-item.active"
);

const mobileStructContentAll = document.querySelectorAll(
  ".mobile-struct-content"
);
const mobileStructMenuItems = document.querySelectorAll(".mobile-struct-item");

let activeMobileStructMenuItem = document.querySelector(
  ".mobile-struct-item.active"
);

for (let btn of desktopStructMenuItems) {
  btn.addEventListener("click", () => {
    activeDesktopStructMenuItem.classList.remove("active");
    btn.classList.add("active");

    for (let contentItem of desktopStructContentAll) {
      if (
        contentItem.dataset.collection ==
        activeDesktopStructMenuItem.dataset.index
      ) {
        contentItem.classList.remove("active");
      }
      if (contentItem.dataset.collection == btn.dataset.index) {
        contentItem.classList.add("active");
      }
    }

    allImageData = [];
    activeDesktopStructMenuItem = btn;
    currentMobileStructItem = null;
    currentDesktopStructItem = null;
    desktopStructList.classList.remove("active");
  });
}

for (let btn of mobileStructMenuItems) {
  btn.addEventListener("click", () => {
    activeMobileStructMenuItem.classList.remove("active");
    btn.classList.add("active");

    for (let contentItem of mobileStructContentAll) {
      if (
        contentItem.dataset.collection ==
        activeMobileStructMenuItem.dataset.index
      ) {
        contentItem.classList.remove("active");
      }
      if (contentItem.dataset.collection == btn.dataset.index) {
        contentItem.classList.add("active");
      }
    }

    allImageData = [];
    activeMobileStructMenuItem = btn;
    currentMobileStructItem = null;
    currentDesktopStructItem = null;
    desktopStructList.classList.remove("active");
  });
}

let currentServicesData = [];
let currentDesktopStructData = {};
let currentDesktopStructItem;
let currentMobileStructData = {};
let currentMobileStructItem;
let allImageData = [];

const desktopStructList = document.querySelector(".desktop-struct-list");
const desktopStructListItems = document.querySelectorAll(
  ".desktop-struct-list-item"
);

const addNewSingleLineBtn = document.querySelector(
  ".desktop-struct-content-control button.single"
);
const addNewDoubleLineBtn = document.querySelector(
  ".desktop-struct-content-control button.double"
);
const addNewMobileItemBtn = document.querySelector(
  ".mobile-struct-content-control button.add"
);

const desktopStructSaveBtn = document.querySelector(
  ".desktop-struct-content-control button.save"
);
const mobileStructSaveBtn = document.querySelector(
  ".mobile-struct-content-control button.save"
);

function sendData(type, data) {
  const token = localStorage.getItem("VIPCLINIC-ADMINVIP-TOKEN");

  fetch(`/private-api/adminvip/${type}`, {
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

desktopStructSaveBtn.addEventListener("click", () => {
  //! Отправка данных на сервер
  allImageData = allImageData.filter((el) => currentDesktopStructData.filter((el2) => el2.collection == el.collection)[0].lines[el.index] != null);
  let result = true;

  for (let item of allImageData) {
    if (currentDesktopStructData[item.collection].lines[item.index].cells["big"] == "empty") result = false;
  }

  if (result) sendData("services-dekstop-struct", { struct: currentDesktopStructData, images: allImageData });
});

mobileStructSaveBtn.addEventListener("click", () => {
  //! Отправка данных на сервер
  allImageData = allImageData.filter((el) => currentMobileStructData.filter((el2) => el2.collection == el.collection)[0].items[el.cell] != null);
  console.log(currentMobileStructData);
  console.log(allImageData);
  sendData("services-mobile-struct", { struct: currentMobileStructData, images: allImageData });
});

addNewMobileItemBtn.addEventListener("click", () => {
  currentMobileStructData[activeMobileStructMenuItem.dataset.index].items.push({
    type: "default",
    id: "empty",
  });

  const itemWraper = document.createElement("div");
  itemWraper.classList.add("mobile-item-wrapper");
  const itemControl = getMobileItemControl();
  itemWraper.appendChild(itemControl);

  const itemHTML = getDefaultMobileItem({ name: "...", descryption: "..." });
  itemHTML.dataset.collection = activeMobileStructMenuItem.dataset.index;
  itemHTML.dataset.cell =
    currentMobileStructData[activeMobileStructMenuItem.dataset.index].items
      .length - 1;
  itemWraper.appendChild(itemHTML);

  document
    .querySelector(".mobile-struct-content.active .line")
    .appendChild(itemWraper);
});

addNewSingleLineBtn.addEventListener("click", () => {
  currentDesktopStructData[
    activeDesktopStructMenuItem.dataset.index
  ].lines.push({
    type: "single",
    cells: {
      0: "empty",
      1: "empty",
      2: "empty",
      3: "empty",
    },
  });

  const lineWrapperHTML = document.createElement("div");
  lineWrapperHTML.classList.add("line-wrapper");
  lineWrapperHTML.dataset.collection =
    activeDesktopStructMenuItem.dataset.index;
  lineWrapperHTML.dataset.index =
    currentDesktopStructData[activeDesktopStructMenuItem.dataset.index].lines
      .length - 1;

  const desktopStructLineControl = getDesktopStructLineControl(false);
  lineWrapperHTML.appendChild(desktopStructLineControl);

  const lineHTML = document.createElement("div");
  lineHTML.classList.add("line");

  const halfHTML1 = document.createElement("div");
  halfHTML1.classList.add("half");

  const halfHTML2 = document.createElement("div");
  halfHTML2.classList.add("half");

  for (let i = 0; i < 4; i++) {
    const itemHTML = getEmptyItem();
    itemHTML.dataset.collection = lineWrapperHTML.dataset.collection;
    itemHTML.dataset.index = lineWrapperHTML.dataset.index;
    itemHTML.dataset.cell = `${i}`;

    if (i < 2) halfHTML1.appendChild(itemHTML);
    else halfHTML2.appendChild(itemHTML);
  }

  lineHTML.appendChild(halfHTML1);
  lineHTML.appendChild(halfHTML2);
  lineWrapperHTML.appendChild(lineHTML);

  document
    .querySelector(".desktop-struct-content.active")
    .appendChild(lineWrapperHTML);
});

addNewDoubleLineBtn.addEventListener("click", () => {
  currentDesktopStructData[
    activeDesktopStructMenuItem.dataset.index
  ].lines.push({
    type: "double",
    bigOrder: "0",
    bigBgUrl: "/images/placeholders/placeholderImg.png",
    cells: {
      big: "empty",
      0: "empty",
      1: "empty",
      2: "empty",
      3: "empty",
    },
  });

  const lineWrapperHTML = document.createElement("div");
  lineWrapperHTML.classList.add("line-wrapper");
  lineWrapperHTML.dataset.collection =
    activeDesktopStructMenuItem.dataset.index;
  lineWrapperHTML.dataset.index =
    currentDesktopStructData[activeDesktopStructMenuItem.dataset.index].lines
      .length - 1;

  const desktopStructLineControl = getDesktopStructLineControl(true);
  lineWrapperHTML.appendChild(desktopStructLineControl);

  const lineHTML = document.createElement("div");
  lineHTML.classList.add("line");

  const halfHTML1 = document.createElement("div");
  halfHTML1.classList.add("half");

  const halfHTML2 = document.createElement("div");
  halfHTML2.classList.add("half");

  halfHTML1.style.order = "0";
  halfHTML2.style.order = "1";

  const bigItemHTML = getDefaultBigItem(
    {},
    "/images/placeholders/placeholderImg.png"
  );
  bigItemHTML.dataset.collection = lineWrapperHTML.dataset.collection;
  bigItemHTML.dataset.index = lineWrapperHTML.dataset.index;
  bigItemHTML.dataset.cell = `big`;
  halfHTML1.appendChild(bigItemHTML);

  for (let i = 0; i < 4; i++) {
    const itemHTML = getEmptyItem();
    itemHTML.dataset.collection = lineWrapperHTML.dataset.collection;
    itemHTML.dataset.index = lineWrapperHTML.dataset.index;
    itemHTML.dataset.cell = `${i}`;

    halfHTML2.appendChild(itemHTML);
  }

  lineHTML.appendChild(halfHTML1);
  lineHTML.appendChild(halfHTML2);
  lineWrapperHTML.appendChild(lineHTML);

  document
    .querySelector(".desktop-struct-content.active")
    .appendChild(lineWrapperHTML);
});

function getItemImageInput(url, maxWidth, maxHeight) {
  const imgCont = document.createElement("div");
  imgCont.classList.add("item__img", "service");

  const bigItemImg = document.createElement("img");
  bigItemImg.style.maxWidth = maxWidth;
  if (maxHeight) bigItemImg.style.maxHeight = maxWidth;
  bigItemImg.src = url;

  const imgInput = document.createElement("input");
  imgInput.setAttribute("type", "file");
  imgInput.setAttribute("accept", "image/png, image/jpeg");
  imgInput.style.display = "none";
  imgInput.addEventListener("change", () => {
    const reader = new FileReader();
    const file = imgInput.files[0];
    const extension = file.type.split("/")[1];

    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      const item = imgInput.parentElement.parentElement;

      const imageData = {
        dataUrl: reader.result,
        extension: extension,
      };
      const res = {};

      if (item.dataset.index) {
        res.index = item.dataset.index;
      }

      res.collection = item.dataset.collection;
      res.cell = item.dataset.cell;

      res.imageData = imageData;

      allImageData.push(res);

      bigItemImg.src = reader.result;
    });
  });

  const changeBtn = document.createElement("button");
  changeBtn.classList.add("btn");
  changeBtn.textContent = "Изменить";
  changeBtn.addEventListener("click", () => {
    imgInput.click();
  })

  imgCont.appendChild(bigItemImg);
  imgCont.appendChild(changeBtn);
  imgCont.appendChild(imgInput);

  return imgCont;
}

function getChangeItemImg() {
  const changeItemBtn = document.createElement("button");
  changeItemBtn.classList.add("item-change");
  changeItemBtn.textContent = "Изменить";
  changeItemBtn.addEventListener("click", () => {
    desktopStructList.classList.add("active");
    currentDesktopStructItem = changeItemBtn.parentElement;
  });

  return changeItemBtn;
}

function getDefaultItem(data) {
  const itemHTML = document.createElement("div");
  itemHTML.classList.add("item");

  const nameHTML = document.createElement("div");
  nameHTML.classList.add("name");
  nameHTML.textContent = data.name;

  const descHTML = document.createElement("div");
  descHTML.classList.add("desc");
  descHTML.textContent = data.descryption;

  const changeItemBtn = getChangeItemImg();

  itemHTML.appendChild(nameHTML);
  itemHTML.appendChild(descHTML);
  itemHTML.appendChild(changeItemBtn);

  return itemHTML;
}

function getDefaultBigItem(data, url) {
  const bigItemHTML = document.createElement("div");
  bigItemHTML.classList.add("item", "big");

  const nameHTML = document.createElement("div");
  nameHTML.classList.add("name");
  nameHTML.textContent = data.name;

  const descHTML = document.createElement("div");
  descHTML.classList.add("desc");
  descHTML.textContent = data.descryption;

  const imgCont = getItemImageInput(url, "300px", "");

  const changeItemBtn = getChangeItemImg();

  bigItemHTML.appendChild(nameHTML);
  bigItemHTML.appendChild(descHTML);
  bigItemHTML.appendChild(imgCont);
  bigItemHTML.appendChild(changeItemBtn);

  return bigItemHTML;
}

function getEmptyItem() {
  const itemHTML = document.createElement("div");
  itemHTML.classList.add("item");

  const nameHTML = document.createElement("div");
  nameHTML.classList.add("name");
  nameHTML.style.display = "none";

  const descHTML = document.createElement("div");
  descHTML.classList.add("desc");
  descHTML.style.display = "none";

  const changeItemBtn = getChangeItemImg();

  itemHTML.appendChild(nameHTML);
  itemHTML.appendChild(descHTML);
  itemHTML.appendChild(changeItemBtn);

  return itemHTML;
}

function getDesktopStructLineControl(swapOn) {
  const desktopStructLineControl = document.createElement("div");
  desktopStructLineControl.classList.add("desktop-struct-line-control");

  const swapBtn = document.createElement("button");
  swapBtn.classList.add("swap");
  const swapImg = document.createElement("img");
  swapImg.src = "/images/icons/swap.png";
  swapBtn.appendChild(swapImg);
  swapBtn.addEventListener("click", () => {
    const halfs = swapBtn.parentElement.parentElement.querySelectorAll(".half");
    const lineWrapper = swapBtn.parentElement.parentElement;
    currentDesktopStructData[lineWrapper.dataset.collection].lines[
      lineWrapper.dataset.index
    ].bigOrder =
      currentDesktopStructData[lineWrapper.dataset.collection].lines[
        lineWrapper.dataset.index
      ].bigOrder == "1"
        ? "0"
        : "1";
    for (let half of halfs) {
      half.style.order = half.style.order == "1" ? "0" : "1";
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = "/images/icons/delete.png";
  deleteBtn.appendChild(deleteBtnImg);
  deleteBtn.addEventListener("click", () => {
    const line = deleteBtn.parentElement.parentElement;
    currentDesktopStructData[line.dataset.collection].lines[
      line.dataset.index
    ] = null;
    line.parentElement.removeChild(line);
  });

  desktopStructLineControl.appendChild(deleteBtn);
  if (swapOn) desktopStructLineControl.appendChild(swapBtn);

  return desktopStructLineControl;
}

function getMobileItemControl() {
  const container = document.createElement("div");
  container.classList.add("mobile-struct-line-control");

  const swapBtn = document.createElement("button");
  swapBtn.classList.add("swap");
  const swapImg = document.createElement("img");
  swapImg.src = "/images/icons/swap.png";
  swapBtn.appendChild(swapImg);
  swapBtn.addEventListener("click", () => {
    const currentItem =
      swapBtn.parentElement.parentElement.querySelector(".item");
    let newItem;
    if (currentItem.classList.contains("item--photo")) {
      newItem = getDefaultMobileItem({ name: "...", descryption: "..." });
      currentMobileStructData[currentItem.dataset.collection].items[
        currentItem.dataset.cell
      ] = {
        id: "empty",
        type: "default",
      };
    } else {
      newItem = getDefaultMobilePhotoItem(
        "/images/placeholders/placeholderImg.png"
      );
      currentMobileStructData[currentItem.dataset.collection].items[
        currentItem.dataset.cell
      ] = {
        type: "photo",
        url: "/images/placeholders/placeholderImg.png",
      };
    }
    newItem.dataset.collection = currentItem.dataset.collection;
    newItem.dataset.cell = currentItem.dataset.cell;

    const cont = currentItem.parentElement;
    cont.removeChild(currentItem);
    cont.appendChild(newItem);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = "/images/icons/delete.png";
  deleteBtn.appendChild(deleteBtnImg);
  deleteBtn.addEventListener("click", () => {
    const item = deleteBtn.parentElement.parentElement.querySelector(".item");
    currentMobileStructData[item.dataset.collection].items[item.dataset.cell] =
      null;
    item.parentElement.parentElement.removeChild(item.parentElement);
  });

  container.appendChild(deleteBtn);
  container.appendChild(swapBtn);

  return container;
}

function getDefaultMobileItem(data) {
  const itemHTML = document.createElement("div");
  itemHTML.classList.add("item");

  const nameHTML = document.createElement("div");
  nameHTML.classList.add("name");
  nameHTML.textContent = data.name;

  const descHTML = document.createElement("div");
  descHTML.classList.add("desc");
  descHTML.textContent = data.descryption;

  const changeItemBtn = document.createElement("button");
  changeItemBtn.classList.add("item-change");
  changeItemBtn.textContent = "Изменить";
  changeItemBtn.addEventListener("click", () => {
    desktopStructList.classList.add("active");
    currentMobileStructItem = changeItemBtn.parentElement;
  });

  itemHTML.appendChild(nameHTML);
  itemHTML.appendChild(descHTML);
  itemHTML.appendChild(changeItemBtn);

  return itemHTML;
}

function getDefaultMobilePhotoItem(url) {
  const itemHTML = document.createElement("div");
  itemHTML.classList.add("item", "item--photo");

  const imgCont = getItemImageInput(url, "280px", "280px");

  itemHTML.appendChild(imgCont);

  return itemHTML;
}

fetch("/api/adminvip/services-short-info")
  .then((rawData) => rawData.json())
  .then((servicesData) => {
    currentServicesData = servicesData;

    const desktopStructList = document.querySelector(".desktop-struct-list");

    for (let service of servicesData) {
      const newBtn = document.createElement("button");
      newBtn.classList.add("desktop-struct-list-item");
      newBtn.textContent = service.name;
      newBtn.dataset.id = service.id;

      desktopStructList.appendChild(newBtn);
    }

    const desktopStructListItems = document.querySelectorAll(
      ".desktop-struct-list-item"
    );

    for (let item of desktopStructListItems) {
      item.addEventListener("click", () => {
        if (currentDesktopStructItem != null) {
          const newService = currentServicesData.filter(
            (service) => service.id == item.dataset.id
          )[0];
          currentDesktopStructItem.querySelector(".name").textContent =
            newService.name;
          currentDesktopStructItem.querySelector(".name").style.display =
            "block";
          currentDesktopStructItem.querySelector(".desc").textContent =
            newService.descryption;
          currentDesktopStructItem.querySelector(".desc").style.display =
            "block";
          currentDesktopStructData[
            currentDesktopStructItem.dataset.collection
          ].lines[currentDesktopStructItem.dataset.index].cells[
            currentDesktopStructItem.dataset.cell
          ] = newService.id;
          currentDesktopStructItem = null;
          desktopStructList.classList.remove("active");
        }

        if (currentMobileStructItem != null) {
          const newService = currentServicesData.filter(
            (service) => service.id == item.dataset.id
          )[0];
          currentMobileStructItem.querySelector(".name").textContent =
            newService.name;
          currentMobileStructItem.querySelector(".desc").textContent =
            newService.descryption;
          currentMobileStructData[
            currentMobileStructItem.dataset.collection
          ].items[currentMobileStructItem.dataset.cell].id = newService.id;
          currentMobileStructItem = null;
          desktopStructList.classList.remove("active");
        }
      });
    }

    fetch("/api/adminvip/services-mobile-struct")
      .then((rawData) => rawData.json())
      .then((structData) => {
        currentMobileStructData = structData;

        for (let item of structData) {
          const container = document.querySelector(
            `.mobile-struct-content[data-collection="${item.collection}"]`
          );

          const lineHTML = document.createElement("div");
          lineHTML.classList.add("line", "mobile");

          for (let cell of item.items) {
            const itemWraper = document.createElement("div");
            itemWraper.classList.add("mobile-item-wrapper");
            const itemControl = getMobileItemControl();
            itemWraper.appendChild(itemControl);

            if (cell.type == "default") {
              const itemData = currentServicesData.filter(
                (el) => el.id == cell.id
              )[0];
              const itemHTML = getDefaultMobileItem(itemData);
              itemHTML.dataset.collection = structData.indexOf(item);
              itemHTML.dataset.cell = item.items.indexOf(cell);
              itemWraper.appendChild(itemHTML);
              lineHTML.appendChild(itemWraper);
            } else if (cell.type == "photo") {
              const itemData = currentServicesData.filter(
                (el) => el.id == cell.id
              )[0];
              const itemHTML = getDefaultMobilePhotoItem(cell.url);
              itemHTML.dataset.collection = structData.indexOf(item);
              itemHTML.dataset.cell = item.items.indexOf(cell);
              itemWraper.appendChild(itemHTML);
              lineHTML.appendChild(itemWraper);
            }
          }
          container.appendChild(lineHTML);
        }
      });

    fetch("/api/adminvip/services-desktop-struct")
      .then((rawData) => rawData.json())
      .then((structData) => {
        currentDesktopStructData = structData;

        for (let item of structData) {
          const container = document.querySelector(
            `.desktop-struct-content[data-collection="${item.collection}"]`
          );

          for (let line of item.lines) {
            const lineWrapperHTML = document.createElement("div");
            lineWrapperHTML.classList.add("line-wrapper");
            lineWrapperHTML.dataset.collection = structData.indexOf(item);
            lineWrapperHTML.dataset.index = item.lines.indexOf(line);

            const desktopStructLineControl = getDesktopStructLineControl(
              line.type == "double"
            );
            lineWrapperHTML.appendChild(desktopStructLineControl);

            const lineHTML = document.createElement("div");
            lineHTML.classList.add("line");

            const halfHTML1 = document.createElement("div");
            halfHTML1.classList.add("half");

            const halfHTML2 = document.createElement("div");
            halfHTML2.classList.add("half");

            if (line.type == "double") {
              lineHTML.classList.add("big");

              const bigItemData = servicesData.filter(
                (service) => service.id == line.cells.big
              )[0];

              const bigItemHTML = getDefaultBigItem(bigItemData, line.bigBgUrl);
              bigItemHTML.dataset.collection =
                lineWrapperHTML.dataset.collection;
              bigItemHTML.dataset.index = lineWrapperHTML.dataset.index;
              bigItemHTML.dataset.cell = "big";

              halfHTML1.style.order = line.bigOrder;
              halfHTML2.style.order = line.bigOrder == 1 ? "0" : "1";
              halfHTML1.appendChild(bigItemHTML);

              for (let i = 0; i < 4; i++) {
                const currentCellData = servicesData.filter(
                  (service) => service.id == line.cells[i]
                )[0];
                let itemHTML;

                if (currentCellData) {
                  itemHTML = getDefaultItem(currentCellData);
                } else {
                  itemHTML = getEmptyItem();
                }

                itemHTML.dataset.collection =
                  lineWrapperHTML.dataset.collection;
                itemHTML.dataset.index = lineWrapperHTML.dataset.index;
                itemHTML.dataset.cell = `${i}`;

                halfHTML2.appendChild(itemHTML);
              }
            } else if (line.type == "single") {
              for (let i = 0; i < 4; i++) {
                const currentCellData = servicesData.filter(
                  (service) => service.id == line.cells[i]
                )[0];
                let itemHTML;

                if (currentCellData) {
                  itemHTML = getDefaultItem(currentCellData);
                } else {
                  itemHTML = getEmptyItem();
                }

                itemHTML.dataset.collection =
                  lineWrapperHTML.dataset.collection;
                itemHTML.dataset.index = lineWrapperHTML.dataset.index;
                itemHTML.dataset.cell = `${i}`;

                if (i < 2) {
                  halfHTML1.appendChild(itemHTML);
                } else {
                  halfHTML2.appendChild(itemHTML);
                }
              }
            }

            lineHTML.appendChild(halfHTML1);
            lineHTML.appendChild(halfHTML2);
            lineWrapperHTML.appendChild(lineHTML);
            container.appendChild(lineWrapperHTML);
          }
        }
      });
  });
