type DbRowFeature = {
	project: string
	part_of_speech: string
	feature: string
	position: number
	code: string
	value: string
}

type ApiFeature = {
	type: 'source' | 'lexical'
	part_of_speech: string
	feature: string
	position: number
	code: string
	value: string
}