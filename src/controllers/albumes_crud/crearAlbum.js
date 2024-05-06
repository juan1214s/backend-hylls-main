// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';

/**
 * Crea un nuevo álbum y lo asocia a un artista.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const crearAlbum = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud
    const { Id_artista, Nombre_album, Fecha_album } = req.body;
    const fotosAlbum = req.file;
    const nombreFormateado = Nombre_album.trim();

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el álbum ya existe para el artista
    const existingAlbum = await connection.execute(
      'SELECT * FROM album_artista WHERE Id_artista = ? AND Nombre_album = ?',
      [Id_artista, nombreFormateado]
    );

    if (existingAlbum[0].length > 0) {
      res.status(400).json({ mensaje: 'El álbum ya existe para este artista' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar la imagen guardada en el servidor
      if (fotosAlbum) {
        await fs.unlink(fotosAlbum.path);
      }

      return;
    }

    // Insertar información básica del álbum en la base de datos
    const [insertResult] = await connection.execute(
      'INSERT INTO album_artista (Id_artista, Nombre_album, Fecha_album) VALUES (?, ?, ?)',
      [Id_artista, Nombre_album, Fecha_album]
    );

    const albumId = insertResult.insertId;

    // Guardar la imagen del álbum si existe
    if (fotosAlbum) {
      await actualizarImagen('Foto_album', fotosAlbum, albumId);
    }

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Álbum creado con éxito' });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al crear el álbum' });
  }
};

/**
 * Función para actualizar la imagen de un álbum.
 * @param {string} tipo - Tipo de imagen ('Foto_album').
 * @param {Object} imagen - Información de la imagen.
 * @param {number} albumId - ID del álbum.
 */
const actualizarImagen = async (tipo, imagen, albumId) => {
  try {
    const archivoNombre = imagen.filename;
    const archivoUrl = `imagenes_album/${archivoNombre}`;

    // Actualizar la entrada del álbum con la URL de la imagen
    await connection.execute(
      `UPDATE album_artista SET ${tipo} = ? WHERE Id_album = ?`,
      [archivoUrl, albumId]
    );

    console.log(`Ruta de la nueva ${tipo}:`, archivoUrl);
  } catch (error) {
    console.error(`Error al actualizar la ${tipo} del álbum:`, error);
    // Si hay un error, eliminar la imagen guardada en el servidor
    await fs.unlink(imagen.path);
    throw error;
  }
};

export default crearAlbum;
