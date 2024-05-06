// Importa el módulo 'express' para manejar las rutas
import express from 'express';

// Importa los módulos de rutas específicos
import artistasRoutes from './artistas_r.js';
import albumesRoutes from './albumes_r.js';
import playlistsRoutes from './playlist_r.js';
import cancionesRoutes from './canciones_r.js';
import noticiasRoutes from './noticias_r.js'; 
import otrosRouter from './otros_r.js';
import videosRoutes from './videos_r.js';
import enviarEmail from './enviar-email.js';
import translateController from './language_api_r.js'
import usersValidation from './usuarios_r.js'


// Crea un objeto Router de Express
const router = express.Router();

// Usa los módulos de rutas específicos para diferentes endpoints
router.use('/artistas', artistasRoutes);
router.use('/albumes', albumesRoutes);
router.use('/playlists', playlistsRoutes);
router.use('/canciones', cancionesRoutes);
router.use('/noticias', noticiasRoutes);
router.use('/videosHero', otrosRouter);
router.use('/videos', videosRoutes);
router.use('/enviar-correo', enviarEmail);
router.use('/api',translateController);
router.use('/usuarios', usersValidation);


// Exporta el objeto Router configurado con las rutas
export default router;

