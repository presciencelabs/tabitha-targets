// https://playwright.dev/docs/writing-tests#first-test
// @ts-check
import { test, expect } from '@playwright/test'

// https://playwright.dev/docs/test-fixtures#built-in-fixtures
test('/English/lookup/forms?word=following', async ({ request }) => {
	const test_word = 'following'
	const expected_forms = [
		{
			stem: 'following',
			part_of_speech: 'Adjective',
			form: 'Stem',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Participle',
		},
	]

	const response = await request.get(`/English/lookup/forms?word=${test_word}`)
	const returned_forms = await response.json()

	// https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-have-length
	expect(returned_forms).toHaveLength(expected_forms.length)
	expect(returned_forms[0]).toEqual(expected_forms[0])
	expect(returned_forms[1]).toEqual(expected_forms[1])
})

test('/English/lookup/forms?word=accused', async ({ request }) => {
	const test_word = 'accused'
	const expected_forms = [
		{
			stem: 'accuse',
			part_of_speech: 'Verb',
			form: 'Past',
		},
		{
			stem: 'accuse',
			part_of_speech: 'Verb',
			form: 'Perfect',
		},
	]

	const response = await request.get(`/English/lookup/forms?word=${test_word}`)
	const returned_forms = await response.json()

	expect(returned_forms).toHaveLength(expected_forms.length)
	expect(returned_forms[0]).toEqual(expected_forms[0])
	expect(returned_forms[1]).toEqual(expected_forms[1])
})

test('/English/lookup/forms?word=got', async ({ request }) => {
	const test_word = 'got'
	const expected_forms = [
		{
			stem: 'get',
			part_of_speech: 'Verb',
			form: 'Past',
		},
		{
			stem: 'get off',
			part_of_speech: 'Verb',
			form: 'Past',
		},
		{
			stem: 'get up',
			part_of_speech: 'Verb',
			form: 'Past',
		},
		{
			stem: 'get on',
			part_of_speech: 'Verb',
			form: 'Past',
		},
	]

	const response = await request.get(`/English/lookup/forms?word=${test_word}`)
	const returned_forms = await response.json()

	expect(returned_forms).toHaveLength(expected_forms.length)
	expect(returned_forms[0]).toEqual(expected_forms[0])
	expect(returned_forms[1]).toEqual(expected_forms[1])
	expect(returned_forms[2]).toEqual(expected_forms[2])
	expect(returned_forms[3]).toEqual(expected_forms[3])
})

test('/English/lookup/forms?word=follow*', async ({ request }) => {
	const test_word = 'follow*'
	const expected_forms = [
		{
			stem: 'following',
			part_of_speech: 'Adjective',
			form: 'Stem',
		},
		{
			stem: 'follower',
			part_of_speech: 'Noun',
			form: 'Stem',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Stem',
		},
		{
			stem: 'follower',
			part_of_speech: 'Noun',
			form: 'Plural',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Past',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Perfect',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Participle',
		},
		{
			stem: 'follow',
			part_of_speech: 'Verb',
			form: 'Third Singular Present',
		},
	]

	const response = await request.get(`/English/lookup/forms?word=${test_word}`)
	const returned_forms = await response.json()

	expect(returned_forms).toHaveLength(expected_forms.length)
	expect(returned_forms[0]).toEqual(expected_forms[0])
	expect(returned_forms[1]).toEqual(expected_forms[1])
	expect(returned_forms[2]).toEqual(expected_forms[2])
	expect(returned_forms[3]).toEqual(expected_forms[3])
	expect(returned_forms[4]).toEqual(expected_forms[4])
	expect(returned_forms[5]).toEqual(expected_forms[5])
	expect(returned_forms[6]).toEqual(expected_forms[6])
})
