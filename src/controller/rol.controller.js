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

        // ⚠️ Detección si es API o formulario HTML tradicional
        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (isApiRequest) {
            return res.status(201).json({ message: "Rol creado correctamente" });
        } else {
            if (req.flash) req.flash('success', 'Rol creado correctamente');
            return res.redirect('/rol/listar');
        }

    } catch (error) {
        console.error("Error en rolController.mandar:", error);
        return res.status(500).json({ error: "Error al crear el rol" });
    }
};

// Listar roles
rolController.listar = async (req, res) => {
    try {
        const roles = await orm.rol.findAll();

        // Ver si es petición API
        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (isApiRequest) {
            return res.status(200).json(roles);
        } else {
            // Si usas vistas con EJS o similar, descomenta esto
            // res.render('rol/listar', { roles });

            // Pero si no tienes vistas, manda texto plano para evitar 404
            return res.send('Lista de roles mostrada aquí (vista no implementada)');
        }
    } catch (error) {
        console.error("Error en rolController.listar:", error);
        return res.status(500).json({ error: "Error al listar roles" });
    }
};

module.exports = rolController;
