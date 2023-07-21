<script lang="ts">
	import type { PageData } from './$types';
	import Trace from './trace.svelte';
	export let data: PageData;
</script>

<div class="p-4">
	<Trace trace={data.trace} contractInfo={data.contractInfo} />
</div>
