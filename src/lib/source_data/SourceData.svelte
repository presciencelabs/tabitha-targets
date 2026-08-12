<script lang="ts">
	import { PUBLIC_SOURCES_API_HOST } from '$env/static/public'
	import SourceEntities from './SourceEntities.svelte'
	import Icon from '@iconify/svelte'
	import type { SourceData, SourceReference } from '$lib/types'

	let { reference }: { reference: SourceReference } = $props()

	async function get_source_data(ref: SourceReference): Promise<SourceData> {
		const response = await fetch(get_sources_url(ref))
		return await response.json()
	}

	function get_sources_url({ type, id_primary, id_secondary, id_tertiary }: SourceReference): string {
		return `${PUBLIC_SOURCES_API_HOST}/${type}/${id_primary}/${id_secondary}/${id_tertiary}`
	}
</script>

<h4 class="flex justify-between">
	Semantic encoding (Phase 2)

	<a href={get_sources_url(reference)} target="_blank" rel="noreferrer" class="link link-accent link-hover text-sm flex items-end">
		all source details
		<Icon icon="fe:link-external" class="h-6 w-6" />
	</a>
</h4>

{#await get_source_data(reference)}
	<p>
		<span class="loading loading-spinner text-warning"></span>
		getting the source data...
	</p>
{:then source}
	<p>
		<SourceEntities source_entities={source.parsed_semantic_encoding} />
	</p>
{/await}