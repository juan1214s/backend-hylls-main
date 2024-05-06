// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Obtiene una noticia específica por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerNoticiaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    // Consultar la noticia por su ID en la base de datos
    const [noticia] = await connection.execute(
      "SELECT * FROM noticia WHERE Id_noticia = ?",
      [id]
    );

    // Verificar si la noticia existe
    if (noticia.length === 0) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    // Formatear la fecha
    const noticiaFormateada = {
      ...noticia[0],
      Fecha: new Date(noticia[0].Fecha).toLocaleDateString("es-ES"),
    };

    res.json(noticiaFormateada);
  } catch (error) {
    console.error("Error al obtener la noticia por ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default obtenerNoticiaPorId;
