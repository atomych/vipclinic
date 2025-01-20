document.querySelector(".btn.save").addEventListener("click", () => {
  const oldPass = document.querySelector("#oldPass").value;
  const newPass = document.querySelector("#newPass1").value;
  const repNewPass = document.querySelector("#newPass2").value;

  if (newPass == repNewPass) {
    const data = {
      old: oldPass,
      new: newPass
    };

    fetch("/private-api/adminvip/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"free-token"}`,
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status == 201) location.reload();
    });
  }
});
