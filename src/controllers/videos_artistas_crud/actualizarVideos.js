import connection from "./../../config/db.js";

/**
 * Actualiza un video de artistas existente en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const actualizarVideos = async (req, res) => {
  const videoArtistasId = req.params.id;
  const { Id_artista, video_artista, video_artista_embed } = req.body;

  try {
    // Verificar si el nuevo enlace de video es válido
    if (!video_artista || video_artista === '') {
      return res.status(400).json({ mensaje: 'Por favor, proporcione un enlace de video válido.' });
    }

    // Verificar si el video existe
    const [existingVideo] = await connection.execute(`
      SELECT va.*, a.Nombre
      FROM video_artistas va
      INNER JOIN artista a ON va.Id_artista = a.Id_artista
      WHERE va.Id_video_artista = ?
    `, [videoArtistasId]);

    if (existingVideo.length === 0) {
      return res.status(404).json({ mensaje: 'Video no encontrado' });
    }

    const videoEnlaces = video_artista.split('watch?v=');
    const videoListo = videoEnlaces[1];

    // Verificar si ya existe un video con el nuevo enlace
    const [existingVideosWithNewLink] = await connection.execute(`
      SELECT * FROM video_artistas WHERE video_artista = ? AND Id_video_artista <> ?
    `, [videoListo, videoArtistasId]);

    // Si ya existe un video con el nuevo enlace, enviar mensaje de error
    if (existingVideosWithNewLink.length > 0) {
      return res.status(400).json({ mensaje: 'Ya existe un video con este enlace.' });
    }

    // Actualizar los campos de video (incluyendo video_artista_embed)
    await connection.execute(
      'UPDATE video_artistas SET Id_artista = ?, video_artista = ?, video_artista_embed = ? WHERE Id_video_artista = ?',
      [Id_artista, videoListo, video_artista_embed, videoArtistasId]
    );

    // Respuesta exitosa
    res.json({ mensaje: 'Video actualizado con éxito' });

  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default actualizarVideos;
