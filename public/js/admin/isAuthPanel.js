const token = localStorage.getItem("VIPCLINIC-ADMINVIP-TOKEN");

fetch("/adminvip/is-auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (!data.isAuth) {
      window.location.href = "/adminvip/login";
    }
  });
