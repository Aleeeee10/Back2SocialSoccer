const mongoose = require('mongoose');
const { MONGO_URI } = require('../keys');

// 1. Configuración de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB en:', mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión en Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// 2. Función de conexión mejorada
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 segundos para selección de servidor
      socketTimeoutMS: 45000,         // 45 segundos para timeout de operaciones
      family: 4,                      // Usar IPv4
      maxPoolSize: 10,               // Máximo de conexiones en el pool
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('🚀 MongoDB conectado correctamente');
  } catch (err) {
    console.error('💥 FALLA CRÍTICA en conexión MongoDB:', err.message);
    process.exit(1); // Termina la aplicación con error
  }
};

// 3. Manejo de cierre de aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('� Conexión a MongoDB cerrada por terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar conexión MongoDB:', err);
    process.exit(1);
  }
});

// 4. Exportar modelos (ajusta las rutas según tu estructura)
const ActivityLogsModel = require('../model/nonRelational/ActivityLogs');
const FavoritosModel = require('../model/nonRelational/favoritos');
const MensajesModel = require('../model/nonRelational/mensajes');
const NotificationsLogModel = require('../model/nonRelational/NotificationsLog');
const UserPreferencesModel = require('../model/nonRelational/UserPreferences');

module.exports = {
  connectDB,
  ActivityLogsModel,
  FavoritosModel,
  MensajesModel,
  NotificationsLogModel,
  UserPreferencesModel,
};
