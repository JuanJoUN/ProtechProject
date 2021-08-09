 const app = require("../../config/server");
const connection = require("../../config/db");
module.exports = app => {




    app.get('/register', (req, res)=>{
        if (req.session.role === "ADMINISTRATIVO"){
            res.render('../views/register');
        }else{
            res.status(404).send("Ooops no tienes permisos para ingresar aquí");
        }
    });

    app.get('/', (req, res)=>{

        if (req.session.loggedin){
            connection.query('SELECT * FROM producto ORDER BY nombre_producto',(error, results)=>{
                if(error){
                    res.send(error);
                }else{
                    res.render('../views/productos.ejs',{
                        producto: results,
                        rol: req.session.role
                    })
                }
            })

        }else{
            res.render('../views/login');
        }
    });

    app.get('/logout', (req,res)=>{
        req.session.destroy(()=>{
            res.redirect('/')
        })
    })

    app.get('/aboutUs', (req,res)=>{
        if (req.session.loggedin){
            res.render('../views/aboutUs.ejs')
        }else{
            res.render('../views/login');
        }
    })

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


    app.get('/aggProductos',(req,res)=>{
        if (req.session.role === "ADMINISTRATIVO"){
            res.render('../views/aggProductos');
        }else{
            res.status(404).send("Ooops no tienes permisos para ingresar aquí");
        }
    });

    app.get('/deleteProduct/:codigoProducto', (req,res)=>{
        const prodId = req.params.codigoProducto;
        connection.query('DELETE FROM producto WHERE codigoProducto = ?',[prodId],(error,results)=>{
            if (error){
                res.send(error);
            }else{
                connection.query('SELECT * FROM producto ORDER BY nombre_producto', (error, result)=>{
                    if (error){
                        res.send(error);
                    }else{
                        res.redirect('/')
                    }
                })
            }
        })
    })

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
                res.redirect('/')
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

    app.post('/editProduct/:codigoProducto', (req, res)=>{
        const prodId = req.params.codigoProducto;
        const {codProdUpd, nomProdUpd, descProdUpd, stockProdUpd, precioProdUpd, costoProdUpd, prodImageUpd} = req.body;
        connection.query('UPDATE producto SET codigoProducto = ?,imagen = ?, nombre_producto = ?, descripción = ?, stock = ?, precio = ?, costo = ?  WHERE codigoProducto = ?', [codProdUpd, prodImageUpd, nomProdUpd, descProdUpd, stockProdUpd,precioProdUpd, costoProdUpd, prodId], (error, result)=>{
            if (error){
                res.send(error);
            }else{
                res.redirect('/')
            }
        });
    })

    app.get('/usuarios',(req,res)=>{
        if (req.session.role === "ADMINISTRATIVO"){
            connection.query('SELECT * FROM usuario ORDER BY cargo', (error,result)=>{
                if(error){
                    res.send(error);
                }else{
                    res.render('../views/usuarios',{
                        users: result
                    });
                }
            })
        }else{
            res.status(404).send("Ooops no tienes permisos para ingresar aquí");
        }


    });

    app.post('/loginAuth', async (req,res)=>{
        const {usuario,password} = req.body;
        if (usuario && password){
            console.log(usuario,password)
                connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async(error, results)=>{
                console.log(results[0].cargo)
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
                    req.session.role = results[0].cargo;
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
app.get('/RegistrarVentas', (req, res)=>{
        connection.query('SELECT * FROM producto ORDER BY nombre_producto', (error, result)=>{
            if (error){
                res.send(error)
            }else{
                res.render('../views/salidaVentas.ejs', {
                    producto: result
                });
            }
        })
    });
    app.post('/registrarSalida', (req, res) => {
            const {codigoProducto, cantidad, impuesto, valor_bruto, total, fecha_venta, cedula_cliente} = req.body;
            console.log(req.body)
            connection.query('INSERT INTO detalle_factura SET ?',{
                codigoProducto: [codigoProducto],
                cantidad: [cantidad],
                impuesto: impuesto,
                valor_bruto: valor_bruto,
                total: total,
                fecha_venta: fecha_venta,
                cedula_cliente: cedula_cliente
              }, (error, result)=>{
                if (error){
                    res.send(error);
                }else{
                    res.redirect('/')
                }
            })

    });
