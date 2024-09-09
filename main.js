const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const waitOn = require('wait-on');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setBackgroundColor('#B3000000');  // B3 = 70% 透明度
  //mainWindow.setBackgroundColor('rgba(0, 0, 0, 0.2)');  // 设置20%透明的黑色背
  mainWindow.loadURL('http://localhost:3000');  // React 开发服务器的地址

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 使用 wait-on 等待 React 开发服务器启动
  waitOn(
    {
      resources: ['http://localhost:3000'], // React 开发服务器地址
      timeout: 30000, // 等待 30 秒
    },
    (err) => {
      if (err) {
        console.error('React 服务器未能在规定时间内启动:', err);
        app.quit();
        return;
      }

      // 在 React 服务器启动后创建窗口
      createWindow();
    }
  );
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 窗口控制事件监听
ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
