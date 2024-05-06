// middleware
const rateLimiter = async (req, res , next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const currentTime = new Date().getTime();
  const timeWindow = 60 * 1000; // 1 minuto
  const maxRequests = 100; // Número máximo de solicitudes permitidas dentro del período de tiempo

  try {
    // Obtiene el número actual de solicitudes para esta dirección IP dentro del período de tiempo
    const result = await req.db.query('SELECT COUNT(*) as numero-registros FROM registors WHERE ip-cliente = ? AND timestamp >= ?', [clientIp, currentTime - timeWindow]);
    const requestCount = result[0].requestCount;

    // Si el número de solicitudes supera el límite, devuelve un código de estado 429 (Muchas solicitudes)
    if (requestCount >= maxRequests) {
      return res.status(429).send('Muchas solicitudes');
    }

    // Si el número de solicitudes está por debajo del límite, agrega la solicitud al registro y permite que continúe
    await req.db.query('INSERT INTO registro (ip-cliente, timestamp) VALUES (?, ?)', [clientIp, currentTime]);
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};

export default rateLimiter;