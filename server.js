const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

var fs = require('fs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'nodejs'
})
*/

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bjdjbsinsyuanxymllgm-mysql.services.clever-cloud.com',
    user: 'u1isfcdq4rvxd2y6',
    password: '6ATfk53UEsLs8q2h10hX',
    database: 'bjdjbsinsyuanxymllgm'
})

app.get('/', (req, res) => {
    fs.readFile('public/index.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el contenido del archivo HTML como respuesta
        res.send(data);
    });
});

app.get('/centros', (req, res) => {
    fs.readFile('public/centros.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el contenido del archivo HTML como respuesta
        res.send(data);
    });
});

app.get('/cursos', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from cursos', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.get('/alumnos', (req, res) => {
    fs.readFile('public/alumnos.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el contenido del archivo HTML como respuesta
        res.send(data);
    });
});

app.get('/actualizar', (req, res) => {
    fs.readFile('public/actualizar.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el contenido del archivo HTML como respuesta
        res.send(data);
    });
});

app.get('/graficos', (req, res) => {
    fs.readFile('public/graficos.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Envía el contenido del archivo HTML como respuesta
        res.send(data);
    });
});

app.get('/datoscentros', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from centros', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.get('/datosalumnos', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from alumnos', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.post('/notasAlumnos', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT cursos.nombre AS nombre_curso, cursos.nivel AS nivel_curso, alumnocurso.aprobado FROM alumnocurso INNER JOIN cursos ON cursos.id = alumnocurso.cursoid WHERE alumnoid="' + req.body.parametro + '"', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.post('/cursosCentros', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT centros.nombre AS nombre_centro, cursos.nombre AS nombre_curso, cursos.nivel FROM centros INNER JOIN cursocentro ON centros.id = cursocentro.centroid INNER JOIN cursos ON cursocentro.cursoid = cursos.id WHERE centros.id ="' + req.body.parametro + '"', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.put('/actualizarCursos', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { nombre, nivel, descripcion, id } = req.body

        connection.query('UPDATE cursos SET nombre = ?, nivel = ?, descripcion = ? WHERE id = ?', [nombre, nivel, descripcion, id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`Se ha actualizado el curso correctamente.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

app.post('/notasCursos', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const cursoId = req.body.parametro;
        connection.query('SELECT COUNT(*) AS total, SUM(aprobado) AS aprobados FROM alumnocurso WHERE cursoid=?', [cursoId], (err, rows) => {
            connection.release(); // return the connection to pool
            if (!err) {
                const aprobados = rows[0].aprobados || 0;
                const suspendidos = rows[0].total - aprobados;
                res.json({ aprobados: aprobados, suspendidos: suspendidos });
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error al obtener las notas del curso.' });
            }
        });
    });
});


app.delete('/borrar/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('DELETE FROM alumnos WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`El alumno ha sido borrado correctamente`)
            } else {
                console.log(err)
            }
        })
    })
});

http.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});