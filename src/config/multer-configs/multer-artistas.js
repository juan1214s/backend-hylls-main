// Configuración de multer para la carga de archivos de artistas
const multerFile = [
    { name: "foto", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "bannerMobil", maxCount: 1 },//nuevo
  ];

export default multerFile;