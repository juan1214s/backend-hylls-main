// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Actualiza una canción existente en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const actualizarCancion = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const cancionId = req.params.id;
    const { Id_album, Cancion } = req.body;

    // Utilizar una tabla derivada para realizar la verificación y la actualización
    const [result] = await connection.execute(
      'UPDATE canciones_artista AS ca ' +
      'SET Id_album = ?, Cancion = ? ' +
      'WHERE Id_cancion = ? AND NOT EXISTS (' +
      '  SELECT 1 FROM (SELECT * FROM canciones_artista) AS temp ' +
      '  WHERE temp.Id_album = ? AND temp.Cancion = ? AND temp.Id_cancion != ?' +
      ')',
      [Id_album, Cancion, cancionId, Id_album, Cancion, cancionId]
    );

    // Verificar si se actualizó una fila (sin duplicados)
    if (result.affectedRows > 0) {
      res.json({ mensaje: 'Canción actualizada con éxito' });
    } else {
      res.status(400).json({ mensaje: 'No se pudo actualizar la canción, puede que ya exista una canción con el mismo nombre en este álbum' });
    }
  } catch (error) {
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default actualizarCancion;
