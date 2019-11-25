var mysql = require('mysql')
    // Let’s make node/socketio listen on port 3000
var io = require('socket.io').listen(3000)
    // Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    port: 3300,
    user: 'root',
    password: '',
    database: 'banco',
})

// Log any errors connected to the db
db.connect(function(err) {
    if (err) {
        console.log("ERROR: " + err)
    } else {
        console.log("conexion establecida")
    }
})


var cliente = [];
var clientesInicial = false;

var ciudad = [];
var ciudadi = false;

var movimiento = [];
var info = false;
var socketCount = 0;

var tipoM = false;
var tipoMov = [];


io.sockets.on('connect', function(socket) {

    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)

    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })


    socket.on('nuevoMov', function(dato) {
        movimiento.push(dato);

        console.log(dato)

        db.query('INSERT INTO movimiento (valor_movimiento, fecha_mov, fk_dtipo_movimiento, fk_numero_cuenta) VALUES (' + dato.valor_movimiento + ', "' + dato.fecha_mov + '", ' + dato.fk_dtipo_movimiento + ', ' + dato.fk_numero_cuenta + ')');
    })

    if (!clientesInicial) {
        db.query('SELECT cc_cliente, nombres, apellidos, direccion, email, ciudadcol, idciudad, numero_cuenta, saldo FROM cliente inner join ciudad on (ciudad_idciudad = idciudad)inner join cuenta on (cc_cliente = cliente_cc_cliente )').on('result', function(data) {
            cliente.push(data);
        }).on('end', function() {
            socket.emit('client', cliente);
        })

        clientesInicial = true;
    } else {
        socket.emit('client', cliente);

    }

    if (!ciudadi) {
        db.query('SELECT * FROM ciudad').on('result', function(datas) {
            ciudad.push(datas);
        }).on('end', function() {
            socket.emit('ciudad', ciudad);
        })

        ciudadi = true;
    } else {
        socket.emit('ciudad', ciudad);

    }

    if (!tipoM) {
        db.query('SELECT * FROM tipo_movimiento').on('result', function(datas) {
            tipoMov.push(datas);
        }).on('end', function() {
            socket.emit('tipoM', tipoMov);
        })

        tipoM = true;
    } else {
        socket.emit('tipoM', tipoMov);

    }


    socket.on('nuevo cliente', function(data) {
        cliente.push(data);

        db.query('INSERT INTO cliente (cc_cliente, nombres, apellidos, direccion, email, ciudad_idciudad) VALUES ("' + data.cc_cliente + '" ,"' + data.nombres + '" ,"' + data.apellidos + ' ","' + data.direccion + '" ,"' + data.email + '" ,"' + data.ciudad_idciudad + '" )')

        db.query('INSERT INTO cuenta (numero_cuenta, saldo, cliente_cc_cliente) VALUES (' + data.numero_cuenta + ' , ' + data.saldo + ',' + data.cc_cliente + ')');

    })




})