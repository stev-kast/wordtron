document.getElementById("signup").addEventListener("click", function (e) {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("openRegister");
});
