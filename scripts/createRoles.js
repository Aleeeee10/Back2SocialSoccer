// scripts/createRoles.js - Script directo para crear roles
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'futbolsocial',
    port: process.env.MYSQLPORT || 3306
};

// Función para formatear fecha
function formatLocalDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function createDefaultRoles() {
    let connection;
    
    try {
        // Conectar a la base de datos
        console.log('🔌 Conectando a la base de datos...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión establecida');
        
        // Verificar si ya existen roles
        const [existingRoles] = await connection.execute(
            "SELECT COUNT(*) as count FROM roles"
        );
        
        if (existingRoles[0].count > 0) {
            console.log('⚠️  Los roles ya existen en la base de datos');
            
            // Mostrar roles existentes
            const [roles] = await connection.execute(
                "SELECT * FROM roles ORDER BY nameRole"
            );
            console.log('📋 Roles existentes:');
            roles.forEach(role => {
                console.log(`   🔹 ID: ${role.idRoles} - ${role.nameRole} - ${role.descriptionRole}`);
            });
            return;
        }
        
        // Crear roles por defecto
        const now = new Date();
        const formattedNow = formatLocalDateTime(now);
        
        const rolesData = [
            {
                nameRole: 'Administrador',
                descriptionRole: 'Administrador del sistema con acceso completo',
                stateRole: 'activo'
            },
            {
                nameRole: 'Usuario',
                descriptionRole: 'Usuario estándar del sistema',
                stateRole: 'activo'
            }
        ];
        
        console.log('🚀 Creando roles por defecto...');
        
        for (const role of rolesData) {
            const [resultado] = await connection.execute(
                "INSERT INTO roles (nameRole, descriptionRole, stateRole, createRole, updateRole) VALUES (?, ?, ?, ?, ?)",
                [role.nameRole, role.descriptionRole, role.stateRole, formattedNow, formattedNow]
            );
            
            console.log(`✅ Rol creado: "${role.nameRole}" con ID: ${resultado.insertId}`);
        }
        
        console.log('🎯 ¡Roles creados exitosamente!');
        console.log('📝 Ahora puedes registrar usuarios desde el frontend');
        
        // Mostrar roles creados
        const [createdRoles] = await connection.execute(
            "SELECT * FROM roles ORDER BY idRoles"
        );
        console.log('📋 Roles disponibles:');
        createdRoles.forEach(role => {
            console.log(`   🔹 ID: ${role.idRoles} - ${role.nameRole} - ${role.descriptionRole}`);
        });
        
    } catch (error) {
        console.error('❌ Error al crear roles:', error.message);
        console.error('💡 Verifica:');
        console.error('   - Configuración de la base de datos en .env');
        console.error('   - Que la tabla "roles" existe');
        console.error('   - Que el servidor MySQL está ejecutándose');
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar el script
createDefaultRoles();
