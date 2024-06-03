export function migrate_lexicon_table(tbta_db, language, targets_db) {
	const transformed_data = transform_tbta_data(tbta_db, language)

	create_tabitha_table(targets_db)

	load_data(targets_db, transformed_data)
}

/** @param {import('bun:sqlite').Database} tbta_db */
function transform_tbta_data(tbta_db, language) {
	const table_names = [
		'Adjectives',
		'Adpositions',
		'Adverbs',
		'Nouns',
		'Verbs',
		'Conjunctions',
		'Particles',
		'Pronouns',
	]
	const transformed_data = transform_data(table_names)

	return transformed_data

	function transform_data(table_names) {
		console.log(`Transforming part of speech data from ${tbta_db.filename}...`)

		const transformed_data = table_names.map(table_name => {
			const singular_part_of_speech = table_name.slice(0, -1)

			const sql = `
				SELECT 	'${language}' as language,
							Roots as stem,
							'${singular_part_of_speech}' as part_of_speech,
							Glosses as gloss,
							Features as features
				FROM ${table_name}
			`
			return tbta_db.query(sql).all()
		}).flat() // flattens data from each parts of speech table into a single array

		console.log('done.')

		return transformed_data
	}
}

/** @param {import('bun:sqlite').Database} targets_db */
function create_tabitha_table(targets_db) {
	create()

	empty_existing_table()

	return targets_db

	function create() {
		console.log(`Creating Lexicon table in ${targets_db.filename}...`)

		targets_db.query(`
			CREATE TABLE IF NOT EXISTS Lexicon (
				language			TEXT,
				stem				TEXT,
				part_of_speech	TEXT,
				gloss				INTEGER,
				features			TEXT,
				forms				TEXT
			)
		`).run()

		console.log('done.')
	}

	function empty_existing_table() {
		console.log(`Cleaning existing data in Lexicon...`)

		targets_db.query(`DELETE FROM Lexicon`).run()

		console.log('done.')
	}
}

/** @param {import('bun:sqlite').Database} targets_db */
function load_data(targets_db, transformed_data) {
	console.log(`Loading data into Lexicon table...`)

	transformed_data.map(async ({language, stem, part_of_speech, gloss, features}) => {
		targets_db.query(`
			INSERT INTO Lexicon (language, stem, part_of_speech, gloss, features)
			VALUES (?, ?, ?, ?, ?)
		`).run(language, stem, part_of_speech, gloss, features)

		await Bun.write(Bun.stdout, '.')
	})

	console.log('done.')
}
