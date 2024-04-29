import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import mysql from "mysql";
const app = express ();
const puerto = 3000;

app.use(cors());
app.use(bodyParser.json());
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phpmyadmin'
    });
    
    conexion.connect(error => {
    
        if (error) {
        console.error('Error al conectar a la base de datos:', error);
        } else {
        console.log('Conexión exitosa a la base de datos');
        }

        });
        app.get('/crear-tabla', (req, res) => {
            const createTableQuery = `
            CREATE TABLE productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            descripcion TEXT
            )
            `;
    
            conexion.query(createTableQuery, (err, results) => {
            if (err) {
            console.error('Error al crear la tabla:', err);
            res.status(500).send('Error al crear la tabla');
            } else {
            console.log('Tabla creada exitosamente');
            res.send('Tabla creada exitosamente');
    
            }
            });
            });
        app.get('/productos', (req, res) => {
            const selectQuery = 'SELECT * FROM productos';
            conexion.query(selectQuery, (err, results) => {

            if (err) {
            console.error('Error al seleccionar productos:', err);
            res.status(500).send('Error al seleccionar productos');
            } else {
            console.log('Productos seleccionados exitosamente');
            res.json(results);
            }
            });
            });
        app.post('/agregar-producto', (req, res) => {
                const { nombre, precio, descripcion } = req.body;
                
                const insertQuery = `
                INSERT INTO productos (nombre, precio, descripcion)
                VALUES (?, ?, ?)
                `;
    
                conexion.query(insertQuery, [nombre, precio, descripcion], (err, results) => {
                if (err) {
                console.error('Error al agregar producto:', err);
                res.status(500).send('Error al agregar producto');
                } else {
                console.log('Producto agregado exitosamente');
                res.send('Producto agregado exitosamente');
                }
                });
                });

        app.put('/productos/:id', (req, res) => {
                    const productId = req.params.id;
                    const { nombre, precio, descripcion } = req.body;
                    
                    const updateQuery = `
                    UPDATE productos
                    SET nombre = ?, precio = ?, descripcion = ?
                    WHERE id = ?
                    `;
            
                    conexion.query(updateQuery, [nombre, precio, descripcion, productId], (err, results) => {
                    if (err) {
                    console.error('Error al actualizar producto:', err);
                    res.status(500).send('Error al actualizar producto');
                    } else {
                    console.log('Producto actualizado exitosamente');
                    res.send('Producto actualizado exitosamente');
                    }
                    });
                    });

        app.delete('/productos/:id', (req, res) => {
                        const productId = req.params.id;
                        
                        const deleteQuery = 'DELETE FROM productos WHERE id = ?';
                        
                        conexion.query(deleteQuery, [productId], (err, results) => {
                        if (err) {
                        console.error('Error al eliminar producto:', err);
                        res.status(500).send('Error al eliminar producto');
                        } else {
                        console.log('Producto eliminado exitosamente');
                        res.send('Producto eliminado exitosamente');
                        }
                        });
                        });
                        
let data = [
    { id: 1, name: 'Objeto 1'},
    { id:2, name: 'Objeto 2'},
    { id:3, name: 'Objeto 3'}
    ];


app.get ('/data'  , (req, res) => {
    res.json(data);
    });
app.get('/', (req, res) => {
res.send ('Hola, mundo con Express!');
});
app.post ('/data', (req, res) => {
    const nuevoDato = req.body;
    nuevoDato.id = data.length + 1;
    data.push(nuevoDato);
    res.json(nuevoDato);
    });
    app.delete('/data/:id', (req, res) => {
        const id = parseInt(req.params.id);
        data = data.filter((item) => item.id !== id);
        res.json ({ mensaje: 'Dato eliminado exitosamente' });
        });


//Iniciar el servidor
app.listen(puerto, () => {
console.log(`Servidor en funcionamiento en el puerto ${puerto}`);
});