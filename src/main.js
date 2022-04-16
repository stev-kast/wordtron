// Librerías
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let ventanaPrincipal;

const templateMenu = [
  //-------------------------------
  {
    label: "Tareas",
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
  // Creación de la ventana principal
  ventanaPrincipal = new BrowserWindow({
    // Hiddes menu bar and can be shown with alt key
    autoHideMenuBar: true,
  });
  //TODO: Look how to change title on each window
  // Carga del archivo index.html en la ventana
  ventanaPrincipal.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/game.html"),
      protocol: "file",
      slashes: true,
    })
  );
  // Carga el menu de un template
  const menuPrincipal = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuPrincipal);

  // Escucha el evento de cierre de la ventana principal
  ventanaPrincipal.on("closed", () => {
    // Cierra la aplicación
    app.quit();
  });
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
