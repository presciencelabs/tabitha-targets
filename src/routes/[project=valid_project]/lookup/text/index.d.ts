type SourceReference = {
	type: string
	id_primary: string
	id_secondary: string
	id_tertiary: number
}

type DbTextResult = TextResult & BookResult & ChapterResult & VerseResult

type SearchResult = {
	reference: SourceReference
	texts: TextResult[]
}