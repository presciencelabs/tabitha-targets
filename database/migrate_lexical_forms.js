import {readdir} from 'node:fs/promises'

/**
 * @param {string} language
 * @param {import('bun:sqlite').Database} targets_db
 * @returns {Promise<void>}
 */
export async function migrate_lexical_forms(language, targets_db) {
	const word_forms = await get_word_forms()

	await load_data(word_forms, targets_db, language)
}

/**
 * @typedef {{sequence_number: string, stem: string, part_of_speech: string, forms: string}} WordFormRecord
 *
 * @returns {Promise<Record<['Adjective'|'Adverb'|'Noun'|'Verb'], WordFormRecord[]>>}
 */
async function get_word_forms() {
	console.log(`Getting word forms from the CSV files...`)

	const filenames = await readdir('inflections/csv')
	const csv_contents_by_file = await Promise.all(filenames.map(filename => Bun.file(`inflections/csv/${filename}`).text()))
	const normalized_data = csv_contents_by_file.map(normalize).flat()

	const groups_init = { Adjective: [], Adverb: [], Noun: [], Verb: [] }

	console.log('done.')

	return normalized_data.reduce(grouper, groups_init)

	function normalize(csv_text) {
		return csv_text.split('\n')
			.filter(line => line !== '')
			.map(transform)

		/**
		 * @param {string} line should follow this pattern: sequence_number,stem,part_of_speech,forms
		 * @returns {{sequence_number: string, stem: string, part_of_speech: string, forms: string}}
		 */
		function transform(line) {
			// note:  some stems are numbers, e.g., "7,1,100,Adjective,|||", so we can't just split(',')
			const [, sequence_number, stem, part_of_speech, forms] = line.match(/^(\d+),(.*),(Adjective|Adverb|Noun|Verb),(.*)$/)

			return { sequence_number, stem, part_of_speech, forms }
		}
	}

	function grouper(tracker, item) {
		const { part_of_speech } = item

		tracker[part_of_speech].push(item)

		return tracker
	}
}

/**
 * There is a delicate association between the a word's place in the Lexicon and the sequence number in the CSV file.
 * When the words in the Lexicon are ordered by their ID, the sequence number from the CSV file represents the "index"
 * of the word in the Lexicon.  Additionally, this is in the context of a single part of speech.
 *
 * @param {Record<['Adjective'|'Adverb'|'Noun'|'Verb'], WordFormRecord[]>} word_forms
 * @param {import('bun:sqlite').Database} targets_db
 * @param {string} language
 * @returns {Promise<void>}
 */
async function load_data(word_forms, targets_db, language) {
	console.log(`Loading word forms into Lexicon table...`)

	for (const part_of_speech of Object.keys(word_forms)) {
		const lexicon_words = await targets_db.query(`
			SELECT *
			FROM Lexicon
			WHERE language = ?
				AND part_of_speech = ?
			ORDER BY id
		`).all(language, part_of_speech)

		for (const { stem: stem_from_word_forms, sequence_number, forms } of word_forms[part_of_speech]) {
			const { id: lexicon_id, stem: stem_from_lexicon } = lexicon_words[sequence_number - 1]

			if (! stem_from_word_forms.startsWith(stem_from_lexicon)) {
				console.log(`⚠️ NOT LOADED ⚠️ due to mismatch: ${stem_from_word_forms} (from word forms) vs ${stem_from_lexicon} (from lexicon)`)

				continue
			}

			await targets_db.query(`
				UPDATE Lexicon
				SET forms = ?
				WHERE language = ?
					AND part_of_speech = ?
					AND id = ?
			`).run(forms, language, part_of_speech, lexicon_id)

			await Bun.write(Bun.stdout, '.')
		}
	}

	console.log('done.')
}
