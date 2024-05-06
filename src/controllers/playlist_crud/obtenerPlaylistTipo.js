// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";



/**
 * Obtiene playlists filtradas por tipo (si se proporciona el parámetro 'tipo').
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerPlaylistsTipo = async (req, res) => {
  try {
    // Obtén el valor del parámetro 'tipo' de la URL
    const tipo = req.query.tipo;

    // Define la consulta SQL para obtener playlists con filtro opcional por 'tipo'
    const sqlQuery = tipo
      ? 'SELECT * FROM play_list WHERE tipo = ?'
      : 'SELECT * FROM play_list';

    // Ejecuta la consulta SQL con el valor del parámetro 'tipo'
    const [rows, fields] = await connection.execute(sqlQuery, [tipo]);

    // Devuelve las playlists en formato JSON
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las playlists:', error);
    res.status(500).json({ mensaje: 'Error al obtener las playlists' });
  }
};

export default obtenerPlaylistsTipo;
