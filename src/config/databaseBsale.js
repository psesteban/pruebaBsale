import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  // control de conexiones inactivas
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  pool: {
    min: 0,
    max: 5,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  }
};

// Crear pool de conexiones
export const pool = mysql.createPool(dbConfig);
console.log('Base de datos configurada con éxito');
