// controller/tarjetasController.js
const tarjetasCtl = {};
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

// FUNCIONES PARA TARJETAS (MySQL)
tarjetasCtl.getAllTarjetas = async (req, res) => {
  try {
    const data = await orm.tarjetas.findAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener tarjetas', error: e.message });
  }
};

// FUNCIÓN PARA MOSTRAR TARJETAS CON SQL DIRECTO
tarjetasCtl.mostrarTarjetas = async (req, res) => {
  try {
    const [listaTarjetas] = await sql.promise().query('SELECT * FROM tarjetas');
    const tarjetas = listaTarjetas[0];
    const data = {
      tarjetas
    };
    return data;
  } catch (error) {
    console.error('Error al mostrar tarjetas:', error.message);
    return { error: 'Error al obtener datos' };
  }
};

tarjetasCtl.getTarjetaById = async (req, res) => {
  try {
    const tarjeta = await orm.tarjetas.findByPk(req.params.id);
    if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    res.json(tarjeta);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar tarjeta', error: e.message });
  }
};

tarjetasCtl.createTarjeta = async (req, res) => {
  try {
    const { tipo, minuto } = req.body;
    
    const tarjetaData = {
      tipo,
      minuto,
      estado: true
    };
    
    const newTarjeta = await orm.tarjetas.create(tarjetaData);
    
    res.status(201).json({
      message: 'Tarjeta creada exitosamente',
      tarjeta: newTarjeta
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al crear tarjeta', error: e.message });
  }
};

// FUNCIÓN PARA CREAR TARJETA CON SQL Y MONGO DIRECTO
tarjetasCtl.mandarTarjeta = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  try {
    const { tipo, minuto } = req.body;
    
    // Datos para MySQL usando ORM
    const envioSQL = {
      tipo,
      minuto,
      estado: true,
      createTarjeta: new Date().toLocaleString(),
    };
    
    const envioTarjeta = await orm.tarjetas.create(envioSQL);
    const idTarjeta = envioTarjeta.id;

    res.status(201).json({
      message: 'Exito al guardar tarjeta',
      tarjeta: envioTarjeta
    });
    
    return 'exito al guardar';

  } catch (error) {
    res.status(400).json({ message: 'Error al envio', error: error.message });
    return error;
  }
};

tarjetasCtl.updateTarjeta = async (req, res) => {
  try {
    const id = req.params.id;
    const tarjeta = await orm.tarjetas.findByPk(id);
    if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    
    await tarjeta.update(req.body);
    res.json({
      message: 'Tarjeta actualizada exitosamente',
      tarjeta
    });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar tarjeta', error: e.message });
  }
};

tarjetasCtl.deleteTarjeta = async (req, res) => {
  try {
    const id = req.params.id;
    const tarjeta = await orm.tarjetas.findByPk(id);
    if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    
    await tarjeta.destroy();
    
    res.json({ message: 'Tarjeta eliminada exitosamente' });
  } catch (e) {
    res.status(500).json({ message: 'Error al eliminar tarjeta', error: e.message });
  }
};

module.exports = tarjetasCtl;
