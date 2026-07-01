-- Run this manually against the database. This project has no migration
-- runner yet; tables are created by hand (see sql/ for history).

CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  requesterUserId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addresseeUserId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (requesterUserId, addresseeUserId)
);
