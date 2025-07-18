// Controlador para roles - siguiendo el patrón estándar del proyecto
const { roles } = require('../dataBase/dataBase.orm');
const pool = require('../dataBase/dataBase.sql');
const { encrypDates } = require('../lib/helpers');
const LogsErrores = require('../model/nonRelational/LogsErrores');

const rolesCtl = {
  // Obtener todos los roles usando ORM (para APIs)
  async getAllRoles(req, res) {
    try {
      const data = await roles.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener roles', error: e.message });
    }
  },

  // Mostrar roles usando consulta SQL directa (para vistas)
  async mostrarRoles(req, res) {
    try {
      const sql = 'SELECT * FROM roles ORDER BY id ASC';
      const rolesData = await pool.query(sql);
      res.json(rolesData);
    } catch (error) {
      console.error('Error al mostrar roles:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Crear rol usando ORM
  async createRole(req, res) {
    try {
      const { nombre, descripcion } = req.body;
      
      // Crear rol en MySQL
      const newRole = await roles.create({
        nombre,
        descripcion,
        estado: true
      });

      // Crear log inicial del rol en MongoDB
      const logInicial = new LogsErrores({
        rolId: newRole.id,
        mensaje: `Rol "${nombre}" creado exitosamente`,
        tipoError: 'system',
        metodo: 'POST',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'low',
        accionIntentan: 'Crear nuevo rol',
        permisosFaltantes: [],
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          parametros: req.body
        },
        resuelto: true,
        estado: true
      });

      await logInicial.save();

      res.status(201).json({
        message: 'Rol y log inicial creados exitosamente',
        rol: newRole,
        logId: logInicial._id
      });
    } catch (e) {
      // Registrar error en MongoDB
      await LogsErrores.create({
        rolId: 0,
        mensaje: `Error al crear rol: ${e.message}`,
        tipoError: 'system',
        stack: e.stack,
        metodo: 'POST',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'high',
        accionIntentan: 'Crear nuevo rol',
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          parametros: req.body
        }
      });

      res.status(400).json({ message: 'Error al crear rol', error: e.message });
    }
  },

  // Mandar/enviar rol (método híbrido para casos especiales)
  async mandarRole(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar usando ORM
      const role = await roles.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

      // Encriptar datos sensibles si es necesario
      const roleData = {
        ...role.toJSON(),
        fechaConsulta: encrypDates(new Date())
      };

      res.json(roleData);
    } catch (error) {
      console.error('Error al mandar rol:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Buscar rol por ID
  async getById(req, res) {
    try {
      const role = await roles.findByPk(req.params.id);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      res.json(role);
    } catch (e) {
      res.status(500).json({ message: 'Error al buscar rol', error: e.message });
    }
  },

  // Actualizar rol
  async update(req, res) {
    try {
      const id = req.params.id;
      const role = await roles.findByPk(id);
      if (!role) {
        // Registrar intento de actualizar rol inexistente
        await LogsErrores.create({
          rolId: parseInt(id),
          mensaje: `Intento de actualizar rol inexistente con ID: ${id}`,
          tipoError: 'validation',
          metodo: 'PUT',
          userId: req.user?.id || null,
          userRole: req.user?.role || 'unknown',
          severidad: 'medium',
          accionIntentan: 'Actualizar rol',
          contextoAdicional: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            parametros: req.body
          }
        });
        
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      
      const oldData = { ...role.dataValues };
      await role.update(req.body);
      
      // Registrar actualización exitosa
      await LogsErrores.create({
        rolId: parseInt(id),
        mensaje: `Rol "${role.nombre}" actualizado exitosamente`,
        tipoError: 'system',
        metodo: 'PUT',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'low',
        accionIntentan: 'Actualizar rol',
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          datosAnteriores: oldData,
          datosNuevos: req.body
        },
        resuelto: true
      });
      
      res.json(role);
    } catch (e) {
      // Registrar error en actualización
      await LogsErrores.create({
        rolId: parseInt(req.params.id),
        mensaje: `Error al actualizar rol: ${e.message}`,
        tipoError: 'system',
        stack: e.stack,
        metodo: 'PUT',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'high',
        accionIntentan: 'Actualizar rol',
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          parametros: req.body
        }
      });
      
      res.status(400).json({ message: 'Error al actualizar rol', error: e.message });
    }
  },

  // Eliminar rol
  async delete(req, res) {
    try {
      const id = req.params.id;
      const role = await roles.findByPk(id);
      if (!role) {
        // Registrar intento de eliminar rol inexistente
        await LogsErrores.create({
          rolId: parseInt(id),
          mensaje: `Intento de eliminar rol inexistente con ID: ${id}`,
          tipoError: 'validation',
          metodo: 'DELETE',
          userId: req.user?.id || null,
          userRole: req.user?.role || 'unknown',
          severidad: 'medium',
          accionIntentan: 'Eliminar rol',
          contextoAdicional: {
            ip: req.ip,
            userAgent: req.get('User-Agent')
          }
        });
        
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      
      // Desactivar logs relacionados (eliminación lógica)
      await LogsErrores.updateMany(
        { rolId: parseInt(id) },
        { estado: false }
      );
      
      await role.destroy();
      
      // Registrar eliminación exitosa
      await LogsErrores.create({
        rolId: parseInt(id),
        mensaje: `Rol "${role.nombre}" eliminado exitosamente`,
        tipoError: 'system',
        metodo: 'DELETE',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'medium',
        accionIntentan: 'Eliminar rol',
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          rolEliminado: role.dataValues
        },
        resuelto: true
      });
      
      res.json({ message: 'Rol y logs relacionados eliminados exitosamente' });
    } catch (e) {
      // Registrar error en eliminación
      await LogsErrores.create({
        rolId: parseInt(req.params.id),
        mensaje: `Error al eliminar rol: ${e.message}`,
        tipoError: 'system',
        stack: e.stack,
        metodo: 'DELETE',
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: 'critical',
        accionIntentan: 'Eliminar rol',
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
      
      res.status(500).json({ message: 'Error al eliminar rol', error: e.message });
    }
  },

  // FUNCIONES ESPECÍFICAS PARA LOGS ERRORES (MongoDB)

  // Obtener logs de errores de un rol específico
  async getRoleLogs(req, res) {
    try {
      const { rolId } = req.params;
      const logs = await LogsErrores.find({ 
        rolId: parseInt(rolId), 
        estado: true 
      }).sort({ fecha: -1 });
      res.json(logs);
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener logs', error: e.message });
    }
  },

  // Obtener rol completo con todos sus logs
  async getRoleWithLogs(req, res) {
    try {
      const { rolId } = req.params;
      
      // Obtener rol de MySQL
      const role = await roles.findByPk(rolId);
      if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
      
      // Obtener logs de MongoDB
      const logs = await LogsErrores.find({ 
        rolId: parseInt(rolId), 
        estado: true 
      }).sort({ fecha: -1 });
      
      res.json({
        rol: role,
        logs: logs,
        totalLogs: logs.length,
        logsNoResueltos: logs.filter(log => !log.resuelto).length
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener datos completos', error: e.message });
    }
  },

  // Registrar error manualmente para un rol
  async logError(req, res) {
    try {
      const { rolId } = req.params;
      const { mensaje, tipoError, severidad, accionIntentan, permisosFaltantes } = req.body;
      
      const newLog = new LogsErrores({
        rolId: parseInt(rolId),
        mensaje,
        tipoError: tipoError || 'system',
        metodo: req.method,
        userId: req.user?.id || null,
        userRole: req.user?.role || 'system',
        severidad: severidad || 'medium',
        accionIntentan: accionIntentan || 'Acción no especificada',
        permisosFaltantes: permisosFaltantes || [],
        contextoAdicional: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          parametros: req.body
        },
        estado: true
      });
      
      await newLog.save();
      res.json({ message: 'Error registrado', log: newLog });
    } catch (e) {
      res.status(400).json({ message: 'Error al registrar log', error: e.message });
    }
  },

  // Resolver error específico
  async resolveError(req, res) {
    try {
      const { rolId, logId } = req.params;
      const { notasResolucion } = req.body;
      
      const updatedLog = await LogsErrores.findByIdAndUpdate(
        logId,
        { 
          resuelto: true,
          fechaResolucion: new Date(),
          notasResolucion: notasResolucion || 'Resuelto sin notas adicionales'
        },
        { new: true }
      );
      
      if (!updatedLog) return res.status(404).json({ message: 'Log no encontrado' });
      res.json({ message: 'Error resuelto', log: updatedLog });
    } catch (e) {
      res.status(400).json({ message: 'Error al resolver log', error: e.message });
    }
  },

  // Obtener estadísticas de errores por rol
  async getErrorStats(req, res) {
    try {
      const { rolId } = req.params;
      
      const stats = await LogsErrores.aggregate([
        { $match: { rolId: parseInt(rolId), estado: true } },
        {
          $group: {
            _id: '$tipoError',
            count: { $sum: 1 },
            severidadPromedio: { $first: '$severidad' },
            ultimoError: { $max: '$fecha' }
          }
        }
      ]);
      
      const totalErrores = await LogsErrores.countDocuments({ 
        rolId: parseInt(rolId), 
        estado: true 
      });
      
      const erroresNoResueltos = await LogsErrores.countDocuments({ 
        rolId: parseInt(rolId), 
        estado: true, 
        resuelto: false 
      });
      
      res.json({
        rolId: parseInt(rolId),
        totalErrores,
        erroresNoResueltos,
        erroresResueltos: totalErrores - erroresNoResueltos,
        estadisticasPorTipo: stats
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: e.message });
    }
  },

  // Limpiar logs antiguos (eliminación física)
  async cleanOldLogs(req, res) {
    try {
      const { rolId } = req.params;
      const { diasAtras = 30 } = req.body;
      
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasAtras);
      
      const result = await LogsErrores.deleteMany({
        rolId: parseInt(rolId),
        fecha: { $lt: fechaLimite },
        resuelto: true
      });
      
      res.json({ 
        message: 'Logs antiguos eliminados', 
        eliminados: result.deletedCount 
      });
    } catch (e) {
      res.status(500).json({ message: 'Error al limpiar logs', error: e.message });
    }
  }
};

module.exports = rolesCtl;
