import jwt from 'jsonwebtoken';
import connection from "./../../config/db.js";

const checkUserRole = (requiredRole, requiredRole2) => {
  return async (req, res, next) => {
    const authorization = req.get('authorization');
    let token = null;

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      token = authorization.substring(7);
    }


    try {
      if (!requiredRole) {
        return next();
      }



      if (!token) {
        console.log('Token not valid');
        return res.status(401).json({ error: 'Token missing or invalid' });
      }

      console.log('Received Token:', token);


      const decodedToken = jwt.verify(token, process.env.PASS_JWT);
      console.log('Decoded Token:', decodedToken);

      const { Usuario, Rol } = decodedToken;

      console.log('User ID:', Usuario);
      console.log('User Role:', Rol);

      // Verificar si el usuario existe en la base de datos y tiene el rol requerido
      const [user] = await connection.execute('SELECT * FROM usuarios WHERE Usuario = ?', [Usuario]);

      if (!user || user.length === 0 || (user[0].Rol !== requiredRole && user[0].Rol !== requiredRole2)) {
        console.log('User not found or does not have the required role');
        return res.status(403).json({ mensaje: 'Acceso denegado. No tienes permisos para realizar esta acción.' });
      }

      req.user = Usuario;
      req.Rol = Rol;

      next();
    } catch (error) {
      console.error('Error verifying JWT:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

export default checkUserRole;
