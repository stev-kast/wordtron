// Librerías
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const fs = require("fs");
const path = require("path");

const link = path.join(__dirname, "./js/users.json");

const templateMenu = [
  //-------------------------------
  {
    label: "File",
    submenu: [
      {
        label: "Salir",
        accelerator: process.platform === "darwin" ? "command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// ------------------------------------------
const readUsers = async () => {
  if (fs.existsSync(link)) {
    let archivo = fs.readFileSync(link, "utf8");
    let users = JSON.parse(archivo);
    return await users;
  }
};
const getActiveUser = async () => {
  let data = await readUsers();
  // Crea el archivo de datos si no existe
  if (data === undefined) {
    data = {
      activeUser: null,
    };

    let cadena = JSON.stringify(data);
    fs.writeFileSync(link, cadena);
  }
  return await data.activeUser;
};

const updateActiveUser = async (user) => {
  data = {
      activeUser: user,
    };
  let cadena = JSON.stringify(data);
  fs.writeFileSync(link, cadena);
};

let active_user = null;
// ------------------------------------------

// Evento "ready" de la aplicación
app.on("ready", async () => {
  active_user = await getActiveUser();
  if (active_user === null) {
    openLogin();
  } else {
    openGame();
  }
  // Escucha el evento abrir ventana de registro
  ipcMain.on("openRegister", (e, data) => {
    e.sender.destroy();
    openRegister();
  });
  // Escucha el evento abrir ventana de logIn
  ipcMain.on("openLogin", (e, data) => {
    updateActiveUser(null);
    e.sender.destroy();
    openLogin();
  });
  // Escucha el evento abrir ventana de Game
  ipcMain.on("openGame", (e, data) => {
    updateActiveUser(data.user);
    e.sender.destroy();
    openGame();
  });
  // Escucha el evento abrir ventana de Game
  ipcMain.on("openStatics", (e, data) => {
    openStatics();
  });
  // Carga el menu de un template
  const menuPrincipal = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuPrincipal);
});
// TODO: Reload causes errors, check why

// Verifica que la aplicación
// no esté empaquetada
if (!app.isPackaged) {
  // Agrega una nueva opción al menú
  templateMenu.push({
    label: "DevTools",
    submenu: [
      {
        label: "Mostrar/Ocultar Dev Tools",
        accelerator: "Ctrl+t",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

// -------------------------
const openRegister = async () => {
  registerWindow = new BrowserWindow({
    // Hiddes menu bar and can be shown with alt key
    autoHideMenuBar: true,
    width: 400,
    height: 500,
    title: "Wordtron Register",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  registerWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/register.html"),
      protocol: "file",
      slashes: true,
    })
  );
};

const openLogin = async () => {
  loginWindow = new BrowserWindow({
    // Hiddes menu bar and can be shown with alt key
    autoHideMenuBar: true,
    width: 400,
    height: 400,
    title: "Wordtron logIn",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  // Carga del archivo index.html en la ventana
  loginWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/login.html"),
      protocol: "file",
      slashes: true,
    })
  );
};

const openGame = async () => {
  gameWindow = new BrowserWindow({
    // Hiddes menu bar and can be shown with alt key
    autoHideMenuBar: true,
    title: "Wordtron",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  gameWindow.maximize();
  // Carga del archivo index.html en la ventana
  gameWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/game.html"),
      protocol: "file",
      slashes: true,
    })
  );
};

const openStatics = async () => {
  gameWindow = new BrowserWindow({
    // Hiddes menu bar and can be shown with alt key
    autoHideMenuBar: true,
    width: 420,
    height: 450,
    title: "My Stats",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  // Carga del archivo index.html en la ventana
  gameWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/statics.html"),
      protocol: "file",
      slashes: true,
    })
  );
};
//-----------------
