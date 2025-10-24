const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

let backendProcess;

function createWindow() {
  let win = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { nodeIntegration: true },
  })

  win.webContents.openDevTools()
  win.maximize()
  win.setMenu(null)

  win.once('ready-to-show', () => {
    win.show()
  });

  win.on('closed', () => {
    if (backendProcess) backendProcess.kill();
  });

  if (isDev) {
    win.loadURL('http://localhost:3000')
    // win.loadFile(path.join(__dirname, '../frontend/build/index.html'))
  } else {
    win.loadFile(path.join(__dirname, '../frontend/build/index.html'))
  }

  win.focus()
}

app.whenReady().then(() => {
  // Inicia o backend Node.js automaticamente
  backendProcess = spawn('node', ['../backend/dist/index.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});