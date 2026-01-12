import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { db }, params: { project }, url: { searchParams } }) {
	// targets.tabitha.bible/English/lookup/features
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun&position=2
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun&position=2&code=P

	const stem_sql = `
		SELECT *
		FROM Lexical_Features
		WHERE project = ?
	`

	/** @type {import('@cloudflare/workers-types').D1Result<DbRowFeature>} */
	const { results: lexical_features } = await db.prepare(stem_sql).bind(project).all()

	const features = transform(lexical_features)

	return json(features)
}

/**
 * @param {DbRowFeature[]} lexical_features 
 * @returns {ApiFeature[]}
 */
function transform(lexical_features) {
	return lexical_features.map(({ part_of_speech, feature, position, code, value }) => ({
		type: 'lexical',
		part_of_speech,
		feature,
		position,
		code,
		value,
	}))
}
