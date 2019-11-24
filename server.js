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

io.sockets.on('connect', function(socket) {


    if (!clientesInicial) {
        db.query('SELECT cc_cliente, nombres, apellidos, direccion, email, ciudadcol, idciudad FROM cliente inner join ciudad on (ciudad_idciudad = idciudad)').on('result', function(data) {
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


    socket.on('nuevo cliente', function(data) {
        cliente.push(data);

        db.query('INSERT INTO cliente (cc_cliente, nombres, apellidos, direccion, email, ciudad_idciudad) VALUES ("' + data.cc_cliente + '" ,"' + data.nombres + '" ,"' + data.apellidos + ' ","' + data.direccion + '" ,"' + data.email + '" ,"' + data.ciudad_idciudad + '" )')

    })

    socket.on("clickNuevo", (data) => {
        console.log(data);
    });



})