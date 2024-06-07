export function migrate_lexical_features_table(language, targets_db) {
	create_tabitha_table(targets_db)

	load_data(targets_db, language)
}

/** @param {import('bun:sqlite').Database} targets_db */
function create_tabitha_table(targets_db) {
	create()

	empty_existing_table()

	return targets_db

	function create() {
		console.log(`Creating Lexical_Features table in ${targets_db.filename}...`)

		targets_db.query(`
			CREATE TABLE IF NOT EXISTS Lexical_Features (
				language			TEXT,
				part_of_speech	TEXT,
				name				TEXT,
				position			INTEGER,
				code				TEXT,
				label				TEXT,
				notes				TEXT
			)
		`).run()

		console.log('done.')
	}

	function empty_existing_table() {
		console.log(`Cleaning existing data in Lexical_Features...`)

		targets_db.query(`DELETE FROM Lexical_Features`).run()

		console.log('done.')
	}
}

/** @param {import('bun:sqlite').Database} targets_db */
function load_data(targets_db, language) {
	console.log(`Loading data into Lexical_Features table...`)

	const data = [
		[language, 'Noun', 'Common/Proper', 1, 'C', 'Common', 'Articles only modify common nouns.  *the John'],
		[language, 'Noun', 'Common/Proper', 1, 'P', 'Proper', ''],
		[language, 'Noun', 'Gender', 2, 'N', 'Neuter', 'This feature determines which pronoun should be used, e.g., it'],
		[language, 'Noun', 'Gender', 2, 'M', 'Masculine', 'This feature determines which pronoun should be used, e.g., he'],
		[language, 'Noun', 'Gender', 2, 'F', 'Feminine', 'This feature determines which pronoun should be used, e.g., she'],
		[language, 'Noun', 'Type of relative clause', 3, 'S', 'Standard', ''],
		[language, 'Noun', 'Type of relative clause', 3, 'L', 'Locative - Relativizer is where', 'The place where I was born...'],
		[language, 'Noun', 'Type of relative clause', 3, 'T', 'Temporal - Relativizer is when', 'The day when John read a book...'],
		[language, 'Noun', 'Count/Mass', 4, 'C', 'Countable', ''],
		[language, 'Noun', 'Count/Mass', 4, 'M', 'Mass', "Mass nouns are treated as singular in number even when they're plural.  This wheat is good.  (singular demonstrative, singular verb)"],
		[language, 'Adjective', 'Type', 1, 'D', 'Descriptive', ''],
		[language, 'Adjective', 'Type', 1, 'C', 'Color', ''],
		[language, 'Adjective', 'Type', 1, 'S', 'Size', ''],
		[language, 'Adjective', 'Type', 1, 'c', 'Cardinal Number', ''],
		[language, 'Adjective', 'Type', 1, 'O', 'Ordinal Number', ''],
		[language, 'Adjective', 'Type', 1, 'Q', 'Quantity', ''],
		[language, 'Adjective', 'Type', 1, 'I', 'Identity', 'The other sense of only is Identity as in "The only person who can solve this problem."'],
		[language, 'Adjective', 'Type', 1, 'q', 'Question', '"how long", "how much", etc.'],
		[language, 'Adjective', 'Type', 1, 'a', 'Pre-Cardinal Number Modifier', 'about, as in "about three months"'],
		[language, 'Adjective', 'Type', 1, 'P', 'Post-Cardinal Number Modifier', 'more, as in "He read ten more books"'],
		[language, 'Adjective', 'Type', 1, 'E', 'Exclusivity', 'only, as in "Only the people who know John..."'],
		[language, 'Adjective', 'Type', 1, 'p', 'Pre-Article Modifier', ''],
		[language, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'Y', 'Yes', ''],
		[language, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'y', 'Yes using "more" and "most"', ''],
		[language, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'N', 'No', ''],
		[language, 'Adverb', 'Location in Clause', 1, 'P', 'Pre-verbal', ''],
		[language, 'Adverb', 'Location in Clause', 1, 'p', 'Post-verbal', ''],
		[language, 'Adverb', 'Location in Clause', 1, 'C', 'Clause Final', ''],
		[language, 'Adverb', 'Location in Clause', 1, 'l', 'Clause Initial', ''],
		[language, 'Adverb', 'Location in Clause', 1, 'c', 'CP-spec', 'interrogative adverbs when, where, why, and how'],
		[language, 'Adverb', 'Location in Clause', 1, 'r', 'Pre-verbal-auxiliary', ''],
		[language, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'Y', 'Yes', ''],
		[language, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'y', 'Yes using "more" and "most"', ''],
		[language, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'N', 'No', ''],
		[language, 'Adposition', 'Position in NP/Clause', 1, 'P', 'Phrase or clause initial', ''],
		[language, 'Adposition', 'Position in NP/Clause', 1, 'p', 'Phrase final', 'ago, as in "many years ago"'],
		[language, 'Particle', 'Location in Clause', 1, 'C', 'Clause Initial', ''],
		[language, 'Particle', 'Location in Clause', 1, 'O', 'Opening Quotation Mark', ''],
		[language, 'Particle', 'Location in Clause', 1, 'c', 'Closing Quotation Mark', ''],
		[language, 'Particle', 'Location in Clause', 1, 'E', 'Embedded Closing Quotation Mark', ''],
		[language, 'Particle', 'Location in Clause', 1, 'o', 'Opening Single Quotation Mark', ''],
		[language, 'Particle', 'Location in Clause', 1, 's', 'Closing Single Quotation Mark', ''],
		[language, 'Particle', 'Location in Clause', 1, 'p', 'Opening Parenthesis', ''],
		[language, 'Particle', 'Location in Clause', 1, 'S', 'Closing Parenthesis', ''],
		[language, 'Particle', 'Location in Clause', 1, 'l', 'Clause Final Punctuation', '!.'],
		[language, 'Particle', 'Location in Clause', 1, 'L', 'Clause Initial List Enumerator', ''],
		[language, 'Particle', 'Location in Clause', 1, 'a', 'Clause Initial Comment Marker', '('],
		[language, 'Particle', 'Location in Clause', 1, 'A', 'Clause Final Comment Marker', ')'],
		[language, 'Particle', 'Location in Clause', 1, 'R', 'Reference Marker', '":" as in Psalms 23:1'],
		[language, 'Particle', 'Location in Clause', 1, 'r', 'Reference Range Marker', '"-" as in Psalms 23:1-4'],
		[language, 'Particle', 'Location in Clause', 1, 'P', 'Opening Apostrophe', ''],
		[language, 'Particle', 'Location in Clause', 1, 'i', 'Closing Apostrophe', ''],
		[language, 'Particle', 'Location in Clause', 1, 'I', 'List Marker', ''],
		[language, 'Particle', 'Location in Clause', 1, 'B', 'Begin Scene', ''],
		[language, 'Particle', 'Location in Clause', 1, 'W', 'Word', ''],
	]

	data.map(row => targets_db.query('INSERT INTO Lexical_Features VALUES (?, ?, ?, ?, ?, ?, ?)').run(...row))

	console.log('done.')
}
