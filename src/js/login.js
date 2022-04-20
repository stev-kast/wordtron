const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { ipcRenderer } = require("electron");

const link = path.join(__dirname, "../js/users.json");

document.getElementById("signup").addEventListener("click", function (e) {
  ipcRenderer.send("openRegister");
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  login();
});

const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return users;
  }
};

async function login() {
  let account = {
    username: document.getElementById("user-username").value,
    passwd: document.getElementById("user-password").value,
  };

  let datos = await readUsers();
  if (datos === undefined) {
    alert("User not found");
  } else {
    if (
      datos.users.some((e) => e.username == account.username) &&
      datos.users.length > 0
    ) {
      // busca si existe el nombre de usuario
      let ind = await datos.users.findIndex(
        // busca el index del nombre de usuario en el array de los usuarios
        (e) => e.username == account.username
      );
      let user = datos.users[ind]; // Guarda el usuario con el username que se encontro
      if (bcrypt.compareSync(account.passwd, user.passwd)) {
        ipcRenderer.send("openGame", { user: user.username });
      } else {
        alert("Invalid credentials");
        return false;
      }
    } else {
      alert("User not found");
    }
  }
}
