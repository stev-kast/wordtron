const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const link = path.join(__dirname, "users.json");

const saltRounds = 10; // Se usa en la encriptacion del password ?

document.getElementById("login").addEventListener("click", function (e) {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("openLogin");
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  addUser();
});

const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return await users;
  }
};

async function addUser() {
  let datos = await readUsers();

  // Crea el archivo de datos si no existe
  if (datos === undefined) {
    datos = {
      users: [],
      statics: [],
    };

    let cadena = JSON.stringify(datos);
    fs.writeFileSync(link, cadena);
  }
  let newUser = {
    name: document.getElementById("user-name").value,
    lastName: document.getElementById("user-last-name").value,
    username: document.getElementById("user-username").value,
    passwd: document.getElementById("user-password").value,
  };
  console.log(newUser);
  // Verifica si el nombre de usuario ya existe
  if (!datos.users.some((e) => e.username == newUser.username)) {
    // Si no existe el nombre de usuario, lo agrega al array de usuarios

    //Encriptacion del password
    const hash = await bcrypt.hashSync(newUser.passwd, saltRounds);
    newUser.passwd = hash;
    // Agrega un usuario a la base
    datos.users.push(newUser);
    // Pasa de objeto JSON a un string de datos
    let cadena = JSON.stringify(datos);
    // Escribe la cadena al archivo datos.JSON
    fs.writeFileSync(link, cadena);
    alert("User Created");
    return datos;
  } else {
    alert("Username already in use");
  }
}
