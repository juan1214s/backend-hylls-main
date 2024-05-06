// Importa el módulo 'express' para manejar las rutas
import express from 'express';
// Importa el middleware de multer para la carga de videos
import { uploadVideo } from './../config/multer.js';
// Importa el controlador para las operaciones CRUD de videos
import crearVideosHero  from './../controllers/videos_hero_crud/crearVideoHero.js';
import obtenerVideosHero from './../controllers/videos_hero_crud/obtenerVideosHero.js';
import borrarVideoHero from './../controllers/videos_hero_crud/borrarVideoHero.js';
import actualizarVideosHero from './../controllers/videos_hero_crud/actualizarVideosHero.js';
import obtenerVideoHeroPorId from './../controllers/videos_hero_crud/obtenerVideoHeroPorId.js';
import VidmulterFile from './../config/multer-configs/multer-videos.js';
import checkUserRole from './../config/middleware/checkUserRole.js';


// Crea un objeto Router de Express
const router = express.Router();

// Rutas para las operaciones CRUD de videos

// Crear un nuevo video de artista
router.post('/crearVideosHero', checkUserRole('superadmin', 'admin'), uploadVideo.fields(VidmulterFile), crearVideosHero);
router.get('/obtenerVideosHero', obtenerVideosHero);
router.delete('/borrarVideoHero/:id', checkUserRole('superadmin'), borrarVideoHero);
router.get('/obtenerVideoHero/:id', obtenerVideoHeroPorId);
router.put('/actualizarVideoHero/:id', checkUserRole('superadmin', 'admin'), uploadVideo.fields(VidmulterFile), actualizarVideosHero);

// Exporta el objeto Router configurado con las rutas de videos
export default router;
