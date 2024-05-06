// routes.ts
import express from 'express';
import { rateLimiter, blockIp } from './middlewareDDoS.js';

const router = express.Router();

router.get('/', rateLimiter, (req, res) => {
  //queda pendiente a la finalizacion total del proyecto para agregar todos los llamados
});

router.use(blockIp);

export default router;