import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { db }, params: { project }, url: { searchParams } }) {
	// targets.tabitha.bible/English/lookup/features
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun&position=2
	// TODO: targets.tabitha.bible/English/lookup/features?category=Noun&position=2&code=P

	const lexical_sql = `
		SELECT *
		FROM Lexical_Features
		WHERE project = ?
	`
	const source_sql = `
		SELECT *
		FROM Source_Features
		WHERE project = ?
	`

	/** @type {import('@cloudflare/workers-types').D1Result<DbRowFeature>} */
	const { results: lexical_features } = await db.prepare(lexical_sql).bind(project).all()

	/** @type {import('@cloudflare/workers-types').D1Result<DbRowFeature>} */
	const { results: source_features } = await db.prepare(source_sql).bind(project).all()

	return json({
		source: transform(source_features),
		lexical: transform(lexical_features),
	})
}

/**
 * @param {DbRowFeature[]} features 
 * @returns {ApiFeature[]}
 */
function transform(features) {
	return features.map(({ category, feature, position, code, value }) => ({
		category,
		feature,
		position,
		code,
		value,
	}))
}
