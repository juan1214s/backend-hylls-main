// obtenerVideoPorId.js
import connection from "./../../config/db.js";

/**
 * Obtiene un video de artista por su ID desde la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerVideoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        // Consultar la base de datos para obtener el video por su ID
        const [video] = await connection.execute('SELECT * FROM video_artistas WHERE Id_video_artista = ?', [id]);

        // Verificar si el video fue encontrado
        if (video.length === 0) {
            return res.status(404).json({ mensaje: 'Video no encontrado' });
        }

        // Devolver el primer video encontrado (solo debería haber uno con ese ID)
        res.json(video[0]);
    } catch (error) {
        // Manejar errores y enviar respuesta de error al cliente
        console.error('Error al obtener el video por ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default obtenerVideoPorId;
