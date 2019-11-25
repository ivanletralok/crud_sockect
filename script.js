$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');

    socket.on('users connected', function(data) {
        $('#usersConnected').html('Users connected: ' + data)
    })

    let tablaLLena = false;
    let tablaLLenas = false;

    getall();

    // Connect to our node/websockets server

    function getall() {
        // socket = io.connect('http://localhost:3000');

        socket.on('client', function(data) {
            var tbody = '';
            console.clear();
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


    // $('#ingresar').click(function() {
    //     var valor = $('#cedulaI').val();

    //     console.log("data : " + "valor : " + valor);

    socket.on('client', function(data) {
        var tbody = '';
        var cont = 0;
        console.clear();

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
                        " <td class='btn' id='btn1'> " + '<i class="material-icons" id=' + data[i].numero_cuenta + ' >control_point</i> ' +
                        '</td></tr>';
                    break;
                }

            }

            if (cont == 0) {
                swal("usuario no registrado");
            }
            $('#tableCliente').html(tbody)

            var val = $('#cedulaI').val('');

        })

    })

    // })


    socket.on('ciudad', function(datas) {

        if (!tablaLLena)
            $.each(datas, function(key, datas) {

                $("#select").append('<option value=' + datas.idciudad + '>' + '<span>' + datas.ciudadcol + '</span>' + '</option>');
            });
        else tablaLLena = true;

    });

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

    function limpiarInput() {
        cedula = $('#cedula').val('');
        nombres = $('#nombres').val('');
        apellidos = $('#apellidos').val('');
        direccion = $('#direccion').val('');
        email = $('#email').val('');
        ciudad = $('#select').val('');

    }

    /*     <!-- socket.on('nuevo cliente', function(data) {
             console.log(data);
             $('#tbdy').append('<tr><td>' + data.cc_cliente + '</td>' +
                 " <td> " + data.nombres + "</td> " +
                 " <td> " + data.apellidos + "</td> " +
                 " <td> " + data.direccion +
                 " <td> " + data.email + "</td> " +
                 " <td> " + data.ciudadcol +
                 '</td></tr>')
         }) -->*/

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

    $('table').delegate(".btn", "click", function(e) {

        console.log(e.target.id)
        var cuent = e.target.id;


        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();

        var fecha = yyyy + '/' + mm + '/' + dd;

        v = 0;
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

                swal({
                    title: "Realizado con exito!",
                    icon: "success",
                });
                ocultarmodal1();

            } else {
                swal("error campo vacio")
            }

        })
        $('#monto').val('');
        $('#selectt').val('');


    });

    function ocultarmodal1() {
        $('#modalConsignar').modal('hide');
    }


})



function showmodal() {
    $('#modalConsignar').modal();
}