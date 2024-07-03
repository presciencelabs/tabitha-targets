export function migrate_lexical_features_table(project, targets_db) {
	create_tabitha_table(targets_db)

	load_data(targets_db, project)
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
				project			TEXT,
				part_of_speech	TEXT,
				feature			TEXT,
				position			INTEGER,
				code				TEXT,
				value				TEXT,
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
function load_data(targets_db, project) {
	console.log(`Loading data into Lexical_Features table...`)

	const data = [
		[project, 'Noun', 'Common/Proper', 1, 'C', 'Common', 'Articles only modify common nouns.  *the John'],
		[project, 'Noun', 'Common/Proper', 1, 'P', 'Proper', ''],
		[project, 'Noun', 'Gender', 2, 'N', 'Neuter', 'This feature determines which pronoun should be used, e.g., it'],
		[project, 'Noun', 'Gender', 2, 'M', 'Masculine', 'This feature determines which pronoun should be used, e.g., he'],
		[project, 'Noun', 'Gender', 2, 'F', 'Feminine', 'This feature determines which pronoun should be used, e.g., she'],
		[project, 'Noun', 'Type of relative clause', 3, 'S', 'Standard', ''],
		[project, 'Noun', 'Type of relative clause', 3, 'L', 'Locative - Relativizer is where', 'The place where I was born...'],
		[project, 'Noun', 'Type of relative clause', 3, 'T', 'Temporal - Relativizer is when', 'The day when John read a book...'],
		[project, 'Noun', 'Count/Mass', 4, 'C', 'Countable', ''],
		[project, 'Noun', 'Count/Mass', 4, 'M', 'Mass', "Mass nouns are treated as singular in number even when they're plural.  This wheat is good.  (singular demonstrative, singular verb)"],
		[project, 'Adjective', 'Type', 1, 'D', 'Descriptive', ''],
		[project, 'Adjective', 'Type', 1, 'C', 'Color', ''],
		[project, 'Adjective', 'Type', 1, 'S', 'Size', ''],
		[project, 'Adjective', 'Type', 1, 'c', 'Cardinal Number', ''],
		[project, 'Adjective', 'Type', 1, 'O', 'Ordinal Number', ''],
		[project, 'Adjective', 'Type', 1, 'Q', 'Quantity', ''],
		[project, 'Adjective', 'Type', 1, 'I', 'Identity', 'The other sense of only is Identity as in "The only person who can solve this problem."'],
		[project, 'Adjective', 'Type', 1, 'q', 'Question', '"how long", "how much", etc.'],
		[project, 'Adjective', 'Type', 1, 'a', 'Pre-Cardinal Number Modifier', 'about, as in "about three months"'],
		[project, 'Adjective', 'Type', 1, 'P', 'Post-Cardinal Number Modifier', 'more, as in "He read ten more books"'],
		[project, 'Adjective', 'Type', 1, 'E', 'Exclusivity', 'only, as in "Only the people who know John..."'],
		[project, 'Adjective', 'Type', 1, 'p', 'Pre-Article Modifier', ''],
		[project, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'Y', 'Yes', ''],
		[project, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'y', 'Yes using "more" and "most"', ''],
		[project, 'Adjective', 'Has Comparative/Superlative Forms', 2, 'N', 'No', ''],
		[project, 'Adverb', 'Location in Clause', 1, 'P', 'Pre-verbal', ''],
		[project, 'Adverb', 'Location in Clause', 1, 'p', 'Post-verbal', ''],
		[project, 'Adverb', 'Location in Clause', 1, 'C', 'Clause Final', ''],
		[project, 'Adverb', 'Location in Clause', 1, 'l', 'Clause Initial', ''],
		[project, 'Adverb', 'Location in Clause', 1, 'c', 'CP-spec', 'interrogative adverbs when, where, why, and how'],
		[project, 'Adverb', 'Location in Clause', 1, 'r', 'Pre-verbal-auxiliary', ''],
		[project, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'Y', 'Yes', ''],
		[project, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'y', 'Yes using "more" and "most"', ''],
		[project, 'Adverb', 'Has Comparative/Superlative Forms', 2, 'N', 'No', ''],
		[project, 'Adposition', 'Position in NP/Clause', 1, 'P', 'Phrase or clause initial', ''],
		[project, 'Adposition', 'Position in NP/Clause', 1, 'p', 'Phrase final', 'ago, as in "many years ago"'],
		[project, 'Particle', 'Location in Clause', 1, 'C', 'Clause Initial', ''],
		[project, 'Particle', 'Location in Clause', 1, 'O', 'Opening Quotation Mark', ''],
		[project, 'Particle', 'Location in Clause', 1, 'c', 'Closing Quotation Mark', ''],
		[project, 'Particle', 'Location in Clause', 1, 'E', 'Embedded Closing Quotation Mark', ''],
		[project, 'Particle', 'Location in Clause', 1, 'o', 'Opening Single Quotation Mark', ''],
		[project, 'Particle', 'Location in Clause', 1, 's', 'Closing Single Quotation Mark', ''],
		[project, 'Particle', 'Location in Clause', 1, 'p', 'Opening Parenthesis', ''],
		[project, 'Particle', 'Location in Clause', 1, 'S', 'Closing Parenthesis', ''],
		[project, 'Particle', 'Location in Clause', 1, 'l', 'Clause Final Punctuation', '!.'],
		[project, 'Particle', 'Location in Clause', 1, 'L', 'Clause Initial List Enumerator', ''],
		[project, 'Particle', 'Location in Clause', 1, 'a', 'Clause Initial Comment Marker', '('],
		[project, 'Particle', 'Location in Clause', 1, 'A', 'Clause Final Comment Marker', ')'],
		[project, 'Particle', 'Location in Clause', 1, 'R', 'Reference Marker', '":" as in Psalms 23:1'],
		[project, 'Particle', 'Location in Clause', 1, 'r', 'Reference Range Marker', '"-" as in Psalms 23:1-4'],
		[project, 'Particle', 'Location in Clause', 1, 'P', 'Opening Apostrophe', ''],
		[project, 'Particle', 'Location in Clause', 1, 'i', 'Closing Apostrophe', ''],
		[project, 'Particle', 'Location in Clause', 1, 'I', 'List Marker', ''],
		[project, 'Particle', 'Location in Clause', 1, 'B', 'Begin Scene', ''],
		[project, 'Particle', 'Location in Clause', 1, 'W', 'Word', ''],
	]

	data.map(row => targets_db.query('INSERT INTO Lexical_Features VALUES (?, ?, ?, ?, ?, ?, ?)').run(...row))

	console.log('done.')
}
