CREATE TABLE tour (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(8), 'hex'),
  name TEXT NOT NULL,
  owner UUID NOT NULL,
  city TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('driving','walking')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('generating','complete')) DEFAULT 'generating'
);


CREATE TABLE tour_stop (
  id BIGSERIAL PRIMARY KEY,
  tour_id TEXT NOT NULL REFERENCES tour(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('generating','complete')) DEFAULT 'generating',
  place_id TEXT NOT NULL,
  seq INT NOT NULL,
  arrive_at TIMESTAMPTZ,
  dwell_minutes INT,
  description TEXT,
  snap_name TEXT,
  snap_rating NUMERIC(2,1),
  snap_price_level SMALLINT,
  snap_address TEXT,
  UNIQUE (tour_id, seq)
);

CREATE INDEX idx_tour_owner ON tour(owner);
CREATE INDEX idx_tour_stop_tour ON tour_stop(tour_id);