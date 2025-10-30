import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { db }, params: { project }, url: { searchParams } }) {
	/** @type {string} */
	const q = normalize_wildcards(searchParams.get('q') ?? '')

	const query = `
		SELECT text, audience, book, chapter, verse
		FROM Text
		WHERE project = ? AND text LIKE ?
	`

	const wildcard_q = q.includes('%') ? q : `%${q}%`

	/** @type {import('@cloudflare/workers-types').D1Result<DbTextResult>} */
	const { results: matches } = await db.prepare(query).bind(project, wildcard_q).all()

	/** @type {SearchResult[]} */
	const results = transform(matches)

	return json(results)

	/**
	 * @param {DbTextResult[]} matches
	 * @returns {SearchResult[]}
	 */
	function transform(matches) {
		return Map.groupBy(matches, m => `${m.book}:${m.chapter}:${m.verse}`).values()
			.map(group => ({
				reference: {
					type: 'Bible',
					id_primary: group[0].book,
					id_secondary: group[0].chapter,
					id_tertiary: group[0].verse
				},
				texts: group.map(({ text, audience }) => ({ text, audience }))
			})).toArray()
	}

	/**
	 * @param {string} possible_wildard – a string that may contain wildcards, e.g., '*' or '#' or '%'
	 * @returns {string} SQL-ready string, i.e., `%` for wildcards
	 */
	function normalize_wildcards(possible_wildard) {
		return possible_wildard.replace(/[*#]/g, '%')
	}
}
