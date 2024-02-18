$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/datoscentros',
        contentType: 'application/json',
        success: function (data) {
            mostrarcentros(data);
        },
        error: function (error) {
            console.error('Error al obtener datos de la PokeAPI:', error.responseJSON.error);
        }
    });

    function mostrarcentros(data) {
        const centrosDiv = $('#data');
        data.forEach(centro => {
            // Crear un nuevo contenedor para este centro y sus cursos asociados
            const contenedorCentro = $('<div>');
            contenedorCentro.append(`<h1>${centro.nombre}</h1>`);
            contenedorCentro.append(`<p>Ciudad: ${centro.ciudad}</p>`);
            // Agregar el contenedor del centro al contenedor principal
            centrosDiv.append(contenedorCentro);
            mostrarcursoscentro(centro.id, contenedorCentro); // Llamar a la función para mostrar cursos asociados a este centro
        });
    }

    function mostrarcursoscentro(centroId, contenedorCentro) {
        // Realizar una solicitud AJAX para obtener los cursos asociados a este centro
        $.ajax({
            type: 'POST',
            url: '/cursosCentros',
            data: JSON.stringify({ parametro: centroId }),
            contentType: 'application/json',
            success: function (cursos) {
                cursos.forEach(curso => {
                    contenedorCentro.append(`<p>Curso: ${curso.nombre_curso}, Nivel: ${curso.nivel}</p>`);
                });
            },
            error: function (error) {
                console.error('Error al obtener cursos del centro:', error);
            }
        });
    }
});