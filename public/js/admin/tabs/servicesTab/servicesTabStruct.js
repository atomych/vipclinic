const desktopStructContentAll = document.querySelectorAll(
  ".desktop-struct-content"
);
const desktopStructMenuItems = document.querySelectorAll(
  ".desktop-struct-item"
);

let activeDesktopStructMenuItem = document.querySelector(
  ".desktop-struct-item.active"
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

    activeDesktopStructMenuItem = btn;
  });
}

let currentServicesData = [];
let currentDesktopStructData = {};
let currentDesktopStructItem;

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

function getChangeItemImg() {
  const changeItemBtn = document.createElement("button");
  changeItemBtn.classList.add("item-change");
  changeItemBtn.textContent = "Изменить";
  changeItemBtn.addEventListener("click", () => {
    desktopStructList.classList.remove("active");
    setTimeout(() => desktopStructList.classList.add("active"), 100);
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

  const imgCont = document.createElement("div");
  imgCont.classList.add("item__img", "service");

  const bigItemImg = document.createElement("img");
  bigItemImg.style.maxWidth = "300px";
  bigItemImg.src = url;

  const changeBtn = document.createElement("button");
  changeBtn.classList.add("btn");
  changeBtn.textContent = "Изменить";

  const imgInput = document.createElement("input");
  imgInput.setAttribute("type", "file");
  imgInput.setAttribute("accept", "image/png, image/jpeg");
  imgInput.style.display = "none";

  imgCont.appendChild(bigItemImg);
  imgCont.appendChild(changeBtn);
  imgCont.appendChild(imgInput);

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
      });
    }

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
