// Importa la función 'enviarCorreo' del módulo 'api_email'
import { enviarCorreo } from "./../config/api_email.js";

/**
 * Maneja la solicitud para enviar un correo electrónico.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const enviarEmail = async (req, res) => {
    // Extrae los datos necesarios del cuerpo de la solicitud
    const { asunto, nombre, email, contenido } = req.body;
  
    try {
        // Utiliza la función 'enviarCorreo' para enviar el correo electrónico
        await enviarCorreo(process.env.EMAIL_DEST, asunto, nombre, email, contenido);
        // Responde con un mensaje de éxito
        res.status(200).json({ mensaje: 'Correo enviado con éxito' });
    } catch (error) {
        // Maneja los errores y responde con un mensaje de error
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
};

// Exporta la función 'enviarEmail' como controlador para ser utilizado en las rutas
export default enviarEmail;
