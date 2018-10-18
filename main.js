const { app, BrowserWindow, Menu, dialog } = require('electron')
const ipcMain = require('electron').ipcMain;
const fs = require('fs');
const path = require('path');
ipcMain.on('base64', function (event, data) {
  dialog.showMessageBox(win, { type: 'info', buttons: ['确定', '复制'], defaultId: 0, title: 'base64字符串', message: '这是一条消息黄金卡刷机大师', detail: ['这是一条消息黄金卡刷机大师第三大厦大叔，', '没的撒大会看到撒大客户的撒大叔看到啊打双打滑动'], noLink: true });
});

ipcMain.on('compare',function(event,data) {
  let compare = new BrowserWindow({frame: false, backgroundColor:'#424242',title: '对比',width: 960,height:720});
  compare.loadFile('./compare.html');
  compare.webContents.openDevTools();
  compare.once('ready-to-show',function(){
    compare.show();
  });
})

let win;

function createWindow() {
  win = new BrowserWindow({ width: 450, height: 700, fullscreenable: false, resizable: false ,frame: false,backgroundColor:'#424242'});
  //创建菜单
  win.webContents.openDevTools();
  // const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(null);

  app.on('ready', function ready() {
    console.log('app is ready')
  })
  // 然后加载应用的 index.html。
  win.loadFile('index.html');


  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
});