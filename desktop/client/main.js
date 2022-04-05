const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let appWindow, chatWindow;
const APP_ICON = path.join(__dirname, '/dist/client/assets/PolyGramLogo.png');

function initWindow() {
    /********** MAIN APP WINDOW **********/
    appWindow = new BrowserWindow({
        icon: APP_ICON,
        // fullscreen: true,
        height: 1000,
        // minHeight: 800,
        // maxHeight: 1080,
        width: 1400,
        // minWidth: 1000,
        // maxWidth: 1920,
        resizable: false,

        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Electron Build Path
    appWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/client/index.html`),
            protocol: 'file:',
            slashes: true,
        }),
    );
    appWindow.setMenuBarVisibility(false);

    // Initialize the DevTools.
    // appWindow.webContents.openDevTools()

    appWindow.on('closed', function () {
        appWindow = null;
        app.quit();
    });

    /********** CHAT WINDOW **********/
    chatWindow = new BrowserWindow({
        height: 800,
        width: 1000,
        center: true,
        // show: false,
    });

    chatWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/client/index.html`),
            protocol: 'file:',
            slashes: true,
            hash: '/chatroom'
        }),
    );
    chatWindow.setMenuBarVisibility(false);

    chatWindow.on('closed', function () {
        chatWindow = null;
    });
}

app.on('ready', initWindow);

// Close when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        initWindow();
    }
});
