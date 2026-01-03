-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 06 dec 2025 om 18:23
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hockey_app`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `position` enum('Keeper','Verdediger','Middenvelder','Aanvaller') NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `players`
--

INSERT INTO `players` (`id`, `name`, `age`, `position`, `photo_url`, `created_at`) VALUES
(25, 'remco', 14, 'Verdediger', NULL, '2025-12-06 16:33:16'),
(26, 'max', 15, 'Keeper', NULL, '2025-12-06 16:33:36'),
(27, 'miranda', 15, 'Verdediger', NULL, '2025-12-06 16:33:45'),
(28, 'maud', 15, 'Aanvaller', NULL, '2025-12-06 16:34:05'),
(29, 'merel ', 16, 'Middenvelder', NULL, '2025-12-06 16:34:30'),
(30, 'peter', 15, 'Verdediger', NULL, '2025-12-06 16:34:40'),
(31, 'tim', 16, 'Middenvelder', NULL, '2025-12-06 16:34:50'),
(32, 'bas', 15, 'Aanvaller', NULL, '2025-12-06 16:35:30'),
(33, 'jos', 14, 'Middenvelder', NULL, '2025-12-06 16:35:39'),
(34, 'aziz', 15, 'Aanvaller', NULL, '2025-12-06 17:10:18'),
(35, 'jack', 14, 'Verdediger', NULL, '2025-12-06 17:10:28'),
(36, 'erik', 15, 'Aanvaller', NULL, '2025-12-06 17:10:41'),
(37, 'bart', 16, 'Verdediger', NULL, '2025-12-06 17:11:02'),
(38, 'gerben', 13, 'Verdediger', NULL, '2025-12-06 17:11:17'),
(39, 'Kamal', 16, 'Middenvelder', NULL, '2025-12-06 17:11:30'),
(40, 'thijs', 15, 'Middenvelder', NULL, '2025-12-06 17:11:41');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `training_id` int(11) NOT NULL,
  `inzet` tinyint(4) NOT NULL CHECK (`inzet` between 1 and 5),
  `conditie` tinyint(4) NOT NULL CHECK (`conditie` between 1 and 5),
  `tactiek` tinyint(4) NOT NULL CHECK (`tactiek` between 1 and 5),
  `techniek_basis` tinyint(4) NOT NULL CHECK (`techniek_basis` between 1 and 5),
  `proactief` tinyint(4) NOT NULL CHECK (`proactief` between 1 and 5),
  `techniek_hoog` tinyint(4) NOT NULL CHECK (`techniek_hoog` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `scores`
--

INSERT INTO `scores` (`id`, `player_id`, `training_id`, `inzet`, `conditie`, `tactiek`, `techniek_basis`, `proactief`, `techniek_hoog`) VALUES
(7, 25, 18, 1, 2, 3, 4, 5, 1),
(8, 26, 18, 2, 3, 4, 5, 4, 5),
(9, 27, 18, 2, 2, 3, 4, 4, 4),
(10, 28, 18, 4, 5, 3, 1, 2, 1),
(11, 29, 18, 3, 3, 3, 4, 5, 4),
(12, 30, 18, 4, 4, 4, 4, 3, 3),
(13, 31, 18, 3, 2, 2, 4, 3, 3),
(14, 33, 18, 3, 3, 3, 2, 2, 3),
(15, 32, 18, 4, 4, 2, 3, 3, 3),
(16, 34, 18, 2, 2, 3, 3, 4, 3),
(17, 36, 18, 3, 4, 3, 3, 3, 2),
(18, 37, 18, 2, 4, 3, 2, 3, 2),
(19, 38, 18, 2, 3, 4, 2, 2, 1),
(20, 39, 18, 1, 2, 3, 4, 5, 1),
(21, 40, 18, 1, 2, 3, 4, 5, 1),
(22, 35, 18, 2, 2, 2, 3, 1, 3);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `trainings`
--

CREATE TABLE `trainings` (
  `id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `trainings`
--

INSERT INTO `trainings` (`id`, `label`, `date`) VALUES
(18, 'Training 1', NULL),
(19, 'Training 2', NULL),
(20, 'Training 3', NULL),
(21, 'Training 4', NULL),
(22, 'Training 5', NULL),
(23, 'Training 6', NULL),
(24, 'Training 7', NULL),
(25, 'Training 8', NULL),
(26, 'Training 9', NULL),
(27, 'Training 10', NULL),
(34, 'trainin 1', '2025-12-08'),
(35, 'training 2', '2025-12-10'),
(36, 'training 3', '2025-12-13'),
(37, 'training 4', '2025-12-17'),
(38, 'training 5', '2026-01-08'),
(39, 'training 6', '2026-01-10'),
(40, 'training 7 ', '2026-01-10'),
(41, 'training 8', '2026-01-13'),
(42, 'training 9', '2026-01-13'),
(43, 'training 10', '2026-01-16');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_player_training` (`player_id`,`training_id`),
  ADD KEY `training_id` (`training_id`);

--
-- Indexen voor tabel `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT voor een tabel `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT voor een tabel `trainings`
--
ALTER TABLE `trainings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
