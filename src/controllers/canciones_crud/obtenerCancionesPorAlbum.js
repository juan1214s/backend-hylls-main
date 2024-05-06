import connection from "./../../config/db.js";

const obtenerCancionesPorAlbum = async (req, res) => {
  try {
    const albumId = req.params.albumId;
   
    if (albumId === undefined) {
      return res.status(400).json({ mensaje: 'ID de álbum no proporcionado' });
    }

    const [existingAlbum] = await connection.execute('SELECT * FROM album_artista WHERE Id_album = ?', [albumId]);
    if (existingAlbum.length === 0) {
      return res.status(404).json({ mensaje: 'Álbum no encontrado' });
    }

    const consulta = 'SELECT Id_cancion, Id_album, Cancion FROM canciones_artista WHERE Id_album = ?';
    const [resultado] = await connection.execute(consulta, [albumId]);

    res.json(resultado);
  } catch (error) {
    console.error('Error mysql:', error);
    res.status(500).json({ mensaje: 'Error al obtener las canciones del álbum' });
  }
};

export default obtenerCancionesPorAlbum;
