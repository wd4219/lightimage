const { app, BrowserWindow, Menu, dialog } = require('electron')
const ipcMain = require('electron').ipcMain;
const fs = require('fs');
const path = require('path');

const template = [
  {
    label: '文件(F)',
    submenu: [{
      label: '打开文件',
      click() {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'],filters: [{name: 'Images', extensions: ['jpg', 'jpeg', 'png']}]} ,function(filePaths){   
          if(filePaths){
            filePaths.forEach(function(item){
              let filename = path.basename(item);
              let file = {
                name: filename,
                path: item
              };
              fs.stat(item,function(err,data){
                file.size = data.size >= 1024 ? (data.size / 1024).toFixed(1) + 'KB' : data.size + 'B';
                win.webContents.send('file',file);
              });
            });
          }
        });
      }
    },
    {
      label: '打开文件夹',
      click() {
        dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, function(filePaths){
          win.webContents.send('filepath', filePaths);
        });
      }
    }]
  },
  {
    role: 'help',
    submenu: [
      {
        label: '文档',
      },
      {
        label: '帮助'
      }
    ]
  }
];

let win;

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({ width: 400, height: 640, minimizable: false, maximizable: false, fullscreenable: false, resizable: false });
  //创建菜单
  win.webContents.openDevTools()
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  
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