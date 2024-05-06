// Importa el módulo 'multer' para el manejo de archivos en formularios multipartes
import multer from 'multer';

// Configuración de multer para artistas
const storageArtista = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes_artista');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

// Configuración de multer para álbumes
const storageAlbum = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes_album');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

// Configuración de multer para playlists
const storagePlaylist = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes_playlist');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

// Configuración de multer para noticias
const storageNoticia = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes_noticia');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

// Configuración de multer para videos
const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/videos_musicales');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.mp4');
  },
});

// Configuración de multer para imágenes de videos de artistas
const storageVideoArtistas = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes_video');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpeg');
  },
});

// Exporta instancias de multer configuradas para cada tipo de carga
export const uploadArtista = multer({ storage: storageArtista });
export const uploadAlbum = multer({ storage: storageAlbum });
export const uploadPlaylist = multer({ storage: storagePlaylist });
export const uploadNoticia = multer({ storage: storageNoticia });
export const uploadVideo = multer({ storage: storageVideo });
export const uploadVideosArtistas = multer({ storage: storageVideoArtistas });
