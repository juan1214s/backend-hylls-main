/**
 * Obtiene la lista de todos los videos y sus respectivos títulos desde la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto JSON con la lista de videos y sus títulos o un mensaje de error.
 */
import connection from "./../../config/db.js";

const obtenerVideosHero = async (req, res) => {
    try {
        // Consultar todas las rutas de videos y sus respectivos títulos en la base de datos
        const results = await connection.query('SELECT * FROM videos_musicales');
        const rows = results[0];
        
        // Devolver la lista de videos y títulos en formato JSON
        res.json(rows);
    } catch (error) {
        console.error("Error de MySQL:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export default obtenerVideosHero;
