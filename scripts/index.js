/** @constant 打开图片按钮 @type HTMLInputElement */
const imageInput = document.getElementById('image_input');
/** 原图预览容器 */
let srcImageContainer = document.getElementById('src_img_container');
/** 原图预览
 @type {HTMLImageElement} */
let srcImage = document.getElementById('src_img');
/** 方便触发器修改页面值 */
let pageModel = {
    _srcImageUrl: '',
    /** 原图路径 */
    get srcImageUrl() {
        return this._srcImageUrl
    },
    set srcImageUrl(val) {
        if (this._srcImageUrl != val) {
            srcImage.set = val
            this._srcImageUrl = val
        }

    },
}

window.onload = function () {
    console.log('[index.js: onload]');
    Particles.init({
        selector: '.background',
        maxParticles: 450,
        // options for breakpoints
        responsive: [
            {
                breakpoint: 768,
                options: {
                    maxParticles: 56,
                    color: '#6F6F6F',
                    connectParticles: true
                }
            }, {
                breakpoint: 425,
                options: {
                    maxParticles: 100,
                    connectParticles: true
                }
            }, {
                breakpoint: 320,
                options: {
                    maxParticles: 0
                    // disables particles.js
                }
            }
        ]
    });
    imageInput.addEventListener('change', imageInputChanged);

    /**
    * 页面禁用拖拽上传时 浏览器默认打开图片
    */
    document.addEventListener('drop', function (e) {
        e.preventDefault()
    }, false)
    document.addEventListener('dragover', function (e) {
        e.preventDefault()
    }, false)
    // 文件拖拽进入
    srcImageContainer.addEventListener('dragenter', event => {
        console.log('[EVENT - dragenter]');
        switchClass(srcImageContainer, 'dragover', true);
    }, false);
    // 文件拖拽离开
    srcImageContainer.addEventListener('dragleave', event => {
        console.log('[EVENT - dragleave]');
        switchClass(srcImageContainer, 'dragover', false);
    }, false);
    // 文件拖拽放下
    srcImageContainer.addEventListener('drop', event => {
        console.log('[EVENT - drop]');
        switchClass(srcImageContainer, 'dragover', false);
        let df = event.dataTransfer;
        let dropFiles = [];
        if (df.items != undefined) {
            // Chrome有items属性，对Chrome内核的单独处理
            for (var i = 0; i < df.items.length; i++) {
                var item = df.items[i];
                // 用webkitGetAsEntry禁止上传目录
                if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
                    var file = item.getAsFile();
                    dropFiles.push(file);
                }
            }
        }
        console.log('dropFiles: ', dropFiles)
        if (dropFiles.length > 0) {
            html5FileReader(dropFiles[0], res => { setPreviewImage(srcImage, res) });
        }

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
    console.log('image_path', image_path);
    if (image_path.indexOf('fakepath') != '-1') {
        console.log(imageInput.files);  // 获取真实路径
        let f0 = imageInput.files[0].path;
        if (f0 && f0 != '') image_path = f0;
    }
    if (image_path && image_path != '') {   // 若路径不为空
        console.log('image_path', image_path);
        pageModel.srcImageUrl = image_path;
        html5FileReader(imageInput.files[0], res => {
            setPreviewImage(srcImage, res);
        })
        // 调用 contextBridge 提供的 API
        window.myAPI.runPhoto2cartoon(image_path, changeFileName(image_path, generateUUID()));
    }
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

/**
 * 文件读取
 * @param {File} file 获取到的文件对象
 * @param {function(res)} loaded 回调函数
 */
function html5FileReader(file, loaded) {
    try {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            console.log(this)
            loaded(this.result)
        }
        return true;
    } catch (e) {
        console.log('[html5FileReader ERROR]', e)
        return false;
    }
}

/**
 * 设置预览图
 * @param {HTMLImageElement} ele 
 * @param {*} image 
 */
function setPreviewImage(ele, image) {
    ele.src = image;
    // 'url(' + this.result + ')'
}

function afterDropListener() {

}