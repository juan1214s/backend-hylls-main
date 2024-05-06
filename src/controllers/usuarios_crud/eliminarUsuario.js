import connection from "./../../config/db.js";

const eliminarUsuario = async (req, res) => {
  let transaction;

  try {
    // Extraer el ID del usuario a eliminar de los parámetros de la solicitud
    const { idUsuario } = req.params;

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el usuario existe antes de intentar eliminarlo
    const [existingUser] = await connection.execute(
      'SELECT * FROM usuarios WHERE IdUsuarios = ?',
      [idUsuario]
    );

    if (existingUser.length === 0) {
      res.status(404).json({ mensaje: 'El usuario no existe' });

      // En caso de que el usuario no exista, realizar un rollback de la transacción
      await connection.rollback(transaction);

      return;
    }

    // Eliminar el usuario de la base de datos
    await connection.execute(
      'DELETE FROM usuarios WHERE IdUsuarios = ?',
      [idUsuario]
    );

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
};

export default eliminarUsuario;
