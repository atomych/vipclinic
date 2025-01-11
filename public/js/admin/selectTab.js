const btns = document.querySelectorAll(".aside__btn");
const tabSection = document.querySelector(".panel__tab iframe");
let activeBtn = document.querySelector(".aside__btn.active");

for (let btn of btns) {
    btn.addEventListener("click", () => {
        if (!btn.classList.contains("active")) {
            const newURL = "/adminvip/tabs/" + btn.dataset.url;
            activeBtn.classList.remove("active");
            btn.classList.add("active");
            activeBtn = btn;
            tabSection.src = newURL;
        }
    })
}