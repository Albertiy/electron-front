const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const settings = require('electron-settings');

let SETOBJ = {
    CMD_PATH: 'D:/MyWorkspace/GitHub/photo2cartoon/dist/test/'
};

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,    // 如果为true，普通js也可以调用node API；
            // contextIsolation: true    // 上下文隔离，高版本Electron默认，低版本需要设置true才能使用contextBridge让普通JS调方法
            session: {
                SETOBJ  // 传输数据给页面
            }
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        // message：控制台信息；sourceId：来源；line：行数；
        console.log('console: ' + sourceId + ' (' + line + '): ' + message);
    })
}

app.whenReady().then(() => {
    console.log('[APP ACTIVATE]')
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/**
 * 加载设置
 */
function initSettings() {
    console.log('|| SETTINGS DIR: ', app.getAppPath());
    settings.configure({
        dir: app.getAppPath(),
        fileName: 'config.json',
        numSpaces: 2,
        prettify: true
    });
    console.log('|| READY for LOAD SETTINGS! Setting file Path：', settings.file());
    settings.get('exePath').then(res => {
        if (res == undefined || res == '') {
            console.log('|| NO SETTING for [exePath]: ', res);
            settings.set('exePath', SETOBJ.CMD_PATH);
            settings.get('exePath').then(res => console.log('set exepath', res));
        } else {
            console.log('|| GET SETTING for [exePath]: ', res);
            SETOBJ.CMD_PATH = res;
        }
    })
}

// ready 早于 activate
app.on('ready', function () {
    console.log('[APP READY]')
    initSettings();
})

/** 监听并返回请求设置事件 */
ipcMain.on('get_settings', (event, status) => {
    event.returnValue = SETOBJ;
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 配置 electron 热刷新页面
try {
    require('electron-reloader')(module, {});
} catch (_) {

}
