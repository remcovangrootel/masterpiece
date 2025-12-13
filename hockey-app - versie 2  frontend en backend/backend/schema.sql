-- backend/schema.sql
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  position ENUM('Keeper','Verdediger','Middenvelder','Aanvaller') NOT NULL,
  photo_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL, -- bv. "Training 1"
  date DATE NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  training_id INT NOT NULL,
  inzet TINYINT NOT NULL CHECK (inzet BETWEEN 1 AND 5),
  conditie TINYINT NOT NULL CHECK (conditie BETWEEN 1 AND 5),
  tactiek TINYINT NOT NULL CHECK (tactiek BETWEEN 1 AND 5),
  techniek_basis TINYINT NOT NULL CHECK (techniek_basis BETWEEN 1 AND 5),
  proactief TINYINT NOT NULL CHECK (proactief BETWEEN 1 AND 5),
  techniek_hoog TINYINT NOT NULL CHECK (techniek_hoog BETWEEN 1 AND 5),
  UNIQUE KEY uniq_player_training (player_id, training_id),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE
);

-- Seed: 10 trainingen
INSERT INTO trainings (label, date)
SELECT CONCAT('Training ', n), NULL
FROM (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t
WHERE NOT EXISTS (SELECT 1 FROM trainings);
