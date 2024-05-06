import connection from "./../../config/db.js";

const obtenerUsuarioPorId = async (req, res) => {
  try {
    // Extraer el ID del usuario de los parámetros de la solicitud
    const { idUsuario } = req.params;

    // Consultar el usuario en la base de datos por ID
    const [usuario] = await connection.query('SELECT * FROM usuarios WHERE IdUsuarios = ?', [idUsuario]);

    // Verificar si el usuario existe
    if (usuario.length === 0) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
      return;
    }

    // Responder con el usuario encontrado
    res.json(usuario[0]);
  } catch (error) {
    console.error('Error de MySQL:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export default obtenerUsuarioPorId;
