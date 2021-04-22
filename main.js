const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const settings = require('electron-settings');

// const APP_NAME = app.name;

/** 设置对象 */
let SET_OBJ = {
    CMD_PATH: 'D:/MyWorkspace/GitHub/photo2cartoon/dist/test/'
};

/**
 * 从文件读取设置
 */
function initSettings() {
    console.log('[main] SETTINGS DIR: ', app.getAppPath());
    settings.configure({
        dir: app.getAppPath(),
        fileName: 'config.json',
        numSpaces: 2,
        prettify: true
    });
    console.log('[main] READY for LOAD SETTINGS! Setting file Path：', settings.file());
    settings.get('exePath').then(res => {
        if (res == undefined || res == '') {
            console.log('[main] NO SETTING for [exePath]: ', res);
            settings.set('exePath', SET_OBJ.CMD_PATH);
            settings.get('exePath').then(res => console.log('set exepath', res));
        } else {
            console.log('[main] GET SETTING for [exePath]: ', res);
            SET_OBJ.CMD_PATH = res;
        }
    })
}

// ready 早于 activate
app.on('ready', function () {
    console.log('[APP READY]')
    initSettings();
})

/**
 * 创建主窗口
 */
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),    // 预加载JS，可通过contextBridge提供方法给渲染线程
            nodeIntegration: false,    // 如果为true，普通js也可以调用node API；
            // contextIsolation: true    // 上下文隔离，高版本Electron默认，低版本需要设置true才能使用contextBridge
            // session: {
            //     SET_OBJ  // 传输数据给页面，无效
            // }
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    // 接收并格式化输出前端页面的控制台输出
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        // message：控制台信息；sourceId：来源文件；line：行数；
        let shortId = sourceId;
        if (sourceId.search("\\\\") != -1)  // 正则表达式匹配反斜杠需要四个反斜杠
            shortId = sourceId.substring(sourceId.lastIndexOf('\\') + 1, sourceId.length);
        else if (sourceId.search('/') != -1) {
            shortId = sourceId.substring(sourceId.lastIndexOf('/') + 1, sourceId.length);
        }
        console.log('[console] ' + shortId + ' (' + line + '): ' + message);
    })
}

function createRemoteWindow() {
    const browser = new BrowserWindow({ width: 800, height: 600 });
    browser.loadURL('https://github.com')   // 远程网页
    browser.menuBarVisible = false; // 隐藏菜单栏
}

// 晚于ready
app.whenReady().then(() => {
    console.log('[APP ACTIVATE]')
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    // createRemoteWindow()
})

/** 监听并返回请求设置事件 */
ipcMain.on('get_settings', (event, status) => {
    event.returnValue = SET_OBJ;
})

// 除了mac系统，其他系统里都是关闭所有窗口就意味着进程结束
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 配置 electron 热刷新页面（修改 main.js 会导致主线程控制台输出结束）
try {
    require('electron-reloader')(module, {});
} catch (_) {

}
