const electron = require('electron');
// Module to control application life.
const app = electron.app;
const globalShortcut = electron.globalShortcut;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const ipc = electron.ipcMain;
const Menu = electron.Menu;
const Tray = electron.Tray;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let tray = null;

let robot = require('robotjs');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	putInTray();
	registerShortcuts();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function putInTray() {
	let iconPath = path.join(__dirname, 'app/img/tray-icon.png');
	console.log(iconPath);
	tray = new Tray(iconPath);

	let trayMenuTemplate = [
		{
			label: 'Sample Colour',
			click: function() {
			  openWindow();
			}
		},
		{
			label: 'History',
			enabled: false
		},
		{
			label: 'Settings',
			enabled: false
		},
		{
			label: 'Quit',
			click: function () {
				tray.destroy();
				app.quit();
			}
		}
	];

	let contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
	tray.setContextMenu(contextMenu);
	tray.setToolTip("Eye Dropper");
}

function registerShortcuts() {
	// Register a 'CommandOrControl+Shift+0' shortcut listener.
	let start = globalShortcut.register('CommandOrControl+Shift+0', () => {
		console.log('CommandOrControl+Shift+0 was pressed');

		if (!mainWindow) {
		  openWindow();
		} else {
		  mainWindow.close();
		}
	});

	if (!start) {
		console.log('registration failed');
	}

	// Register a 'Esc' shortcut listener.
	let esc = globalShortcut.register('Esc', () => {
		console.log('Escape was pressed');

		if (mainWindow) {
		  mainWindow.close();
		}
	});

	// Check whether a shortcut is registered.
	console.log(globalShortcut.isRegistered('CommandOrControl+Shift+0'));
	console.log(globalShortcut.isRegistered('Esc'));
}

function openWindow() {
	let screenSize = robot.getScreenSize();

	// Create transparent fullscreen window to listen for click events
	mainWindow = new BrowserWindow({
		width: screenSize.width, 
		height: screenSize.height, 
		frame: false, 
		transparent: true,
		resizable: false,
	});

	mainWindow.setIgnoreMouseEvents(false);
  
	mainWindow.loadURL(`file://${__dirname}/app/index.html`)

//	mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	});
}
