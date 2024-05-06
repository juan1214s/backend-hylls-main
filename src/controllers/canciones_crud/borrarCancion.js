// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Elimina una canción de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const borrarCancion = async (req, res) => {
    try {
        // Extraer el ID del parámetro de la URL
        const cancionId = req.params.id;

        // Eliminar la canción de la base de datos
        await connection.execute('DELETE FROM canciones_artista WHERE Id_cancion = ?', [cancionId]);

        res.json({ mensaje: 'Canción eliminada con éxito' });
    } catch (error) {
        console.error('Error mysql:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default borrarCancion;
