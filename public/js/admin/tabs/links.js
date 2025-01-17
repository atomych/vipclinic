const saveBtn = document.querySelector(".btn.save");

saveBtn.addEventListener("click", () => {
  const putLinksData = {social: {}};

  putLinksData.yclients = document.querySelector("#yclients").textContent;
  putLinksData.social.phone = document.querySelector("#phone").textContent;
  putLinksData.social.wa = document.querySelector("#wa").textContent;
  putLinksData.social.tg = document.querySelector("#tg").textContent;

  fetch("/private-api/adminvip/links", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"free-token"}`,
    },
    body: JSON.stringify(putLinksData),
  }).then((res) => {
    if (res.status == 201) location.reload();
  });
});