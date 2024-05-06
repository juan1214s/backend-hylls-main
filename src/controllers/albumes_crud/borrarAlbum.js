import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Elimina un álbum de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const borrarAlbum = async (req, res) => {
  try {
    // Extraer el ID del parámetro de la URL
    const albumId = req.params.id;

    // Verificar si el álbum existe
    const [existingAlbum] = await connection.execute('SELECT * FROM album_artista WHERE Id_album = ?', [albumId]);
    if (existingAlbum.length === 0) {
      return res.status(404).json({ mensaje: 'Álbum no encontrado' });
    }

    // Obtener la ruta de la foto del álbum en el sistema de archivos
    const fotoAlbumUrl = existingAlbum[0].Foto_album;

    // Construir la ruta completa al archivo en la carpeta pública
    const rutaCompletaFotoAlbum = path.join('./public', fotoAlbumUrl);

    // Intentar eliminar la foto del álbum del sistema de archivos
    try {
      await fs.unlink(rutaCompletaFotoAlbum);
      console.log('Foto del álbum eliminada con éxito');
    } catch (error) {
      // Manejar el error de eliminación de la foto del álbum
      console.error('Error al eliminar la foto del álbum:', error);
    }

    // Borrar el álbum de la base de datos
    await connection.execute('DELETE FROM album_artista WHERE Id_album = ?', [albumId]);

    // Respuesta exitosa
    res.json({ mensaje: 'Álbum eliminado con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).json({ mensaje: 'Error al borrar el álbum' });
  }
};

export default borrarAlbum;
