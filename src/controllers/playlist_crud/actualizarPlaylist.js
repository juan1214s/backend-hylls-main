// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Actualiza una playlist existente en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const actualizarPlaylist = async (req, res) => {
  const idPlaylist = req.params.id;
  const { enlace_spotify, enlace_applemusic, Nombre_playList, tipo } = req.body;

  try {
    let fotoPlaylist = null;

    // Verifica si se proporciona una nueva foto antes de asignar un valor
    if (req.file) {
      fotoPlaylist = `imagenes_playlist/${req.file.filename}`;

      // Obtener la información de la playlist actual
      const [existingPlaylist] = await connection.execute(
        'SELECT * FROM play_list WHERE Id_playlist = ?',
        [idPlaylist]
      );

      // Eliminar la foto anterior del servidor
      if (existingPlaylist[0].foto_playlist) {
        const fotoAnteriorUrl = existingPlaylist[0].foto_playlist;
        const rutaCompletaFotoAnterior = path.join(
          './public',
          fotoAnteriorUrl
        );

        try {
          // Verificar si la imagen anterior existe antes de intentar eliminarla
          await fs.access(rutaCompletaFotoAnterior);

          // Eliminar la imagen anterior del sistema de archivos
          await fs.unlink(rutaCompletaFotoAnterior);
          console.log('Foto anterior eliminada:', rutaCompletaFotoAnterior);
        } catch (error) {
          console.error('Error al eliminar la foto anterior:', error);
        }
      }
    } else {
      // Si no se proporciona una nueva foto, obtén el valor actual de la imagen
      const [existingPlaylist] = await connection.execute(
        'SELECT foto_playlist FROM play_list WHERE Id_playlist = ?',
        [idPlaylist]
      );

      // Asigna el valor actual de la imagen (si existe)
      fotoPlaylist = existingPlaylist[0] ? existingPlaylist[0].foto_playlist : null;
    }

    // Consulta para verificar si ya existe un registro con los mismos valores
    const [existingDuplicates] = await connection.execute(
      'SELECT * FROM play_list WHERE enlace_spotify = ? AND enlace_applemusic = ? AND tipo = ? AND Id_playlist <> ?',
      [enlace_spotify, enlace_applemusic, tipo, idPlaylist]
    );

    // Si existen registros duplicados, enviar mensaje de error
    if (existingDuplicates.length > 0) {
      return res.status(400).json({ mensaje: 'No se puede duplicar la información de otra playlist.' });
    }

    // Realizar la actualización en la base de datos
    await connection.execute(
      'UPDATE play_list SET enlace_spotify = ?, enlace_applemusic = ?, Nombre_playList = ?, foto_playlist = ?, tipo = ? WHERE Id_playlist = ?',
      [enlace_spotify, enlace_applemusic, Nombre_playList, fotoPlaylist, tipo, idPlaylist]
    );

    // Devolver una respuesta exitosa
    res.json({ mensaje: 'Playlist actualizada con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error al actualizar la Playlist:', error);
    res.status(500).json({ error: 'Error al actualizar la Playlist' });
  }
};

export default actualizarPlaylist;
