const mysql = require('mysql')

const db = mysql.createConnection({
    host : '85.10.205.173',
    user : 'juandapatra_10',
    password : 'Almight021597112',
    database : 'jp_10_database'
})

module.exports={
    db
}