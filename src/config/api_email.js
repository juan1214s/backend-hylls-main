// Importa el módulo 'nodemailer' para enviar correos electrónicos
import nodemailer from 'nodemailer';

// Crea un objeto de transporte para enviar correos electrónicos utilizando el servicio Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_DEST, // Correo del destinatario (para enviar los correos)
    pass: process.env.EMAIL_PASS, // Contraseña específica para la aplicación (NO es la contraseña de la cuenta de correo)
  },
});

/**
 * Función para enviar correos electrónicos.
 * @param {string} destinatario - Dirección de correo electrónico del destinatario.
 * @param {string} asunto - Asunto del correo electrónico.
 * @param {string} nombre - Nombre del remitente.
 * @param {string} email - Dirección de correo electrónico del remitente.
 * @param {string} contenido - Contenido del correo electrónico.
 * @returns {Object} - Objeto con un mensaje indicando el resultado del envío del correo.
 * @throws {Error} - Error en caso de fallo al enviar el correo electrónico.
 */
const enviarCorreo = async (destinatario, asunto, nombre, email, contenido) => {
  // Configuración del contenido del correo
  const mailOptions = {
    from: email, // Dirección de correo del remitente
    to: destinatario, // Dirección de correo del destinatario
    subject: asunto, // Asunto del correo
    text: `
      Nombre: ${nombre}
      Email: ${email}
      Contenido: ${contenido}
    `,
  };

  try {
    // Envía el correo electrónico y espera la respuesta
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info);
    
    // Devuelve un objeto con un mensaje indicando el éxito del envío del correo
    return { mensaje: 'Correo enviado con éxito' };
  } catch (error) {
    // En caso de error, imprime el mensaje de error y lanza una excepción
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
};

// Exporta la función 'enviarCorreo' para su uso en otros módulos
export { enviarCorreo };
