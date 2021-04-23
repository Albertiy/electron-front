/** @constant 打开图片按钮 @type HTMLInputElement */
const imageInput = document.getElementById('image_input');
let srcImageContainer = document.getElementById('src_img_container');
let srcImage = document.getElementById('src_img');

window.onload = function () {
    console.log('[index.js: onload]');
    imageInput.addEventListener('change', imageInputChanged);
    // 文件拖拽进入
    srcImage.addEventListener('dragenter', event => {
        console.log('[EVENT] - dragenter -');
        switchClass(srcImageContainer, 'dragover', true);
    }, false);

    // 文件拖拽离开
    srcImage.addEventListener('dragleave', event => {
        console.log('[EVENT] - dragleave -');
        if (srcImageContainer.classList.contains('dragover'))
            srcImageContainer.classList.remove('dragover');
    }, false);

    srcImage.addEventListener('dragend', event => {
        console.log('[EVENT] - dragleave -');
        if (srcImageContainer.classList.contains('dragover'))
            srcImageContainer.classList.remove('dragover');
    }, false);

    // 文件拖拽放下
    srcImage.addEventListener('drop', event => {
        console.log('[EVENT] - drop -');
        event.preventDefault();
        event.stopPropagation();
        return false;
    }, false);
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

/**
 * 生成 UUID 唯一编码
 * @returns {string}
 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

/**
 * 切换HTML元素添加或移除CSS类
 * @param {*} ele HTML元素
 * @param {*} className CSS类名
 * @param {boolean} state true 添加，false 移除
 */
function switchClass(ele, className, state) {
    if (state && !ele.classList.contains(className))
        ele.classList.add(className);
    else if (!state && ele.classList.contains(className))
        ele.classList.remove(className);
};