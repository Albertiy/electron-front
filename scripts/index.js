/** @constant 打开图片按钮 @type HTMLInputElement */
const imageInput = document.getElementById('image_input');

window.onload = function () {
    console.log('[index.js: onload]');
    imageInput.addEventListener('change', imageInputChanged);
}

/**
 * 文件输入改变事件
 * @param {*} event 
 */
function imageInputChanged(event) {
    let image_path = '';
    image_path = imageInput.value;
    if (image_path.indexOf('fakepath') != '-1') {
        console.log(imageInput.files[0].path);  // 获取真实路径
        image_path = imageInput.files[0].path;
    }
    console.log(image_path);
    window.myAPI.runPhoto2cartoon(image_path, changeFileName(image_path, generateUUID()));
}


function changeFileName(url, newName) {
    return url.substr(0, url.lastIndexOf("\\") + 1) + newName + url.slice(url.lastIndexOf('.'));
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};