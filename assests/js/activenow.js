import proxy from "./proxy.js";
const setActiveNow = () => {
  fetch(`${proxy}/api/activenow`, {
    method: "POST",
    body: JSON.stringify({
      type: "set-active",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== "success") {
        document.cookie =
          "token" + "=" + "" + ";" + "-3600" + ";path=/" + ";SameSite=Strict";
        window.location.reload();
      }
    });
};
window.onload = () => {
  setActiveNow();
  setInterval(() => {
    setActiveNow();
  }, 3000);
};
