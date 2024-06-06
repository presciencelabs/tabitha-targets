import {readdir} from 'node:fs/promises'

/** @param {import('bun:sqlite').Database} targets_db */
export async function migrate_lexical_forms(language, targets_db) {
	const filenames = await readdir('inflections/csv')
	const all_files = await Promise.all(filenames.map(filename => Bun.file(`inflections/csv/${filename}`).text()))

	all_files.map(file_text => {
		const transformed_data = file_text
			.split('\n')
			.filter(line => line !== '')
			.map(line => line.split(','))
			.map(([stem, part_of_speech, forms]) => ({ stem, part_of_speech, forms}))

		load_data(targets_db, language, transformed_data)
	})
}

async function load_data(targets_db, language, transformed_data) {
	console.log(`Loading lexical forms into Lexicon table...`)

	transformed_data.map(async ({stem, part_of_speech, forms}) => {
		targets_db.query(`
			UPDATE Lexicon
			SET forms = ?
			WHERE language = ?
				AND stem = ?
				AND part_of_speech = ?
		`).run(forms, language, stem, part_of_speech)

		await Bun.write(Bun.stdout, '.')
	})

	console.log('done.')
}

