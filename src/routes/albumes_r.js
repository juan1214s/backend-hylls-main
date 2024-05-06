// Importa el módulo 'express' para el manejo de rutas
import express from 'express';

// Importa el middleware de multer para la carga de archivos
import { uploadAlbum } from './../config/multer.js';

// Importa las funciones controladoras para las operaciones CRUD de álbumes
import crearAlbum from './../controllers/albumes_crud/crearAlbum.js';
import actualizarAlbum from './../controllers/albumes_crud/actualizarAlbum.js';
import obtenerAlbumPorId from './../controllers/albumes_crud/obtenerAlbumPorId.js';
import obtenerAlbumConArtista from './../controllers/albumes_crud/albumesConArtistas.js';
import obtenerAlbumesPorArtista from './../controllers/albumes_crud/obtenerAlbumPorArtista.js';
import borrarAlbum from './../controllers/albumes_crud/borrarAlbum.js';
import checkUserRole from '../config/middleware/checkUserRole.js';
import obtenerAlbumesRelacionados from './../controllers/albumes_crud/albumesRelacionados.js';



// Crea una instancia del enrutador de express
const router = express.Router();

// Rutas CRUD para álbumes
router.get('/obtenerAlbumes', obtenerAlbumConArtista); //obtiene toda la info del album + el nombre del artista
router.post('/crearAlbum', checkUserRole('superadmin', 'admin'), uploadAlbum.single('foto_album'), crearAlbum);
router.get('/obtenerAlbum/:id', obtenerAlbumPorId);
router.get('/obtenerAlbumPorArtista/:idArtista', obtenerAlbumesPorArtista);
router.delete('/borrarAlbum/:id', checkUserRole('superadmin'), borrarAlbum);
router.put('/actualizarAlbum/:id', checkUserRole('superadmin', 'admin'), uploadAlbum.single('foto_album'), actualizarAlbum);
router.get('/obtenerAlbumeRelacionados/:idArtista', obtenerAlbumesRelacionados);

// Exporta el enrutador configurado con las rutas definidas
export default router;
