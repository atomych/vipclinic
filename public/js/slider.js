window.addEventListener("load", () => {
  const sliderLists = document.querySelectorAll(".slider-list");

  sliderLists.forEach(list => {
    const items = Array.from(list.children);

    if (items.length) {
      const marginRight = Math.trunc(parseInt(getComputedStyle(items[0]).marginRight));
      setSliderControl(list, marginRight, items);
    }
  });

  function setSliderControl(list, marginRight, items) {
    const listWidth = list.offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const itemHeight = items[0].offsetHeight;
    const totalWidth = items.length * itemWidth + marginRight * (items.length - 1);
    const sliderContainer = list.parentElement.querySelector(".slider-container");

    sliderContainer.style.top = -(itemHeight / 2) + "px";

    if (listWidth < totalWidth) {
      const sliderContainer = list.parentElement.querySelector(".slider-container");
      sliderContainer.innerHTML += `
        <button class="slider-arrow left"></button>
        <button class="slider-arrow right"></button>
      `;

      const backBtn = sliderContainer.querySelector(".slider-arrow.left");
      const nextBtn = sliderContainer.querySelector(".slider-arrow.right");
      const scrollValue = itemWidth + marginRight;

      backBtn.addEventListener("click", () => {
        list.scrollBy({ left: list.scrollLeft === 0 ? list.scrollWidth : -scrollValue, behavior: 'smooth' });
      });

      nextBtn.addEventListener("click", () => {
        list.scrollBy({ left: (Math.ceil(list.scrollLeft) + listWidth >= list.scrollWidth) ? -list.scrollWidth : scrollValue, behavior: 'smooth' });
      });
    }
  }
});