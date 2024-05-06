// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";


/**
 * Obtiene todas las canciones almacenadas en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerCanciones = async (req, res) => {
    try {
        // Consultar todas las canciones en la base de datos
        const results = await connection.query('SELECT * FROM canciones_artista');
        const rows = results[0];

        res.json(rows);
    } catch (error) {
        console.error('Error de MySQL:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default obtenerCanciones;
