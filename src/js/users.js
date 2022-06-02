const { confirmMessage } = require("./input");
const bcrypt = require("bcrypt");
const axios = require("axios");

async function showStatics(username) {
  user = await axios.get(`https://wordtron-api.herokuapp.com/statics/username/${username}`);
  let stats = user.data[0].statics;
  if (stats != undefined) {
    let games = 0;
    for (let i = 0; i < stats.length; i++) {
      games = games + stats[i];
    }
    let squares = "";
    console.log(`Partidas jugadas: ${games}`);
    console.log(`Victorias: ${percentage(games, games - stats[0])}%`);
    squares = generateSquares(percentage(games, stats[1]));
    console.log(`1: ${squares} ${percentage(games, stats[1])}%`);
    squares = generateSquares(percentage(games, stats[2]));
    console.log(`2: ${squares} ${percentage(games, stats[2])}%`);
    squares = generateSquares(percentage(games, stats[3]));
    console.log(`3: ${squares} ${percentage(games, stats[3])}%`);
    squares = generateSquares(percentage(games, stats[4]));
    console.log(`4: ${squares} ${percentage(games, stats[4])}%`);
    squares = generateSquares(percentage(games, stats[5]));
    console.log(`5: ${squares} ${percentage(games, stats[5])}%`);
    squares = generateSquares(percentage(games, stats[6]));
    console.log(`6: ${squares} ${percentage(games, stats[6])}%`);
    squares = generateSquares(percentage(games, stats[0]));
    console.log(`X: ${squares} ${percentage(games, stats[0])}%`);
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
  showStatics,
};
