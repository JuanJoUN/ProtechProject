 const app = require("../../config/server");

module.exports = app => {
    app.get('/register', (req, res)=>{
        res.render('../views/register');
    });

    app.get('/login', (req, res)=>{
        res.render('../views/login');
    });

    app.get('/productos', (req, res)=>{
        res.render('../views/productos.ejs');
    });

}