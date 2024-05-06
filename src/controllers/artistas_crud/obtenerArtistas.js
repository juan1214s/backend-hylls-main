// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";


/**
 * Obtiene todos los artistas de la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerArtistas = async (req, res) => {
  try {
    // Consultar todos los artistas en la base de datos
    const results = await connection.query('SELECT * FROM artista');
    const rows = results[0];
    res.json(rows);
  } catch (error) {
    console.error("Error de MySQL:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export default obtenerArtistas;
