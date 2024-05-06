import connection from "./../../config/db.js";


/**
 * Elimina un álbum de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerAlbumConArtista = async (req, res) => {
    try {
        const consulta = `
          SELECT album_artista.Id_album, artista.Nombre AS Nombre_artista, album_artista.Nombre_album, album_artista.Fecha_album, album_artista.Foto_album
          FROM album_artista
          LEFT JOIN artista ON album_artista.Id_artista = artista.Id_artista;
        `;
    
        const resultado = await connection.query(consulta);
        const albumsFormateados = resultado[0].map(album => {
          return {
              Id_album: album.Id_album,
              Nombre_artista: album.Nombre_artista,
              Nombre_album: album.Nombre_album,
              Fecha_album: new Date(album.Fecha_album).toLocaleDateString(),
              Foto_album: album.Foto_album
          };
      });

      res.json(albumsFormateados);
      } catch (error) {
        console.error("Error al obtener datos combinados:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
      }
};

export default obtenerAlbumConArtista;
