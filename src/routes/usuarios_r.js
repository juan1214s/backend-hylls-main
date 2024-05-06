import express from 'express';
import usersValidation from "./../controllers/usuarios_crud/obtenerusuarios.js";
import obtenerUsuarios from './../controllers/usuarios_crud/obtenerTodosUsuarios.js';
import crearUsuario from './../controllers/usuarios_crud/crearUsuario.js';
import eliminarUsuario from './../controllers/usuarios_crud/eliminarUsuario.js';
import obtenerUsuarioPorId from './../controllers/usuarios_crud/obtenerUsuario.js';
import actualizarUsuario from './../controllers/usuarios_crud/actualizarUsuario.js';


//proteger rutas de usuarios que no sean superadmins
import checkUserRole from './../config/middleware/checkUserRole.js';

const router = express.Router();

router.post('/validation', usersValidation)

//crud
router.get('/obtenerTodosUsuarios', checkUserRole('superadmin'), obtenerUsuarios);
router.get('/obtenerUsuario/:idUsuario', checkUserRole('superadmin'), obtenerUsuarioPorId);
router.post('/crearUsuario', checkUserRole('superadmin'), crearUsuario)
router.delete('/borrarUsuario/:idUsuario', checkUserRole('superadmin'), eliminarUsuario);
router.put('/actualizarUsuario/:idUsuario', checkUserRole('superadmin'), actualizarUsuario)

export default router