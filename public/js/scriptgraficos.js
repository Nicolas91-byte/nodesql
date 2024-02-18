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

    $('#cursoForm').submit(function (event) {
        event.preventDefault(); // Prevenir el envío del formulario

        var seleccion = $('#selector').val();
        mostrargrafico(seleccion);
    });

    // Cargar los módulos de Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        $('#cursoForm').submit(function (event) {
            event.preventDefault(); // Prevenir el envío del formulario

            var seleccion = $('#selector').val();
            mostrargrafico(seleccion);
        });
    });

    function mostrargrafico(id) {
        $.ajax({
            type: 'POST',
            url: 'notasCursos',
            data: JSON.stringify({ parametro: id }),
            contentType: 'application/json',
            success: function (notas) {
                console.log(notas);

                // Crear un array con los valores recibidos
                var data = google.visualization.arrayToDataTable([
                    ['Estado', 'Cantidad'],
                    ['Aprobados', notas.aprobados],
                    ['Suspendidos', notas.suspendidos]
                ]);

                // Configurar las opciones del gráfico
                var options = {
                    title: 'Alumnos Aprobados y Suspendidos',
                    is3D: true,
                };

                // Dibujar el gráfico de tarta en el div con id 'graficos'
                var chart = new google.visualization.PieChart(document.getElementById('graficos'));
                chart.draw(data, options);
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
});