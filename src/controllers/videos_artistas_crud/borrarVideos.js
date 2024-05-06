import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * Elimina un video de artistas de la base de datos por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const borrarVideos = async (req, res) => {
    const videoArtistasId = req.params.id;

    try {
        // Obtener la información del video antes de eliminarlo
        const [existingVideo] = await connection.execute(`
        SELECT va.*
        FROM video_artistas va
        WHERE va.Id_video_artista = ?
      `, [videoArtistasId]);

        if (existingVideo.length === 0) {
            return res.status(404).json({ mensaje: 'Video no encontrado' });
        }

        // Obtener la ruta de la foto del video en el sistema de archivos
        const fotoVideoAntiguaUrl = existingVideo[0].foto_video;

        // Verificar si existe una foto antigua antes de intentar eliminarla
        if (fotoVideoAntiguaUrl) {
            // Construir la ruta completa al archivo en la carpeta pública
            const rutaCompletaFotoVideo = path.join('./public', fotoVideoAntiguaUrl);

            // Intentar eliminar la imagen del video del sistema de archivos si existe
            try {
                await fs.unlink(rutaCompletaFotoVideo);
                console.log('Foto del video eliminada con éxito:', rutaCompletaFotoVideo);
            } catch (error) {
                // Manejar el error de eliminación de la foto del video
                console.error('Error al eliminar la foto del video:', error);
            }
        }

        // Eliminar el video de la base de datos
        const [result] = await connection.execute('DELETE FROM video_artistas WHERE Id_video_artista = ?', [videoArtistasId]);

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Video eliminado con éxito' });
        } else {
            res.status(404).json({ mensaje: 'Video no encontrado' });
        }
    } catch (error) {
        // Manejar errores y enviar respuesta de error al cliente
        console.error("Error mysql:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default borrarVideos;
