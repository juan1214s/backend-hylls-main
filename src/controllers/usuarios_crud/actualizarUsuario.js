import bcrypt from 'bcrypt';
import connection from "./../../config/db.js";

const actualizarUsuario = async (req, res) => {
  let transaction;

  try {
    // Extraer el ID del usuario de los parámetros de la solicitud
    const { idUsuario } = req.params;

    // Extraer los datos actualizados del cuerpo de la solicitud
    const { Rol, Clave, Usuario, Nombre } = req.body;

    // Verificar si el nuevo email ya existe para otro usuario
    const [existingUserWithEmail] = await connection.execute(
      'SELECT * FROM usuarios WHERE Usuario = ? AND IdUsuarios != ?',
      [Usuario, idUsuario]
    );

    if (existingUserWithEmail.length > 0) {
      res.status(400).json({ mensaje: 'Ya existe un usuario con ese email' });
      return;
    }

    // Hashear el nuevo password antes de almacenarlo en la base de datos
    const hashedPassword = await bcrypt.hash(Clave, 10);

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Actualizar el usuario en la base de datos con el password hasheado
    await connection.execute(
      'UPDATE usuarios SET Rol = ?, Clave = ?, Usuario = ?, Nombre = ? WHERE IdUsuarios = ?',
      [Rol, hashedPassword, Usuario, Nombre, idUsuario]
    );

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error de MySQL:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};

export default actualizarUsuario;
