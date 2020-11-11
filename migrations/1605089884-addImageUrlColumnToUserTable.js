exports.up = async (sql) => {
  await sql`
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE users
      DROP COLUMN avatar_url;
  `;
};
