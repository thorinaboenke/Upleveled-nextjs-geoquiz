exports.up = async (sql) => {
  await sql`
    ALTER TABLE users ADD COLUMN streak_days INTEGER NOT NULL DEFAULT 0, ADD COLUMN last_game_played TIMESTAMP DEFAULT NOW();
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE users
      DROP COLUMN streak_days, DROP COLUMN last_game_played;
  `;
};
