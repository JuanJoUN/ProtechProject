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
const updateStock = ({ codigoProducto, cantidad }) => {
    return new Promise((resolve, reject) => {
        const QUERY_SELECT = 'SELECT * FROM producto WHERE codigoProducto = ?'

        connection.query(QUERY_SELECT, [codigoProducto], (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                if (resolve.length > 0) {
                    const producto = results[0]
                    const newStock = producto.stock - cantidad
                    if (newStock >= 0) {
                        const QUERY_UPDATE = 'UPDATE producto SET stock = ? WHERE codigoProducto = ?'
                        connection.query(QUERY_UPDATE, [newStock, codigoProducto], (err, results, fields) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(results, fields)
                            }
                        })
                    } else {
                        const error = `
                        No hay suficientes productos para ese pedido.
                        Existen ${producto.stock} productos y pediste ${cantidad} productos.
                        `
                        reject({ error })
                    }
                    console.log(results, fields)
                } else {
                    reject({ error: 'El producto no existe!' })
                }
            }
        })
    });
}
const verifyClient = (datosCliente) => {
    const { cedula_cliente } = datosCliente
    return new Promise((resolve, reject) => {
        const QUERY_SELECT = 'SELECT * FROM cliente WHERE cedula_cliente = ?'
        connection.query(QUERY_SELECT, [cedula_cliente], (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                if (results.length > 0) {
                    console.log('El usuario ya existe')
                    resolve(results, fields)
                } else {
                    console.log(results, fields)
                    const QUERY_CREATE = 'INSERT INTO cliente SET ?'
                    connection.query(QUERY_CREATE, datosCliente, (err, results, fields) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(results, fields)
                        }
                    })
                }
            }
        })
    })
}

app.post('/registrarSalida', async (req, res) => {
    try {
        const { productos, valorNeto, total, fechaFactura, cedula_cliente, nombre_cliente, direccion, numero_celular } = req.body;
        console.log(req.body)
        connection.query('INSERT INTO detalle_factura (codigoProducto, cantidad, valor_bruto, total) VALUES ?', [productos],
            async (error, result) => {
                if (error) {
                    res.send(error);
                } else {
                    await verifyClient({ cedula_cliente, nombre_cliente, direccion, numero_celular })
                    connection.query('INSERT INTO encabezado_factura SET ?', {
                        cedula_cliente: cedula_cliente,
                        valorNeto: valorNeto,
                        fechaFactura: fechaFactura,
                    }, async (error, result) => {
                        if (error) {
                            res.send(error);
                        } else {
                            const promiseUpdateProducts = productos.map(
                                ([codigoProducto, cantidad]) =>
                                    updateStock({ codigoProducto, cantidad })
                            )
                            await Promise.all(promiseUpdateProducts)
                            console.log(result)
                            res.json({ result, success:true });
                        }
                    })
                }
            });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}
);
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
// estadisticas y api de estadisticas
app.get('/Estadisticas', (req, res) => {
    connection.query('SELECT SUM(valor_bruto) AS total_bruto_sum, SUM(total) AS total_sum FROM detalle_factura', (error, result) => {
        if (error) {
            res.send(error)
        } else {
            console.log(result)
            res.render('../views/estadisticasDeVenta.ejs', {
                total_bruto_sum: result[0].total_bruto_sum,
                total_sum: result[0].total_sum

            });

        }
    })
});
app.get('/prueba', (req,res)=>{
  connection.query("SELECT SUM(valor_bruto) AS total_bruto_sum, SUM(total) AS total_sum FROM detalle_factura", (error, result) => {
        if (error) {
            res.send(error);
        } else {
            res.send(console.log(result))
            };
    })
});

app.get('/listaClientes', (req, res) => {
    connection.query('SELECT * FROM cliente ORDER BY cedula_cliente', (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.render('../views/listaClientes.ejs', {
                clientes: result
            });
        }
    })
});
app.get('/listaProductosVendidos', (req, res) => {
    connection.query('SELECT * FROM detalle_factura ORDER BY codigoProducto', (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.render('../views/listaProductosVendidos.ejs', {
                productos: result
            });

        }
    })
});


// api
app.get("/apiEstadisticasDetalleFactura", (req, res) => {
    const sql = "SELECT codigoProducto, SUM(cantidad) cantidad, SUM(valor_bruto) valor_bruto, SUM(total) total FROM detalle_factura GROUP BY codigoProducto";
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('not result');
        }
    })
})
// SELECT codigoProducto, SUM(cantidad), SUM(valor_bruto), SUM(total)
// FROM detalle_factura
// GROUP BY codigoProducto;
app.get("/apiEstadisticasProductos", (req, res) => {
    const sql = 'SELECT * FROM producto';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('not result');
        }
    })
})
app.get("/apiEstadisticasEncabezadoFactura", (req, res) => {
    const sql = 'SELECT fechaFactura, SUM(valorNeto) valorNeto FROM encabezado_factura GROUP BY fechaFactura ';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('not result');
        }
    })
})
