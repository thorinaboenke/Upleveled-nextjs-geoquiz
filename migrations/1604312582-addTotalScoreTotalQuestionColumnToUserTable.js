exports.up = async (sql) => {
  await sql`
    ALTER TABLE users ADD COLUMN total_correct_questions INTEGER DEFAULT 0, ADD COLUMN total_answered_questions INTEGER DEFAULT 0;
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE users
      DROP COLUMN total_correct_questions, DROP COLUMN total_answered_questions;
  `;
};
