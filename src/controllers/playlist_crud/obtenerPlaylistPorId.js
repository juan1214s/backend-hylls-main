// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";



/**
 * Obtiene una playlist específica por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerPlaylistPorId = async (req, res) => {
  const { id } = req.params;

  try {
    // Consultar la playlist por su ID en la base de datos
    const [playlist] = await connection.execute('SELECT * FROM play_list WHERE Id_playlist = ?', [id]);

    // Verificar si la playlist existe
    if (playlist.length === 0) {
      // Si no se encuentra la playlist, devuelve un error 404
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    // Devolver la playlist encontrada
    res.json(playlist[0]);
  } catch (error) {
    console.error('Error al obtener la playlist por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export default obtenerPlaylistPorId;
