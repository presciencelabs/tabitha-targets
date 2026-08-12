import { describe, expect, it } from 'vitest'
import { get_features_to_display } from './features_helpers'

describe('features_helpers', () => {
	it('filters out negative feature values ("No", "Un...", "No ...", "Not ...")', () => {
		expect(get_features_to_display({ name: 'Plural', value: 'No' })).toBe(false)
		expect(get_features_to_display({ name: 'State', value: 'Unspecified' })).toBe(false)
		expect(get_features_to_display({ name: 'Gender', value: 'No Gender' })).toBe(false)
		expect(get_features_to_display({ name: 'Tense', value: 'Not Applicable' })).toBe(false)
	})

	it('keeps valid positive feature values', () => {
		expect(get_features_to_display({ name: 'Number', value: 'Singular' })).toBe(true)
		expect(get_features_to_display({ name: 'Person', value: 'First' })).toBe(true)
	})
})
