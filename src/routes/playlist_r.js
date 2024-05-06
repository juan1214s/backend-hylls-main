// Importa el módulo 'express' para manejar las rutas
import express from 'express';

// Importa el middleware de multer para la carga de playlists
import { uploadPlaylist } from './../config/multer.js';

// Importa los controladores para las operaciones CRUD de playlists
import crearPlaylist from './../controllers/playlist_crud/crearPlaylist.js';
import obtenerPlaylists from './../controllers/playlist_crud/obtenerPlaylists.js';
import obtenerPlaylistPorId from './../controllers/playlist_crud/obtenerPlaylistPorId.js';
import obtenerPlaylistsTipo from './../controllers/playlist_crud/obtenerPlaylistTipo.js';
import actualizarPlaylist from './../controllers/playlist_crud/actualizarPlaylist.js';
import eliminarPlaylist from './../controllers/playlist_crud/eliminarPlaylist.js';
import checkUserRole from './../config/middleware/checkUserRole.js';

// Crea un objeto Router de Express
const router = express.Router();

// Rutas para las operaciones CRUD de playlists

// Ruta para crear una nueva playlist
router.post('/crearPlaylist', checkUserRole('superadmin', 'admin'), uploadPlaylist.single('foto_playlist'), crearPlaylist);

// Ruta para obtener todas las playlists
router.get('/obtenerPlaylists', obtenerPlaylists);

// Ruta para obtener una playlist por su ID
router.get('/obtenerPlaylist/:id', obtenerPlaylistPorId);

// Ruta para obtener playlists según un tipo específico
router.get('/obtenerPlaylistsTipo', obtenerPlaylistsTipo);

// Ruta para actualizar una playlist por su ID
router.put('/actualizarPlaylist/:id', checkUserRole('superadmin', 'admin'), uploadPlaylist.single('foto_playlist'), actualizarPlaylist);

// Ruta para eliminar una playlist por su ID
router.delete('/eliminarPlaylist/:id', checkUserRole('superadmin'), eliminarPlaylist);

// Exporta el objeto Router configurado con las rutas de playlists
export default router;
