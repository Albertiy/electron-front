const mysql = require('mysql');
const OptPool = require('./mysql_pool');

let optPool = new OptPool();
let pool = optPool.getPool();

let insertSql = 'insert into test (name, pwd) values(?,?)';
let selectSql = 'select * from test limit 10';
let deleteSql = 'delete from test where name="NeedDelete"';
let updateSql = 'update test set name="conna update" where name="conan"';

pool.getConnection((err, conn) => {
    let params = ['AdaWang', 'ada123'];
    conn.query(insertSql, params, (err, res) => {
        if (err)
            console.log(err)
        console.log("insert result ==> ", res)
        conn.destroy(); // 释放连接必须在查询结束之后
    });
});