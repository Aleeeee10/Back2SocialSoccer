// controller/torneosController.js
const torneosCtl = {};
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
    const newTorneo = await orm.torneos.create(req.body);
    res.status(201).json({
      message: 'Torneo creado exitosamente',
      torneo: newTorneo
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
    
    await torneo.destroy();
    
    res.json({ message: 'Torneo eliminado exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar torneo', error: e.message });
  }
};

module.exports = torneosCtl;
