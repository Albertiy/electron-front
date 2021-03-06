// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { ipcRenderer, contextBridge, net } = require('electron')
const exec = require('child_process').exec
const cmdStr = 'test.exe';

let SET_OBJ = {
    CMD_PATH: 'D:/MyWorkspace/GitHub/photo2cartoon/dist/test/'
};

// 暴露到主世界。。。方法名绝了
contextBridge.exposeInMainWorld('myAPI', {
    runPhoto2cartoon: (filePath, savePath) => {
        console.log('\n图片路径：' + filePath, '保存路径' + savePath);
        let cstr = cmdStr + ' --photo_path "' + filePath + '" --save_path "' + savePath + '"';
        console.log('\n命令：', cstr);
        runExec(cstr, SET_OBJ.CMD_PATH);
    }
});

/** 获取设置 */
async function acceptSettings() {
    let res = ipcRenderer.sendSync('get_settings');
    console.log('回应设置：', res);
    SET_OBJ = res;
    console.log('获取设置完成：', JSON.stringify(SET_OBJ));
}

/**
 * 页面初始化方法
 */
window.addEventListener('DOMContentLoaded', (res) => {
    console.log('[WINDOW DOMContentLoaded]')
    acceptSettings();
    clientRequest = net.request("www.baidu.com")
    clientRequest.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        })
        response.on('end', () => {
            console.log('No more data in response.')
        })
    })
    request.end()

    // const replaceText = (selector, text) => {
    //     const element = document.getElementById(selector)
    //     if (element) element.innerText = text
    // }

    // for (const type of ['chrome', 'node', 'electron']) {
    //     replaceText(`${type}-version`, process.versions[type])
    // }

})

/** 
 * runExec 执行命令行
 * @param {string} cmdStr 命令
 * @param {string} cmdPath 命令行路径，如果不需要可不写
*/
function runExec(cmdStr, cmdPath) {
    var workerProcess = exec(cmdStr, { cwd: cmdPath }); // 花括号没参数也要写
    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
    });
    workerProcess.stdout.on('data', function (data) {
        console.log('stderr: ' + data)
    });
    workerProcess.on('error', function (data) { // 这样才能看到错误输出 ENOENT：没有这样的文件或目录
        console.log('error: ' + data)
    });
    workerProcess.on('close', function (code) {
        console.log('out code：' + code)
    });
}