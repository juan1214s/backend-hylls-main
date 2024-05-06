//app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import router from './src/routes/index.js'; // Importa el enrutador principal
import './src/config/db.js'; // Importa la configuración de la base de datos

// Obtiene la ruta del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crea una instancia de Express
const app = express();

// Configuración de middleware y enrutador
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'
app.use(cors()); // Habilita CORS para permitir solicitudes desde diferentes dominios
app.use(express.json()); // Permite el análisis de solicitudes con formato JSON

//enrutador principal en la ruta base
app.use('/', router);

// Configuración y arranque del servidor
const PORT = process.env.PORT || 3001; // Puerto en el que la aplicación escuchará
app.listen(PORT, () => {
  console.log(process.env.DBUSER); // Imprime el nombre de usuario de la base de datos (útil para debuggear)
  console.log(`Server is running on port ${PORT}`);
});


export default app;
