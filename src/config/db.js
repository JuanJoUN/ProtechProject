const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bf934f5528948e",
    database: "aa8c2759",
    password: "aa8c2759"
});

connection.connect((error)=>{
    if(error){
        console.log("Error: " + error);
    }else{
        console.log("Conexión a la BD exitosa")
    }
});

module.exports = connection;
