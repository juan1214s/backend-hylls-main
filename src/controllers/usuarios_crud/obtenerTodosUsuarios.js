// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";

/**
 * Obtiene todos los usuarios de la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const obtenerUsuarios = async (req, res) => {
  try {
    // Consultar todos los usuarios en la base de datos
    const results = await connection.query('SELECT * FROM usuarios');
    const usuarios = results[0];
    res.json(usuarios);
  } catch (error) {
    console.error("Error de MySQL:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export default obtenerUsuarios;
