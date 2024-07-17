-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2024 a las 19:16:46
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `contratnetunodb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `C_Identidad` int(11) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `Nombres` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `n_telefono` varchar(11) NOT NULL,
  `rol` tinyint(1) NOT NULL DEFAULT 1,
  `contraseña` varchar(150) NOT NULL,
  `contratista` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `cedula_identidad` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `numero_telefono` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratistas`
--

CREATE TABLE `contratistas` (
  `C_Identidad` int(11) NOT NULL,
  `contratos_pendientes` int(11) DEFAULT NULL,
  `inventario` varchar(300) DEFAULT NULL,
  `empresa` tinyint(1) DEFAULT 0,
  `Nombres` text NOT NULL,
  `Apellidos` text NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `n_telefono` varchar(11) NOT NULL,
  `rol` tinyint(1) NOT NULL DEFAULT 0,
  `sexo` tinyint(1) NOT NULL DEFAULT 0,
  `contratos_instalados` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratos`
--

CREATE TABLE `contratos` (
  `fecha_contrato` date NOT NULL,
  `id` int(11) NOT NULL,
  `ci_cliente` int(11) NOT NULL,
  `estatus_` tinyint(1) NOT NULL DEFAULT 0,
  `id_cuenta` int(11) NOT NULL,
  `plan_contratado` varchar(100) NOT NULL,
  `direccion_contrato` varchar(1000) NOT NULL,
  `motivo_standby` varchar(300) DEFAULT NULL,
  `fecha_instalacion` date DEFAULT NULL,
  `recursos_inventario_instalacion` varchar(500) DEFAULT NULL,
  `observaciones_instalacion` varchar(1000) DEFAULT NULL,
  `contratista_asignado` int(11) DEFAULT NULL,
  `telefono_cliente` varchar(11) DEFAULT NULL,
  `nodo` varchar(100) NOT NULL,
  `empresa_contratista` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta_netuno`
--

CREATE TABLE `cuenta_netuno` (
  `id` int(11) NOT NULL,
  `ci_cliente` int(11) NOT NULL,
  `contratos_activos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`C_Identidad`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `n_telefono` (`n_telefono`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cedula_identidad`);

--
-- Indices de la tabla `contratistas`
--
ALTER TABLE `contratistas`
  ADD PRIMARY KEY (`C_Identidad`),
  ADD UNIQUE KEY `n_telefono_contratista` (`n_telefono`),
  ADD UNIQUE KEY `email_contratista` (`email`);

--
-- Indices de la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cuenta_netuno`
--
ALTER TABLE `cuenta_netuno`
  ADD PRIMARY KEY (`id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cuenta_netuno`
--
ALTER TABLE `cuenta_netuno`
  ADD CONSTRAINT `fk_ci_cliente` FOREIGN KEY (`ci_cliente`) REFERENCES `clientes` (`cedula_identidad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
