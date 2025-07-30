const sql = require('./src/dataBase/dataBase.sql');

(async () => {
  try {
    console.log('🔍 Probando consulta de equipos...');
    
    const [teams] = await sql.promise().query("SELECT * FROM teams WHERE estado = 'activo' ORDER BY nombre ASC");
    
    console.log('=== Equipos encontrados ===');
    console.log('Total:', teams.length);
    
    if (teams.length > 0) {
      teams.forEach(team => {
        console.log(`ID: ${team.id} - Nombre: ${team.nombre} - Estado: ${team.estado}`);
      });
    } else {
      console.log('❌ No se encontraron equipos activos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit();
})();
