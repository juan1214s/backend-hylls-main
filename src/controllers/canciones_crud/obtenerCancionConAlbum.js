// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Obtén todas las canciones con detalles de álbum y artista, incluso aquellas sin álbum asociado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerCancionConAlbum = async (req, res) => {
  try {
    const consulta = `
      SELECT ca.Id_cancion, ca.Id_album, ca.Cancion, aa.Nombre_album 
      FROM canciones_artista ca 
      LEFT JOIN album_artista aa ON ca.Id_album = aa.Id_album;
    `;
    const resultado = await connection.query(consulta);
    res.json(resultado[0]);
  } catch (error) {
    console.error("Error al obtener canciones con detalles de álbum y artista:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export default obtenerCancionConAlbum;
