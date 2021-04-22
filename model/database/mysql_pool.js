const mysql = require('mysql');

/** 数据库连接池模块 */
class MySqlPool {
    // constructor() {

    // }

    flag = true;
    pool = mysql.createPool({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '34477384',
        database: 'zhagen_oa',
    });
    getPool() {
        return this.pool;
    }
};

module.exports = MySqlPool;