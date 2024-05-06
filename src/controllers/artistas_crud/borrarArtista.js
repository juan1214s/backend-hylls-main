import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Elimina un artista de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const borrarArtista = async (req, res) => {
  try {
    const artistaId = req.params.id;

    const [existingArtist] = await connection.execute('SELECT * FROM artista WHERE Id_artista = ?', [artistaId]);

    if (existingArtist.length === 0) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    // Eliminar las fotos y banners del artista del sistema de archivos
    if (existingArtist[0].foto) {
      const fotoUrl = existingArtist[0].foto;
      const rutaCompletaFoto = path.join('./public', fotoUrl);

      try {
        await fs.unlink(rutaCompletaFoto);
        console.log('Imagen de foto eliminada con éxito');
      } catch (error) {
        // Manejar el error de eliminación de la imagen de foto
        console.error('Error al eliminar imagen de foto:', error);
      }
    }

    if (existingArtist[0].banner) {
      const bannerUrl = existingArtist[0].banner;
      const rutaCompletaBanner = path.join('./public', bannerUrl);

      try {
        await fs.unlink(rutaCompletaBanner);
        console.log('Imagen de banner eliminada con éxito');
      } catch (error) {
        // Manejar el error de eliminación de la imagen de banner
        console.error('Error al eliminar imagen de banner:', error);
      }
    }

    // Borrar el artista de la base de datos
    await connection.execute('DELETE FROM artista WHERE Id_artista = ?', [artistaId]);

    // Respuesta exitosa
    res.json({ mensaje: 'Artista eliminado con éxito' });
  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error("Error mysql:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default borrarArtista;
