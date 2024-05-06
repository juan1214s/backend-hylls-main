import connection from "./../../config/db.js";
import fs from 'fs/promises';

const actualizarVideo = async (req, res) => {
  try {
    // Obtener el ID del video y el título del cuerpo de la solicitud
    const { id } = req.params;
    const { titulo } = req.body;
    const videos = req.files['video'];

    // Verificar si se proporciona un archivo de video o un título
    if (videos && videos.length > 0) {
      // Obtener la información del video existente para obtener su ruta
      const [existingVideo] = await connection.execute('SELECT * FROM videos_musicales WHERE Id_video = ?', [id]);

      // Manejar el caso en que el video no se encuentra en la base de datos
      if (existingVideo.length === 0) {
        console.log('Video no encontrado en la base de datos');
        return res.status(404).json({ mensaje: 'Video no encontrado en la base de datos' });
      }

      // Obtener la ruta del video antiguo y eliminarlo del sistema de archivos
      const videoAntiguoUrl = existingVideo[0].video;
      await fs.unlink(`./public/${videoAntiguoUrl}`);

      // Guardar el nuevo video en el sistema de archivos
      const videoNombre = videos[0].filename;
      const nuevoArchivoUrl = `videos_musicales/${videoNombre}`;

      // Verificar si ya existe un video con el mismo título
      const [existingVideosWithTitle] = await connection.execute(
        'SELECT * FROM videos_musicales WHERE titulo = ? AND Id_video <> ?',
        [titulo, id]
      );

      // Si ya existe un video con el mismo título, enviar mensaje de error
      if (existingVideosWithTitle.length > 0) {
        // Eliminar el archivo de video que se subió (para evitar almacenamiento innecesario)
        await fs.unlink(`./public/${nuevoArchivoUrl}`);
        return res.status(400).json({ mensaje: 'Ya existe un video con este título.' });
      }

      // Actualizar la base de datos con la nueva información del video
      await connection.execute(
        'UPDATE videos_musicales SET video = ?, titulo = ? WHERE Id_video = ?',
        [nuevoArchivoUrl, titulo, id]
      );

      console.log('Video actualizado. Ruta del nuevo video:', nuevoArchivoUrl);
      res.json({ mensaje: 'Video actualizado con éxito' });
    } else if (titulo) {
      // Si no se proporciona un archivo de video pero se proporciona un título,
      // actualizar solo el título en la base de datos

      // Verificar si ya existe un video con el mismo título
      const [existingVideosWithTitle] = await connection.execute(
        'SELECT * FROM videos_musicales WHERE titulo = ? AND Id_video <> ?',
        [titulo, id]
      );

      // Si ya existe un video con el mismo título, enviar mensaje de error
      if (existingVideosWithTitle.length > 0) {
        return res.status(400).json({ mensaje: 'Ya existe un video con este título.' });
      }

      await connection.execute(
        'UPDATE videos_musicales SET titulo = ? WHERE Id_video = ?',
        [titulo, id]
      );

      console.log('Video actualizado solo con el título');
      res.json({ mensaje: 'Video actualizado con éxito' });
    } else {
      console.log('No se proporcionó ningún campo para actualizar');
      res.status(400).json({ mensaje: 'No se proporcionó ningún campo para actualizar' });
    }
  } catch (error) {
    console.error('Error en la actualización del video:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el video' });
  }
};

export default actualizarVideo;
