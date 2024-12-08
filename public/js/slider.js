window.addEventListener("load", () => {
  const sliderLists = document.querySelectorAll(".slider-list");

  for (let list of sliderLists) {
    const items = list.childNodes;

    if (items.length) {
      setSliderControl(list, parseInt(getComputedStyle(items[0]).marginRight));
    }
  }

  function setSliderControl(list, marginRight) {
    const listWidth = list.offsetWidth;
    const listItems = list.childNodes;
    const itemWidth = listItems[0].offsetWidth;

    if (
      listWidth <
      listItems.length * itemWidth + marginRight * (listItems.length - 1)
    ) {
      const sliderContainer =
        list.parentElement.querySelector(".slider-container");
      sliderContainer.innerHTML += `
      <button class="slider-arrow left"></button>
      <button class="slider-arrow right"></button>
    `;

      const backBtn = sliderContainer.querySelector(".slider-arrow.left");
      const nextBtn = sliderContainer.querySelector(".slider-arrow.right");
      const scrollValue = itemWidth + marginRight;

      backBtn.addEventListener("click", () => {
        if (list.scrollLeft == 0) {
          list.scrollTo(list.scrollWidth, 0);
        } else {
          list.scrollBy(-scrollValue, 0);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (list.scrollLeft + list.clientWidth >= list.scrollWidth) {
          list.scrollTo(0, 0);
        } else {
          list.scrollBy(scrollValue, 0);
        }
      });
    }
  }
});
