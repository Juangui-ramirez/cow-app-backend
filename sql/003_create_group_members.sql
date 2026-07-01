-- Run this manually against the database. This project has no migration
-- runner yet; tables are created by hand (see sql/ for history).

CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  groupId INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joinedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (groupId, userId)
);

-- Backfill: make every existing group's owner a member so groups created
-- before this feature keep working (bills need at least one member).
INSERT INTO group_members (groupId, userId, joinedAt)
SELECT id, ownerUserId, createdAt FROM groups
ON CONFLICT (groupId, userId) DO NOTHING;
