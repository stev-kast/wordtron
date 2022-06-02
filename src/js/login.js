const bcrypt = require("bcrypt");
const { ipcRenderer } = require("electron");
const axios = require("axios");

document.getElementById("signup").addEventListener("click", function (e) {
  ipcRenderer.send("openRegister");
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  login();
});
const getUserByUsername = async (username) => {
  let user = await axios.get("https://wordtron-api.herokuapp.com/user/username/"+username)
  return user;
}
async function login() {
  let account = {
    username: document.getElementById("user-username").value,
    passwd: document.getElementById("user-password").value,
  };
  foundUser = await getUserByUsername(account.username);
  if (foundUser.data.length > 0) {
    if (bcrypt.compareSync(account.passwd, foundUser.data[0].password)) {
      ipcRenderer.send("openGame", { user: foundUser.data[0].username });
    } else {
      alert("Invalid credentials");
      return false;
    }
  } else {
    alert("User not found");
  }
}
