import express from 'express'
import translateController from '../config/api_traductor.js';


const router = express.Router();

router.post('/language', translateController);

export default router