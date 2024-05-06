// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';

/**
 * Crea un nuevo artista y guarda las imágenes asociadas.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const crearArtista = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, biografia, facebook, twitter, instagram, youtube } = req.body;
    //evitar espacios extras alrededor
    const nombreNormalizado = nombre.trim();

    // Obtener las imágenes del formulario
    const fotos = req.files['foto'];
    const banners = req.files['banner'];
    const bannersMobil = req.files['bannerMobil'];

    //valida q el bannerMobil si contenga un archivo
    if (bannersMobil == null || undefined || false) {
      return console.error('El banner responsive para mobil es requerido')
    }

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el artista ya existe
    const existingArtist = await connection.execute(
      'SELECT * FROM artista WHERE Nombre = ?',
      [nombreNormalizado]
    );

    if (existingArtist[0].length > 0) {
      res.status(400).json({ mensaje: 'El artista ya existe' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar las imágenes guardadas en el servidor
      if (fotos && fotos.length > 0) {
        await fs.unlink(fotos[0].path);
      }

      if (banners && banners.length > 0) {
        await fs.unlink(banners[0].path);
      }

      if (bannersMobil && bannersMobil.length > 0) {//nuevo
        await fs.unlink(banners[0].path);
      }

      return;
    }

    // Insertar información básica del artista en la base de datos
    const [insertResult] = await connection.execute(
      'INSERT INTO artista (Nombre, biografia, facebook, twitter, instagram, youtube) VALUES (?, ?, ?, ?, ?, ?)',
      [nombreNormalizado, biografia, facebook, twitter, instagram, youtube]
    );

    const artistaId = insertResult.insertId;

    // Guardar las imágenes si existen
    if (fotos && fotos.length > 0) {
      await actualizarImagen('foto', fotos[0], artistaId);
    }

    if (banners && banners.length > 0) {
      await actualizarImagen('banner', banners[0], artistaId);
    }

    if (bannersMobil && bannersMobil.length > 0) {//nuevo
      await actualizarImagen('bannerMobil', bannersMobil[0], artistaId);
    }


    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Artista creado con éxito' });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).send('Internal Server Error');
  }
};


/**
 * Función para actualizar la imagen de un artista.
 * @param {string} tipo - Tipo de imagen ('foto' o 'banner').
 * @param {Object} imagen - Información de la imagen.
 * @param {number} artistaId - ID del artista.
 */
const actualizarImagen = async (tipo, imagen, artistaId) => {
  try {
    const archivoNombre = imagen.filename;
    const archivoUrl = `imagenes_artista/${archivoNombre}`;

    // Actualizar la entrada del artista con la URL de la imagen
    await connection.execute(
      `UPDATE artista SET ${tipo} = ? WHERE Id_artista = ?`,
      [archivoUrl, artistaId]
    );

  } catch (error) {
    console.error(`Error al actualizar la ${tipo} del artista:`, error);
    // Si hay un error, eliminar la imagen guardada en el servidor
    await fs.unlink(imagen.path);
    throw error;
  }
};

export default crearArtista;
