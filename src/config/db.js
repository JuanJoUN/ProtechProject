const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: "us-cdbr-east-04.cleardb.com",
//     user: "bf934f5528948e",
//     database: "heroku_54b881ededb837f",
//     password: "aa8c2759"
// });


const connection_BD = {
    host: "us-cdbr-east-04.cleardb.com",
    user: "bf934f5528948e",
    database: "heroku_54b881ededb837f",
    password: "aa8c2759"
};

function handleDisconnect(connection_BD){
    connectionn = mysql.createPool(connection_BD);
    connectionn.getConnection(function (error){
        if (error){
            console.log("Error while connecting to db: ", error);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connectionn.on('error', function (error){
        console.log('Database error', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw error;
        }
    });
}

handleDisconnect(connection_BD);


