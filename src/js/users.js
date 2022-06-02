const fs = require("fs");
const path = require("path");
const { confirmMessage } = require("./input");
const bcrypt = require("bcrypt");

const link = path.join(__dirname, "users.json");

const saltRounds = 10; // Se usa en la encriptacion del password ?

const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return users;
  }
};

async function saveStatics(username, last) {
  let datos = await readUsers();
  if (datos.statics.some((e) => e.username == username)) {
    let ind = await datos.statics.findIndex(
      // busca el index del nombre de usuario en el array de los statics
      (e) => e.username == username
    );
    datos.statics[ind].statics[last]++;
    let cadena = JSON.stringify(datos);
    fs.writeFileSync(link, cadena);
  } else {
    await confirmMessage("Gracias por jugar tu primer juego! :)");
    // Agrega un usuario a la base de estadisticas
    const newUser = {
      username: username,
      statics: [0, 0, 0, 0, 0, 0, 0],
    };
    newUser.statics[last] = 1;
    datos.statics.push(newUser);
    let cadena = JSON.stringify(datos);
    fs.writeFileSync(link, cadena);
  }
}

async function showStatics(username) {
  let datos = await readUsers();
  let stats = await datos.statics.filter((e) => e.username == username)[0];
  if (stats != undefined) {
    let games = 0;
    for (let i = 0; i < stats.statics.length; i++) {
      games = games + stats.statics[i];
    }
    let squares = "";
    console.log(`Partidas jugadas: ${games}`);
    console.log(`Victorias: ${percentage(games, games - stats.statics[0])}%`);
    squares = generateSquares(percentage(games, stats.statics[1]));
    console.log(`1: ${squares} ${percentage(games, stats.statics[1])}%`);
    squares = generateSquares(percentage(games, stats.statics[2]));
    console.log(`2: ${squares} ${percentage(games, stats.statics[2])}%`);
    squares = generateSquares(percentage(games, stats.statics[3]));
    console.log(`3: ${squares} ${percentage(games, stats.statics[3])}%`);
    squares = generateSquares(percentage(games, stats.statics[4]));
    console.log(`4: ${squares} ${percentage(games, stats.statics[4])}%`);
    squares = generateSquares(percentage(games, stats.statics[5]));
    console.log(`5: ${squares} ${percentage(games, stats.statics[5])}%`);
    squares = generateSquares(percentage(games, stats.statics[6]));
    console.log(`6: ${squares} ${percentage(games, stats.statics[6])}%`);
    squares = generateSquares(percentage(games, stats.statics[0]));
    console.log(`X: ${squares} ${percentage(games, stats.statics[0])}%`);
    await confirmMessage("");
  } else {
    console.log("No hay datos aun");
    await confirmMessage("");
  }
}

function generateSquares(stat) {
  let str = "";
  for (let i = 0; i < stat; i++) {
    str = str + "□";
  }
  return str;
}

function percentage(games, victories) {
  return (victories * 100) / games;
}

module.exports = {
  saveStatics,
  showStatics,
};
