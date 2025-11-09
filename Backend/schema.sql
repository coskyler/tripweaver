CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tour (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(8), 'hex'),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  city TEXT,
  description TEXT,
  stops INT,
  type TEXT CHECK (type IN ('driving','walking')),
  budget INT CHECK (budget BETWEEN 0 AND 4),
  search_radius INT CHECK (search_radius > 0),
  start_lat DOUBLE PRECISION,
  start_lng DOUBLE PRECISION,
  end_lat DOUBLE PRECISION,
  end_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('generating','updating','complete','failed')) DEFAULT 'generating'
);


CREATE TABLE tour_stop (
  tour_id TEXT NOT NULL REFERENCES tour(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  description TEXT,
  snap_name TEXT,
  snap_rating NUMERIC(2,1),
  snap_price_level SMALLINT,
  snap_address TEXT,
  snap_lat DOUBLE PRECISION,
  snap_lng DOUBLE PRECISION,
  snap_url TEXT,
  PRIMARY KEY (tour_id, seq)
);

CREATE INDEX idx_tour_owner ON tour(owner);
CREATE INDEX idx_tour_stop_tour ON tour_stop(tour_id);