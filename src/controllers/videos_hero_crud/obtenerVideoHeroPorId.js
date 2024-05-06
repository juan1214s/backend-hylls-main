import connection from './../../config/db.js';

const obtenerVideoHeroPorId = async (req, res) => {
  try {
    // Obtener el ID del video desde los parámetros de la solicitud
    const { id } = req.params;

    // Consultar la base de datos para obtener el video por ID
    const [rows] = await connection.execute(
      'SELECT * FROM videos_musicales WHERE Id_video = ?',
      [id]
    );

    // Verificar si se encontró el video
    if (rows.length > 0) {
      const video = rows[0];
      res.status(200).json({ video });
    } else {
      res.status(404).json({ mensaje: 'Video no encontrado' });
    }
  } catch (error) {
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default obtenerVideoHeroPorId;
