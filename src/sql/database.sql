CREATE DATABASE ProtechDB;


CREATE TABLE Usuario
(
    usuarioId       INT PRIMARY KEY AUTO_INCREMENT,
    usuario         VARCHAR(25) NOT NULL,
    nombre_empleado VARCHAR(70),
    cargo           VARCHAR(25) NOT NULL CHECK (cargo IN ('TECNICO', 'ADMINISTRATIVO')),
    contrasena      VARCHAR(20) NOT NULL
);


CREATE TABLE Producto
(
    codigoProducto  INT PRIMARY KEY,
    imagen          varchar(250) NOT NULL,
    nombre_producto VARCHAR(50)  NOT NULL,
    descripción     VARCHAR(150),
    stock           INT,
    precio          INT          NOT NULL,
    costo           INT          NOT NULl
);

CREATE TABLE cliente
(
    cedula_cliente varchar(50) PRIMARY KEY,
    nombre_cliente varchar(70)  NOT NULL,
    direccion      varchar(150) NOT NULL,
    numero_celular varchar(13)  NOT NULL
);

CREATE TABLE encabezado_factura
(
    encabezadoId   INT PRIMARY KEY AUTO_INCREMENT,
    usuarioId      int(11)     NOT NULL,
    cedula_cliente varchar(50) NOT NULL,
    FOREIGN KEY (cedula_cliente) REFERENCES cliente (cedula_cliente),
    fechaFactura   DATE        NOT NULL,
    observaciones  VARCHAR(150),
    descuentos     INT         NOT NULL,
    impuestos      INT         NOT NULL,
    valorNeto      INT         NOT NULL
);

CREATE TABLE detalle_factura
(
    detalleId      INT PRIMARY KEY AUTO_INCREMENT,
    encabezadoId   INT,
    FOREIGN KEY (encabezadoId) REFERENCES encabezado_factura (encabezadoId),
    codigoProducto INT,
    FOREIGN KEY (codigoProducto) REFERENCES Producto (codigoProducto),
    cantidad       INT NOT NULL CHECK (cantidad > 0),
    descuento      INT NOT NULL,
    impuesto       INT NOT NULL,
    valor_bruto    INT NOT NULL,
    total          INT NOT NULL
);


DESCRIBE detalle_factura
