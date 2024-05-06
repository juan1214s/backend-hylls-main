// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";



/**
 * Obtiene todas las playlists almacenadas en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerPlaylists = async (req, res) => {
  try {
    // Consultar todas las playlists en la base de datos
    const [rows, fields] = await connection.execute('SELECT * FROM play_list');

    // Devolver las playlists en formato JSON
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las playlists:', error);
    res.status(500).json({ mensaje: 'Error al obtener las playlists' });
  }
};

export default obtenerPlaylists;
