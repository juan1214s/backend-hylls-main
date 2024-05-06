// Importa el módulo 'express' para el manejo de rutas
import express from "express";
import multerFile from "./../config/multer-configs/multer-artistas.js";
import { uploadArtista } from "./../config/multer.js";
import checkUserRole from '../config/middleware/checkUserRole.js';

import crearArtista from "../controllers/artistas_crud/crearArtista.js";
import obtenerArtistas from "../controllers/artistas_crud/obtenerArtistas.js";
import obtenerArtistaPorId from "../controllers/artistas_crud/obtenerArtistasPorId.js";
import borrarArtista from "../controllers/artistas_crud/borrarArtista.js";
import actualizarArtista from "../controllers/artistas_crud/actualizarArtista.js";

const router = express.Router();

// Rutas CRUD para artistas con el middleware checkUserRole
router.post("/crearArtista", checkUserRole('superadmin', 'admin'), uploadArtista.fields(multerFile), crearArtista);
router.get("/obtenerArtistas", obtenerArtistas);
router.get("/obtenerArtista/:id", obtenerArtistaPorId);

// Utiliza el middleware checkUserRole antes de la ruta que requiere 'superadmin'
router.delete("/borrarArtista/:id", checkUserRole('superadmin'), borrarArtista);

router.put("/actualizarArtista/:id", checkUserRole('superadmin', 'admin'), uploadArtista.fields(multerFile), actualizarArtista);

export default router;
