// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs';

/**
 * Crea un nuevo video en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto JSON con un mensaje de éxito o un mensaje de error.
 */
const crearVideosHero = async (req, res) => {
  try {
    // Obtener el título y el archivo de video del cuerpo de la solicitud
    const { titulo } = req.body;
    const videos = req.files['video'][0];

    // Verificar si se proporciona un archivo de video
    if (videos) {
      const videoNombre = videos.filename;
      const archivoUrl = `videos_musicales/${videoNombre}`;

      // Verificar si ya existe un video con el mismo título
      const [existingVideosWithTitle] = await connection.execute(
        'SELECT * FROM videos_musicales WHERE titulo = ?',
        [titulo]
      );

      // Si ya existe un video con el mismo título, enviar mensaje de error
      if (existingVideosWithTitle.length > 0) {
        // Eliminar el archivo de video que se subió (para evitar almacenamiento innecesario)
        console.log('Eliminando archivo de video debido a la duplicidad de título:', archivoUrl);
        fs.unlinkSync(`./public/${archivoUrl}`);

        return res.status(400).json({ mensaje: 'Ya existe un video con este título.' });
      }

      // Insertar el nuevo video en la base de datos
      await connection.execute(
        'INSERT INTO videos_musicales (video, titulo) VALUES (?, ?)',
        [archivoUrl, titulo]
      );

      // Imprimir la ruta del nuevo video
      console.log('Ruta del video:', archivoUrl);

      // Responder con un mensaje de éxito
      res.json({ mensaje: 'Video creado correctamente' });
    } else {
      // Manejar el caso en que no se proporciona un archivo de video
      console.log('No se proporcionó ningún archivo de video');
      res.status(400).json({ mensaje: 'No se proporcionó ningún archivo de video' });
    }
  } catch (error) {
    // Manejar errores y responder con un mensaje de error
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default crearVideosHero;
