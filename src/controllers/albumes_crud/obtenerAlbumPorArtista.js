import connection from "./../../config/db.js";

/**
 * Obtiene los álbumes de un artista por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerAlbumesPorArtista = async (req, res) => {

    try {
      // Extraer el ID del parámetro de la URL
      const { idArtista } = req.params;
  
      // Consultar el álbum por su ID en la base de datos
      const [album] = await connection.execute('SELECT * FROM album_artista WHERE Id_artista = ?', [idArtista]);
  
      // Verificar si el álbum existe
      if (album.length === 0) {
        return res.status(404).json({ mensaje: 'Álbum no encontrado' });
      }
  
      res.json(album[0]);
    } catch (error) {
      console.error('Error mysql:', error);
      res.status(500).json({ mensaje: 'Error al obtener el álbum por ID' });
    } 
}

export default obtenerAlbumesPorArtista;
