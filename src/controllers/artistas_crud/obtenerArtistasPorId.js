// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";


/**
 * Obtiene un artista específico por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerArtistaPorId = async (req, res) => {
  try {
    // Extraer el ID del parámetro de la URL
    const { id } = req.params;

    // Consultar el artista por su ID en la base de datos
    const [artista] = await connection.execute('SELECT * FROM artista WHERE Id_artista = ?', [id]);

    // Verificar si el artista existe
    if (artista.length === 0) {
      return res.status(404).json({ mensaje: 'Artista no encontrado' });
    }

    res.json(artista[0]);
  } catch (error) {
    console.error('Error al obtener el artista por ID:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default obtenerArtistaPorId;
