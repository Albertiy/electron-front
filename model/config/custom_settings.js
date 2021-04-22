/** 没什么用 */
const { app } = require('electron');

class CustomSettings {
    configPath = app.getAppPath();
    get() {

    }
}

module.exports = CustomSettings;