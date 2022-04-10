const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow, chatWindow, collabChatWindow;
const APP_ICON = path.join(__dirname, '/dist/client/assets/PolyGramLogo.png');

function createAppWindows() {
    /*************************************/
    /********** MAIN APP WINDOW **********/
    /*************************************/
    mainWindow = new BrowserWindow({
        icon: APP_ICON,
        height: 1000,
        width: 1400,
        minHeight: 1000,
        minWidth: 1400,
        maxHeight: 1080,
        maxWidth: 1920,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Electron Build Path
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/client/index.html`),
            protocol: 'file:',
            slashes: true,
        }),
    );
    mainWindow.setMenuBarVisibility(false);

    // Initialize the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (chatWindow) {
            chatWindow.destroy();
        }
        if (collabChatWindow) {
            collabChatWindow.destroy();
        }
        app.quit();
    });

    /*********************************/
    /********** CHAT WINDOW **********/
    /*********************************/

    chatWindow = new BrowserWindow({
        icon: APP_ICON,
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        maxHeight: 1080,
        maxWidth: 1920,
        center: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    chatWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/client/index.html`),
            protocol: 'file:',
            slashes: true,
            hash: '/chatmenu',
        }),
    );

    chatWindow.setMenuBarVisibility(false);

    chatWindow.on('close', (e) => {
      // On désactive la possibilité de fermer la fenêtre pour
      // éviter la destruction de l'objet (ça lance une erreur sinon)
      e.preventDefault();
      console.log("Closing the chat window is disabled")
    });

}

app.on('ready', createAppWindows);

// Close when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        createAppWindows();
    }
});

// Gestion de la fenêtre de clavardage
ipcMain.on('open-chat', (event, data) => {
    console.log('ipcMain received open-chat event');
    chatWindow.show();
});

ipcMain.on('close-chat', (event, data) => {
    console.log('ipcMain received close-chat event');
    chatWindow.hide();
});

ipcMain.on('view-profile', (event, data) => {
  console.log("ipcMain received view-profile event. Is event send from chat window ?", data);
  event.reply('view-profile-reply', data);
})

// Gestion de la fenêtre de clavardage lors d'une session collaborative
ipcMain.on('open-collab-chat', (event, data) => {
    console.log('ipcMain received open-collab-chat event');

    /*********************************/
    /******* COLLAB CHAT WINDOW *****/
    /*********************************/

    collabChatWindow = new BrowserWindow({
        icon: APP_ICON,
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        maxHeight: 1080,
        maxWidth: 1920,
        center: true,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    collabChatWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/client/index.html`),
            protocol: 'file:',
            slashes: true,
            hash: '/collab-chatroom',
        }),
    );

    collabChatWindow.setMenuBarVisibility(false);

    collabChatWindow.on('close', (e) => {
      // On désactive la possibilité de fermer la fenêtre pour
      // éviter la destruction de l'objet (ça lance une erreur sinon)
      e.preventDefault();
      console.log("Closing the chat window is disabled")
    });
});

ipcMain.on('close-collab-chat', (event, data) => {
    console.log('ipcMain received close-collab-chat event');
    if (collabChatWindow) {
      collabChatWindow.destroy();
    }
});
