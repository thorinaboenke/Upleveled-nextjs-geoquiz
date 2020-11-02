const categories = [{ name: 'name' }, { name: 'capital' }, { name: 'flag' }];

exports.up = async (sql) => {
  await sql`
	INSERT INTO categories (category_name)
VALUES
    ('flag'),
    ('name'),
		('capital')
	`;
};

exports.down = async (sql) => {
  for (const category in categories) {
    await sql`
	DELETE FROM categories WHERE
	category_name = ${category.name}
	`;
  }
};
