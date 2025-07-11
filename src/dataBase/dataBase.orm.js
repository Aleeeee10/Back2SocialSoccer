const { Sequelize } = require("sequelize");
const {
    MYSQLHOST,
    MYSQLUSER,
    MYSQLPASSWORD,
    MYSQLDATABASE,
    MYSQLPORT,
    MYSQL_URI
} = require("../keys");

let sequelize;

if (MYSQL_URI) {
    sequelize = new Sequelize(MYSQL_URI, {
        dialect: 'mysql',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false,
    });
} else {
    sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: 'mysql',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false,
    });
}

sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
    .catch(err => console.error('No se pudo conectar a la base de datos:', err));

const syngOptions = process.env.NODE_ENV === 'development' ? { force: true } : { alter : true };

sequelize.sync(syngOptions)
    .then(() => console.log('Sincronización de la base de datos completada.'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

// MODELOS
const users = require('../model/user')(sequelize, Sequelize.DataTypes);
const rol = require('../model/roles')(sequelize, Sequelize.DataTypes);
const detalleRol = require('../model/detalleRol')(sequelize, Sequelize.DataTypes);
const players = require('../model/jugadores')(sequelize, Sequelize.DataTypes);
const teams = require('../model/equipos')(sequelize, Sequelize.DataTypes);
const referees = require('../model/arbitros')(sequelize, Sequelize.DataTypes);
const matches = require('../model/partidos')(sequelize, Sequelize.DataTypes);
const news = require('../model/noticias')(sequelize, Sequelize.DataTypes);
const estadisticas = require('../model/estadisticas')(sequelize, Sequelize.DataTypes);
const detalleEstadisticas = require('../model/detalleEstadisticas')(sequelize, Sequelize.DataTypes);
const detalleJugadores = require('../model/detalleJugadores')(sequelize, Sequelize.DataTypes);
const resultados = require('../model/resultados')(sequelize, Sequelize.DataTypes);
const detalleResultados = require('../model/detalle.resutados')(sequelize, Sequelize.DataTypes);
const tarjetas = require('../model/tarjetas')(sequelize, Sequelize.DataTypes);
const division = require('../model/division')(sequelize, Sequelize.DataTypes);
const posiciones = require('../model/posiciones')(sequelize, Sequelize.DataTypes);
const detalleDivision = require('../model/detalleDivision')(sequelize, Sequelize.DataTypes);
const canchas = require('../model/canchas')(sequelize, Sequelize.DataTypes);

// RELACIONES

// Users & Roles (👈 aquí el ajuste que pediste: usar 'idRol' en lugar de 'idRole')
users.belongsTo(rol, { foreignKey: 'idRol', as: 'rol' });
rol.hasMany(users, { foreignKey: 'idRol', as: 'users' });

// Users & detalleRol
users.hasMany(detalleRol, { foreignKey: 'idUsers' });
detalleRol.belongsTo(users, { foreignKey: 'idUsers' });

// Roles & detalleRol
rol.hasMany(detalleRol, { foreignKey: 'idRoles' });
detalleRol.belongsTo(rol, { foreignKey: 'idRoles' });

// Players & Teams
teams.hasMany(players);
players.belongsTo(teams);

// Matches & Teams
matches.belongsTo(teams, { as: 'team1', foreignKey: 'team1Id' });
matches.belongsTo(teams, { as: 'team2', foreignKey: 'team2Id' });

// Matches & Referees
matches.belongsTo(referees, { as: 'referee', foreignKey: 'refereeId' });

// Estadísticas
players.hasMany(detalleEstadisticas);
detalleEstadisticas.belongsTo(players);

estadisticas.hasMany(detalleEstadisticas);
detalleEstadisticas.belongsTo(estadisticas);

// Jugadores & Detalles
players.hasMany(detalleJugadores);
detalleJugadores.belongsTo(players);

// Resultados
matches.hasMany(resultados);
resultados.belongsTo(matches);

resultados.hasMany(detalleResultados);
detalleResultados.belongsTo(resultados);

players.hasMany(detalleResultados);
detalleResultados.belongsTo(players);

// Tarjetas
matches.hasMany(tarjetas);
tarjetas.belongsTo(matches);

players.hasMany(tarjetas);
tarjetas.belongsTo(players);

// Posiciones y División
division.hasMany(posiciones);
posiciones.belongsTo(division);

teams.hasOne(posiciones);
posiciones.belongsTo(teams);

// División y Teams con alias
teams.belongsTo(division, { foreignKey: 'divisionId', as: 'divisionInfo' });
division.hasMany(teams, { foreignKey: 'divisionId', as: 'equipos' });

// Detalle División
division.hasMany(detalleDivision);
detalleDivision.belongsTo(division);

players.hasMany(detalleDivision);
detalleDivision.belongsTo(players);

// Canchas & Matches
matches.belongsTo(canchas, { foreignKey: 'canchaId', as: 'cancha' });
canchas.hasMany(matches, { foreignKey: 'canchaId', as: 'partidos' });

// EXPORT
module.exports = {
    sequelize,
    users,
    rol,
    detalleRol,
    players,
    teams,
    referees,
    matches,
    news,
    estadisticas,
    detalleEstadisticas,
    detalleJugadores,
    resultados,
    detalleResultados,
    tarjetas,
    posiciones,
    division,
    detalleDivision,
    canchas,
    standings: posiciones, // <--- alias para usar en otros módulos
};
