import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

const borrarVideoHero = async (req, res) => {
  try {
    // Obtener el ID del video de los parámetros de la solicitud
    const videoId = req.params.id;

    // Verificar si el video existe
    const [existeVideo] = await connection.execute('SELECT * FROM videos_musicales WHERE Id_video = ?', [videoId]);
    if (existeVideo.length === 0) {
      return res.status(404).json({ mensaje: 'Video no encontrado' });
    }

    // Obtener la ruta del video en el sistema de archivos
    const videoUrl = existeVideo[0].video;

    // Construir la ruta completa al video en la carpeta pública
    const rutaCompletaVideo = path.join('./public', videoUrl);

    // Eliminar el video del sistema de archivos
    await fs.unlink(rutaCompletaVideo);

    // Eliminar el video de la base de datos
    await connection.execute('DELETE FROM videos_musicales WHERE Id_video = ?', [videoId]);

    // Responder con un mensaje de éxito
    res.json({ mensaje: "Video eliminado correctamente" });

  } catch (error) {
    // Manejar errores y responder con un mensaje de error
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el video' });
  }
};

export default borrarVideoHero;
