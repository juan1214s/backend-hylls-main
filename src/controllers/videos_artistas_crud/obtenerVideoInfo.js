import axios from 'axios';

const ObtenerVideoInfo = async (req, res) => {
  try {
    const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const API_KEY = process.env.YT_KEY;

    // Obtén la URL del video de la consulta
    const videoUrl = req.query.url;

    // Haz una solicitud a la API de YouTube para obtener información del video
    const response = await axios.get(`${youtubeApiUrl}?id=${videoUrl}&part=snippet&key=${API_KEY}`);
    
    if (response.data.items && response.data.items.length > 0) {
      const videoInfo = response.data.items[0].snippet;

      // Usa la miniatura de alta calidad si está disponible, de lo contrario, usa la predeterminada
      const thumbnailUrl = videoInfo.thumbnails.high ? videoInfo.thumbnails.high.url : videoInfo.thumbnails.default.url;

      res.json({
        title: videoInfo.title,
        publishDate: videoInfo.publishedAt,
        thumbnail: thumbnailUrl,
      });
    } else {
      res.status(404).json({ mensaje: 'Video no encontrado' });

    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener información del video');
  }
};

export default ObtenerVideoInfo;