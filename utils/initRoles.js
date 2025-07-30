// utils/initRoles.js
const rolesController = require('../src/controller/rolesController');

const initRoles = async () => {
    try {
        // Usar la función del controller para inicializar roles
        const success = await rolesController.initializeDefaultRoles();
        
        if (success) {
            console.log('🎯 Inicialización de roles completada exitosamente');
        } else {
            console.error('❌ Error en la inicialización de roles');
        }
        
    } catch (error) {
        console.error('❌ Error crítico al inicializar roles:', error.message);
    }
};

module.exports = initRoles;
