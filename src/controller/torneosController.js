// controller/torneosController.js
const torneosCtl = {};
const orm = require('../dataBase/dataBase.orm');
const sql = require('../dataBase/dataBase.sql');
const mongo = require('../dataBase/dataBase.mongo');
const { cifrarDatos, descifrarDatos } = require('../lib/encrypDates');
const TournamentBrackets = require('../model/nonRelational/TournamentBrackets');

function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

// FUNCIONES PARA TORNEOS (MySQL)
torneosCtl.getAllTorneos = async (req, res) => {
  try {
    const data = await orm.torneos.findAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener torneos', error: e.message });
  }
};

// FUNCIÓN PARA MOSTRAR TORNEOS CON SQL DIRECTO
torneosCtl.mostrarTorneos = async (req, res) => {
  try {
    const [listaTorneos] = await sql.promise().query('SELECT * FROM torneos');
    const torneos = listaTorneos[0];
    const data = {
      torneos
    };
    return data;
  } catch (error) {
    console.error('Error al mostrar torneos:', error.message);
    return { error: 'Error al obtener datos' };
  }
};

torneosCtl.getTorneoById = async (req, res) => {
  try {
    const torneo = await orm.torneos.findByPk(req.params.id);
    if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
    res.json(torneo);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar torneo', error: e.message });
  }
};

torneosCtl.createTorneo = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, descripcion, formato = 'eliminacion_directa' } = req.body;
    
    // Crear torneo en MySQL
    const newTorneo = await orm.torneos.create({
      nombre,
      fechaInicio,
      fechaFin,
      descripcion,
      estado: true
    });

    // Crear estructura de brackets en MongoDB automáticamente
    const tournamentBracket = new TournamentBrackets({
      torneoId: newTorneo.id,
      formato,
      rondas: [],
      grupos: [],
      premios: {
        campeon: '',
        subcampeon: '',
        tercerPuesto: ''
      },
      estado: true
    });

    await tournamentBracket.save();

    res.status(201).json({
      message: 'Torneo y estructura de brackets creados exitosamente',
      torneo: newTorneo,
      brackets: tournamentBracket
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear torneo', error: e.message });
  }
};

// FUNCIÓN PARA CREAR TORNEO CON SQL Y MONGO DIRECTO
torneosCtl.mandarTorneo = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  try {
    const { nombre, descripcion, fechaInicio, fechaFin, estado } = req.body;
    
    // Datos para MySQL usando ORM
    const envioSQL = {
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      estado: estado || true,
      createTorneo: new Date().toLocaleString(),
    };
    
    const envioTorneo = await orm.torneos.create(envioSQL);
    const idTorneo = envioTorneo.id;

    res.status(201).json({
      message: 'Exito al guardar torneo',
      torneo: envioTorneo
    });
    
    return 'exito al guardar';

  } catch (error) {
    res.status(400).json({ message: 'Error al envio', error: error.message });
    return error;
  }
};

torneosCtl.updateTorneo = async (req, res) => {
  try {
    const id = req.params.id;
    const torneo = await orm.torneos.findByPk(id);
    if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
    
    await torneo.update(req.body);
    res.json({
      message: 'Torneo actualizado exitosamente',
      torneo
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar torneo', error: e.message });
  }
};

torneosCtl.deleteTorneo = async (req, res) => {
  try {
    const id = req.params.id;
    const torneo = await orm.torneos.findByPk(id);
    if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
    
    // Eliminar estructura de brackets relacionada (eliminación lógica)
    await TournamentBrackets.updateMany(
      { torneoId: parseInt(id) },
      { estado: false }
    );
    
    await torneo.destroy();
    
    res.json({ message: 'Torneo y estructura de brackets eliminados exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar torneo', error: e.message });
  }
};

// FUNCIONES ESPECÍFICAS PARA TOURNAMENT BRACKETS (MongoDB)

// Obtener estructura de brackets de un torneo específico
torneosCtl.getTournamentBrackets = async (req, res) => {
  try {
    const { torneoId } = req.params;
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    res.json(brackets);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener brackets', error: e.message });
  }
};

// Obtener torneo completo con estructura de brackets
torneosCtl.getTournamentWithBrackets = async (req, res) => {
  try {
    const { torneoId } = req.params;
    
    // Obtener torneo de MySQL
    const torneo = await orm.torneos.findByPk(torneoId);
    if (!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
    
    // Obtener estructura de brackets de MongoDB
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    res.json({
      torneo,
      brackets,
      totalRondas: brackets ? brackets.rondas.length : 0,
      totalGrupos: brackets ? brackets.grupos.length : 0
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
  }
};

// Configurar estructura de torneo (formato y equipos)
torneosCtl.setupTournament = async (req, res) => {
  try {
    const { torneoId } = req.params;
    const { formato, equipos, gruposConfig } = req.body;
    
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    if (!brackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    
    brackets.formato = formato;
    
    if (formato === 'grupos' && gruposConfig) {
      brackets.grupos = gruposConfig.map(grupo => ({
        nombre: grupo.nombre,
        equipos: grupo.equipos,
        tabla: grupo.equipos.map(equipoId => ({
          equipoId,
          puntos: 0,
          partidosJugados: 0,
          victorias: 0,
          empates: 0,
          derrotas: 0
        }))
      }));
    }
    
    await brackets.save();
    res.json({ message: 'Estructura del torneo configurada', brackets });
  } catch (e) {
    res.status(400).json({ message: 'Error al configurar torneo', error: e.message });
  }
};

// Agregar ronda al torneo
torneosCtl.addRound = async (req, res) => {
  try {
    const { torneoId } = req.params;
    const { nombre, partidos } = req.body;
    
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    if (!brackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    
    brackets.rondas.push({
      nombre,
      partidos: partidos.map(partido => ({
        equipoLocal: partido.equipoLocal,
        equipoVisitante: partido.equipoVisitante,
        resultado: { golesLocal: 0, golesVisitante: 0 },
        fecha: partido.fecha,
        ganador: null,
        estado: 'programado'
      }))
    });
    
    await brackets.save();
    res.json({ message: 'Ronda agregada', brackets });
  } catch (e) {
    res.status(400).json({ message: 'Error al agregar ronda', error: e.message });
  }
};

// Actualizar resultado de partido
torneosCtl.updateMatchResult = async (req, res) => {
  try {
    const { torneoId, rondaIndex, partidoIndex } = req.params;
    const { golesLocal, golesVisitante } = req.body;
    
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    if (!brackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    
    const ronda = brackets.rondas[rondaIndex];
    const partido = ronda.partidos[partidoIndex];
    
    partido.resultado.golesLocal = golesLocal;
    partido.resultado.golesVisitante = golesVisitante;
    partido.ganador = golesLocal > golesVisitante ? partido.equipoLocal : partido.equipoVisitante;
    partido.estado = 'finalizado';
    
    await brackets.save();
    res.json({ message: 'Resultado actualizado', partido });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar resultado', error: e.message });
  }
};

// Actualizar tabla de grupo
torneosCtl.updateGroupTable = async (req, res) => {
  try {
    const { torneoId, grupoIndex } = req.params;
    const { equipoId, puntos, victorias, empates, derrotas } = req.body;
    
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    if (!brackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    
    const grupo = brackets.grupos[grupoIndex];
    const equipoIndex = grupo.tabla.findIndex(eq => eq.equipoId === equipoId);
    
    if (equipoIndex !== -1) {
      grupo.tabla[equipoIndex].puntos += puntos;
      grupo.tabla[equipoIndex].partidosJugados += 1;
      grupo.tabla[equipoIndex].victorias += victorias;
      grupo.tabla[equipoIndex].empates += empates;
      grupo.tabla[equipoIndex].derrotas += derrotas;
    }
    
    await brackets.save();
    res.json({ message: 'Tabla actualizada', grupo });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar tabla', error: e.message });
  }
};

// Establecer premios del torneo
torneosCtl.setPrizes = async (req, res) => {
  try {
    const { torneoId } = req.params;
    const { campeon, subcampeon, tercerPuesto } = req.body;
    
    const updatedBrackets = await TournamentBrackets.findOneAndUpdate(
      { torneoId: parseInt(torneoId), estado: true },
      { premios: { campeon, subcampeon, tercerPuesto } },
      { new: true }
    );
    
    if (!updatedBrackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    res.json({ message: 'Premios establecidos', premios: updatedBrackets.premios });
  } catch (e) {
    res.status(400).json({ message: 'Error al establecer premios', error: e.message });
  }
};

// Generar brackets automáticos para eliminación directa
torneosCtl.generateEliminationBrackets = async (req, res) => {
  try {
    const { torneoId } = req.params;
    const { equipos } = req.body; // Array de IDs de equipos
    
    const brackets = await TournamentBrackets.findOne({ 
      torneoId: parseInt(torneoId), 
      estado: true 
    });
    
    if (!brackets) return res.status(404).json({ message: 'Estructura de brackets no encontrada' });
    
    // Generar rondas automáticamente
    const totalEquipos = equipos.length;
    const rondas = [];
    let equiposActuales = [...equipos];
    
    while (equiposActuales.length > 1) {
      const nombreRonda = getRoundName(equiposActuales.length);
      const partidos = [];
      
      for (let i = 0; i < equiposActuales.length; i += 2) {
        if (i + 1 < equiposActuales.length) {
          partidos.push({
            equipoLocal: equiposActuales[i],
            equipoVisitante: equiposActuales[i + 1],
            resultado: { golesLocal: 0, golesVisitante: 0 },
            fecha: null,
            ganador: null,
            estado: 'programado'
          });
        }
      }
      
      rondas.push({ nombre: nombreRonda, partidos });
      equiposActuales = new Array(Math.ceil(equiposActuales.length / 2));
    }
    
    brackets.rondas = rondas;
    await brackets.save();
    
    res.json({ message: 'Brackets de eliminación generados', brackets });
  } catch (e) {
    res.status(400).json({ message: 'Error al generar brackets', error: e.message });
  }
};

function getRoundName(numEquipos) {
  if (numEquipos === 2) return 'Final';
  if (numEquipos === 4) return 'Semifinal';
  if (numEquipos === 8) return 'Cuartos de Final';
  if (numEquipos === 16) return 'Octavos de Final';
  return `Ronda de ${numEquipos}`;
}

module.exports = torneosCtl;
