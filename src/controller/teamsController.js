// controller/teamsController.js
const teamsCtl = {};
const orm = require('../dataBase/dataBase.orm');
const sql = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const TeamSocial = require('../model/nonRelational/TeamSocial'); // Modelo no relacional para contenido social de equipos
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

// FUNCIÓN PARA MOSTRAR EQUIPOS CON CONTENIDO SOCIAL (híbrido: SQL + MongoDB)
teamsCtl.mostrarTeams = async (req, res) => {
  try {
    const [listaTeams] = await sql.promise().query('SELECT * FROM teams');
    
    // Si hay equipos, obtener contenido social del primer equipo como ejemplo
    if (listaTeams.length > 0) {
      const teamSocial = await TeamSocial.findOne({ teamId: listaTeams[0].id });
      const data = {
        equipos: listaTeams,
        contenidoSocial: teamSocial
      };
      res.json(data);
    } else {
      res.json({ equipos: listaTeams, contenidoSocial: null });
    }
  } catch (error) {
    console.error('Error al mostrar equipos:', error.message);
    res.status(500).json({ error: 'Error al obtener datos' });
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
    const { nombre, logo, entrenador, redesSociales, colores, himno, historia } = req.body;
    
    // 1. Crear equipo en MySQL
    const teamData = {
      nombre,
      logo,
      entrenador,
      estado: true
    };
    
    const newTeam = await orm.teams.create(teamData);
    
    // 2. Crear contenido social inicial en MongoDB
    const defaultTeamSocial = {
      teamId: newTeam.id,
      redesSociales: redesSociales || {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        tiktok: ""
      },
      publicaciones: [{
        tipo: "texto",
        contenido: `¡Bienvenidos al equipo ${newTeam.nombre}! 🚀⚽`,
        fecha: new Date(),
        likes: 0,
        comentarios: 0,
        hashtags: [newTeam.nombre.replace(/\s+/g, ''), "futbol", "equipo"]
      }],
      seguidores: {
        facebook: 0,
        instagram: 0,
        twitter: 0
      },
      himno: himno || "",
      historia: historia || `Historia del equipo ${newTeam.nombre}`,
      colores: colores || {
        primario: "#000000",
        secundario: "#FFFFFF"
      },
      estado: true
    };
    
    const teamSocial = await TeamSocial.create(defaultTeamSocial);
    
    // 3. Respuesta con ambos datos
    res.status(201).json({
      equipo: newTeam,
      contenidoSocial: teamSocial,
      mensaje: 'Equipo y contenido social creados exitosamente'
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
    
    // Eliminar contenido social relacionado (eliminación lógica)
    await TeamSocial.updateMany(
      { teamId: id },
      { estado: false }
    );
    
    await team.destroy();
    
    res.json({ message: 'Equipo y contenido social eliminados exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar equipo', error: e.message });
  }
};

// FUNCIONES ESPECÍFICAS PARA TEAM SOCIAL (MongoDB)

// Obtener contenido social de un equipo específico
teamsCtl.getTeamSocial = async (req, res) => {
  try {
    const { teamId } = req.params;
    const teamSocial = await TeamSocial.findOne({ teamId: parseInt(teamId), estado: true });
    res.json(teamSocial);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener contenido social', error: e.message });
  }
};

// Obtener equipo completo con todo su contenido social
teamsCtl.getTeamWithSocial = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Obtener equipo de MySQL
    const team = await orm.teams.findByPk(teamId);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    
    // Obtener contenido social de MongoDB
    const teamSocial = await TeamSocial.findOne({ teamId: parseInt(teamId), estado: true });
    
    res.json({
      equipo: team,
      contenidoSocial: teamSocial,
      totalPublicaciones: teamSocial ? teamSocial.publicaciones.length : 0
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
  }
};

// Agregar publicación al equipo
teamsCtl.addPost = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { tipo, contenido, hashtags } = req.body;
    
    const teamSocial = await TeamSocial.findOne({ 
      teamId: parseInt(teamId), 
      estado: true 
    });
    
    if (!teamSocial) return res.status(404).json({ message: 'Contenido social del equipo no encontrado' });
    
    teamSocial.publicaciones.push({
      tipo,
      contenido,
      fecha: new Date(),
      likes: 0,
      comentarios: 0,
      hashtags: hashtags || []
    });
    
    await teamSocial.save();
    res.json({ message: 'Publicación agregada', contenidoSocial: teamSocial });
  } catch (e) {
    res.status(400).json({ message: 'Error al agregar publicación', error: e.message });
  }
};

// Actualizar redes sociales del equipo
teamsCtl.updateSocialMedia = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { redesSociales } = req.body;
    
    const updatedTeamSocial = await TeamSocial.findOneAndUpdate(
      { teamId: parseInt(teamId), estado: true },
      { redesSociales },
      { new: true }
    );
    
    if (!updatedTeamSocial) return res.status(404).json({ message: 'Contenido social no encontrado' });
    res.json(updatedTeamSocial);
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar redes sociales', error: e.message });
  }
};

// Actualizar seguidores del equipo
teamsCtl.updateFollowers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { seguidores } = req.body;
    
    const updatedTeamSocial = await TeamSocial.findOneAndUpdate(
      { teamId: parseInt(teamId), estado: true },
      { seguidores },
      { new: true }
    );
    
    if (!updatedTeamSocial) return res.status(404).json({ message: 'Contenido social no encontrado' });
    res.json(updatedTeamSocial);
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar seguidores', error: e.message });
  }
};

// Dar like a una publicación
teamsCtl.likePost = async (req, res) => {
  try {
    const { teamId, postId } = req.params;
    
    const teamSocial = await TeamSocial.findOne({ 
      teamId: parseInt(teamId), 
      estado: true 
    });
    
    if (!teamSocial) return res.status(404).json({ message: 'Contenido social no encontrado' });
    
    const post = teamSocial.publicaciones.id(postId);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
    
    post.likes += 1;
    await teamSocial.save();
    
    res.json({ message: 'Like agregado', publicacion: post });
  } catch (e) {
    res.status(400).json({ message: 'Error al dar like', error: e.message });
  }
};

// Actualizar información del equipo (himno, historia, colores)
teamsCtl.updateTeamInfo = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { himno, historia, colores } = req.body;
    
    const updateData = {};
    if (himno) updateData.himno = himno;
    if (historia) updateData.historia = historia;
    if (colores) updateData.colores = colores;
    
    const updatedTeamSocial = await TeamSocial.findOneAndUpdate(
      { teamId: parseInt(teamId), estado: true },
      updateData,
      { new: true }
    );
    
    if (!updatedTeamSocial) return res.status(404).json({ message: 'Contenido social no encontrado' });
    res.json(updatedTeamSocial);
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar información del equipo', error: e.message });
  }
};

module.exports = teamsCtl;
