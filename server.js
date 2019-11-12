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

io.sockets.on('connect', function(socket) {

    if (!clientesInicial) {
        db.query('SELECT * FROM clientes').on('result', function(data) {
            cliente.push(data);
        }).on('end', function() {
            socket.emit('client', cliente);
        })

        clientesInicial = true;
    } else {
        socket.emit('client', cliente);
    }


    socket.on('nuevo cliente', function(data) {
        cliente.push(data);
        io.sockets.emit('nuevo cliente', data)
        console.log(data);

        db.query('INSERT INTO clientes (nombres, direccion, numero_cuenta, saldo, movimiento_idmovimiento) VALUES ("' + data.nombres + '" ,"' + data.direccion + '" ,"' + data.numero_cuenta + ' ","' + data.saldo + '" ,"' + data.movimiento_idmovimiento + '" )')

    })


})