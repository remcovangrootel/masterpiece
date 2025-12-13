CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age BETWEEN 10 AND 60),
  position VARCHAR(50) NOT NULL,
  photo_url TEXT NOT NULL
);

CREATE TABLE trainings (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT
);

CREATE TABLE player_trainings (
  id SERIAL PRIMARY KEY,
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  training_id INT NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  inzet INT CHECK (inzet BETWEEN 1 AND 10),
  conditie INT CHECK (conditie BETWEEN 1 AND 10),
  tactiek INT CHECK (tactiek BETWEEN 1 AND 10),
  techniek_basis INT CHECK (techniek_basis BETWEEN 1 AND 10),
  proactief INT CHECK (proactief BETWEEN 1 AND 10),
  techniek_hoog_niveau INT CHECK (techniek_hoog_niveau BETWEEN 1 AND 10),
  UNIQUE (player_id, training_id)
);
