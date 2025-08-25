export function errorHandler(err, req, res, next) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  
    // Error de conexión a base de datos
    if (err.message.includes('connect') || err.message.includes('Connection')) {
      return res.status(400).json({
        code: 400,
        errors: "could not connect to db"
      });
    }
  
    // Error operacional personalizado
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        code: err.statusCode,
        errors: err.message
      });
    }
  
    // Error genérico
    res.status(400).json({
      code: 400,
      errors: err.message || "could not connect to db"
    });
  }