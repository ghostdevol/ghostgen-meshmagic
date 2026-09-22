const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets', 'ghostgen-icon.png'),
    title: 'Ghost_Gen MeshMagic'
  });

  win.loadFile('app/index.html');
}

app.whenReady().then(createWindow);
