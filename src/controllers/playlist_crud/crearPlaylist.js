// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';

const crearPlaylist = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud
    const { enlace_spotify, enlace_applemusic, Nombre_playlist, tipo } = req.body;

    // Obtener la foto de la playlist, si existe
    const fotoPlaylist = req.file ? `imagenes_playlist/${req.file.filename}` : null;
    const nombrePlaylistFormateado = Nombre_playlist.trim();

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si la playlist ya existe para los mismos enlaces y tipo
    const [existingPlaylist] = await connection.execute(
      'SELECT * FROM play_list WHERE ' +
      'TRIM(LOWER(enlace_spotify)) = TRIM(LOWER(?)) ' +
      'AND TRIM(LOWER(enlace_applemusic)) = TRIM(LOWER(?)) ' +
      'AND tipo = ?',
      [enlace_spotify, enlace_applemusic, tipo]
    );

    if (existingPlaylist.length > 0) {
      res.status(400).json({ mensaje: 'La playlist ya existe para los mismos enlaces y tipo' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar la imagen guardada en el servidor
      if (fotoPlaylist) {
        await fs.unlink(req.file.path);
      }

      return;
    }

    // Crear la playlist en la base de datos
    await connection.execute(
      'INSERT INTO play_list (enlace_spotify, enlace_applemusic, Nombre_playlist, foto_playlist, tipo) VALUES (?, ?, ?, ?, ?)',
      [enlace_spotify, enlace_applemusic, nombrePlaylistFormateado, fotoPlaylist, tipo]
    );

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Playlist creada con éxito' });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al crear la Playlist' });
  }
};

export default crearPlaylist;
