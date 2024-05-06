// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";


/**
 * Obtiene una canción específica por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerCancionPorId = async (req, res) => {
    try {
        // Extraer el ID del parámetro de la URL
        const { id } = req.params;

        // Consultar la canción por su ID en la base de datos
        const [cancion] = await connection.execute('SELECT * FROM canciones_artista WHERE Id_cancion = ?', [id]);

        // Verificar si la canción existe
        if (cancion.length === 0) {
            return res.status(404).json({ mensaje: 'Canción no encontrada' });
        }

        res.json(cancion[0]);
    } catch (error) {
        console.error('Error al obtener la canción por ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default obtenerCancionPorId;
