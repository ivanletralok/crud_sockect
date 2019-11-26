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

    /**obtener los usuarios conectados */

    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)

    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })


    /**se hace la inserccion ala tabla movimiento en la base de datos */

    socket.on('nuevoMov', function(dato) {
        console.log(dato)
        db.query('INSERT INTO movimiento (valor_movimiento, fecha_mov, fk_dtipo_movimiento, fk_numero_cuenta) VALUES (' + dato.valor_movimiento + ', "' + dato.fecha_mov + '", ' + dato.fk_dtipo_movimiento + ', ' + dato.fk_numero_cuenta + ')');
    })

    /**estraer todos los clientes ya registrados en la base de datos */

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

    /**se extrar todas las ciudades que estan en la base de datos 
     * para cargar un select 
     */
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

    /**se hace una consulta para extraer todos los tipo de moviemiento de la base de datos
     * y se envian ala vista
     */

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

    /** aqui se escucha un nuevo cliente y se inserta en la base de datos*/

    socket.on('nuevo cliente', function(data) {
        cliente.push(data);

        db.query('INSERT INTO cliente (cc_cliente, nombres, apellidos, direccion, email, ciudad_idciudad) VALUES ("' + data.cc_cliente + '" ,"' + data.nombres + '" ,"' + data.apellidos + ' ","' + data.direccion + '" ,"' + data.email + '" ,"' + data.ciudad_idciudad + '" )')

        db.query('INSERT INTO cuenta (numero_cuenta, saldo, cliente_cc_cliente) VALUES (' + data.numero_cuenta + ' , ' + data.saldo + ',' + data.cc_cliente + ')');

    })




})