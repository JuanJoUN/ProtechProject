const app = require('./config/server');
const connection = require('./config/db')

require('./app/routes/main')(app);

app.listen(app.get('port'),()=>{
    console.log("Servidor en el puerto: ", app.get('port'));
});
