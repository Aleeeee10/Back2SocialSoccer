-- Script SQL para crear la estructura de base de datos optimizada
-- Evita el problema "Too many keys specified; max 64 keys allowed"

-- Crear tablas principales sin demasiados índices automáticos

-- Tabla de roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de divisiones
CREATE TABLE IF NOT EXISTS `divisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `divisionId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `divisionId` (`divisionId`),
  FOREIGN KEY (`divisionId`) REFERENCES `divisions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de jugadores
CREATE TABLE IF NOT EXISTS `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `posicion` varchar(255) DEFAULT NULL,
  `dorsal` int DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de árbitros
CREATE TABLE IF NOT EXISTS `referees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `experiencia` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de canchas
CREATE TABLE IF NOT EXISTS `canchas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de partidos
CREATE TABLE IF NOT EXISTS `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT NULL,
  `equipoLocalId` int DEFAULT NULL,
  `equipoVisitanteId` int DEFAULT NULL,
  `refereeId` int DEFAULT NULL,
  `canchaId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `equipoLocalId` (`equipoLocalId`),
  KEY `equipoVisitanteId` (`equipoVisitanteId`),
  KEY `refereeId` (`refereeId`),
  KEY `canchaId` (`canchaId`),
  FOREIGN KEY (`equipoLocalId`) REFERENCES `teams` (`id`),
  FOREIGN KEY (`equipoVisitanteId`) REFERENCES `teams` (`id`),
  FOREIGN KEY (`refereeId`) REFERENCES `referees` (`id`),
  FOREIGN KEY (`canchaId`) REFERENCES `canchas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de resultados
CREATE TABLE IF NOT EXISTS `resultados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marcadorLocal` int DEFAULT NULL,
  `marcadorVisitante` int DEFAULT NULL,
  `matchId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `matchId` (`matchId`),
  FOREIGN KEY (`matchId`) REFERENCES `matches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de tarjetas
CREATE TABLE IF NOT EXISTS `tarjetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  `minuto` int DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `matchId` int DEFAULT NULL,
  `playerId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `matchId` (`matchId`),
  KEY `playerId` (`playerId`),
  FOREIGN KEY (`matchId`) REFERENCES `matches` (`id`),
  FOREIGN KEY (`playerId`) REFERENCES `players` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de posiciones
CREATE TABLE IF NOT EXISTS `posiciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `puntos` int DEFAULT NULL,
  `partidosJugados` int DEFAULT NULL,
  `partidosGanados` int DEFAULT NULL,
  `partidosEmpatados` int DEFAULT NULL,
  `partidosPerdidos` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  `divisionId` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  KEY `divisionId` (`divisionId`),
  FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`),
  FOREIGN KEY (`divisionId`) REFERENCES `divisions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de torneos
CREATE TABLE IF NOT EXISTS `torneos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `descripcion` text,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar datos básicos
INSERT IGNORE INTO `roles` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'admin', 'Administrador del sistema', 1),
(2, 'user', 'Usuario estándar', 1),
(3, 'coach', 'Entrenador', 1);

-- Insertar división básica
INSERT IGNORE INTO `divisions` (`id`, `nombre`, `estado`) VALUES
(1, 'Primera División', 1),
(2, 'Segunda División', 1);
