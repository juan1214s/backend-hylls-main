// crearVideo.js
import connection from "./../../config/db.js";

/**
 * Crea un nuevo video de artista en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const crearVideo = async (req, res) => {
  const { Id_artista, video_artista, video_artista_embed } = req.body;


  try {
    // Verificar si el enlace proporcionado es válido
    if (!video_artista) {
      return res.status(400).json({ mensaje: 'Por favor, proporcione un enlace de video.' });
    }

    const videoEnlaces = video_artista.split('watch?v=');
    const videoListo = videoEnlaces[1];

    // Verificar si ya existe un video con la misma URL
    const [existingVideos] = await connection.execute(
      'SELECT * FROM video_artistas WHERE video_artista = ?',
      [videoListo]
    );

    // Si ya existe un video con la misma URL, enviar mensaje de error
    if (existingVideos.length > 0) {
      return res.status(400).json({ mensaje: 'El video ya existe.' });
    }

    // Insertar el nuevo video en la base de datos
    await connection.execute(
      'INSERT INTO video_artistas (Id_artista, video_artista, video_artista_embed) VALUES (?, ?, ?)',
      [Id_artista, videoListo, video_artista_embed]
    );

    res.status(200).json({ mensaje: 'Video creado exitosamente' });

  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default crearVideo;
