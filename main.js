const { app, BrowserWindow, Menu, ipcMain,dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const yazl = require("yazl");
const zipfile = new yazl.ZipFile();
let _data = null;
let IMG_ARRAY = [];
ipcMain.on('compare',function(event,data) {
  _data = data;
  let compare = new BrowserWindow({frame: false, backgroundColor:'#424242',title: '对比',width: 960,height:720,resizable: false});
  compare.loadFile('./compare.html');
  compare.webContents.openDevTools();
  compare.once('ready-to-show',function(){
    compare.show();
  });
});
ipcMain.on('load-compare',function(event) {
  event.returnValue = _data;
});

ipcMain.on('imglist',function(event,data) {
  IMG_ARRAY = data;
});

ipcMain.on('download-single-file',function(event,data){
  let image = {},inx = -1;
  for(let i = 0; i < IMG_ARRAY.length;i++) {
    if(data.id === IMG_ARRAY[i].id) {
      inx = i;
      break;
    }
  }
  if(inx !== -1) {
    if(data.type === 'webp') {
      image.path = path.join(IMG_ARRAY[inx].filepath, IMG_ARRAY[inx].filename + '.webp');
      image.data = IMG_ARRAY[inx].webp.data;
    } else{
      image.path = path.join(IMG_ARRAY[inx].filepath, IMG_ARRAY[inx].filename + '.' + IMG_ARRAY[inx].originExtname);
      if(data.type === 'origin') {
        image.data = IMG_ARRAY[inx].origin.data;
      } else {
        image.data = IMG_ARRAY[inx].compress.data;
      }
    }
    dialog.showSaveDialog({defaultPath: image.path}, function(filename) {
      fs.writeFile(filename,image.data,function(err){
        console.log('已下载');
      });
    });
  }
});

let win;

function createWindow() {
  win = new BrowserWindow({ width: 450, height: 700, fullscreenable: false, resizable: false ,frame: false,backgroundColor:'#424242'});
  //创建菜单
  win.webContents.openDevTools();
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