// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Crea una nueva canción asociada a un álbum.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const crearCancion = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { Id_album, Cancion } = req.body;

    // Realizar la verificación y la inserción en una única consulta SQL
    const [result] = await connection.execute(
      'INSERT INTO canciones_artista (Id_album, Cancion) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM canciones_artista WHERE Id_album = ? AND Cancion = ?)',
      [Id_album, Cancion, Id_album, Cancion]
    );

    // Verificar si se insertó una fila (sin duplicados)
    if (result.affectedRows > 0) {
      res.json({ mensaje: 'Canción creada con éxito' });
    } else {
      res.status(400).json({ mensaje: 'La canción ya existe en este álbum' });
    }
  } catch (error) {
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default crearCancion;
