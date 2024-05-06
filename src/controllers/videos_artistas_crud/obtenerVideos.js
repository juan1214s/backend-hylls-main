// obtenerVideos.js
import connection from "./../../config/db.js";

/**
 * Obtiene todos los videos de artistas desde la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerVideos = async (req, res) => {
    try {
        // Consultar la base de datos para obtener todos los videos de artistas
        const results = await connection.query(`
          SELECT va.*, a.Nombre
          FROM video_artistas va
          LEFT JOIN artista a ON va.Id_artista = a.Id_artista
        `);
    
        // Extraer las filas de resultados
        const rows = results[0];
        // Devolver los videos de artistas encontrados
        res.json(rows);
    } catch (error) {
        // Manejar errores y enviar respuesta de error al cliente
        console.error("Error de MySQL:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export default obtenerVideos;
