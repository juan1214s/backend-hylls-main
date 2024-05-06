// Importa el módulo 'express' para manejar las rutas
import express from 'express';

// Importa el middleware de multer para la carga de imágenes
import { uploadNoticia } from './../config/multer.js';

// Importa los controladores de noticias CRUD
import crearNoticia from './../controllers/noticias_crud/crearNoticia.js';
import obtenerNoticia from './../controllers/noticias_crud/obtenerNoticias.js';
import obtenerNoticiaPorId from './../controllers/noticias_crud/obtenerNoticiaPorId.js';
import borrarNoticia from './../controllers/noticias_crud/borrarNoticia.js';
import actualizarNoticia from './../controllers/noticias_crud/actualizarNoticia.js';
import NotmulterFile from './../config/multer-configs/multer-noticias.js';
import checkUserRole from './../config/middleware/checkUserRole.js';


// Crea un objeto Router de Express
const router = express.Router();

// Rutas para las operaciones CRUD de noticias

// Crear nueva noticia
router.post('/crearNoticia', checkUserRole('superadmin', 'admin'), uploadNoticia.fields(NotmulterFile), crearNoticia);

// Obtener todas las noticias de la tabla 'noticias' en la base de datos
router.get('/obtenerNoticia', obtenerNoticia);

// Obtener noticia por ID
router.get('/obtenerNoticia/:id', obtenerNoticiaPorId);

// Borrar noticia por ID
router.delete('/borrarNoticia/:id', checkUserRole('superadmin'), borrarNoticia);

// Actualizar noticia por ID
router.put('/actualizarNoticia/:id', checkUserRole('superadmin', 'admin'), uploadNoticia.fields(NotmulterFile), actualizarNoticia);

// Exporta el objeto Router configurado con las rutas de noticias
export default router;
