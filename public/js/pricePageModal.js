const priceDocs = document.querySelectorAll(".open-modal-item");
let currentIndex;

function getCloseModalBtn(modal) {
  const icon = document.createElement("button");
  const iconImg = document.createElement("img");
  iconImg.src = "/images/icons/close.svg";
  icon.classList.add("modal-close-icon");
  icon.appendChild(iconImg);
  icon.addEventListener("click", () => {
    document.body.removeChild(modal);
    currentIndex = null;
  });
  return icon;
}

function getSliderBtn(className) {
  const btn = document.createElement("button");
  btn.classList.add("modal-open-arrow", className);
  return btn;
}

function getModalContentImage(url) {
  const img = document.createElement("img");
  img.classList.add("modal-open-window-image");
  img.src = url;

  return img;
}

let index = 0;
for (let priceDoc of priceDocs) {
  priceDoc.dataset.index = index;

  priceDoc.addEventListener("click", () => {
    currentIndex = Number(priceDoc.dataset.index);

    const modal = document.createElement("div");
    modal.classList.add("modal-open-window-main");
    const modalCloseBtn = getCloseModalBtn(modal);
    const contentImg = getModalContentImage(priceDoc.src);
    modal.appendChild(modalCloseBtn);
    modal.appendChild(contentImg);
    
    const backArr = getSliderBtn("left");
    backArr.addEventListener("click", () => {
      if (currentIndex - 1 < 0) currentIndex = priceDocs.length - 1;
      else currentIndex -= 1;

      contentImg.src = priceDocs[currentIndex].src;
    })

    const nextArr = getSliderBtn("right");
    nextArr.addEventListener("click", () => {
      if (currentIndex + 1 ==  priceDocs.length) currentIndex = 0;
      else currentIndex += 1;

      contentImg.src = priceDocs[currentIndex].src;
    })

    modal.appendChild(backArr);
    modal.appendChild(nextArr);
    document.body.classList.add("no-scroll");
    document.body.appendChild(modal);
  });

  index += 1;

  priceDoc.parentElement.querySelector(".price__item-before").addEventListener("click", () => priceDoc.click());
  priceDoc.parentElement.querySelector(".price__item-after").addEventListener("click", () => priceDoc.click());
}
