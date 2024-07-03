export function migrate_form_names_table(project, targets_db) {
	create_tabitha_table(targets_db)

	load_data(targets_db, project)
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
				project			TEXT,
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
function load_data(targets_db, project) {
	console.log(`Loading data into Form_Names table...`)

	const data = [
		[project, 'Noun', 'Plural', 1],
		[project, 'Verb', 'Past', 1],
		[project, 'Verb', 'Perfect', 2],
		[project, 'Verb', 'Participle', 3],
		[project, 'Verb', 'Third Singular Present', 4],
		[project, 'Adjective', 'Comparative', 1],
		[project, 'Adjective', 'Superlative', 2],
		[project, 'Adverb', 'Comparative', 1],
		[project, 'Adverb', 'Superlative', 2]
	]

	data.map(row => targets_db.query('INSERT INTO Form_Names VALUES (?, ?, ?, ?)').run(...row))

	console.log('done.')
}
