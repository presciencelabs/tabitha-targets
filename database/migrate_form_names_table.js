export function migrate_form_names_table(language, targets_db) {
	create_tabitha_table(targets_db)

	load_data(targets_db, language)
}

/** @param {import('bun:sqlite').Database} targets_db */
function create_tabitha_table(targets_db) {
	create()

	empty_existing_table()

	return targets_db

	function create() {
		console.log(`Creating Form_Names table in ${targets_db.filename}...`)

		targets_db.query(`
			CREATE TABLE IF NOT EXISTS Form_Names (
				language			TEXT,
				part_of_speech	TEXT,
				name				TEXT,
				position			INTEGER
			)
		`).run()

		console.log('done.')
	}

	function empty_existing_table() {
		console.log(`Cleaning existing data in Form_Names...`)

		targets_db.query(`DELETE FROM Form_Names`).run()

		console.log('done.')
	}
}

/** @param {import('bun:sqlite').Database} targets_db */
function load_data(targets_db, language) {
	console.log(`Loading data into Form_Names table...`)

	const data = [
		[language, 'Noun', 'Plural', 1],
		[language, 'Verb', 'Past', 1],
		[language, 'Verb', 'Perfect', 2],
		[language, 'Verb', 'Participle', 3],
		[language, 'Verb', 'Third Singular Present', 4],
		[language, 'Adjective', 'Comparative', 1],
		[language, 'Adjective', 'Superlative', 2],
		[language, 'Adverb', 'Comparative', 1],
		[language, 'Adverb', 'Superlative', 2]
	]

	data.map(row => targets_db.query('INSERT INTO Form_Names VALUES (?, ?, ?, ?)').run(...row))

	console.log('done.')
}
