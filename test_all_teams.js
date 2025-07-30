const sql = require('./src/dataBase/dataBase.sql');

(async () => {
  try {
    console.log('🔍 Verificando todos los equipos...');
    
    const [teams] = await sql.promise().query("SELECT * FROM teams ORDER BY id ASC");
    
    console.log('=== Todos los equipos ===');
    console.log('Total:', teams.length);
    
    if (teams.length > 0) {
      teams.forEach(team => {
        console.log(`ID: ${team.id} - Nombre: ${team.nombre} - Estado: ${team.estado}`);
      });
    } else {
      console.log('❌ No hay equipos en la tabla');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit();
})();
