$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');

    /**cantidad de usuario conectados */
    socket.on('users connected', function(data) {
        $('#usersConnected').html('Users connected: ' + data)
    })

    let tablaLLena = false;
    let tablaLLenas = false;

    getall();

    /**aqui se dibuja la tabla de la vista del administrador */

    function getall() {
        // socket = io.connect('http://localhost:3000');

        socket.on('client', function(data) {
            var tbody = '';
            for (var i = 0; i < data.length; i++) {
                tbody += '<tr><td>' + data[i].cc_cliente + '</td>' +
                    " <td> " + data[i].nombres + "</td> " +
                    " <td> " + data[i].apellidos + "</td> " +
                    " <td> " + data[i].direccion + "</td> " +
                    " <td> " + data[i].email + "</td> " +
                    " <td> " + data[i].numero_cuenta + "</td> " +
                    " <td> " + data[i].saldo + "</td> " +
                    // " <td class='btn'> " + '<i class="material-icons" id=' + data[i].cc_cliente + ' >control_point</i>' +
                    '</td></tr>';
            }
            $('#tbdy').html(tbody)

        })
    }

    /**se dibuja la tabla de los clientes que esten registrados en la base de datos
     * para poder hacer el tipo de transaccion
     */

    socket.on('client', function(data) {
        var tbody = '';
        var cont = 0;

        $('#ingresar').click(function() {
            var val = $('#cedulaI').val();
            for (var i = 0; i < data.length; i++) {
                if (val == data[i].cc_cliente) {
                    cont++;
                    tbody += '<tr><td>' + data[i].cc_cliente + '</td>' +
                        " <td> " + data[i].nombres + "</td> " +
                        " <td> " + data[i].apellidos + "</td> " +
                        " <td> " + data[i].direccion + "</td> " +
                        " <td> " + data[i].email + "</td> " +
                        " <td> " + data[i].numero_cuenta + "</td> " +
                        " <td> " + data[i].saldo + "</td> " +
                        " <td class='btn'> " + '<i class="material-icons" id=' + data[i].numero_cuenta + ' >control_point</i> ' +
                        '</td></tr>';


                    break;
                }

            }

            if (cont == 0) {
                swal("usuario no registrado");
            }
            var val = $('#cedulaI').val('');
            $('#tableCliente').html(tbody);


        })

    })


    // })

    /**se carga el boton select con las ciudades que estan en la base de datos */

    socket.on('ciudad', function(datas) {

        if (!tablaLLena)
            $.each(datas, function(key, datas) {

                $("#select").append('<option value=' + datas.idciudad + '>' + '<span>' + datas.ciudadcol + '</span>' + '</option>');
            });
        else tablaLLena = true;

    });

    /**se cargan los tipos de transacion en un input select */
    socket.on('tipoM', function(datas) {

        if (!tablaLLenas)
            $.each(datas, function(key, datas) {

                $("#selectt").append('<option value=' + datas.idtipo_movimiento + '>' + '<span>' + datas.descripcion + '</span>' + '</option>');
            });
        else tablaLLenas = true;

    });



    function showmodal() {
        $('.modal').modal();
    }

    function ocultarmodal() {
        $('#exampleModal').modal('hide');
    }

    /**funcion que limpia input despues de guardar */

    function limpiarInput() {
        cedula = $('#cedula').val('');
        nombres = $('#nombres').val('');
        apellidos = $('#apellidos').val('');
        direccion = $('#direccion').val('');
        email = $('#email').val('');
        ciudad = $('#select').val('');

    }


    /**aqui se emite un nuevo cliente al servidor  para insertar en la base de datos 
     * 
     * dandole click al boton guardar
     */

    $('#btnGuardar').click(function() {

        var randon = Math.round(Math.random() * 100000);
        var saldo = 0;
        cedula = $('#cedula').val();
        nombres = $('#nombres').val();
        apellidos = $('#apellidos').val();
        direccion = $('#direccion').val();
        email = $('#email').val();
        ciudad = $('#select').val();

        if (cedula != "" && nombres != "" && apellidos != "" && ciudad != "") {
            socket.emit('nuevo cliente', {
                cc_cliente: cedula,
                nombres: nombres,
                apellidos: apellidos,
                direccion: direccion,
                email: email,
                ciudad_idciudad: ciudad,
                numero_cuenta: randon,
                saldo: saldo
            });

            swal({
                title: "Guardado con exito!",
                icon: "success",
            });

        } else {
            swal("error al llenar los datos");
        }

        getall();
        ocultarmodal();
        limpiarInput();

    })



    // $('#btnmodal').click(function() {
    //     showmodal();
    // })

    var c = 0;

    /**aqui se inserta un nuevo movimiento en la base de datos
     */
    $('table').delegate(".btn", "click", function(e) {

        //  console.log(e.target.id)
        var cuent = e.target.id;
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();

        var fecha = yyyy + '/' + mm + '/' + dd;

        showmodal();

        $('#consignar').click(function() {
            monto = $('#monto').val();
            tipom = $('#selectt').val();

            if (monto != "" && tipom != "") {
                socket.emit('nuevoMov', {
                    valor_movimiento: monto,
                    fecha_mov: fecha,
                    fk_dtipo_movimiento: tipom,
                    fk_numero_cuenta: cuent
                });
                $('#monto').val('');
                $('#selectt').val('');

                swal({
                    title: "Realizado con exito!",
                    icon: "success",
                });

                ocultarmodal1();


            } else {

                swal({
                    title: "Realizado con exito!",
                    icon: "success",
                });

            }

        })
    });

    function ocultarmodal1() {
        $('#modalConsignar').modal('hide');
    }


})



function showmodal() {
    $('#modalConsignar').modal();
}