document.getElementById("login").addEventListener("click", function (e) {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("openLogin");
});
