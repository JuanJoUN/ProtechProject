 const app = require("../../config/server");

module.exports = app => {
    app.get('/register', (req, res)=>{
        res.render('../views/register');
    });

    app.get('/', (req, res)=>{

        if (req.session.loggedin){
            connection.query('SELECT * FROM producto',(error, results)=>{
                if(error){
                    res.send(error);
                }else{
                    res.render('../views/productos.ejs',{
                        product: results
                    })
                }
            })

        }else{
            res.render('../views/login');
        }
    });

    app.get('/login', (req, res)=>{
        res.render('../views/login');
    });

    app.get('/productos', (req, res)=>{
        res.render('../views/productos.ejs');
    });

    app.get('/aggProductos',(req,res)=>{
        res.render('../views/aggProductos');
    });

    app.get('/usuarios',(req,res)=>{
        res.render('../views/usuarios');
    });

    app.post('/loginAuth', async (req,res)=>{
        const {usuario,password} = req.body;
        if (usuario && password){
            console.log(usuario,password)
            connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async(error, results)=>{

                if (results.length ===0 || !(password===results[0].contraseña)){
                    res.render('../views/login.ejs',{
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: ''
                    })
                }else{
                    req.session.loggedin=true;
                    req.session.name = results[0].nombreUsuario;
                    res.render('../views/login.ejs', {
                        alert: true,
                        alertTitle:"Inicio de sesión",
                        alertMessage: "Inicio de sesión exitoso",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
            })
        }
    });
}
