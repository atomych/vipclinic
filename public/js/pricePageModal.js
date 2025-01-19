const priceDocs = document.querySelectorAll(".open-modal-item");

function getCloseModalBtn(modal) {
  const icon = document.createElement("button");
  const iconImg = document.createElement("img");
  iconImg.src = "/images/icons/close.svg";
  icon.classList.add("modal-close-icon");
  icon.appendChild(iconImg);
  icon.addEventListener("click", () => {
    document.body.removeChild(modal);
  });
  return icon;
}

function getModalContentImage(url) {
  const img = document.createElement("img");
  img.classList.add("modal-open-window-image");
  img.src = url;

  return img;
}

for (let priceDoc of priceDocs) {
  priceDoc.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.classList.add("modal-open-window-main");
    const modalCloseBtn = getCloseModalBtn(modal);
    const contentImg = getModalContentImage(priceDoc.src);
    modal.appendChild(modalCloseBtn);
    modal.appendChild(contentImg);
    document.body.classList.add("no-scroll");
    document.body.appendChild(modal);
  });
}
