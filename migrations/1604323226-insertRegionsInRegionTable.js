const regions = [
  { name: 'Asia' },
  { name: 'Europe' },
  { name: 'Africa' },
  { name: 'Oceania' },
  { name: 'Americas' },
];

exports.up = async (sql) => {
  await sql`
	INSERT INTO regions (region_name)
VALUES
    ('Asia'),
    ('Europe'),
		('Africa'),
		('Oceania'),
		('Americas');
	`;
};

exports.down = async (sql) => {
  for (const region in regions) {
    await sql`
	DELETE FROM regions WHERE
	region_name = ${region.name}
	`;
  }
};
