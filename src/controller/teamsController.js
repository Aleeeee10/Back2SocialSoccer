// controller/teamsController.js
const teamsCtl = {};
const orm = require('../dataBase/dataBase.orm');
const sql = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const { cifrarDatos, descifrarDatos } = require('../lib/encrypDates')

function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

// FUNCIONES PARA EQUIPOS (MySQL)
teamsCtl.getAllTeams = async (req, res) => {
  try {
    const data = await orm.teams.findAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener equipos', error: e.message });
  }
};

// FUNCIÓN PARA MOSTRAR EQUIPOS CON SQL DIRECTO
teamsCtl.mostrarTeams = async (req, res) => {
  try {
    const [listaTeams] = await sql.promise().query('SELECT * FROM teams');
    const equipos = listaTeams[0];
    const data = {
      equipos
    };
    return data;
  } catch (error) {
    console.error('Error al mostrar equipos:', error.message);
    return { error: 'Error al obtener datos' };
  }
};

teamsCtl.getTeamById = async (req, res) => {
  try {
    const team = await orm.teams.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json(team);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar equipo', error: e.message });
  }
};

teamsCtl.createTeam = async (req, res) => {
  try {
    const { nombre, logo, entrenador } = req.body;
    
    const teamData = {
      nombre,
      logo,
      entrenador,
      estado: true
    };
    
    const newTeam = await orm.teams.create(teamData);
    
    res.status(201).json({
      message: 'Equipo creado exitosamente',
      team: newTeam
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear equipo', error: e.message });
  }
};

// FUNCIÓN PARA CREAR EQUIPO CON SQL Y MONGO DIRECTO
teamsCtl.mandarTeam = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  try {
    const { nombre, logo, entrenador } = req.body;
    
    // Datos para MySQL usando ORM
    const envioSQL = {
      nombre,
      logo,
      entrenador,
      estado: true,
      createTeam: new Date().toLocaleString(),
    };
    
    const envioTeam = await orm.teams.create(envioSQL);
    const idTeam = envioTeam.id;

    res.status(201).json({
      message: 'Exito al guardar equipo',
      team: envioTeam
    });
    
    return 'exito al guardar';

  } catch (error) {
    res.status(400).json({ message: 'Error al envio', error: error.message });
    return error;
  }
};

teamsCtl.updateTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team = await orm.teams.findByPk(id);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    
    await team.update(req.body);
    res.json({
      message: 'Equipo actualizado exitosamente',
      team
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar equipo', error: e.message });
  }
};

teamsCtl.deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team = await orm.teams.findByPk(id);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    
    await team.destroy();
    
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar equipo', error: e.message });
  }
};

module.exports = teamsCtl;
