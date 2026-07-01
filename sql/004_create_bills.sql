-- Run this manually against the database, after sql/003_create_group_members.sql.

CREATE TABLE IF NOT EXISTS bills (
  id SERIAL PRIMARY KEY,
  groupId INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  description VARCHAR(100) NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  paidByUserId INTEGER NOT NULL REFERENCES users(id),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_splits (
  id SERIAL PRIMARY KEY,
  billId INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  userId INTEGER NOT NULL REFERENCES users(id),
  amountOwed NUMERIC(12,2) NOT NULL,
  settled BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (billId, userId)
);
