// https://kit.svelte.dev/docs/routing#server
import { error, json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { db }, params: { project, book, chapter } }) {
	const sql = `
		SELECT DISTINCT verse
		FROM Text
		WHERE project = ?
			AND book = ?
			AND chapter = ?
		ORDER BY verse
	`
	/** @type {import('@cloudflare/workers-types').D1Result<VerseResult>} https://developers.cloudflare.com/d1/platform/client-api/#return-object */
	const { results } = await db.prepare(sql).bind(project, book, chapter).all()

	if (results.length) {
		return json(results.map(({ verse }) => verse))
	}

	return error(404, 'Not found')
}
