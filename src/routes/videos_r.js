// Importa el módulo 'express' para manejar las rutas
import express from 'express';

// Importa el middleware de multer para la carga de videos de artistas
import { uploadVideosArtistas } from './../config/multer.js';

// Importa los controladores para las operaciones CRUD de videos
import obtenerVideos from './../controllers/videos_artistas_crud/obtenerVideos.js';
import crearVideo from './../controllers/videos_artistas_crud/crearVideo.js';
import obtenerVideoPorId from './../controllers/videos_artistas_crud/obtenerVideoPorId.js';
import actualizarVideos from './../controllers/videos_artistas_crud/actualizarVideos.js';
import borrarVideos from './../controllers/videos_artistas_crud/borrarVideos.js';
import ObtenerVideoInfo from './../controllers/videos_artistas_crud/obtenerVideoInfo.js';
import checkUserRole from './../config/middleware/checkUserRole.js';
import obtenerVideoEmbed from './../controllers/videos_artistas_crud/obtenerVideoEmbed.js';


// Crea un objeto Router de Express
const router = express.Router();

// Rutas para las operaciones CRUD de videos

router.get('/obtenerVideos', obtenerVideos);

router.get('/obtenerVideosEmbed/:id', obtenerVideoEmbed);

router.post('/crearVideo', checkUserRole('superadmin', 'admin'), uploadVideosArtistas.single('foto_video'), crearVideo);

router.get('/obtenerVideos/:id', obtenerVideoPorId);

router.delete('/borrarVideos/:id', checkUserRole('superadmin'), borrarVideos);

router.put('/actualizarVideos/:id', checkUserRole('superadmin', 'admin'), uploadVideosArtistas.single('foto_video'), actualizarVideos);

//Este es un endpoint específico para consumir la api de youtube:
router.get('/video-info', ObtenerVideoInfo)



// Exporta el objeto Router configurado con las rutas de videos
export default router;
