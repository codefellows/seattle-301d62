DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255),
  priority SMALLINT,
  completed BOOLEAN,
  planned_time_in_seconds INTEGER,
  title VARCHAR(255),
  description VARCHAR(511) 
)