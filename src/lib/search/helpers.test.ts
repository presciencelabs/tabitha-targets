import { describe, expect, it } from 'vitest'
import { build_filter_options, build_search_regex, by_book_order, filter_search_results } from './helpers'
import type { SearchTextResult } from '../types'

const mockResults: SearchTextResult[] = [
	{
		reference: { type: 'verse', id_primary: '1 Samuel', id_secondary: 21, id_tertiary: 1 },
		texts: [
			{ audience: 'Churched Adults', text: 'David went to Nob' },
			{ audience: 'Unchurched Adults', text: 'David went to Nob to meet Ahimelech' },
		],
	},
	{
		reference: { type: 'verse', id_primary: 'Ruth', id_secondary: 4, id_tertiary: 17 },
		texts: [
			{ audience: 'Churched Adults', text: 'Obed became Jesse father. And Jesse became David father.' },
		],
	},
]

describe('search helpers', () => {
	it('sorts results by canonical Bible book order', () => {
		const sorted = mockResults.slice().sort(by_book_order)
		expect(sorted[0].reference.id_primary).toBe('Ruth')
		expect(sorted[1].reference.id_primary).toBe('1 Samuel')
	})

	it('builds filter options correctly from search results', () => {
		const filters = build_filter_options(mockResults)
		expect(filters.get('Book')).toEqual(['Any', 'Ruth', '1 Samuel'])
		expect(filters.get('Audience')).toEqual(['Any', 'Churched Adults', 'Unchurched Adults'])
	})

	it('filters search results by selected book and audience', () => {
		const filteredBook = filter_search_results(mockResults, { Book: 'Ruth', Audience: 'Any' })
		expect(filteredBook).toHaveLength(1)
		expect(filteredBook[0].reference.id_primary).toBe('Ruth')

		const filteredAudience = filter_search_results(mockResults, { Book: 'Any', Audience: 'Unchurched Adults' })
		expect(filteredAudience).toHaveLength(1)
		expect(filteredAudience[0].reference.id_primary).toBe('1 Samuel')
	})

	it('builds search term regex for text highlighting', () => {
		const regex = build_search_regex(['david', 'king'])
		expect('David became king'.split(regex)).toEqual(['', 'David', ' became ', 'king', ''])
	})
})
