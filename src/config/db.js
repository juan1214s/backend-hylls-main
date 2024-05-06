//db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carga las variables de entorno desde un archivo .env
dotenv.config();

// Configuración de conexión a la base de datos
const config = {
  host: process.env.DBHOST, // Dirección del servidor de la base de datos
  user: process.env.DBUSER, // Nombre de usuario de la base de datos
  password: process.env.DBPASS, // Contraseña de la base de datos
  database: process.env.DBNAME, // Nombre de la base de datos a la que se conectará
}

// Crea una conexión a la base de datos utilizando la configuración especificada
const connection = await mysql.createConnection(config);

// Imprime un mensaje en la consola indicando que la conexión se ha establecido correctamente
console.log("Conexión Hecha");


export default connection;
