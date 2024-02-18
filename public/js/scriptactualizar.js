$(document).ready(function () {
    var data;

    $.ajax({
        type: 'GET',
        url: '/cursos',
        contentType: 'application/json',
        success: function (response) {
            data = response;
            mostrarselector(data);
        },
        error: function (error) {
            console.error('Error al obtener datos de la PokeAPI:', error.responseJSON.error);
        }
    });

    function mostrarselector(data) {
        const cursosSelector = $('#selector');
        cursosSelector.empty();
        data.forEach(curso => {
            cursosSelector.append(`<option value="${curso.id}">${curso.nombre} ${curso.nivel}</option>`);
        });
    }

    // Ocultar el div #seleccion al inicio
    $('#seleccion').hide();

    $('#cursoForm').submit(function (event) {
        event.preventDefault(); // Prevenir el envío del formulario

        var seleccion = $('#selector').val();
        // Obtener el curso seleccionado
        var cursoSeleccionado = data.find(curso => curso.id == seleccion);

        // Llenar los campos de texto con la información del curso
        $('#nombre').val(cursoSeleccionado.nombre);
        $('#nivel').val(cursoSeleccionado.nivel);
        $('#descripcion').val(cursoSeleccionado.descripcion);

        // Mostrar el div #seleccion
        $('#seleccion').show();
    });

    $('#seleccion button').click(function (event) {
        event.preventDefault();
        modificarcurso();
    });

    function modificarcurso() {
        console.log($("#nombre").val(), $("#nivel").val(), $("#descripcion").val(), $("#selector").val());
        $.ajax({
            url: '/actualizarCursos',
            type: 'PUT',
            contentType: 'application/x-www-form-urlencoded',
            data: { nombre: $("#nombre").val(), nivel: $("#nivel").val(), descripcion: $("#descripcion").val(), id: $("#selector").val() },
            success: function (response) {
                console.log(response);
                // Mostrar alerta
                alert("Los datos se han cambiado correctamente.");
                // Recargar la página
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
});
