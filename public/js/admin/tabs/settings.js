document.querySelector(".btn.save").addEventListener("click", () => {
  const oldPass = document.querySelector("#oldPass").value;
  const newPass = document.querySelector("#newPass1").value;
  const repNewPass = document.querySelector("#newPass2").value;

  if (newPass == repNewPass) {
    const data = {
      old: oldPass,
      new: newPass
    };

    const token = localStorage.getItem("VIPCLINIC-ADMINVIP-TOKEN");

    fetch("/private-api/adminvip/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status == 201) location.reload();
    });
  }
});
