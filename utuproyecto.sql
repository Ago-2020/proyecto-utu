-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2025 at 03:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `utuproyecto`
--

-- --------------------------------------------------------

--
-- Table structure for table `favoritos`
--

CREATE TABLE `favoritos` (
  `id_usuario` int(11) NOT NULL,
  `id_local` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favoritos`
--

INSERT INTO `favoritos` (`id_usuario`, `id_local`) VALUES
(9, 2),
(29, 2);

-- --------------------------------------------------------

--
-- Table structure for table `local`
--

CREATE TABLE `local` (
  `id_local` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `nombre_local` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `etiquetas` varchar(255) DEFAULT NULL,
  `numero` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `local`
--

INSERT INTO `local` (`id_local`, `id_usuario`, `ubicacion`, `descripcion`, `slogan`, `nombre_local`, `foto`, `etiquetas`, `numero`) VALUES
(1, 4, 'Las Piedras 8732 y Oribe', 'Panaderia ', '', 'Matias Panaderia', NULL, NULL, NULL),
(2, 5, '18 de julio 3042', 'Tacos y burritos', '', 'Taqueria Goku', NULL, NULL, NULL),
(3, 7, 'Wilson Ferreira, Zorrilla ', 'Local de golosinas', '', 'Campeon del dulce', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `id_publicacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `tipo_producto` varchar(255) NOT NULL,
  `id_local` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `publicacion`
--

CREATE TABLE `publicacion` (
  `id_local` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publicacion`
--

INSERT INTO `publicacion` (`id_local`, `id_publicacion`, `foto`, `fecha_inicio`, `fecha_fin`, `descripcion`) VALUES
(2, 1, NULL, '2025-09-17', '2025-09-18', 'Oferta de tacos 2x1 a $70'),
(3, 2, NULL, '2025-09-16', '2025-09-19', 'Todos tus dulces favoritos con 50% de descuento'),
(1, 3, NULL, '2025-09-15', '2025-09-17', 'Galletas San Jose a $38');

-- --------------------------------------------------------

--
-- Table structure for table `redes_sociales`
--

CREATE TABLE `redes_sociales` (
  `id_red` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `nombre_red` int(11) NOT NULL,
  `url_perfil` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reportes`
--

CREATE TABLE `reportes` (
  `id_local` int(11) NOT NULL,
  `razon` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resenas`
--

CREATE TABLE `resenas` (
  `id_resena` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `estrellas` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `reportado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `email_usuario` varchar(100) NOT NULL,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `password_usuario` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `tipo_usuario` int(50) NOT NULL COMMENT 'ADMIN, CLIENT o OWNER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `email_usuario`, `nombre_usuario`, `password_usuario`, `foto`, `tipo_usuario`) VALUES
(1, 'farolito44gonzalez@gmail.com', 'farolito44', 'farolito44', NULL, 1),
(2, 'luciamachado@gmail.com', 'lucy_machado', 'lucia_machado3042', NULL, 2),
(3, 'MartinOlivella22@gmail.com', 'Martin Olivella', 'MartuOli22', NULL, 1),
(4, 'matias22gonzlaez@gmail.com', 'matu_glz', 'matiasgonzalez44', NULL, 1),
(5, 'JuanPedro@gmail.com', 'JuanP', 'JuanPedro45', NULL, 1),
(6, 'CristianHernandez@gmail.com', 'Cris_Hndz', 'CrisHerndz', NULL, 1),
(7, 'EzeAlcidez@gmail.com', 'Takeshi', 'Takeshi_12345', NULL, 1),
(9, 'good@gmail.com', 'Ago2020', '$2y$10$Ev8wU50wOWOPbbbkOanY8ODMu7jtOevSB4cZ3hbN0N0GYAFbSbr32', NULL, 1),
(28, 'santiago@gmail.com', 'San', '$2y$10$.JbaYMks.cta8rcdYrk.m.onH64B7wNlkcVUS2mfeliENCoBtBi6S', NULL, 2),
(29, 'ayrtondemontet16@gmail.com', 'dexter', '$2y$10$SMKN08w6L2X6ucLTNwaNiesR/UkpAUa4.nt8YSKWv0QjwjzUSj4Ma', NULL, 2),
(32, 'lol20lol@p.com', 'lol20lol', '$2y$10$dw0NlzTbY8fQg5d2BJkiyuV0RD14cUoZCEB.hPwpW/QQ5gHwSMEs2', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuario_tipos`
--

CREATE TABLE `usuario_tipos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(32) NOT NULL,
  `nombre` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario_tipos`
--

INSERT INTO `usuario_tipos` (`id`, `codigo`, `nombre`) VALUES
(1, 'ADMIN', 'Administrador'),
(2, 'CLIENT', 'Cliente'),
(3, 'OWNER', 'Emprendedor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favoritos`
--
ALTER TABLE `favoritos`
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `favoritos_ibfk_1` (`id_local`);

--
-- Indexes for table `local`
--
ALTER TABLE `local`
  ADD PRIMARY KEY (`id_local`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_publicacion`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_local` (`id_local`);

--
-- Indexes for table `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `id_local` (`id_local`);

--
-- Indexes for table `redes_sociales`
--
ALTER TABLE `redes_sociales`
  ADD PRIMARY KEY (`id_red`),
  ADD KEY `id_local` (`id_local`);

--
-- Indexes for table `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id_local`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id_resena`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_local` (`id_local`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email_usuario` (`email_usuario`),
  ADD UNIQUE KEY `email_usuario_2` (`email_usuario`),
  ADD KEY `fk_usuario_tipos` (`tipo_usuario`);

--
-- Indexes for table `usuario_tipos`
--
ALTER TABLE `usuario_tipos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_USUARIO_TIPOS` (`codigo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `local`
--
ALTER TABLE `local`
  MODIFY `id_local` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id_publicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `redes_sociales`
--
ALTER TABLE `redes_sociales`
  MODIFY `id_red` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `usuario_tipos`
--
ALTER TABLE `usuario_tipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`),
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `local`
--
ALTER TABLE `local`
  ADD CONSTRAINT `local_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `notificacion_ibfk_3` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`);

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`);

--
-- Constraints for table `publicacion`
--
ALTER TABLE `publicacion`
  ADD CONSTRAINT `publicacion_ibfk_2` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`);

--
-- Constraints for table `redes_sociales`
--
ALTER TABLE `redes_sociales`
  ADD CONSTRAINT `redes_sociales_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`);

--
-- Constraints for table `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`),
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`id_local`) REFERENCES `local` (`id_local`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_tipos` FOREIGN KEY (`tipo_usuario`) REFERENCES `usuario_tipos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
