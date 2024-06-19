import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { db }, params: { language }, url: { searchParams } }) {
	/** @type {string} */
	const word = searchParams.get('word') ?? ''

	const sql = `
		SELECT *
		FROM Lexicon
		WHERE language = ?
			AND (stem LIKE ? OR forms LIKE ?)
	`

	/** @type {import('@cloudflare/workers-types').D1Result<DbRowLexicon>} */
	const { results } = await db.prepare(sql).bind(language, word, `%|${word}|%`).all()

	/** @type {LexicalForm[]} */
	let forms = []
	for (const { stem: base_stem, part_of_speech, constituents,  forms: encoded_forms } of results) {
		const stem = derive_stem(base_stem, constituents)

		if (!encoded_forms) {
			forms.push({ stem, part_of_speech, form: 'Stem' })
			continue
		}

		// when encoded_forms is not null, it's a pipe-separated string
		// e.g., 'following' => '|followed|followed|following|follows|'
		const matched_indices = encoded_forms
			.split('|')											// ['', 'followed', 'followed', 'following', 'follows', '']
			.filter(form => !!form)							// ['followed', 'followed', 'following', 'follows']
			.map((form, i) => form === word ? i : -1) // [-1, -1, 2, -1]
			.filter(i => i > -1)								// [2]

		for (const i of matched_indices) {
			const form = await get_form_name(db, language, part_of_speech, i + 1)
			forms.push({ stem, part_of_speech, form })
		}
	}

	return json(forms)
}

/**
 *
 * @param {string} base_stem
 * @param {string} constituents
 * @returns {string}
 */
function derive_stem(base_stem, constituents) {
	if (!constituents) {
		return base_stem
	}

	// this string consists of the part we want and some further info in brackets that is not useful in the context of the lexicon
	// e.g.:
	// 	off[Adposition in VP]
	// 	threshing[First Word of Compound Noun]
	// 	over[Verbal Adposition moved to Direct Object]
	// 	of Ono[Post-Nominal Modifier]
	const constituent = constituents.split('[')[0] ?? ''

	return `${base_stem} ${constituent}`
}

/**
 * @param {import('@cloudflare/workers-types').D1Database} db
 * @param {string} language
 * @param {string} part_of_speech
 * @param {number} position
 *
 * @returns {Promise<string>}
 */
async function get_form_name(db, language, part_of_speech, position) {
	const sql = `
		SELECT *
		FROM Form_Names
		WHERE language = ?
			AND part_of_speech = ?
			AND position = ?
	`

	/** @type {import('@cloudflare/workers-types').D1Result<DbRowFormNames>} */
	return await db.prepare(sql).bind(language, part_of_speech, position).first('name') ?? ''
}

// async function by_filter(filter) {
// 	const normalized_q = normalize_wildcards(filter.q)

// 	const prepared_stmts = {
// 		stems: db.prepare(`
// 			SELECT *
// 			FROM Concepts
// 			WHERE stem LIKE ?`).bind(normalized_q),
// 		glosses: db.prepare(`
// 			SELECT *
// 			FROM Concepts
// 			WHERE gloss LIKE ?`).bind(`%${normalized_q}%`),
// 		all: db.prepare(`
// 			SELECT *
// 			FROM Concepts
// 			WHERE stem LIKE ?
// 				OR gloss LIKE ?`).bind(normalized_q, `%${normalized_q}%`),
// 	}

// 	/** @type {import('@cloudflare/workers-types').D1Result<DbRowConcept>} */
// 	const { results } = await prepared_stmts[filter.scope].all()

// 	return normalize(results)
// }

// /**
//  * @param {string} possible_wildard – a string that may contain wildcards, e.g., '*' or '#' or '%'
//  * @returns {string} SQL-ready string, i.e., `%` for wildcards
//  */
// function normalize_wildcards(possible_wildard) {
// 	return possible_wildard.replace(/[*#]/g, '%')
// }
