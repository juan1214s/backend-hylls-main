import connection from "./../../config/db.js";

/**
 * Obtiene los enlaces de video embed de un artista específico desde la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerVideoEmbed = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del artista de los parámetros de la solicitud
    console.log(req.params); // Mueve esta línea aquí para acceder a id correctamente

    // Consultar la base de datos para obtener los ultimos enlaces de video embed del artista específico
    const [videoEmbeds] = await connection.execute(
      'SELECT * FROM video_artistas WHERE Id_artista = ? ORDER BY Id_video_artista DESC LIMIT 1',
      [id]
    );

    // Verificar si se encontraron enlaces de video embed para el artista específico
    if (videoEmbeds.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron enlaces de video embed para el artista con el ID proporcionado.' });
    }

    // Devolver los enlaces de video embed del artista encontrado
    res.status(200).json(videoEmbeds);

  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default obtenerVideoEmbed;
