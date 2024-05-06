import connection from "./../../config/db.js";
import bcrypt from 'bcrypt';

const crearUsuario = async (req, res) => {
  let transaction;

  try {
    // Extraer datos del cuerpo de la solicitud
    const { Rol, Clave, Usuario, Nombre } = req.body;

    // Iniciar la transacción
    transaction = await connection.beginTransaction();

    // Verificar si el usuario ya existe por correo electrónico
    const [existingUser] = await connection.execute(
      'SELECT * FROM usuarios WHERE TRIM(LOWER(Usuario)) = TRIM(LOWER(?))',
      [Usuario]
    );

    if (existingUser.length > 0) {
      res.status(400).json({ mensaje: 'El usuario ya existe' });

      // En caso de duplicado, realizar un rollback de la transacción
      await connection.rollback(transaction);

      return;
    }

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(Clave, 10);

    // Crear el usuario en la base de datos con la contraseña hasheada
    await connection.execute(
      'INSERT INTO usuarios (Rol, Clave, Usuario, Nombre) VALUES (?, ?, ?, ?)',
      [Rol, hashedPassword, Usuario, Nombre]
    );

    // Commit de la transacción
    await connection.commit(transaction);

    res.json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    console.error('Error mysql:', error);

    // Si hay un error, realizar un rollback de la transacción
    if (transaction) {
      await connection.rollback(transaction);
    }

    // Responder con un mensaje de error
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
};

export default crearUsuario;
