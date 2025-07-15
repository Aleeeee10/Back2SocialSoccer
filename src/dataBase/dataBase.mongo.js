const mongoose = require('mongoose');
const { MONGO_URI } = require('../keys');

// Opciones de conexión actualizadas para Mongoose
const MONGODB_OPTIONS = {
  serverSelectionTimeoutMS: 5000, // 5 segundos para selección de servidor
  socketTimeoutMS: 45000,         // 45 segundos para timeout de operaciones
  family: 4,                      // Usar IPv4
  maxPoolSize: 10,               // Máximo de conexiones en el pool
  retryWrites: true,
  w: 'majority'
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, MONGODB_OPTIONS);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to DB');
});

mongoose.connection.on('error', err => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected');
});

// Manejo de cierre de aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
