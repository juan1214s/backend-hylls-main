// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";


/**
 * Obtiene todas las noticias almacenadas en la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerNoticia = async (req, res) => {
  try {
    // Consultar todas las noticias en la base de datos
    const [rows] = await connection.execute("SELECT * FROM noticia");

    const noticiasFormateadas = rows.map(noticia => {
      return {
        Id_noticia: noticia.Id_noticia,
        Imagen: noticia.Imagen,
        Titulo: noticia.Titulo,
        Descripcion_corta: noticia.Descripcion_corta,
        Descripcion_larga: noticia.Descripcion_larga,
        Fecha: new Date(noticia.Fecha).toLocaleDateString('es-ES')
      }
    });

    res.json(noticiasFormateadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export default obtenerNoticia;
