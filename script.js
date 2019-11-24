$(document).ready(function() {

    var socket = io.connect('http://localhost:3000');
    let tablaLLena = false;
    getall();

    // Connect to our node/websockets server

    function getall() {
        var socket = io.connect('http://localhost:3000');


        socket.on('client', function(data) {
            var tbody = '';
            console.clear();
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                tbody += '<tr><td>' + data[i].cc_cliente + '</td>' +
                    " <td> " + data[i].nombres + "</td> " +
                    " <td> " + data[i].apellidos + "</td> " +
                    " <td> " + data[i].direccion + "</td> " +
                    " <td> " + data[i].email + "</td> " +
                    " <td> " + data[i].ciudadcol + "</td> " +
                    " <td class='btn'> " + '<i class="material-icons" id=' + data[i].cc_cliente + ' >control_point</i>' +
                    '</td></tr>';
            }
            $('#tbdy').html(tbody)

        })

    }


    socket.on('ciudad', function(datas) {

        if (!tablaLLena)
            $.each(datas, function(key, datas) {

                $("#select").append('<option value=' + datas.idciudad + '>' + '<span>' + datas.ciudadcol + '</span>' + '</option>');
            });
        else tablaLLena = true;

    });


    $('body').delegate(".btn", "click", function(e) {
        socket.emit("clickNuevo", e.target.id);
        console.log(e.target.id);
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
                ciudad_idciudad: ciudad
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



    $('#btnmodal').click(function() {
        console.log("hola");
        showmodal();
    })


})