// Importa la conexión configurada con mysql2/promise
import connection from "./../../config/db.js";
import fs from 'fs/promises';
import path from 'path';





const actualizarNoticia = async (req, res) => {
  const noticiaId = req.params.id;
  const { Titulo, Descripcion_corta, Descripcion_larga, Fecha } = req.body;

  // Obtener la imagen del formulario
  const nuevaImagen = req.files['Imagen'];

  try {
    // Obtener la información de la noticia actual
    const [existingNoticia] = await connection.execute('SELECT * FROM noticia WHERE Id_Noticia = ?', [noticiaId]);

    // Verificar si la noticia ya existe por el título (realizando un trim)
    const [existingNoticiaByTitle] = await connection.execute(
      'SELECT * FROM noticia WHERE TRIM(LOWER(Titulo)) = TRIM(LOWER(?)) AND Id_Noticia != ?',
      [Titulo, noticiaId]
    );

    if (existingNoticiaByTitle.length > 0) {
      return res.status(400).json({ mensaje: 'Ya existe otra noticia con el mismo título' });
    }

    // Actualizar la foto si existe una nueva imagen
    if (nuevaImagen && nuevaImagen.length > 0) {
      await actualizarImagen('Imagen', nuevaImagen, noticiaId, existingNoticia);
    }

    // Parsea la fecha en formato DD/MM/YYYY a un objeto Date
    const partesFecha = Fecha.split('/');
    const fechaFormateada = new Date(`${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`).toISOString().split('T')[0];

    // Crear un objeto con los campos a actualizar
    const updateFields = {
      Titulo,
      Descripcion_corta,
      Descripcion_larga,
      Fecha: fechaFormateada,
    };

    // Filtrar los campos undefined
    const filteredFields = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    );

    // Construir la consulta SQL dinámicamente
    const updateQuery = 'UPDATE noticia SET ' +
      Object.keys(filteredFields).map(field => `${field} = ?`).join(', ') +
      ' WHERE Id_Noticia = ?';

    // Construir el array de valores para la consulta SQL
    const updateValues = Object.values(filteredFields);
    updateValues.push(noticiaId);

    // Actualizar los campos de la noticia (sin imágenes)
    await connection.execute(updateQuery, updateValues);

    // Respuesta exitosa
    res.json({ mensaje: 'Noticia actualizada con éxito' });

  } catch (error) {
    // Manejar errores y enviar respuesta de error al cliente
    console.error('Error mysql:', error);
    res.status(500).send('Internal Server Error');
  }
};




const actualizarImagen = async (tipo, imagen, noticiaId, existingNoticia) => {
  try {
    // Verificar si hay una imagen actual
    const imagenActualUrl = existingNoticia[0][tipo];

    if (imagenActualUrl) {
      // Construir la ruta completa al archivo en la carpeta pública
      const rutaCompletaImagenActual = path.join('./public', imagenActualUrl);

      // Verificar si la imagen actual existe antes de intentar eliminarla
      const imagenActualExiste = await fs.access(rutaCompletaImagenActual)
        .then(() => true)
        .catch(() => false);

      if (imagenActualExiste) {
        // Eliminar la imagen actual del sistema de archivos
        await fs.unlink(rutaCompletaImagenActual);
      }
    }

    // Actualizar la base de datos con la nueva información de la imagen
    const archivoNombre = imagen[0].filename;
    const nuevoArchivoUrl = `imagenes_noticia/${archivoNombre}`;

    // Actualizar los campos de la noticia con la nueva imagen
    await connection.execute(
      `UPDATE noticia SET ${tipo} = ? WHERE Id_Noticia = ?`,
      [nuevoArchivoUrl, noticiaId]
    );

    console.log(`Ruta de la nueva ${tipo}:`, nuevoArchivoUrl);
  } catch (error) {
    console.error(`Error al actualizar la ${tipo} de la noticia:`, error);
    // Si hay un error, eliminar la imagen guardada en el servidor
    await fs.unlink(imagen[0].path);
    throw error;
  }
};

export default actualizarNoticia;
