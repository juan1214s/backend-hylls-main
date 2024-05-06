import connection from "./../../config/db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const usersValidation = async (req, res) => {
  try {
    console.log("Llegaaaaa");
    const { usuario, clave } = req.body; 
    
    const results = await connection.query('SELECT * FROM usuarios WHERE Usuario = ? AND Clave = ?', [usuario, clave]);

    const rows = results[0];

    if (rows.length > 0) {
      // Usuario válido
      const usuarioValidado = {
        idUsuarios: rows[0].idUsuarios,
        Rol: rows[0].Rol,
        Usuario: rows[0].Usuario,
        Nombre: rows[0].Nombre,  
      };

      const token  = jwt.sign(usuarioValidado, process.env.PASS_JWT);
      
      res.status(200).json({
        usuario: usuarioValidado,
        token: token
      });

      console.log("terminó usuarios");
      
    } else {
      // Usuario no encontrado o contraseña incorrecta
      res.status(401).json({ mensaje: 'Usuario no válido' });
    }
  } catch (error) {
    console.error("Error de MySQL:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export default usersValidation;
