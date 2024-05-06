import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Elimina una playlist de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const eliminarPlaylist = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener la información de la playlist actual
    const [existingPlaylist] = await connection.execute(
      'SELECT foto_playlist FROM play_list WHERE Id_playlist = ?',
      [id]
    );

    // Verificar si la playlist existe
    if (existingPlaylist.length === 0) {
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    // Eliminar la foto de la playlist del servidor
    if (existingPlaylist[0].foto_playlist) {
      const fotoUrl = existingPlaylist[0].foto_playlist;
      const rutaCompletaFoto = path.join(
        './public',
        'imagenes_playlist', // Agregar la carpeta para playlists
        fotoUrl
      );

      // Intentar eliminar la imagen del sistema de archivos si existe
      try {
        await fs.unlink(rutaCompletaFoto);
        console.log('Foto eliminada con éxito:', rutaCompletaFoto);
      } catch (error) {
        // Manejar el error de eliminación de la foto
        console.error('Error al eliminar la foto:', error);
      }
    }

    // Ejecutar la consulta para eliminar la playlist por su ID
    const [result] = await connection.execute(
      'DELETE FROM play_list WHERE Id_playlist = ?',
      [id]
    );

    // Verificar si se eliminó alguna fila (afectó filas)
    if (result.affectedRows > 0) {
      res.json({ mensaje: 'Playlist eliminada con éxito' });
    } else {
      // Si no se encuentra la playlist, devuelve un error 404
      res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error al eliminar la playlist:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export default eliminarPlaylist;
