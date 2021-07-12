 const app = require("../../config/server");
const connection = require("../../config/db");
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

    app.post('/register',(req,res)=>{
        const {empName, empRol, userName, password} = req.body;
        connection.query('INSERT INTO usuario SET ?',{
            usuario: userName,
            nombre_empleado:empName,
            cargo: empRol,
            contrasena: password
        },(error,result)=>{
            if (error){
                res.send(error);
            }else{
                res.render("../views/register",{
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage: "Registro exitoso",
                    alertIcon: "success",
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'usuarios'
                })
            }
        });

    })

    app.get('/login', (req, res)=>{
        res.render('../views/login');
    });

    app.get('/productos', (req, res)=>{
        connection.query('SELECT * FROM producto', (error, result)=>{
            if (error){
                res.send(error)
            }else{
                res.render('../views/productos.ejs', {
                    producto: result
                });
            }
        })

    });

    app.get('/aggProductos',(req,res)=>{
        res.render('../views/aggProductos');
    });

    app.get('/deleteUser/:usuarioId', (req,res)=>{
        const  userId = req.params.usuarioId;
        connection.query('DELETE FROM usuario WHERE usuarioId=?',[userId],(error,results)=>{
            if (error){
                res.send(error);
            }else{
                connection.query("SELECT * FROM usuario", (err, result) => {
                    if(err){
                        res.send(err);
                    } else {
                        res.redirect('/usuarios')
                    }
                })
            }
        })
    })

    app.post('/aggProducto',(req,res)=>{
        const {codProd, nomProd, descProd, stockProd, precioProd, costoProd, prodImage} = req.body;
        console.log(req.body)
        connection.query('INSERT INTO producto SET ?',{
            codigoProducto: codProd,
            imagen: prodImage,
            nombre_producto: nomProd,
            descripción: descProd,
            stock: stockProd,
            precio: precioProd,
            costo: costoProd
        }, (error, result)=>{
            if (error){
                res.send(error);
            }else{
                res.redirect('/productos')
            }
        })
    })

    app.post('/editUser/:usuarioId', (req, res)=>{
        const userId = req.params.usuarioId;
        const {empNameUpd, empRolUpd, userNameUpd} = req.body;
        connection.query('UPDATE usuario SET usuario = ?, nombre_empleado = ?, cargo = ? WHERE usuarioId = ?', [userNameUpd, empNameUpd, empRolUpd, userId], (error, result)=>{
            if (error){
                res.send(error);
            }else{
                res.redirect('/usuarios')
            }
        });
    })

    app.get('/usuarios',(req,res)=>{
        connection.query('SELECT * FROM usuario', (error,result)=>{
            if(error){
                res.send(error);
            }else{
                res.render('../views/usuarios',{
                    users: result
                });
            }
        })

    });

    app.post('/loginAuth', async (req,res)=>{
        const {usuario,password} = req.body;
        if (usuario && password){
            console.log(usuario,password)
            connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async(error, results)=>{

                if (results.length ===0 || !(password===results[0].contrasena)){
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
