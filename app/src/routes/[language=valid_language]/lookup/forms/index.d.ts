type DbRowLexicon = {
	language: string
	stem: string
	part_of_speech: string
	gloss: string
	features: string
	constituents: string
	forms: string
}

type LexicalForm = {
	stem: string
	part_of_speech: string
	form: string
}

type DbRowFormNames = {
	language: string
	part_of_speech: string
	name: string
	position: number
}

type FormNameMap = {
	part_of_speech: string
	name: string
	position: number
}