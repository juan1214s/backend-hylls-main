// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises'; // Importa la biblioteca 'fs' para operaciones de sistema de archivos
import path from 'path'; // Importa la biblioteca 'path' para manipulación de rutas de archivos

/**
 * Actualiza un artista existente en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const actualizarArtista = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud y del archivo
    const artistaId = req.params.id;
    const { Nombre, biografia, facebook, twitter, instagram, youtube } = req.body;
    const fotos = req.files['foto'];
    const banners = req.files['banner'];

    // Crear un objeto con los campos a actualizar
    const updateFields = {
      Nombre,
      biografia,
      facebook,
      twitter,
      instagram,
      youtube,
    };

    // Filtrar los campos undefined
    const filteredFields = Object.fromEntries(
      Object.entries(updateFields).filter(([_,value]) => value !== undefined)
    );

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el nuevo nombre ya está asociado a otro artista
    const existingArtist = await connection.execute(
      'SELECT * FROM artista WHERE Nombre = ? AND Id_artista <> ?',
      [filteredFields.Nombre, artistaId]
    );

    if (existingArtist[0].length > 0) {
      res.status(400).json({ mensaje: 'El nuevo nombre ya está asociado a otro artista' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar las imágenes guardadas en el servidor
      if (fotos && fotos.length > 0) {
        await fs.unlink(fotos[0].path);
      }

      if (banners && banners.length > 0) {
        await fs.unlink(banners[0].path);
      }

      return;
    }

    // Construir la consulta SQL dinámicamente
    const updateQuery = 'UPDATE artista SET ' +
      Object.keys(filteredFields).map(field => `${field} = ?`).join(', ') +
      ' WHERE Id_artista = ?';

    // Construir el array de valores para la consulta SQL
    const updateValues = [...Object.values(filteredFields), artistaId];

    // Actualizar los campos del artista (sin imágenes)
    await connection.execute(updateQuery, updateValues);

    console.log('Consulta SQL para la actualización:', updateQuery);
    console.log('Valores para la actualización:', updateValues);

    // Actualizar la foto si existe
    if (fotos && fotos.length > 0) {
      // Obtener la ruta de la foto antigua del artista en el sistema de archivos
      const [existingArtist] = await connection.execute('SELECT * FROM artista WHERE Id_artista = ?', [artistaId]);
      const fotoAntiguaUrl = existingArtist[0].foto;

      // Construir la ruta completa al archivo antiguo en la carpeta pública
      const rutaCompletaFotoAntigua = path.join('./public', fotoAntiguaUrl);

      // Eliminar la foto antigua del artista del sistema de archivos
      await fs.unlink(rutaCompletaFotoAntigua);

      // Guardar la nueva foto en el sistema de archivos
      const archivoNombre = fotos[0].filename;
      const archivoUrl = `imagenes_artista/${archivoNombre}`;

      // Actualizar la entrada del artista con la URL de la foto
      await connection.execute(
        'UPDATE artista SET foto = ? WHERE Id_artista = ?',
        [archivoUrl, artistaId]
      );

    }

    // Actualizar el banner si existe
    if (banners && banners.length > 0) {
      // Obtener la ruta del banner antiguo del artista en el sistema de archivos
      const [existingArtist] = await connection.execute('SELECT * FROM artista WHERE Id_artista = ?', [artistaId]);
      const bannerAntiguoUrl = existingArtist[0].banner;

      // Construir la ruta completa al archivo antiguo en la carpeta pública
      const rutaCompletaBannerAntiguo = path.join('./public', bannerAntiguoUrl);

      // Eliminar el banner antiguo del artista del sistema de archivos
      await fs.unlink(rutaCompletaBannerAntiguo);

      // Guardar el nuevo banner en el sistema de archivos
      const archivoNombre = banners[0].filename;
      const archivoUrl = `imagenes_artista/${archivoNombre}`;

      // Actualizar la entrada del artista con la URL del banner
      await connection.execute(
        'UPDATE artista SET banner = ? WHERE Id_artista = ?',
        [archivoUrl, artistaId]
      );

    }

    // Commit de la transacción
    await connection.commit(transaction);

    // Respuesta exitosa
    res.json({ mensaje: 'Artista actualizado con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    res.status(500).send('Internal Server Error');
  }
};

export default actualizarArtista;
