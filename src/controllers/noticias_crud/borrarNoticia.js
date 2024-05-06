import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Elimina una noticia de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const borrarNoticia = async (req, res) => {
  const noticiaId = req.params.id;

  try {
    // Obtener la información de la noticia antes de borrarla
    const [existingNoticia] = await connection.execute('SELECT * FROM noticia WHERE Id_Noticia = ?', [noticiaId]);

    // Verificar si la noticia existe
    if (existingNoticia.length === 0) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }

    // Obtener la ruta de la imagen asociada a la noticia
    const imagenUrl = existingNoticia[0].Imagen;

    // Construir la ruta completa al archivo en la carpeta pública
    const rutaCompletaImagen = path.join('./public', imagenUrl);

    // Intentar eliminar la imagen del sistema de archivos si existe
    try {
      await fs.unlink(rutaCompletaImagen);
      console.log('Imagen de noticia eliminada con éxito');
    } catch (error) {
      // Manejar el error de eliminación de la imagen de noticia
      console.error('Error al eliminar imagen de noticia:', error);
    }

    // Borrar la noticia de la base de datos
    await connection.execute('DELETE FROM noticia WHERE Id_Noticia = ?', [noticiaId]);

    // Respuesta exitosa
    res.json({ mensaje: 'Noticia eliminada con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default borrarNoticia;
