const signInBtn = document.querySelector(".form__btn");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");

signInBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();

  const data = {
    login: loginInput.value,
    password: passwordInput.value,
  };

  fetch("/adminvip/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.login) {
        localStorage.setItem("VIPCLINIC-ADMINVIP-TOKEN", data.token);
        window.location.href = "/adminvip/panel";
      } else {
        console.log("invalid auth");
      }
    });
});
