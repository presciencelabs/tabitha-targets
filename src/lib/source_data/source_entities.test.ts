import { describe, expect, it } from 'vitest'
import type { SourceEntity } from '../types'

function clause_reducer(clauses: SourceEntity[][], entity: SourceEntity) {
	if (entity.value === '{') {
		clauses.push([])
	}

	const last_clause = clauses[clauses.length - 1]
	if (last_clause) {
		last_clause.push(entity)
	}

	return clauses
}

function createMockEntity(overrides: Partial<SourceEntity>): SourceEntity {
	return {
		value: '',
		category: 'Clause',
		category_abbr: 'C',
		feature_codes: [],
		features: [],
		concept: null,
		pairing_concept: null,
		...overrides,
	}
}

const mockEntities: SourceEntity[] = [
	createMockEntity({ value: '{', category: 'Clause', category_abbr: 'C', feature_codes: ['1', '2'] }),
	createMockEntity({ value: 'David', category: 'Noun Phrase', category_abbr: 'NP', feature_codes: ['1', 'Agent'], concept: { stem: 'David', sense: '1' } }),
	createMockEntity({ value: '}', category: 'Clause', category_abbr: 'C', feature_codes: ['1', '2'] }),
	createMockEntity({ value: '{', category: 'Clause', category_abbr: 'C', feature_codes: ['1', '2'] }),
	createMockEntity({ value: 'went', category: 'Verb Phrase', category_abbr: 'VP', feature_codes: ['1', '2'], concept: { stem: 'go', sense: '1' } }),
	createMockEntity({ value: '}', category: 'Clause', category_abbr: 'C', feature_codes: ['1', '2'] }),
]

describe('SourceEntities clause reducer', () => {
	it('groups flat entities into separate clause arrays on opening brace', () => {
		const clauses = mockEntities.reduce(clause_reducer, [] as SourceEntity[][])
		expect(clauses).toHaveLength(2)
		expect(clauses[0]).toHaveLength(3)
		expect(clauses[1]).toHaveLength(3)
		expect(clauses[0][1].value).toBe('David')
		expect(clauses[1][1].value).toBe('went')
	})
})
