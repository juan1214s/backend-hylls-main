// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';

/**
 * Crea una nueva noticia con la opción de adjuntar imágenes.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const crearNoticia = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud
    const { Titulo, Descripcion_corta, Descripcion_larga, Fecha } = req.body;
    const Imagenes = req.files["Imagen"];
    const tituloFormateado = Titulo.trim();

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si la noticia ya existe por el título
    const existingNoticia = await connection.execute(
      'SELECT * FROM noticia WHERE TRIM(LOWER(Titulo)) = TRIM(LOWER(?))',
      [tituloFormateado]
    );

    if (existingNoticia[0].length > 0) {
      res.status(400).json({ mensaje: 'La noticia ya existe' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      // Eliminar las imágenes guardadas en el servidor
      if (Imagenes && Imagenes.length > 0) {
        await eliminarImagenes(Imagenes);
      }

      return;
    }

    // Crear la noticia sin las imágenes primero
    const [insertResult] = await connection.execute(
      "INSERT INTO noticia (Titulo, Imagen, Descripcion_corta, Descripcion_larga, Fecha) VALUES (?, ?, ?, ?, ?)",
      [Titulo, Imagenes ? Imagenes[0].filename : null, Descripcion_corta, Descripcion_larga, Fecha]
    );

    // Insertar los datos del formulario en la base de datos
    const Id_noticia = insertResult.insertId;

    // Guardar las imágenes si existen
    if (Imagenes && Imagenes.length > 0) {
      await actualizarImagen('Imagen', Imagenes[0], Id_noticia);
    }

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: "Noticia creada con éxito" });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al crear la noticia, revisa los campos' });
  }
};

/**
 * Función para actualizar la imagen de una noticia.
 * @param {string} tipo - Tipo de imagen ('Imagen').
 * @param {Object} imagen - Información de la imagen.
 * @param {number} noticiaId - ID de la noticia.
 */
const actualizarImagen = async (tipo, imagen, noticiaId) => {
  try {
    const archivoNombre = imagen.filename;
    const archivoUrl = `imagenes_noticia/${archivoNombre}`;

    // Actualizar la entrada de la noticia con la URL de la imagen
    await connection.execute(
      `UPDATE noticia SET ${tipo} = ? WHERE Id_noticia = ?`,
      [archivoUrl, noticiaId]
    );

    console.log(`Ruta de la nueva ${tipo}:`, archivoUrl);
  } catch (error) {
    console.error(`Error al actualizar la ${tipo} de la noticia:`, error);
    // Si hay un error, eliminar la imagen guardada en el servidor
    await eliminarImagenes([imagen]);
    throw error;
  }
};

/**
 * Elimina las imágenes especificadas del sistema de archivos.
 * @param {Array} imagenes - Información de las imágenes.
 */
const eliminarImagenes = async (imagenes) => {
  try {
    for (const imagen of imagenes) {
      await fs.unlink(imagen.path);
      console.log('Imagen eliminada:', imagen.path);
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
};

export default crearNoticia;
