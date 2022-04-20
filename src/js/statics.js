const fs = require("fs");
const path = require("path");

const link = path.join(__dirname, "../js/users.json");

// ----------------------------------------------------------------
const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return users;
  }
};

function getPercentage(games, victories) {
  return (victories * 100) / games;
}

const main = async () => {
  let data = await readUsers();
  let stats = await data.statics.filter(
    (e) => e.username === data.activeUser
  )[0];

  let gamesCount = 0;
  for (let i = 0; i < stats.statics.length; i++) {
    gamesCount = gamesCount + stats.statics[i];
  }

  document.getElementById("games-played").innerHTML = gamesCount;
  document.getElementById("winrate").innerHTML =
    Math.floor(getPercentage(gamesCount, gamesCount - stats.statics[6])) + "%";

  let max = Math.max(...stats.statics);

  for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    let index = document.createElement("div");
    index.innerHTML = i + 1;
    index.style.width = "1em";
    index.classList.add("index");

    let percentage = document.createElement("div");
    percentage.innerHTML = stats.statics[i];
    percentage.style.width = `${Math.floor(
      getPercentage(gamesCount, stats.statics[i])
    )}%`;
    percentage.style.minWidth = "1em";
    percentage.classList.add("bar");
    if (stats.statics[i] === max) {
      percentage.classList.add("highlight");
    }

    row.appendChild(index);
    row.appendChild(percentage);

    document.getElementById("percentages").appendChild(row);
  }
};

main();
