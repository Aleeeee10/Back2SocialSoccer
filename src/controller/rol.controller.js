const orm = require('../dataBase/dataBase.orm');
const rolController = {};

// Crear rol
rolController.mandar = async (req, res) => {
    console.log("rolController.mandar");
    try {
        const { nameRole, descriptionRole, stateRole, createRole, updateRole } = req.body;

        // Validación básica de campos obligatorios
        if (!nameRole || !descriptionRole || !stateRole || !createRole || !updateRole) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Crear el rol en la base de datos relacional
        await orm.rol.create({
            nameRole,
            descriptionRole,
            stateRole,
            createRole,
            updateRole
        });

        // Si tuvieras una base MongoDB, aquí podrías insertar también
        // await mongo.rol.create({ ... });

        // Si usas flash y vistas:
        if (req.flash) req.flash('success', 'Rol creado correctamente');
        // Si usas vistas:
        if (res.redirect) return res.redirect('/rol/listar');
        // Si es API:
        return res.status(201).json({ message: "Rol creado correctamente" });

    } catch (error) {
        console.error("Error en rolController.mandar:", error);
        res.status(500).json({ error: "Error al crear el rol" });
    }
};

// Listar roles
rolController.listar = async (req, res) => {
    try {
        const roles = await orm.rol.findAll();
        res.render('rol/listar', { roles }); // o res.json(roles) si es API
    } catch (error) {
        console.error("Error en rolController.listar:", error);
        res.status(500).json({ error: "Error al listar roles" });
    }
};

module.exports = rolController;
