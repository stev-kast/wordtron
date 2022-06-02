const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const axios = require("axios");

const link = path.join(__dirname, "../js/users.json");

const saltRounds = 10; // Se usa en la encriptacion del password ?

document.getElementById("login").addEventListener("click", function (e) {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("openLogin");
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  addUser();
});

const getUserByUsername = async (username) => {
  let user = await axios.get("http://localhost:3000/user/username/"+username)
  return user;
}

async function addUser() {
  let newUser = {
    name: document.getElementById("user-name").value,
    lastname: document.getElementById("user-last-name").value,
    username: document.getElementById("user-username").value,
  };
  users = await getUserByUsername(newUser.username);
  // Verifica si el nombre de usuario ya existe
  if (users.data.length==0) {
    //Encriptacion del password
    const hash = await bcrypt.hashSync(document.getElementById("user-password").value, saltRounds);
    newUser.password = hash;
    // Agrega un usuario a la base
    try {
      // Hace la petición al Rest API
      let respuesta = await axios.post("http://localhost:3000/user",
        newUser);
      // Muestra el resultado
      console.log(respuesta);
    alert("User Created");
    } catch (error) {
      console.log(error);
    }

  } else {
    alert("Username already in use");
  }
}
