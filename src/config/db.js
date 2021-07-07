const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
});

connection.connect((error)=>{
    if(error){
        console.log("Error: " + error);
    }else{
        console.log("Conexión a la BD exitosa")
    }
});

module.exports = connection;
