function borrarAlumno(id) {
    $.ajax({
        type: 'delete',
        url: `/borrar/${id}`,
        success: function (response) {
            alert('Alumno eliminado correctamente: ' + response); // Mostrar la respuesta en un alert
            location.reload(); // Recargar la página
        },
        error: function (error) {
            console.error('Error en la solicitud AJAX:', error);
            alert('Error al intentar eliminar al alumno. Por favor, inténtalo de nuevo.'); // Mostrar un mensaje de error en caso de fallo
        }
    });
}

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/datosalumnos',
        contentType: 'application/json',
        success: function (data) {
            mostraralumnos(data, 0); // Comenzamos desde el primer elemento
        },
        error: function (error) {
            console.error('Error al obtener datos de la PokeAPI:', error.responseJSON.error);
        }
    });

    function mostraralumnos(data, index) {
        const alumnosDiv = $('#data');
        if (index >= data.length) {
            // Si hemos llegado al final de los datos, terminamos la recursión
            return;
        }
        var alumno = data[index];
        var id = alumno.id;
        alumnosDiv.append(`<h1>${alumno.nombre} ${alumno.apellidos}</h1>`);
        // Realizamos la solicitud AJAX secundaria para obtener las notas del alumno actual
        $.ajax({
            type: 'POST',
            url: 'notasAlumnos',
            data: JSON.stringify({ parametro: id }),
            contentType: 'application/json',
            success: function (notas) {
                mostrarnotas(notas); // Mostramos las notas obtenidas
                alumnosDiv.append(`<button onClick="borrarAlumno(${id})">Borrar</button> `);
                mostraralumnos(data, index + 1); // Pasamos al siguiente alumno
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX secundaria:', error);
                alumnosDiv.append(`<button onClick="borrarAlumno(${id})">Borrar</button> `);
                mostraralumnos(data, index + 1); // Pasamos al siguiente alumno incluso en caso de error
            }
        });
    }

    function mostrarnotas(notas) {
        console.log('Mostrando notas:', notas);
        const alumnosDiv = $('#data');
        notas.forEach(nota => {
            var notasalumno = nota.aprobado === 1 ? "Aprobado" : "Suspenso";
            // Asumiendo que el objeto 'nota' contiene los campos 'curso' y 'aprobado'
            alumnosDiv.append(`<p>curso: ${nota.nombre_curso} nivel ${nota.nivel_curso} </p> `);
            alumnosDiv.append(`<p>aprobado: ${notasalumno}</p>`);
        });
    }

});