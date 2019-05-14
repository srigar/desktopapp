const electron = require("electron");
const url = require("url");
const path = require("path");


const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', function() {
    // Create new window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on('closed', function() {
        app.quit();
    });
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add Item'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'subWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Avoid garbage collection
    addWindow.on('close', function() {
        addWindow = null;
    });
}

function clearContent() {
    mainWindow.webContents.send('item:clear');
}

ipcMain.on('item:send', function(e, value) {
    mainWindow.webContents.send('item:receive', value);
    addWindow.close();
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },{
                label: 'Clear Items',
                click() {
                    clearContent();
                }
            },{
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({ label: ''});
}