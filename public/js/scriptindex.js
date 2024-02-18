$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/cursos',
        contentType: 'application/json',
        success: function (data) {

            mostrarcursos(data);
        },
        error: function (error) {

            console.error('Error al obtener datos de la PokeAPI:', error.responseJSON.error);
        }
    });

    function mostrarcursos(data) {
        const cursosDiv = $('#data');
        cursosDiv.empty();
        data.forEach(curso => {
            cursosDiv.append(`<h1> ${curso.nombre}</h1>`);
            cursosDiv.append(`<p>Nivel: ${curso.nivel}</p>`);
            cursosDiv.append(`<p>Descripción: ${curso.descripcion}</p>`);
        })
    }
});