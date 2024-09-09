const { contextBridge, ipcRenderer } = require('electron');

// 将 ipcRenderer 暴露到渲染进程
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  },
});

window.addEventListener('DOMContentLoaded', () => {
  // 清除 localStorage 数据
  localStorage.clear();
});
