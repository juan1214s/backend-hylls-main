// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Actualiza un álbum existente en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const actualizarAlbum = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud y del archivo
    const albumId = req.params.id;
    const { Id_artista, Nombre_album, Fecha_album } = req.body;
    const fotoAlbum = req.file;

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el álbum existe
    const [existingAlbum] = await connection.execute('SELECT * FROM album_artista WHERE Id_album = ?', [albumId]);
    if (existingAlbum.length === 0) {
      res.status(404).json({ mensaje: 'Álbum no encontrado' });

      // En caso de álbum no encontrado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar la imagen guardada en el servidor
      if (fotoAlbum) {
        await fs.unlink(fotoAlbum.path);
      }

      return;
    }

    // Formatear la fecha antes de la actualización
    const fechaFormateada = new Date(Fecha_album).toISOString().split('T')[0];

    // Verificar si el álbum ya existe para el artista
    const [existingDuplicate] = await connection.execute(
      'SELECT * FROM album_artista WHERE Id_artista = ? AND Nombre_album = ? AND Id_album <> ?',
      [Id_artista, Nombre_album, albumId]
    );

    if (existingDuplicate.length > 0) {
      res.status(400).json({ mensaje: 'Ya existe un álbum con este nombre para este artista' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar la imagen guardada en el servidor
      if (fotoAlbum) {
        await fs.unlink(fotoAlbum.path);
      }

      return;
    }

    // Obtener la ruta de la foto del álbum en el sistema de archivos
    const fotoAlbumAntiguaUrl = existingAlbum[0].Foto_album;

    // Construir la ruta completa al archivo en la carpeta pública
    const rutaCompletaFotoAlbum = path.join('./public', fotoAlbumAntiguaUrl);

    // Verificar si hay una nueva foto antes de eliminar la foto antigua
    if (fotoAlbum && fotoAlbumAntiguaUrl) {
      // Eliminar la foto antigua del álbum del sistema de archivos
      await fs.unlink(rutaCompletaFotoAlbum);
    }

    // Actualizar los campos del álbum (sin imágenes)
    await connection.execute(
      'UPDATE album_artista SET Id_artista = ?, Nombre_album = ?, Fecha_album = ? WHERE Id_album = ?',
      [Id_artista, Nombre_album, fechaFormateada, albumId]
    );

    // Actualizar la foto del álbum si existe
    if (fotoAlbum) {
      await actualizarImagen('Foto_album', fotoAlbum, albumId);
    }

    // Commit de la transacción
    await connection.commit(transaction);

    // Respuesta exitosa
    res.json({ mensaje: 'Álbum actualizado con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al actualizar el álbum' });
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

export default actualizarAlbum;
