// Librerías
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let logInWindow;

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

// Evento "ready" de la aplicación
app.on("ready", () => {
  openLogin();
  // Escucha el evento abrir ventana de registro
  ipcMain.on("openRegister", (e, data) => {
    e.sender.destroy();
    openRegister();
  });
  // Escucha el evento abrir ventana de logIn
  ipcMain.on("openLogin", (e, data) => {
    e.sender.destroy();
    openLogin();
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
  registerWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: "Wordtron logIn",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  // Carga del archivo index.html en la ventana
  registerWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/login.html"),
      protocol: "file",
      slashes: true,
    })
  );
};
