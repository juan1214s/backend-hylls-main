// Importa el módulo 'express' para el manejo de rutas
import express from 'express';

// Importa las funciones controladoras para las operaciones CRUD de canciones
import crearCancion from './../controllers/canciones_crud/crearCancion.js';
import borrarCancion from './../controllers/canciones_crud/borrarCancion.js';
import obtenerCancionPorId from './../controllers/canciones_crud/obtenerCancionPorId.js';
import obtenerCancionConAlbum from './../controllers/canciones_crud/obtenerCancionConAlbum.js';
import obtenerCancionesPorAlbum from './../controllers/canciones_crud/obtenerCancionesPorAlbum.js';
import actualizarCancion from './../controllers/canciones_crud/actualizarCancion.js';
import checkUserRole from './../config/middleware/checkUserRole.js';

// Crea una instancia del enrutador de express
const router = express.Router();

// Rutas CRUD para canciones
router.post('/crearCancion', checkUserRole('superadmin', 'admin'), crearCancion);
router.get('/obtenerCanciones', obtenerCancionConAlbum);//obtiene toda la info de la cancion + el nombre del album
router.get('/obtenerCancion/:id', obtenerCancionPorId);
router.get('/obtenerCancionesPorAlbum/:albumId', obtenerCancionesPorAlbum);
router.put('/actualizarCancion/:id', checkUserRole('superadmin', 'admin'), actualizarCancion);
router.delete('/borrarCancion/:id', checkUserRole('superadmin'), borrarCancion);

// Exporta el enrutador configurado con las rutas definidas
export default router;
