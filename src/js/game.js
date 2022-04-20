const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");

const link = path.join(__dirname, "../js/users.json");

const dictionary = path.join(__dirname, "../js/dictionary.json"); // Diccionario mas comun ESPAÑOL

let letter_count = 0; // Helps to avoid entering more than five keyboard before validating the word
let active_row = 0; // helps verify what row are we working on
let word = null; //This is the word to find in the game
let game_cells = []; // saves color indicator for each cell
let keyboard = [];

document.getElementById("logOut").addEventListener("click", function (e) {
  e.preventDefault();
  ipcRenderer.send("openLogin");
});
document.getElementById("new-game").addEventListener("click", function (e) {
  location.reload();
});
document.getElementById("statics").addEventListener("click", function (e) {
  e.preventDefault();
  ipcRenderer.send("openStatics");
});
document.getElementsByName("delete")[0].addEventListener("click", (e) => {
  let cells = document.getElementsByClassName("letter-cell");
  cells = Object.values(cells);
  let finder = active_row * 5 - 1;
  if (active_row < 6) {
    for (let i = 5; i > 0; i--) {
      if (cells[finder + i].children[0].innerHTML !== "") {
        cells[finder + i].children[0].innerHTML = "";
        letter_count--;
        return true;
      }
    }
  }
});
document.getElementsByName("enter")[0].addEventListener("click", (e) => {
  let cells = document.getElementsByClassName("letter-cell");
  cells = Object.values(cells);
  let input = "";
  if (active_row < 6) {
    for (let i = active_row * 5; i < active_row * 5 + 5; i++) {
      input = input + cells[i].children[0].innerHTML;
    }
    verify_word(input, word);
  }
});

document.addEventListener("keydown", (e) => {
  if (isALetter(e.key) && e.key.length === 1) {
    let letter = e.key.toUpperCase();

    let cells = document.getElementsByClassName("letter-cell");
    cells = Object.values(cells);
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].children[0].innerHTML === "" && letter_count < 5) {
        cells[i].children[0].innerHTML = letter;
        letter_count++;
        return true;
      }
    }
  }
  if (e.key === "Backspace") {
    let cells = document.getElementsByClassName("letter-cell");
    cells = Object.values(cells);
    let finder = active_row * 5 - 1;
    if (active_row < 6) {
      for (let i = 5; i > 0; i--) {
        if (cells[finder + i].children[0].innerHTML !== "") {
          cells[finder + i].children[0].innerHTML = "";
          letter_count--;
          return true;
        }
      }
    }
  }
  if (e.key === "Enter") {
    let cells = document.getElementsByClassName("letter-cell");
    cells = Object.values(cells);
    let input = "";
    if (active_row < 6) {
      for (let i = active_row * 5; i < active_row * 5 + 5; i++) {
        input = input + cells[i].children[0].innerHTML;
      }
      verify_word(input, word);
    }
  }
});
// ---------------- Hace que cada key ingrese su valor en el grid del juego
let keys = document.getElementsByName("key");
keys = Object.values(keys);
keys.map((key) => {
  key.addEventListener("click", (e, data) => {
    let cells = document.getElementsByClassName("letter-cell");
    cells = Object.values(cells);
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].children[0].innerHTML === "" && letter_count < 5) {
        cells[i].children[0].innerHTML = e.target.innerHTML;
        letter_count++;
        return true;
      }
    }
  });
});
// ----------------------------------------------------------------
function isALetter(char) {
  return /[a-zA-Z]/.test(char);
}
const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return users;
  }
};
// ------------ Lee el diccionario de palabras mas comunes
const readCommon = async () => {
  if (fs.existsSync(dictionary)) {
    let lectura = fs.readFileSync(dictionary);
    let abc = JSON.parse(lectura);
    return abc.common;
  } else {
    console.log("El archivo common no existe");
  }
};
const readDic = async () => {
  if (fs.existsSync(dictionary)) {
    let lectura = fs.readFileSync(dictionary);
    let abc = JSON.parse(lectura);
    return abc.complete;
  } else {
    console.log("El archivo common no existe");
  }
};
const generate_word = async () => {
  // This will take a random word from a list of common english or spanis words
  let commons = await readCommon();
  let choose = Math.floor(Math.random() * commons.length);
  let word = commons[choose];
  return word;
};

const verify_word = async (input, word) => {
  let di = await readDic();
  let word_in_dic = Object.values(di).some((e) => e == input); // read dic solo me retorna un objeto por lo tanto hago la conversion aca

  if (input.length != 5) {
    alert("Word is not valid");
  } else if (!word_in_dic) {
    alert("Word is not in dictionary");
  } else {
    compare_words(input, word);
  }
};

const compare_words = async (input, word) => {
  // Aca se guardan los indicadores despues de comparar la palabra ingresada con la palabra a encontrar (0,1,2,3)
  // 0 indica que la letra esta en la posicion correcta
  // 1 indica que la letra esta en la palabra pero no en la posicion correcta
  // 2 indica que la letra no esta en la palabra
  // 3 es un estado para el codigo que indica que no hay interaccion aun con la letra.

  let wordChecker = 0;
  for (let j = 0; j < 5; j++) {
    if (input.charAt(j) == word.charAt(j)) {
      // --- Extra logic to avoid redundance: Si anteriormente ya se marco la letra con indicador 1 se remueve este dato para ahora indicar que la letra esta en la posicion correcta
      for (let i = 0; i < j; i++) {
        if (game_cells[game_cells.length - 1 - i][0] == input.charAt(j)) {
          if (word.split("").filter((e) => e == input.charAt(j)).length == 1) {
            // Se verifica que la letra este solo una vez en la palabra a encontrar
            game_cells[game_cells.length - 1 - i][1] = 2;
          }
        }
      }
      // ----------
      game_cells.push([input.charAt(j), 0]);
      let ind = keyboard.findIndex((e) => e[0] == input.charAt(j));
      // Si la letra en la posicion j de input es igual a la letra en la posicion j de word se guarda como un 0
      keyboard[ind][1] = 0;
      wordChecker++;
    } else if (word.split("").some((e) => e == input.charAt(j))) {
      // --- Extra logic to avoid redundance: Se verifica si la palabra contiene dos o mas veces la palabra a encontrar para guardar estos datos correctamente.
      let count = 0;
      for (let i = 0; i < j; i++) {
        if (game_cells[game_cells.length - 1 - i][0] == input.charAt(j)) {
          count++;
        }
      }
      if (count < word.split("").filter((e) => e == input.charAt(j)).length) {
        let ind = keyboard.findIndex((e) => e[0] == input.charAt(j));
        if (keyboard[ind][1] != 0) {
          keyboard[ind][1] = 1;
        }
        game_cells.push([input.charAt(j), 1]);
      } else {
        let ind = keyboard.findIndex((e) => e[0] == input.charAt(j));
        if (keyboard[ind][1] != 0 && keyboard[ind][1] != 1) {
          keyboard[ind][1] = 2;
        }
        game_cells.push([input.charAt(j), 2]);
      }
      // --------------
    } else if (word.split("").some((e) => e != input.charAt(j))) {
      let ind = keyboard.findIndex((e) => e[0] == input.charAt(j));
      if (keyboard[ind][1] != 0 && keyboard[ind][1] != 1) {
        keyboard[ind][1] = 2;
      }
      game_cells.push([input.charAt(j), 2]);
    }
  }

  await print_game_cells_color();
  await print_keyboard_colors();

  if (wordChecker == 5) {
    // Si hay 5 letras en la posicion correctase guarda un arroba para indicar que se ha encontrado la palabra
    game_cells.push("@");
    saveStatics(active_row);
    active_row = 7;
    letter_count = 6;
    alert("Word Found!");
  } else if (active_row == 5) {
    alert("Game Over! \nWord: " + word);
    saveStatics(active_row + 1);
  }
  active_row++;
  letter_count = 0;
};

const print_game_cells_color = async () => {
  let cells = document.getElementsByClassName("letter-cell");
  cells = Object.values(cells);

  for (let i = game_cells.length - 5; i < game_cells.length; i++) {
    if (game_cells[i][1] === 0) {
      cells[i].classList.add("green");
    } else if (game_cells[i][1] === 1) {
      cells[i].classList.add("orange");
    } else if (game_cells[i][1] === 2) {
      cells[i].classList.add("gray");
    }
  }
};

const print_keyboard_colors = async () => {
  let keys = document.getElementsByName("key");
  keys = Object.values(keys);
  for (let i = 0; i < keyboard.length; i++) {
    if (keyboard[i][1] === 0) {
      keys[i].classList.remove("gray");
      keys[i].classList.remove("orange");
      keys[i].classList.add("green");
    } else if (keyboard[i][1] === 1) {
      keys[i].classList.remove("gray");
      keys[i].classList.add("orange");
    } else if (keyboard[i][1] === 2) {
      keys[i].classList.add("gray");
    }
  }
};

async function saveStatics(last) {
  let datos = await readUsers();
  let username = datos.activeUser;
  if (datos.statics.some((e) => e.username == username)) {
    let ind = await datos.statics.findIndex(
      // busca el index del nombre de usuario en el array de los statics
      (e) => e.username == username
    );
    datos.statics[ind].statics[last]++;
    let cadena = JSON.stringify(datos);
    fs.writeFileSync(link, cadena);
  } else {
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
// -------------------------
const start_game = async () => {
  word = await generate_word();
  keyboard = [
    ["Q", 3],
    ["W", 3],
    ["E", 3],
    ["R", 3],
    ["T", 3],
    ["Y", 3],
    ["U", 3],
    ["I", 3],
    ["O", 3],
    ["P", 3],
    ["A", 3],
    ["S", 3],
    ["D", 3],
    ["F", 3],
    ["G", 3],
    ["H", 3],
    ["J", 3],
    ["K", 3],
    ["L", 3],
    ["Z", 3],
    ["X", 3],
    ["C", 3],
    ["V", 3],
    ["B", 3],
    ["N", 3],
    ["M", 3],
  ];
  console.log(word);
};
start_game();
