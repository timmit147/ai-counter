
CREATE TABLE IF NOT EXISTS counter (
    name TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counter (name, value)
VALUES ('visits', 0);
