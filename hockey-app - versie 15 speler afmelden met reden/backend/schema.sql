-- Database schema voor hockey_app
-- Zorg dat je database bestaat: CREATE DATABASE hockey_app; USE hockey_app;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Spelers
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  position ENUM('Keeper','Verdediger','Middenvelder','Aanvaller') NOT NULL,
  photo_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trainingen
CREATE TABLE IF NOT EXISTS trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  date DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Scores per speler per training
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  training_id INT NOT NULL,
  inzet TINYINT NOT NULL,
  conditie TINYINT NOT NULL,
  tactiek TINYINT NOT NULL,
  techniek_basis TINYINT NOT NULL,
  proactief TINYINT NOT NULL,
  techniek_hoog TINYINT NOT NULL,
  UNIQUE KEY uniq_player_training (player_id, training_id),
  CONSTRAINT fk_scores_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_scores_training FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed: 10 trainingen (alleen als tabel leeg is)
INSERT INTO trainings (label, date)
SELECT CONCAT('Training ', n), NULL
FROM (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) AS nums
WHERE NOT EXISTS (SELECT 1 FROM trainings LIMIT 1);

