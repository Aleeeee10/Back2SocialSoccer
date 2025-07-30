const app = require('./app');
const initRoles = require('../utils/initRoles');

// Función principal para inicializar el servidor
const startServer = async () => {
    try {
        // 1. Inicializar roles del sistema antes de arrancar el servidor
        console.log('🚀 Iniciando Back2SocialSoccer...');
        await initRoles();
        
        // 2. Arrancar el servidor
        const port = app.get('port');
        app.listen(port, () => {
            console.log('='.repeat(50));
            console.log(`🎯 Servidor Back2SocialSoccer ejecutándose`);
            console.log(`📡 Puerto: ${port}`);
            console.log(`🌐 URL: http://localhost:${port}`);
            console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log('='.repeat(50));
            console.log('✅ ¡Servidor listo para recibir conexiones!');
            console.log('📝 Ahora puedes registrar usuarios desde el frontend');
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar el servidor:', error.message);
        console.error('💡 Revisa la configuración de la base de datos');
        process.exit(1);
    }
};

// Ejecutar el servidor
startServer();
